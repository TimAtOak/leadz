<?php

namespace App\Controller\Api;

use App\Entity\CompanyInfo;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/company-info')]
class CompanyInfoController extends AbstractController
{
    #[Route('', name: 'api_company_info_get', methods: ['GET'])]
    public function get(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $info = $em->getRepository(CompanyInfo::class)->findOneBy(['user' => $user]);

        if (!$info) {
            $info = new CompanyInfo();
            $info->setUser($user);
            $em->persist($info);
            $em->flush();
        }

        return $this->json($this->serialize($info));
    }

    #[Route('', name: 'api_company_info_update', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $info = $em->getRepository(CompanyInfo::class)->findOneBy(['user' => $user]);

        if (!$info) {
            $info = new CompanyInfo();
            $info->setUser($user);
            $em->persist($info);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (array_key_exists('companyName', $data)) $info->setCompanyName($data['companyName'] ?: null);
        if (array_key_exists('phone', $data)) $info->setPhone($data['phone'] ?: null);
        if (array_key_exists('email', $data)) $info->setEmail($data['email'] ?: null);
        if (array_key_exists('address', $data)) $info->setAddress($data['address'] ?: null);
        if (array_key_exists('primaryColor', $data)) $info->setPrimaryColor($data['primaryColor'] ?: null);

        $em->flush();

        return $this->json($this->serialize($info));
    }

    private function serialize(CompanyInfo $info): array
    {
        return [
            'companyName' => $info->getCompanyName(),
            'phone' => $info->getPhone(),
            'email' => $info->getEmail(),
            'address' => $info->getAddress(),
            'primaryColor' => $info->getPrimaryColor() ?? '#3b82f6',
        ];
    }
}
