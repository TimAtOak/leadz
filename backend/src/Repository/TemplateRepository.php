<?php

namespace App\Repository;

use App\Entity\Template;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Template>
 */
class TemplateRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Template::class);
    }

    public function findForUser(User $user): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.user IS NULL OR t.user = :user')
            ->setParameter('user', $user)
            ->orderBy('t.isDefault', 'DESC')
            ->addOrderBy('t.createdAt', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
