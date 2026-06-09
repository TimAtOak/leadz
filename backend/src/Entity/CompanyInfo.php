<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class CompanyInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, unique: true, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $companyName = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $address = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $primaryColor = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $secondaryColor = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $textColor = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $headingColor = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $emailSubject = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $emailBody = null;

    public function getId(): ?int { return $this->id; }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): static { $this->user = $user; return $this; }

    public function getCompanyName(): ?string { return $this->companyName; }
    public function setCompanyName(?string $v): static { $this->companyName = $v; return $this; }

    public function getPhone(): ?string { return $this->phone; }
    public function setPhone(?string $v): static { $this->phone = $v; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(?string $v): static { $this->email = $v; return $this; }

    public function getAddress(): ?string { return $this->address; }
    public function setAddress(?string $v): static { $this->address = $v; return $this; }

    public function getPrimaryColor(): ?string { return $this->primaryColor; }
    public function setPrimaryColor(?string $v): static { $this->primaryColor = $v; return $this; }

    public function getSecondaryColor(): ?string { return $this->secondaryColor; }
    public function setSecondaryColor(?string $v): static { $this->secondaryColor = $v; return $this; }

    public function getTextColor(): ?string { return $this->textColor; }
    public function setTextColor(?string $v): static { $this->textColor = $v; return $this; }

    public function getHeadingColor(): ?string { return $this->headingColor; }
    public function setHeadingColor(?string $v): static { $this->headingColor = $v; return $this; }

    public function getEmailSubject(): ?string { return $this->emailSubject; }
    public function setEmailSubject(?string $v): static { $this->emailSubject = $v; return $this; }

    public function getEmailBody(): ?string { return $this->emailBody; }
    public function setEmailBody(?string $v): static { $this->emailBody = $v; return $this; }
}
