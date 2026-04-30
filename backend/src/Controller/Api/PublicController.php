<?php

namespace App\Controller\Api;

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
    public function show(string $slug, PitchPageRepository $pitchPageRepository): JsonResponse
    {
        $pitchPage = $pitchPageRepository->findBySlug($slug);

        if (!$pitchPage) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $lead = $pitchPage->getLead();

        $scan = $lead->getWebsiteScan();

        return $this->json([
            'subject' => $pitchPage->getSubject(),
            'body' => $pitchPage->getBody(),
            'domain' => $lead->getDomain(),
            'companyName' => $lead->getCompanyName(),
            'publishedAt' => $pitchPage->getPublishedAt()?->format('c'),
            'designTemplate' => $pitchPage->getDesignTemplate(),
            'faviconUrl' => $scan?->getFaviconUrl(),
            'ogImageUrl' => $scan?->getOgImageUrl(),
            'logoUrl' => $scan?->getLogoUrl(),
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
