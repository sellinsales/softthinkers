<?php

declare(strict_types=1);

return [
    'brand' => [
        'name' => 'SoftThinkers',
        'tagline' => 'Think smart. Build better.',
        'headline' => 'Building Smarter Solutions for a Better Tomorrow',
        'summary' => 'SoftThinkers is a technology company delivering software engineering, cloud consulting, certified data expertise, digital products, mobile apps, and managed hosting services for growing businesses.',
        'email' => 'sales@softthinkers.com',
        'phone' => 'Consultation by appointment',
        'location' => 'Pakistan',
        'logo' => 'assets/img/softhinkerslogo.png',
    ],
    'nav' => [
        ['label' => 'Home', 'href' => 'index.php', 'key' => 'home'],
        ['label' => 'Services', 'href' => 'services.php', 'key' => 'services'],
        ['label' => 'Products', 'href' => 'portfolio.php', 'key' => 'products'],
        ['label' => 'Solutions', 'href' => 'packages.php', 'key' => 'solutions'],
        ['label' => 'About Us', 'href' => 'portal.php', 'key' => 'about'],
        ['label' => 'Contact Us', 'href' => 'contact.php', 'key' => 'contact'],
    ],
    'heroActions' => [
        ['label' => 'Explore Services', 'href' => 'services.php', 'variant' => 'primary'],
        ['label' => 'Contact Us', 'href' => 'contact.php', 'variant' => 'secondary'],
    ],
    'trustBar' => [
        ['label' => 'Microsoft', 'subtext' => 'Professional Expertise'],
        ['label' => 'Databricks', 'subtext' => 'Certified Delivery'],
        ['label' => '100+', 'subtext' => 'Certified Professionals'],
    ],
    'services' => [
        [
            'icon' => '</>',
            'title' => 'Software Development',
            'text' => 'Custom software solutions built with modern engineering practices for business platforms, automation, integrations, and digital products.',
        ],
        [
            'icon' => 'CL',
            'title' => 'Cloud Computing Consultancy',
            'text' => 'Cloud adoption, architecture reviews, migration planning, performance optimization, and cost-aware infrastructure consulting.',
        ],
        [
            'icon' => 'DB',
            'title' => 'Certified Databricks Professionals',
            'text' => 'Lakehouse implementation, analytics acceleration, data engineering, ETL pipelines, and scalable data processing expertise.',
        ],
        [
            'icon' => 'MS',
            'title' => 'Microsoft Professionals',
            'text' => 'Microsoft ecosystem support across Azure, Power Platform, .NET, enterprise modernization, and operational systems.',
        ],
        [
            'icon' => 'DI',
            'title' => 'Data Ingestion Software',
            'text' => 'Robust ingestion software to collect, process, transform, and route data into business-ready pipelines and reporting layers.',
        ],
    ],
    'deliveryProcess' => [
        [
            'icon' => '01',
            'title' => 'Discovery & Scope',
            'text' => 'We define business goals, technical constraints, delivery priorities, and the shape of the solution before execution starts.',
        ],
        [
            'icon' => '02',
            'title' => 'Build & Validate',
            'text' => 'Engineering, cloud work, product design, and integration tasks are delivered with practical review cycles and clear checkpoints.',
        ],
        [
            'icon' => '03',
            'title' => 'Launch & Support',
            'text' => 'We stay close through deployment, optimization, handover, and ongoing support where long-term operational continuity matters.',
        ],
    ],
    'solutionTracks' => [
        [
            'icon' => 'AP',
            'title' => 'Application Platforms',
            'text' => 'Business systems, SaaS products, customer portals, internal dashboards, and workflow automation.',
        ],
        [
            'icon' => 'DA',
            'title' => 'Data & Analytics',
            'text' => 'Ingestion pipelines, lakehouse delivery, analytics enablement, ETL modernization, and reporting foundations.',
        ],
        [
            'icon' => 'MC',
            'title' => 'Managed Cloud Delivery',
            'text' => 'Cloud reviews, migration planning, hosting guidance, infrastructure advisory, and performance optimization.',
        ],
    ],
    'products' => [
        [
            'title' => 'FruitMatch',
            'type' => 'Casual Matching Game',
            'text' => 'A colorful mobile matching game built for quick play sessions, simple tap interaction, and family-friendly casual gameplay.',
            'theme' => 'gold',
            'href' => 'app-fruitmatch.php',
        ],
        [
            'title' => '786Rides',
            'type' => 'Ride Hailing Platform',
            'text' => 'A rider, driver, and dispatch-ready mobility product designed for dependable bookings and daily operations.',
            'theme' => 'navy',
            'href' => 'app-786rides.php',
        ],
        [
            'title' => 'OnWayRides',
            'type' => 'Travel App',
            'text' => 'A clean mobile-first transport product for practical trip booking, local travel, and rider convenience.',
            'theme' => 'gold',
            'href' => 'app-onwayrides.php',
        ],
        [
            'title' => 'Kids Learning Games',
            'type' => 'Educational Products',
            'text' => 'Interactive learning games built to engage children through curiosity, repetition, and positive progression.',
            'theme' => 'violet',
            'href' => 'app-lingohunt.php',
        ],
        [
            'title' => 'Parenting & Growth Guides',
            'type' => 'Family Learning Content',
            'text' => 'Guides, tools, and structured content to support parenting decisions, child growth, and learning habits.',
            'theme' => 'rose',
            'href' => 'contact.php',
        ],
        [
            'title' => 'Web Hosting',
            'type' => 'Managed Infrastructure',
            'text' => 'Hosting plans for business websites and products, backed by direct support, migration help, and lifecycle guidance.',
            'theme' => 'blue',
            'href' => 'hosting.php',
        ],
    ],
    'portfolioHighlights' => [
        [
            'icon' => 'MB',
            'title' => 'Mobility Platforms',
            'text' => 'Ride-hailing, dispatch, passenger, and driver experiences shaped for local operations and growth-oriented mobility services.',
        ],
        [
            'icon' => 'ED',
            'title' => 'Learning Experiences',
            'text' => 'Kids learning games, guided educational flows, parent-facing content, and progression-led family products.',
        ],
        [
            'icon' => 'BP',
            'title' => 'Business Platforms',
            'text' => 'Operational platforms, booking systems, market-driven solutions, and custom software aligned to business workflows.',
        ],
    ],
    'apps' => [
        'fruitmatch' => [
            'eyebrow' => 'Casual Game',
            'title' => 'FruitMatch',
            'subtitle' => 'A colorful fruit-matching mobile game by SoftThinkers designed for simple play loops, quick sessions, and family-friendly interaction.',
            'theme' => 'gold',
            'storeCta' => 'Request Launch Details',
            'features' => [
                [
                    'icon' => 'MT',
                    'title' => 'Simple Match Gameplay',
                    'text' => 'FruitMatch focuses on direct tap-and-match play so users can understand the core loop quickly without complicated setup.',
                ],
                [
                    'icon' => 'QS',
                    'title' => 'Quick Sessions',
                    'text' => 'The game structure supports short, repeatable play sessions that work well for casual mobile use.',
                ],
                [
                    'icon' => 'FG',
                    'title' => 'Family-Friendly Direction',
                    'text' => 'The product direction is toward approachable visuals, straightforward interaction, and public-facing support resources.',
                ],
            ],
            'benefits' => [
                'Easy-to-understand fruit matching designed for broad accessibility',
                'Works well for short mobile play sessions without a complex learning curve',
                'Backed by public SoftThinkers support, privacy, and deletion pages',
                'Structured to give store reviewers and users clear public policy references',
            ],
        ],
        'lingohunt' => [
            'eyebrow' => 'Kids Learning App',
            'title' => 'LingoHunt',
            'subtitle' => 'A playful object-learning experience for children built around curiosity, progression, and parent-friendly learning goals.',
            'theme' => 'violet',
            'storeCta' => 'Contact for Launch Updates',
            'features' => [
                [
                    'icon' => 'CV',
                    'title' => 'Object Discovery',
                    'text' => 'Children can scan or identify everyday objects and connect them with vocabulary, pronunciation, and context.',
                ],
                [
                    'icon' => 'GP',
                    'title' => 'Guided Progression',
                    'text' => 'Words, stages, and rewards are structured to encourage repeat learning instead of one-off interaction.',
                ],
                [
                    'icon' => 'PG',
                    'title' => 'Parent Awareness',
                    'text' => 'The wider vision includes parent-facing visibility into progress, usage, and milestone unlocks.',
                ],
            ],
            'benefits' => [
                'Built for young learners with visual, repetition-based interaction',
                'Supports vocabulary growth through real-world object recognition',
                'Designed to connect game progression with educational outcomes',
                'Can be extended with cross-app learning modules and guided content',
            ],
        ],
        '786rides' => [
            'eyebrow' => 'Mobility App',
            'title' => '786Rides',
            'subtitle' => 'A ride-hailing platform for riders, drivers, and operations teams that need dependable daily mobility workflows.',
            'theme' => 'navy',
            'storeCta' => 'Request Product Demo',
            'features' => [
                [
                    'icon' => 'RD',
                    'title' => 'Rider Experience',
                    'text' => 'Clear booking flows, trip visibility, and a straightforward passenger experience built for practical use.',
                ],
                [
                    'icon' => 'DR',
                    'title' => 'Driver Tools',
                    'text' => 'Driver-side workflows support trip acceptance, status handling, and operational responsiveness.',
                ],
                [
                    'icon' => 'OP',
                    'title' => 'Dispatch Alignment',
                    'text' => 'The platform can support local business operations through coordinated dispatch and service oversight.',
                ],
            ],
            'benefits' => [
                'Designed for real transport operations, not just mock marketplace flows',
                'Adaptable for local booking models and dispatch-led businesses',
                'Positioned for expansion into broader mobility management',
                'Backed by a team that can evolve the platform over time',
            ],
        ],
        'onwayrides' => [
            'eyebrow' => 'Travel App',
            'title' => 'OnWayRides',
            'subtitle' => 'A cleaner everyday ride and travel experience focused on comfort, usability, and practical trip access.',
            'theme' => 'gold',
            'storeCta' => 'Ask About Availability',
            'features' => [
                [
                    'icon' => 'UX',
                    'title' => 'Simple Booking',
                    'text' => 'The product focuses on a low-friction booking experience for everyday users who want clarity and speed.',
                ],
                [
                    'icon' => 'MB',
                    'title' => 'Mobile-First Design',
                    'text' => 'Flows are oriented around mobile interaction patterns so the app feels direct and familiar on the go.',
                ],
                [
                    'icon' => 'SV',
                    'title' => 'Service Flexibility',
                    'text' => 'The platform direction allows room for local travel models, bookings, and service variants over time.',
                ],
            ],
            'benefits' => [
                'Built around everyday usability rather than overloaded screens',
                'Well suited to local travel and app-based booking experiences',
                'Can evolve into a larger mobility ecosystem if needed',
                'Aligned with the broader SoftThinkers product portfolio',
            ],
        ],
    ],
    'whyChoose' => [
        'Certified Microsoft and Databricks professionals',
        'End-to-end software, cloud, and data delivery',
        'Mobile apps, products, and business systems under one team',
        'Agile execution with practical communication',
        'Client-focused delivery and long-term support',
    ],
    'metrics' => [
        ['value' => '200+', 'label' => 'Projects Delivered'],
        ['value' => '120+', 'label' => 'Happy Clients'],
        ['value' => '10+', 'label' => 'Years of Industry Work'],
        ['value' => '99%', 'label' => 'Client Retention Focus'],
    ],
    'partners' => [
        ['name' => 'Microsoft', 'subtext' => 'Professional Network'],
        ['name' => 'Databricks', 'subtext' => 'Certified Delivery'],
        ['name' => 'Cloud', 'subtext' => 'Architecture & Migration'],
    ],
    'hostingBenefits' => [
        [
            'icon' => 'UP',
            'title' => 'Reliable Uptime Focus',
            'text' => 'Hosting packages built for business continuity, straightforward onboarding, and support that stays close to deployment.',
        ],
        [
            'icon' => 'MG',
            'title' => 'Migration Guidance',
            'text' => 'We can help move websites, reconfigure domains, and align hosting environments with active project needs.',
        ],
        [
            'icon' => 'SP',
            'title' => 'Support with Context',
            'text' => 'Hosting is backed by a technical team that also understands software projects, product launches, and operational workflows.',
        ],
    ],
    'hostingPlans' => [
        [
            'name' => 'Starter',
            'price' => '$2.99',
            'billing' => '/mo',
            'items' => ['1 Website', '10 GB SSD Storage', 'Free SSL Certificate', '24/7 Support'],
        ],
        [
            'name' => 'Business',
            'price' => '$6.99',
            'billing' => '/mo',
            'featured' => true,
            'items' => ['5 Websites', '50 GB SSD Storage', 'Free SSL Certificate', 'Daily Backups', '24/7 Support'],
        ],
        [
            'name' => 'Premium',
            'price' => '$9.99',
            'billing' => '/mo',
            'items' => ['Unlimited Websites', '100 GB SSD Storage', 'Free SSL Certificate', 'Daily Backups', 'Priority Support'],
        ],
        [
            'name' => 'Enterprise',
            'price' => '$19.99',
            'billing' => '/mo',
            'items' => ['Unlimited Websites', '200 GB SSD Storage', 'Free SSL Certificate', 'Daily Backups', 'Priority Support'],
        ],
    ],
    'packageTracks' => [
        [
            'icon' => 'ST',
            'title' => 'Starter Launch',
            'text' => 'For teams that need a clean web presence, foundational hosting, and direct technical guidance to get moving quickly.',
        ],
        [
            'icon' => 'GR',
            'title' => 'Growth Delivery',
            'text' => 'For businesses expanding into platforms, mobile apps, cloud migration, analytics, or more structured product work.',
        ],
        [
            'icon' => 'EN',
            'title' => 'Enterprise Buildout',
            'text' => 'For larger systems, cross-functional products, operations software, or multi-team engagements needing sustained execution.',
        ],
    ],
    'companyHighlights' => [
        [
            'icon' => 'CO',
            'title' => 'Company Focus',
            'text' => 'SoftThinkers combines software delivery, cloud guidance, data work, product thinking, and managed hosting under one technical brand.',
        ],
        [
            'icon' => 'MD',
            'title' => 'Modern Delivery',
            'text' => 'We work across mobile, web, cloud, analytics, and product systems with pragmatic communication and practical execution.',
        ],
        [
            'icon' => 'IN',
            'title' => 'Industry Reach',
            'text' => 'Mobility, learning, family products, platforms, hosting, and business software are all part of the delivery footprint.',
        ],
    ],
    'contactCards' => [
        [
            'icon' => 'EM',
            'title' => 'Email Consultation',
            'text' => 'Share your requirement, expected timeline, and target platform. We will route it to the right team.',
        ],
        [
            'icon' => 'CL',
            'title' => 'Cloud & Data Advisory',
            'text' => 'Reach out for architecture reviews, migration planning, data ingestion work, and analytics-oriented delivery.',
        ],
        [
            'icon' => 'PD',
            'title' => 'Product Discussions',
            'text' => 'Talk to us about mobility apps, kids learning products, business systems, hosting, or platform modernization.',
        ],
    ],
    'supportCards' => [
        [
            'icon' => 'SU',
            'title' => 'General App Support',
            'text' => 'Use this route for login problems, feature questions, account concerns, and product access issues.',
        ],
        [
            'icon' => 'AC',
            'title' => 'Account & Data Requests',
            'text' => 'Use this route for deletion requests, data access questions, and account status clarifications.',
        ],
        [
            'icon' => 'BS',
            'title' => 'Business & Partnership',
            'text' => 'Use this route for product demos, pilots, partnerships, or operational deployment discussions.',
        ],
    ],
    'cta' => [
        'title' => 'Need a Custom Solution?',
        'text' => 'We build tailored systems for software products, cloud delivery, mobile apps, business operations, and modern hosting needs.',
        'button' => ['label' => 'Get a Free Consultation', 'href' => 'contact.php'],
    ],
    'footerColumns' => [
        [
            'title' => 'Services',
            'links' => [
                ['label' => 'Software Development', 'href' => 'services.php'],
                ['label' => 'Cloud Consultancy', 'href' => 'services.php'],
                ['label' => 'Databricks Solutions', 'href' => 'services.php'],
                ['label' => 'Microsoft Solutions', 'href' => 'services.php'],
                ['label' => 'Data Ingestion Software', 'href' => 'services.php'],
            ],
        ],
        [
            'title' => 'Products',
            'links' => [
                ['label' => 'FruitMatch', 'href' => 'portfolio.php'],
                ['label' => '786Rides', 'href' => 'portfolio.php'],
                ['label' => 'OnWayRides', 'href' => 'portfolio.php'],
                ['label' => 'Kids Learning Games', 'href' => 'portfolio.php'],
                ['label' => 'Parenting & Guides', 'href' => 'portfolio.php'],
                ['label' => 'Web Hosting', 'href' => 'hosting.php'],
            ],
        ],
        [
            'title' => 'Company',
            'links' => [
                ['label' => 'About Us', 'href' => 'portal.php'],
                ['label' => 'Solutions', 'href' => 'packages.php'],
                ['label' => 'Contact Us', 'href' => 'contact.php'],
                ['label' => 'Consultation', 'href' => 'contact.php'],
                ['label' => 'Support', 'href' => 'support.php'],
            ],
        ],
        [
            'title' => 'App Support',
            'links' => [
                ['label' => 'FruitMatch App Page', 'href' => 'app-fruitmatch.php'],
                ['label' => 'FruitMatch Privacy Policy', 'href' => 'app-fruitmatch-privacy.php'],
                ['label' => 'LingoHunt App Page', 'href' => 'app-lingohunt.php'],
                ['label' => 'Support', 'href' => 'support.php'],
                ['label' => 'Privacy Policy', 'href' => 'privacy-policy.php'],
                ['label' => 'Terms of Service', 'href' => 'terms.php'],
                ['label' => 'Delete Account', 'href' => 'delete-account.php'],
            ],
        ],
        [
            'title' => 'Contact',
            'links' => [
                ['label' => 'sales@softthinkers.com', 'href' => 'mailto:sales@softthinkers.com'],
                ['label' => 'Consultation by appointment', 'href' => 'contact.php'],
                ['label' => 'Pakistan', 'href' => 'contact.php'],
            ],
        ],
    ],
];
