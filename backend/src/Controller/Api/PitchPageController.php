<?php

namespace App\Controller\Api;

use App\Entity\Lead;
use App\Entity\PageBlock;
use App\Entity\PitchPage;
use App\Entity\User;
use App\Repository\TemplateRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[Route('/api/leads/{leadId}/pitch-page')]
class PitchPageController extends AbstractController
{
    #[Route('', name: 'api_pitch_page_get', methods: ['GET'])]
    public function get(int $leadId, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $lead = $em->find(Lead::class, $leadId);

        if (!$lead || $lead->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $pitchPage = $lead->getPitchPage();
        if (!$pitchPage) {
            return $this->json(['error' => 'No pitch page yet'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serialize($pitchPage));
    }

    #[Route('', name: 'api_pitch_page_create', methods: ['POST'])]
    public function createOrUpdate(
        int $leadId,
        Request $request,
        EntityManagerInterface $em,
        TemplateRepository $templateRepository,
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        $lead = $em->find(Lead::class, $leadId);

        if (!$lead || $lead->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (empty($data['subject']) || empty($data['body'])) {
            return $this->json(['error' => 'subject and body are required'], Response::HTTP_BAD_REQUEST);
        }

        $pitchPage = $lead->getPitchPage() ?? new PitchPage();
        $isNew = $pitchPage->getId() === null;

        if ($isNew) {
            $pitchPage->setLead($lead);
            $pitchPage->setPublicSlug($this->generateSlug($lead));
        }

        $pitchPage->setSubject($data['subject']);
        $pitchPage->setBody($data['body']);

        $allowed = ['modern', 'colorful', 'corporate', 'minimal'];
        if (!empty($data['designTemplate']) && in_array($data['designTemplate'], $allowed, true)) {
            $pitchPage->setDesignTemplate($data['designTemplate']);
        }

        if (!empty($data['templateId'])) {
            $template = $templateRepository->find($data['templateId']);
            if ($template) {
                $pitchPage->setTemplate($template);
            }
        }

        if ($isNew) {
            $em->persist($pitchPage);
            $lead->setStatus(Lead::STATUS_PAGE_CREATED);

            // Create a pitch block so it can be positioned among page blocks
            $existingPitchBlock = $em->getRepository(PageBlock::class)->findOneBy(['lead' => $lead, 'type' => 'pitch']);
            if (!$existingPitchBlock) {
                $maxPosition = 0;
                foreach ($lead->getPageBlocks() as $b) {
                    $maxPosition = max($maxPosition, $b->getPosition() + 1);
                }
                $pitchBlock = new PageBlock();
                $pitchBlock->setLead($lead);
                $pitchBlock->setType('pitch');
                $pitchBlock->setPosition($maxPosition);
                $em->persist($pitchBlock);
            }
        }

        $em->flush();

        return $this->json($this->serialize($pitchPage), $isNew ? Response::HTTP_CREATED : Response::HTTP_OK);
    }

    private function generateSlug(Lead $lead): string
    {
        $slugger = new AsciiSlugger();
        $base = $slugger->slug($lead->getDomain())->lower()->toString();
        return $base . '-' . substr(bin2hex(random_bytes(6)), 0, 8);
    }

    private function serialize(PitchPage $p): array
    {
        return [
            'id' => $p->getId(),
            'subject' => $p->getSubject(),
            'body' => $p->getBody(),
            'publicSlug' => $p->getPublicSlug(),
            'viewCount' => $p->getViewCount(),
            'publishedAt' => $p->getPublishedAt()?->format('c'),
            'templateId' => $p->getTemplate()?->getId(),
            'designTemplate' => $p->getDesignTemplate(),
            'shareUrl' => '/p/' . $p->getPublicSlug(),
        ];
    }
}
