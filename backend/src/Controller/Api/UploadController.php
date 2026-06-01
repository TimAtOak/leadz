<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/upload')]
class UploadController extends AbstractController
{
    #[Route('', name: 'api_upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get('file');

        if (!$file) {
            return $this->json(['error' => 'No file provided'], Response::HTTP_BAD_REQUEST);
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            return $this->json(['error' => 'File too large (max 5 MB)'], Response::HTTP_BAD_REQUEST);
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file->getPathname());
        if (!str_starts_with($mimeType, 'image/')) {
            return $this->json(['error' => 'File must be an image'], Response::HTTP_BAD_REQUEST);
        }

        $ext = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = bin2hex(random_bytes(16)) . '.' . $ext;
        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $file->move($uploadDir, $filename);

        return $this->json(['url' => '/uploads/' . $filename]);
    }
}
