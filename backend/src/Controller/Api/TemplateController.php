<?php

namespace App\Controller\Api;

use App\Entity\Template;
use App\Entity\User;
use App\Repository\TemplateRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/templates')]
class TemplateController extends AbstractController
{
    #[Route('', name: 'api_templates_list', methods: ['GET'])]
    public function list(TemplateRepository $templateRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $templates = $templateRepository->findForUser($user);

        return $this->json(array_map(fn(Template $t) => $this->serialize($t), $templates));
    }

    #[Route('', name: 'api_templates_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true) ?? [];

        if (empty($data['name']) || empty($data['subject']) || empty($data['body'])) {
            return $this->json(['error' => 'name, subject and body are required'], Response::HTTP_BAD_REQUEST);
        }

        $template = new Template();
        $template->setUser($user);
        $template->setName($data['name']);
        $template->setSubject($data['subject']);
        $template->setBody($data['body']);
        $template->setIsDefault(false);

        $em->persist($template);
        $em->flush();

        return $this->json($this->serialize($template), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_templates_show', methods: ['GET'])]
    public function show(Template $template): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($template->getUser() !== null && $template->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serialize($template));
    }

    #[Route('/{id}', name: 'api_templates_update', methods: ['PUT'])]
    public function update(Template $template, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($template->getUser() === null || $template->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (!empty($data['name'])) $template->setName($data['name']);
        if (!empty($data['subject'])) $template->setSubject($data['subject']);
        if (!empty($data['body'])) $template->setBody($data['body']);

        $em->flush();

        return $this->json($this->serialize($template));
    }

    #[Route('/{id}', name: 'api_templates_delete', methods: ['DELETE'])]
    public function delete(Template $template, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($template->getUser() === null || $template->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $em->remove($template);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function serialize(Template $t): array
    {
        return [
            'id' => $t->getId(),
            'name' => $t->getName(),
            'subject' => $t->getSubject(),
            'body' => $t->getBody(),
            'isDefault' => $t->isDefault(),
            'isGlobal' => $t->getUser() === null,
            'createdAt' => $t->getCreatedAt()?->format('c'),
        ];
    }
}
