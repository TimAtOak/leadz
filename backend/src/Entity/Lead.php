<?php

namespace App\Entity;

use App\Repository\LeadRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LeadRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Lead
{
    public const STATUS_NEW = 'new';
    public const STATUS_REVIEWED = 'reviewed';
    public const STATUS_PAGE_CREATED = 'page_created';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_OPENED = 'opened';
    public const STATUS_RESPONDED = 'responded';
    public const STATUS_WON = 'won';
    public const STATUS_LOST = 'lost';

    public const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_REVIEWED,
        self::STATUS_PAGE_CREATED,
        self::STATUS_CONTACTED,
        self::STATUS_OPENED,
        self::STATUS_RESPONDED,
        self::STATUS_WON,
        self::STATUS_LOST,
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'leads')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 2048)]
    private ?string $url = null;

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $title = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $companyName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contactEmail = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contactName = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $contactPhone = null;

    #[ORM\Column(length: 50)]
    private string $status = self::STATUS_NEW;

    #[ORM\Column(length: 50)]
    private string $designTemplate = 'modern';

    #[ORM\Column(length: 50)]
    private string $pitchMode = 'blocks';

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $wpAnredeHero = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $wpTextHero = null;

    #[ORM\Column(nullable: true)]
    private ?int $wpPostId = null;

    #[ORM\Column(length: 2048, nullable: true)]
    private ?string $wpPostUrl = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $notes = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToOne(targetEntity: WebsiteScan::class, mappedBy: 'lead', cascade: ['persist', 'remove'])]
    private ?WebsiteScan $websiteScan = null;

    #[ORM\OneToOne(targetEntity: PitchPage::class, mappedBy: 'lead', cascade: ['persist', 'remove'])]
    private ?PitchPage $pitchPage = null;

    #[ORM\OneToMany(targetEntity: PageBlock::class, mappedBy: 'lead', cascade: ['remove'], orphanRemoval: true)]
    #[ORM\OrderBy(['position' => 'ASC'])]
    private Collection $pageBlocks;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->pageBlocks = new ArrayCollection();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): static { $this->user = $user; return $this; }

    public function getUrl(): ?string { return $this->url; }
    public function setUrl(string $url): static { $this->url = $url; return $this; }

    public function getDomain(): ?string { return $this->domain; }
    public function setDomain(string $domain): static { $this->domain = $domain; return $this; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(?string $title): static { $this->title = $title; return $this; }

    public function getCompanyName(): ?string { return $this->companyName; }
    public function setCompanyName(?string $companyName): static { $this->companyName = $companyName; return $this; }

    public function getContactEmail(): ?string { return $this->contactEmail; }
    public function setContactEmail(?string $contactEmail): static { $this->contactEmail = $contactEmail; return $this; }

    public function getContactName(): ?string { return $this->contactName; }
    public function setContactName(?string $contactName): static { $this->contactName = $contactName; return $this; }

    public function getContactPhone(): ?string { return $this->contactPhone; }
    public function setContactPhone(?string $contactPhone): static { $this->contactPhone = $contactPhone; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }

    public function getDesignTemplate(): string { return $this->designTemplate; }
    public function setDesignTemplate(string $t): static { $this->designTemplate = $t; return $this; }

    public function getPitchMode(): string { return $this->pitchMode; }
    public function setPitchMode(string $v): static { $this->pitchMode = $v; return $this; }

    public function getWpAnredeHero(): ?string { return $this->wpAnredeHero; }
    public function setWpAnredeHero(?string $v): static { $this->wpAnredeHero = $v; return $this; }

    public function getWpTextHero(): ?string { return $this->wpTextHero; }
    public function setWpTextHero(?string $v): static { $this->wpTextHero = $v; return $this; }

    public function getWpPostId(): ?int { return $this->wpPostId; }
    public function setWpPostId(?int $v): static { $this->wpPostId = $v; return $this; }

    public function getWpPostUrl(): ?string { return $this->wpPostUrl; }
    public function setWpPostUrl(?string $v): static { $this->wpPostUrl = $v; return $this; }

    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): static { $this->notes = $notes; return $this; }

    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function getUpdatedAt(): ?\DateTimeImmutable { return $this->updatedAt; }

    public function getWebsiteScan(): ?WebsiteScan { return $this->websiteScan; }
    public function setWebsiteScan(?WebsiteScan $scan): static { $this->websiteScan = $scan; return $this; }

    public function getPitchPage(): ?PitchPage { return $this->pitchPage; }
    public function setPitchPage(?PitchPage $pitchPage): static { $this->pitchPage = $pitchPage; return $this; }

    public function getPageBlocks(): Collection { return $this->pageBlocks; }
}
