<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260528000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add company_info and page_block tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE company_info (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
            company_name VARCHAR(255) DEFAULT NULL,
            phone VARCHAR(50) DEFAULT NULL,
            email VARCHAR(255) DEFAULT NULL,
            address VARCHAR(500) DEFAULT NULL,
            primary_color VARCHAR(20) DEFAULT NULL
        )');

        $this->addSql('CREATE TABLE page_block (
            id SERIAL PRIMARY KEY,
            lead_id INT NOT NULL REFERENCES lead(id) ON DELETE CASCADE,
            type VARCHAR(50) NOT NULL,
            position INT NOT NULL DEFAULT 0,
            content JSON NOT NULL DEFAULT \'{}\'
        )');

        $this->addSql('CREATE INDEX idx_page_block_lead ON page_block(lead_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS page_block');
        $this->addSql('DROP TABLE IF EXISTS company_info');
    }
}
