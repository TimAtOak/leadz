<?php

namespace App\Entity;

use App\Repository\WebsiteScanRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WebsiteScanRepository::class)]
class WebsiteScan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: Lead::class, inversedBy: 'websiteScan')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lead $lead = null;

    #[ORM\Column(length: 2048)]
    private ?string $url = null;

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $title = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $metaDescription = null;

    #[ORM\Column(type: 'json')]
    private array $h1Texts = [];

    #[ORM\Column(type: 'json')]
    private array $detectedEmails = [];

    #[ORM\Column(type: 'json')]
    private array $detectedPhones = [];

    #[ORM\Column(length: 2048, nullable: true)]
    private ?string $faviconUrl = null;

    #[ORM\Column(length: 2048, nullable: true)]
    private ?string $ogImageUrl = null;

    #[ORM\Column(length: 2048, nullable: true)]
    private ?string $logoUrl = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $scannedAt = null;

    public function __construct()
    {
        $this->scannedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getLead(): ?Lead { return $this->lead; }
    public function setLead(?Lead $lead): static { $this->lead = $lead; return $this; }

    public function getUrl(): ?string { return $this->url; }
    public function setUrl(string $url): static { $this->url = $url; return $this; }

    public function getDomain(): ?string { return $this->domain; }
    public function setDomain(string $domain): static { $this->domain = $domain; return $this; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(?string $title): static { $this->title = $title; return $this; }

    public function getMetaDescription(): ?string { return $this->metaDescription; }
    public function setMetaDescription(?string $metaDescription): static { $this->metaDescription = $metaDescription; return $this; }

    public function getH1Texts(): array { return $this->h1Texts; }
    public function setH1Texts(array $h1Texts): static { $this->h1Texts = $h1Texts; return $this; }

    public function getDetectedEmails(): array { return $this->detectedEmails; }
    public function setDetectedEmails(array $detectedEmails): static { $this->detectedEmails = $detectedEmails; return $this; }

    public function getDetectedPhones(): array { return $this->detectedPhones; }
    public function setDetectedPhones(array $detectedPhones): static { $this->detectedPhones = $detectedPhones; return $this; }

    public function getFaviconUrl(): ?string { return $this->faviconUrl; }
    public function setFaviconUrl(?string $faviconUrl): static { $this->faviconUrl = $faviconUrl; return $this; }

    public function getOgImageUrl(): ?string { return $this->ogImageUrl; }
    public function setOgImageUrl(?string $ogImageUrl): static { $this->ogImageUrl = $ogImageUrl; return $this; }

    public function getLogoUrl(): ?string { return $this->logoUrl; }
    public function setLogoUrl(?string $logoUrl): static { $this->logoUrl = $logoUrl; return $this; }

    public function getScannedAt(): ?\DateTimeImmutable { return $this->scannedAt; }
}
