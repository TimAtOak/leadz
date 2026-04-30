<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260430000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add favicon_url, og_image_url, logo_url to website_scan';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE website_scan ADD COLUMN favicon_url VARCHAR(2048) DEFAULT NULL');
        $this->addSql('ALTER TABLE website_scan ADD COLUMN og_image_url VARCHAR(2048) DEFAULT NULL');
        $this->addSql('ALTER TABLE website_scan ADD COLUMN logo_url VARCHAR(2048) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE website_scan DROP COLUMN favicon_url');
        $this->addSql('ALTER TABLE website_scan DROP COLUMN og_image_url');
        $this->addSql('ALTER TABLE website_scan DROP COLUMN logo_url');
    }
}
