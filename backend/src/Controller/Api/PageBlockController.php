<?php

namespace App\Controller\Api;

use App\Entity\Lead;
use App\Entity\PageBlock;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/leads/{leadId}/blocks')]
class PageBlockController extends AbstractController
{
    private function getLead(int $leadId, EntityManagerInterface $em): ?Lead
    {
        /** @var User $user */
        $user = $this->getUser();
        $lead = $em->getRepository(Lead::class)->find($leadId);
        if (!$lead || $lead->getUser()->getId() !== $user->getId()) {
            return null;
        }
        return $lead;
    }

    #[Route('', name: 'api_blocks_list', methods: ['GET'])]
    public function list(int $leadId, EntityManagerInterface $em): JsonResponse
    {
        $lead = $this->getLead($leadId, $em);
        if (!$lead) return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);

        $blocks = $em->getRepository(PageBlock::class)->findBy(['lead' => $lead], ['position' => 'ASC']);

        return $this->json(array_map(fn(PageBlock $b) => $this->serialize($b), $blocks));
    }

    #[Route('', name: 'api_blocks_create', methods: ['POST'])]
    public function create(int $leadId, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $lead = $this->getLead($leadId, $em);
        if (!$lead) return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);

        $data = json_decode($request->getContent(), true) ?? [];
        $type = $data['type'] ?? null;

        if (!$type || !in_array($type, PageBlock::TYPES, true)) {
            return $this->json(['error' => 'Invalid block type'], Response::HTTP_BAD_REQUEST);
        }

        $maxPosition = 0;
        foreach ($lead->getPageBlocks() as $existing) {
            $maxPosition = max($maxPosition, $existing->getPosition() + 1);
        }

        $block = new PageBlock();
        $block->setLead($lead);
        $block->setType($type);
        $block->setPosition($maxPosition);
        $block->setContent($data['content'] ?? $this->defaultContent($type));

        $em->persist($block);
        $em->flush();

        return $this->json($this->serialize($block), Response::HTTP_CREATED);
    }

    #[Route('/{blockId}', name: 'api_blocks_update', methods: ['PUT'])]
    public function update(int $leadId, int $blockId, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $lead = $this->getLead($leadId, $em);
        if (!$lead) return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);

        $block = $em->getRepository(PageBlock::class)->find($blockId);
        if (!$block || $block->getLead()->getId() !== $lead->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        if (isset($data['content'])) $block->setContent($data['content']);

        $em->flush();

        return $this->json($this->serialize($block));
    }

    #[Route('/reorder', name: 'api_blocks_reorder', methods: ['POST'])]
    public function reorder(int $leadId, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $lead = $this->getLead($leadId, $em);
        if (!$lead) return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);

        $data = json_decode($request->getContent(), true) ?? [];
        // $data is an array of block IDs in the new order

        foreach ($data as $position => $blockId) {
            $block = $em->getRepository(PageBlock::class)->find($blockId);
            if ($block && $block->getLead()->getId() === $lead->getId()) {
                $block->setPosition((int) $position);
            }
        }

        $em->flush();

        $blocks = $em->getRepository(PageBlock::class)->findBy(['lead' => $lead], ['position' => 'ASC']);
        return $this->json(array_map(fn(PageBlock $b) => $this->serialize($b), $blocks));
    }

    #[Route('/{blockId}', name: 'api_blocks_delete', methods: ['DELETE'])]
    public function delete(int $leadId, int $blockId, EntityManagerInterface $em): JsonResponse
    {
        $lead = $this->getLead($leadId, $em);
        if (!$lead) return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);

        $block = $em->getRepository(PageBlock::class)->find($blockId);
        if (!$block || $block->getLead()->getId() !== $lead->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($block);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function serialize(PageBlock $block): array
    {
        return [
            'id' => $block->getId(),
            'type' => $block->getType(),
            'position' => $block->getPosition(),
            'content' => $block->getContent(),
        ];
    }

    private function defaultContent(string $type): array
    {
        return match ($type) {
            'header' => ['logoUrl' => '', 'navLinks' => [['label' => 'Start', 'url' => '#']]],
            'hero' => ['heading' => 'Willkommen', 'subheading' => '', 'ctaText' => 'Loslegen', 'ctaUrl' => '#', 'imageUrl' => ''],
            'text' => ['align' => 'center', 'label' => '', 'heading' => 'Über uns', 'body' => '', 'ctaText' => '', 'ctaUrl' => '#'],
            'split' => ['imageUrl' => '', 'imagePosition' => 'left', 'label' => '', 'heading' => 'Was uns ausmacht', 'body' => '', 'ctaText' => '', 'ctaUrl' => '#'],
            'features' => ['heading' => '', 'columns' => 2, 'items' => [['icon' => '', 'label' => 'Merkmal 1', 'description' => ''], ['icon' => '', 'label' => 'Merkmal 2', 'description' => '']]],
            'services' => ['heading' => 'Unsere Leistungen', 'items' => [['title' => 'Leistung 1', 'description' => '']]],
            'team' => ['heading' => 'Unser Team', 'members' => [['name' => 'Name', 'role' => 'Position', 'imageUrl' => '', 'bio' => '']]],
            'cta' => ['heading' => 'Bereit loszulegen?', 'subheading' => '', 'buttonText' => 'Kontakt aufnehmen', 'buttonUrl' => '#'],
            'footer' => ['copyright' => '', 'links' => [['label' => 'Datenschutz', 'url' => '#']]],
            default => [],
        };
    }
}
