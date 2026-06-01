<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260529000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add design_template to lead';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE lead ADD COLUMN design_template VARCHAR(50) NOT NULL DEFAULT 'modern'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead DROP COLUMN design_template');
    }
}
