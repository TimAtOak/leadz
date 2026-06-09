<?php

namespace App\Controller\Api;

use App\Entity\CompanyInfo;
use App\Entity\PageBlock;
use App\Entity\PageView;
use App\Repository\PitchPageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/public')]
class PublicController extends AbstractController
{
    #[Route('/pitch/{slug}', name: 'api_public_pitch_show', methods: ['GET'])]
    public function show(string $slug, PitchPageRepository $pitchPageRepository, EntityManagerInterface $em): JsonResponse
    {
        $pitchPage = $pitchPageRepository->findBySlug($slug);

        if (!$pitchPage) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $lead = $pitchPage->getLead();
        $scan = $lead->getWebsiteScan();

        $blocks = $em->getRepository(PageBlock::class)->findBy(['lead' => $lead], ['position' => 'ASC']);

        $companyInfo = $em->getRepository(CompanyInfo::class)->findOneBy(['user' => $lead->getUser()]);
        $primaryColor   = $companyInfo?->getPrimaryColor()   ?? '#3b82f6';
        $secondaryColor = $companyInfo?->getSecondaryColor() ?? '#6366f1';
        $textColor      = $companyInfo?->getTextColor()      ?? '#374151';
        $headingColor   = $companyInfo?->getHeadingColor()   ?? '#111827';

        $pitchContent = [
            'subject' => $pitchPage->getSubject(),
            'body' => $pitchPage->getBody(),
            'domain' => $lead->getDomain(),
            'companyName' => $lead->getCompanyName(),
            'publishedAt' => $pitchPage->getPublishedAt()?->format('c'),
            'faviconUrl' => $scan?->getFaviconUrl(),
            'ogImageUrl' => $scan?->getOgImageUrl(),
            'logoUrl' => $scan?->getLogoUrl(),
        ];

        $serializedBlocks = array_map(fn(PageBlock $b) => [
            'id' => $b->getId(),
            'type' => $b->getType(),
            'position' => $b->getPosition(),
            'content' => $b->getType() === 'pitch' ? $pitchContent : $b->getContent(),
        ], $blocks);

        // Backwards compat: if no pitch block exists yet, inject one at position 0
        $hasPitchBlock = array_filter($blocks, fn(PageBlock $b) => $b->getType() === 'pitch');
        if (!$hasPitchBlock) {
            array_unshift($serializedBlocks, [
                'id' => 0,
                'type' => 'pitch',
                'position' => -1,
                'content' => $pitchContent,
            ]);
        }

        return $this->json([
            'primaryColor'   => $primaryColor,
            'secondaryColor' => $secondaryColor,
            'textColor'      => $textColor,
            'headingColor'   => $headingColor,
            'blocks'         => $serializedBlocks,
        ]);
    }

    #[Route('/pitch/{slug}/view', name: 'api_public_pitch_view', methods: ['POST'])]
    public function trackView(
        string $slug,
        Request $request,
        PitchPageRepository $pitchPageRepository,
        EntityManagerInterface $em,
    ): JsonResponse {
        $pitchPage = $pitchPageRepository->findBySlug($slug);

        if (!$pitchPage) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $pageView = new PageView();
        $pageView->setPitchPage($pitchPage);
        $pageView->setIp($request->getClientIp());
        $pageView->setUserAgent(substr($request->headers->get('User-Agent', ''), 0, 500));

        $pitchPage->incrementViewCount();

        $lead = $pitchPage->getLead();
        if ($lead->getStatus() === 'page_created' || $lead->getStatus() === 'contacted') {
            $lead->setStatus('opened');
        }

        $em->persist($pageView);
        $em->flush();

        return $this->json(['tracked' => true]);
    }
}
