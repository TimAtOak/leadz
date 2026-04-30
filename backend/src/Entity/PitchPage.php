<?php

namespace App\Entity;

use App\Repository\PitchPageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PitchPageRepository::class)]
class PitchPage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: Lead::class, inversedBy: 'pitchPage')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lead $lead = null;

    #[ORM\ManyToOne(targetEntity: Template::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?Template $template = null;

    #[ORM\Column(length: 500)]
    private ?string $subject = null;

    #[ORM\Column(type: 'text')]
    private ?string $body = null;

    #[ORM\Column(length: 100, unique: true)]
    private ?string $publicSlug = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $publishedAt = null;

    #[ORM\Column]
    private int $viewCount = 0;

    #[ORM\Column(length: 50)]
    private string $designTemplate = 'modern';

    #[ORM\OneToMany(targetEntity: PageView::class, mappedBy: 'pitchPage', orphanRemoval: true)]
    private Collection $pageViews;

    public function __construct()
    {
        $this->pageViews = new ArrayCollection();
        $this->publishedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getLead(): ?Lead { return $this->lead; }
    public function setLead(?Lead $lead): static { $this->lead = $lead; return $this; }

    public function getTemplate(): ?Template { return $this->template; }
    public function setTemplate(?Template $template): static { $this->template = $template; return $this; }

    public function getSubject(): ?string { return $this->subject; }
    public function setSubject(string $subject): static { $this->subject = $subject; return $this; }

    public function getBody(): ?string { return $this->body; }
    public function setBody(string $body): static { $this->body = $body; return $this; }

    public function getPublicSlug(): ?string { return $this->publicSlug; }
    public function setPublicSlug(string $publicSlug): static { $this->publicSlug = $publicSlug; return $this; }

    public function getPublishedAt(): ?\DateTimeImmutable { return $this->publishedAt; }

    public function getViewCount(): int { return $this->viewCount; }
    public function incrementViewCount(): static { $this->viewCount++; return $this; }

    public function getDesignTemplate(): string { return $this->designTemplate; }
    public function setDesignTemplate(string $designTemplate): static { $this->designTemplate = $designTemplate; return $this; }

    public function getPageViews(): Collection { return $this->pageViews; }
}
