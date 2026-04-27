<?php

namespace App\Command;

use App\Entity\Template;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-templates',
    description: 'Seed default global pitch templates',
)]
class SeedTemplatesCommand extends Command
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $templates = [
            [
                'name' => 'Website Redesign Pitch',
                'subject' => 'Your website has potential — here\'s how we can unlock it',
                'body' => "Hi {{company_name}},\n\nI came across your website at {{url}} and I think there's a real opportunity to improve it.\n\nModern websites need to be fast, mobile-friendly, and clearly communicate your value. Based on what I saw, here's what I'd focus on:\n\n- A cleaner, more modern design\n- Faster load times\n- Clearer calls-to-action\n\nI specialize in web projects exactly like this. I'd love to show you a quick concept.\n\nWould you be open to a 20-minute call this week?\n\nBest regards,\n{{sender_name}}",
            ],
            [
                'name' => 'SEO Improvement Pitch',
                'subject' => 'I noticed something about {{domain}} that\'s costing you customers',
                'body' => "Hi {{company_name}},\n\nI was researching businesses in your space and came across {{url}}.\n\nI noticed a few quick wins that could significantly improve how you show up in Google searches — things like:\n\n- Missing or weak meta descriptions\n- Untapped keyword opportunities\n- Technical issues affecting crawlability\n\nWith some targeted improvements, you could be showing up for customers who are actively searching for what you offer.\n\nI put together a brief overview of what I found. Would it be helpful if I shared it with you?\n\nBest,\n{{sender_name}}",
            ],
            [
                'name' => 'Performance Optimization Pitch',
                'subject' => 'Your website might be losing customers every second',
                'body' => "Hi {{company_name}},\n\nPage speed is one of the most important factors for both user experience and search rankings. Slow websites lose visitors — and revenue.\n\nI ran a quick analysis of {{url}} and found several performance issues that are likely causing visitors to bounce before they even see what you offer.\n\nHere's what I can help you fix:\n\n- Image optimization and lazy loading\n- Code minification and caching\n- Server response time improvements\n\nMost of these improvements can be done quickly and the impact is measurable.\n\nWant to see the full report?\n\nKind regards,\n{{sender_name}}",
            ],
            [
                'name' => 'Mobile-First Pitch',
                'subject' => 'Over 60% of visitors are on mobile — is {{domain}} ready?',
                'body' => "Hi {{company_name}},\n\nI visited {{url}} on my phone today and noticed it could be significantly improved for mobile users.\n\nWith more than 60% of web traffic now coming from mobile devices, a poor mobile experience means you're potentially turning away the majority of your visitors.\n\nI help businesses like yours create mobile-first experiences that:\n\n- Load fast on any connection\n- Look great on any screen size\n- Convert visitors into customers\n\nI'd love to show you what's possible. Can I send over a quick mockup?\n\nBest,\n{{sender_name}}",
            ],
        ];

        $existing = $this->em->getRepository(Template::class)->count(['user' => null]);
        if ($existing > 0) {
            $io->warning('Templates already seeded. Use --force to re-seed.');
            return Command::SUCCESS;
        }

        foreach ($templates as $data) {
            $template = new Template();
            $template->setName($data['name']);
            $template->setSubject($data['subject']);
            $template->setBody($data['body']);
            $template->setIsDefault(true);
            $this->em->persist($template);
        }

        $this->em->flush();
        $io->success(sprintf('Seeded %d templates.', count($templates)));

        return Command::SUCCESS;
    }
}
