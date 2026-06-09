<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260609000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add pitch_mode, wp_anrede_hero, wp_text_hero to lead';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE lead ADD COLUMN pitch_mode VARCHAR(50) NOT NULL DEFAULT 'blocks'");
        $this->addSql("ALTER TABLE lead ADD COLUMN wp_anrede_hero TEXT NULL");
        $this->addSql("ALTER TABLE lead ADD COLUMN wp_text_hero TEXT NULL");
        $this->addSql("ALTER TABLE lead ADD COLUMN wp_post_id INTEGER NULL");
        $this->addSql("ALTER TABLE lead ADD COLUMN wp_post_url VARCHAR(2048) NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead DROP COLUMN pitch_mode');
        $this->addSql('ALTER TABLE lead DROP COLUMN wp_anrede_hero');
        $this->addSql('ALTER TABLE lead DROP COLUMN wp_text_hero');
        $this->addSql('ALTER TABLE lead DROP COLUMN wp_post_id');
        $this->addSql('ALTER TABLE lead DROP COLUMN wp_post_url');
    }
}
