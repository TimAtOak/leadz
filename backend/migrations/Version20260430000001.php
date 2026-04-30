<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260430000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add design_template column to pitch_page';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE pitch_page ADD COLUMN design_template VARCHAR(50) NOT NULL DEFAULT 'modern'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE pitch_page DROP COLUMN design_template');
    }
}
