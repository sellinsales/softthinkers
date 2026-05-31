<?php

declare(strict_types=1);

return [
    'brand' => [
        'name' => 'SoftThinkers',
        'tagline' => 'Hosting, development, products, and digital ventures under one team.',
        'email' => 'sales@softthinkers.com',
        'phone' => '+92 300 0000000',
    ],
    'nav' => [
        ['label' => 'Home', 'href' => 'index.php', 'key' => 'home'],
        ['label' => 'Services', 'href' => 'services.php', 'key' => 'services'],
        ['label' => 'Packages', 'href' => 'packages.php', 'key' => 'packages'],
        ['label' => 'Hosting', 'href' => 'hosting.php', 'key' => 'hosting'],
        ['label' => 'Portfolio', 'href' => 'portfolio.php', 'key' => 'portfolio'],
        ['label' => 'Portal', 'href' => 'portal.php', 'key' => 'portal'],
        ['label' => 'Contact', 'href' => 'contact.php', 'key' => 'contact'],
    ],
    'pillars' => [
        [
            'title' => 'Cloud',
            'text' => 'Reliable hosting, deployment planning, and modern web infrastructure for small and growing businesses.',
        ],
        [
            'title' => 'Sustainability',
            'text' => 'Long-term support, maintainable builds, and practical delivery plans instead of one-off launches.',
        ],
        [
            'title' => 'Hardware',
            'text' => 'Solutions that respect operational realities, from office setups to devices used in day-to-day field work.',
        ],
    ],
    'serviceLines' => [
        [
            'title' => 'Web Hosting',
            'text' => 'Packages, migrations, domain support, renewals, and deployment assistance for business websites.',
        ],
        [
            'title' => 'Web Development',
            'text' => 'Corporate sites, portals, internal tools, booking flows, and custom business systems.',
        ],
        [
            'title' => 'App Development',
            'text' => 'Mobile products for learning, operations, bookings, logistics, and customer experience.',
        ],
        [
            'title' => 'Game Development',
            'text' => 'Educational and engagement-driven experiences, including projects like LingoHunt.',
        ],
    ],
    'benefits' => [
        'Single-team delivery across hosting, design, development, and support.',
        'Onsite and offshore execution depending on project needs and budget.',
        'Industry-standard technical solutions backed by responsive support.',
        'A practical path from idea to launch without juggling multiple vendors.',
    ],
    'hostingPlans' => [
        [
            'name' => 'Starter Hosting',
            'price' => 'From $49/yr',
            'items' => ['1 website', 'Email setup support', 'Basic backups', 'Launch assistance'],
        ],
        [
            'name' => 'Business Hosting',
            'price' => 'From $129/yr',
            'items' => ['Multiple websites', 'Priority support', 'Performance tuning', 'Migration help'],
        ],
        [
            'name' => 'Managed Growth',
            'price' => 'Custom',
            'items' => ['Hosting plus maintenance', 'Uptime oversight', 'Security review', 'Hands-on support'],
        ],
    ],
    'projects' => [
        [
            'title' => 'LingoHunt',
            'type' => 'Game-Based Learning',
            'text' => 'A child-friendly language learning experience built around discovery, camera interaction, and progression.',
        ],
        [
            'title' => 'Ride Hailing Suite',
            'type' => 'Mobility Platform',
            'text' => 'Driver, rider, and admin workflows for transport operations and managed booking systems.',
        ],
        [
            'title' => 'Taxi Booking Solution',
            'type' => 'Booking Product',
            'text' => 'A focused transport booking stack for local operators with dispatch-friendly flows.',
        ],
        [
            'title' => 'Marketplace Systems',
            'type' => 'Commerce Platform',
            'text' => 'Seller, buyer, and operations-ready systems tailored for niche digital or local commerce.',
        ],
    ],
    'contactCards' => [
        [
            'title' => 'Hosting Enquiries',
            'text' => 'Packages, migrations, renewals, and operational support.',
        ],
        [
            'title' => 'Development Projects',
            'text' => 'Web platforms, mobile apps, dashboards, and business systems.',
        ],
        [
            'title' => 'Product Partnerships',
            'text' => 'Games, learning products, marketplaces, and mobility solutions.',
        ],
    ],
    'portalFeatures' => [
        [
            'title' => 'Account Requests',
            'text' => 'A future client portal can onboard customers for hosting, project support, and managed services.',
        ],
        [
            'title' => 'Renewals and Billing',
            'text' => 'Renewal reminders, invoice visibility, and service continuity should live in the client area.',
        ],
        [
            'title' => 'Support Routing',
            'text' => 'Service tickets, migration requests, and technical follow-ups can be structured through one account.',
        ],
    ],
    'packageCards' => [
        [
            'title' => 'Starter Launch',
            'type' => 'Hosting + Basic Setup',
            'text' => 'Best for a new brochure website or single-brand presence with initial support included.',
        ],
        [
            'title' => 'Business Presence',
            'type' => 'Hosting + Web Build',
            'text' => 'For businesses that need a stronger website, content structure, and dependable support.',
        ],
        [
            'title' => 'Operations Platform',
            'type' => 'Custom Development',
            'text' => 'For portals, bookings, marketplaces, internal workflows, or custom digital operations.',
        ],
        [
            'title' => 'Product Studio',
            'type' => 'Apps and Games',
            'text' => 'For learning apps, mobility products, educational games, and custom digital ventures.',
        ],
    ],
];
