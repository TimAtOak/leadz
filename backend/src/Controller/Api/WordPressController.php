<?php

namespace App\Controller\Api;

use App\Entity\Lead;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class WordPressController extends AbstractController
{
    #[Route('/api/leads/{leadId}/publish-wordpress', name: 'api_publish_wordpress', methods: ['POST'])]
    public function publish(
        int $leadId,
        Request $request,
        EntityManagerInterface $em,
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        $lead = $em->find(Lead::class, $leadId);

        if (!$lead || $lead->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $wpUrl = $_ENV['WP_URL'] ?? '';
        $wpUsername = $_ENV['WP_USERNAME'] ?? '';
        $wpAppPassword = $_ENV['WP_APP_PASSWORD'] ?? '';

        if (!$wpUrl || !$wpUsername || !$wpAppPassword) {
            return $this->json(
                ['error' => 'WordPress-Zugangsdaten nicht konfiguriert (WP_URL, WP_USERNAME, WP_APP_PASSWORD)'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (empty($data['textHero'])) {
            return $this->json(['error' => 'textHero ist erforderlich'], Response::HTTP_BAD_REQUEST);
        }

        $companyName = $lead->getCompanyName() ?? $lead->getDomain();
        $logo = $lead->getWebsiteScan()?->getLogoUrl() ?? '';
        $anredeHero = $data['anredeHero'] ?? ('Hallo ' . $companyName . ',');
        $textHero = $data['textHero'];

        $payload = json_encode([
            'title' => $companyName,
            'status' => 'publish',
            'meta' => [
                'logo' => $logo,
                'anrede-hero' => $anredeHero,
                'text-hero' => $textHero,
            ],
        ]);

        $ch = curl_init(rtrim($wpUrl, '/') . '/wp-json/wp/v2/lead/');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode($wpUsername . ':' . $wpAppPassword),
            ],
            CURLOPT_TIMEOUT => 30,
        ]);

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlError) {
            return $this->json(['error' => 'Verbindungsfehler: ' . $curlError], Response::HTTP_BAD_GATEWAY);
        }

        $wpData = json_decode($response, true);

        if ($statusCode >= 400) {
            return $this->json([
                'error' => 'WordPress API Fehler',
                'details' => $wpData['message'] ?? $response,
            ], Response::HTTP_BAD_GATEWAY);
        }

        return $this->json([
            'wpPostId' => $wpData['id'] ?? null,
            'wpPostUrl' => $wpData['link'] ?? null,
        ]);
    }
}
