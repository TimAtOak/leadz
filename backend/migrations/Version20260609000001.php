<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260609000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add secondary_color, text_color, heading_color to company_info';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE company_info ADD COLUMN secondary_color VARCHAR(20) NULL");
        $this->addSql("ALTER TABLE company_info ADD COLUMN text_color VARCHAR(20) NULL");
        $this->addSql("ALTER TABLE company_info ADD COLUMN heading_color VARCHAR(20) NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE company_info DROP COLUMN secondary_color');
        $this->addSql('ALTER TABLE company_info DROP COLUMN text_color');
        $this->addSql('ALTER TABLE company_info DROP COLUMN heading_color');
    }
}
