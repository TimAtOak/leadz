<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'page_block')]
class PageBlock
{
    public const TYPES = ['header', 'hero', 'text', 'split', 'features', 'services', 'team', 'cta', 'footer', 'pitch'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Lead::class, inversedBy: 'pageBlocks')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Lead $lead = null;

    #[ORM\Column(length: 50)]
    private string $type = 'hero';

    #[ORM\Column]
    private int $position = 0;

    #[ORM\Column(type: 'json')]
    private array $content = [];

    public function getId(): ?int { return $this->id; }

    public function getLead(): ?Lead { return $this->lead; }
    public function setLead(?Lead $lead): static { $this->lead = $lead; return $this; }

    public function getType(): string { return $this->type; }
    public function setType(string $type): static { $this->type = $type; return $this; }

    public function getPosition(): int { return $this->position; }
    public function setPosition(int $position): static { $this->position = $position; return $this; }

    public function getContent(): array { return $this->content; }
    public function setContent(array $content): static { $this->content = $content; return $this; }
}
