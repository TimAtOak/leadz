<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240101000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Initial schema: user, lead, website_scan, template, pitch_page, page_view';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE "user" (
            id SERIAL PRIMARY KEY,
            email VARCHAR(180) NOT NULL UNIQUE,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
        )');

        $this->addSql('CREATE TABLE lead (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            url VARCHAR(2048) NOT NULL,
            domain VARCHAR(255) NOT NULL,
            title VARCHAR(255) DEFAULT NULL,
            company_name VARCHAR(500) DEFAULT NULL,
            contact_email VARCHAR(255) DEFAULT NULL,
            contact_phone VARCHAR(50) DEFAULT NULL,
            status VARCHAR(50) NOT NULL DEFAULT \'new\',
            notes TEXT DEFAULT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
        )');

        $this->addSql('CREATE TABLE website_scan (
            id SERIAL PRIMARY KEY,
            lead_id INT NOT NULL UNIQUE REFERENCES lead(id) ON DELETE CASCADE,
            url VARCHAR(2048) NOT NULL,
            domain VARCHAR(255) NOT NULL,
            title VARCHAR(255) DEFAULT NULL,
            meta_description VARCHAR(500) DEFAULT NULL,
            h1_texts JSON NOT NULL DEFAULT \'[]\',
            detected_emails JSON NOT NULL DEFAULT \'[]\',
            detected_phones JSON NOT NULL DEFAULT \'[]\',
            scanned_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
        )');

        $this->addSql('CREATE TABLE template (
            id SERIAL PRIMARY KEY,
            user_id INT DEFAULT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            subject VARCHAR(500) NOT NULL,
            body TEXT NOT NULL,
            is_default BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
        )');

        $this->addSql('CREATE TABLE pitch_page (
            id SERIAL PRIMARY KEY,
            lead_id INT NOT NULL UNIQUE REFERENCES lead(id) ON DELETE CASCADE,
            template_id INT DEFAULT NULL REFERENCES template(id) ON DELETE SET NULL,
            subject VARCHAR(500) NOT NULL,
            body TEXT NOT NULL,
            public_slug VARCHAR(100) NOT NULL UNIQUE,
            published_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
            view_count INT NOT NULL DEFAULT 0
        )');

        $this->addSql('CREATE TABLE page_view (
            id SERIAL PRIMARY KEY,
            pitch_page_id INT NOT NULL REFERENCES pitch_page(id) ON DELETE CASCADE,
            ip VARCHAR(45) DEFAULT NULL,
            user_agent VARCHAR(500) DEFAULT NULL,
            viewed_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
        )');

        $this->addSql('CREATE INDEX idx_lead_user_id ON lead(user_id)');
        $this->addSql('CREATE INDEX idx_lead_status ON lead(status)');
        $this->addSql('CREATE INDEX idx_page_view_pitch_page ON page_view(pitch_page_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS page_view');
        $this->addSql('DROP TABLE IF EXISTS pitch_page');
        $this->addSql('DROP TABLE IF EXISTS website_scan');
        $this->addSql('DROP TABLE IF EXISTS lead');
        $this->addSql('DROP TABLE IF EXISTS template');
        $this->addSql('DROP TABLE IF EXISTS "user"');
    }
}
