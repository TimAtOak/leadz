<?php

namespace App\Repository;

use App\Entity\PitchPage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PitchPage>
 */
class PitchPageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PitchPage::class);
    }

    public function findBySlug(string $slug): ?PitchPage
    {
        return $this->findOneBy(['publicSlug' => $slug]);
    }
}
