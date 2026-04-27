<?php

namespace App\Controller\Api;

use App\Entity\Lead;
use App\Entity\User;
use App\Entity\WebsiteScan;
use App\Repository\LeadRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/leads')]
class LeadController extends AbstractController
{
    #[Route('', name: 'api_leads_list', methods: ['GET'])]
    public function list(Request $request, LeadRepository $leadRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(1, (int) $request->query->get('limit', 20)));
        $status = $request->query->get('status');

        $leads = $leadRepository->findByUserPaginated($user, $page, $limit, $status ?: null);
        $total = $leadRepository->countByUser($user, $status ?: null);

        return $this->json([
            'data' => array_map(fn(Lead $l) => $this->serializeLead($l), $leads),
            'meta' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => (int) ceil($total / $limit),
            ],
        ]);
    }

    #[Route('', name: 'api_leads_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!$data || empty($data['url']) || empty($data['domain'])) {
            return $this->json(['error' => 'url and domain are required'], Response::HTTP_BAD_REQUEST);
        }

        $lead = new Lead();
        $lead->setUser($user);
        $lead->setUrl($data['url']);
        $lead->setDomain($data['domain']);
        $lead->setTitle($data['title'] ?? null);
        $lead->setCompanyName($data['companyName'] ?? null);

        $scan = new WebsiteScan();
        $scan->setLead($lead);
        $scan->setUrl($data['url']);
        $scan->setDomain($data['domain']);
        $scan->setTitle($data['title'] ?? null);
        $scan->setMetaDescription($data['metaDescription'] ?? null);
        $scan->setH1Texts($data['h1Texts'] ?? []);
        $scan->setDetectedEmails($data['detectedEmails'] ?? []);
        $scan->setDetectedPhones($data['detectedPhones'] ?? []);

        $em->persist($lead);
        $em->persist($scan);
        $em->flush();

        return $this->json($this->serializeLead($lead), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_leads_show', methods: ['GET'])]
    public function show(Lead $lead): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        /** @var User $user */
        $user = $this->getUser();

        if ($lead->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeLeadFull($lead));
    }

    #[Route('/{id}', name: 'api_leads_update', methods: ['PATCH'])]
    public function update(Lead $lead, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($lead->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (isset($data['status']) && in_array($data['status'], Lead::STATUSES, true)) {
            $lead->setStatus($data['status']);
        }
        if (array_key_exists('companyName', $data)) {
            $lead->setCompanyName($data['companyName']);
        }
        if (array_key_exists('contactEmail', $data)) {
            $lead->setContactEmail($data['contactEmail']);
        }
        if (array_key_exists('contactPhone', $data)) {
            $lead->setContactPhone($data['contactPhone']);
        }
        if (array_key_exists('notes', $data)) {
            $lead->setNotes($data['notes']);
        }

        $em->flush();

        return $this->json($this->serializeLeadFull($lead));
    }

    #[Route('/{id}', name: 'api_leads_delete', methods: ['DELETE'])]
    public function delete(Lead $lead, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($lead->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($lead);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function serializeLead(Lead $lead): array
    {
        return [
            'id' => $lead->getId(),
            'url' => $lead->getUrl(),
            'domain' => $lead->getDomain(),
            'title' => $lead->getTitle(),
            'companyName' => $lead->getCompanyName(),
            'contactEmail' => $lead->getContactEmail(),
            'contactPhone' => $lead->getContactPhone(),
            'status' => $lead->getStatus(),
            'hasPitchPage' => $lead->getPitchPage() !== null,
            'pitchPageSlug' => $lead->getPitchPage()?->getPublicSlug(),
            'createdAt' => $lead->getCreatedAt()?->format('c'),
            'updatedAt' => $lead->getUpdatedAt()?->format('c'),
        ];
    }

    private function serializeLeadFull(Lead $lead): array
    {
        $data = $this->serializeLead($lead);
        $data['notes'] = $lead->getNotes();

        $scan = $lead->getWebsiteScan();
        if ($scan) {
            $data['websiteScan'] = [
                'url' => $scan->getUrl(),
                'domain' => $scan->getDomain(),
                'title' => $scan->getTitle(),
                'metaDescription' => $scan->getMetaDescription(),
                'h1Texts' => $scan->getH1Texts(),
                'detectedEmails' => $scan->getDetectedEmails(),
                'detectedPhones' => $scan->getDetectedPhones(),
                'scannedAt' => $scan->getScannedAt()?->format('c'),
            ];
        }

        $pitchPage = $lead->getPitchPage();
        if ($pitchPage) {
            $data['pitchPage'] = [
                'id' => $pitchPage->getId(),
                'subject' => $pitchPage->getSubject(),
                'body' => $pitchPage->getBody(),
                'publicSlug' => $pitchPage->getPublicSlug(),
                'viewCount' => $pitchPage->getViewCount(),
                'publishedAt' => $pitchPage->getPublishedAt()?->format('c'),
            ];
        }

        return $data;
    }
}
