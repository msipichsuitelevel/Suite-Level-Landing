/**
 * Page copy and the screenshot manifest, kept out of the components so the
 * wording can be edited without touching layout, and so the FAQ can be fed to
 * both the rendered page and the FAQPage JSON-LD from one source. If those two
 * drift apart, Google treats the structured data as mismatched.
 */

export type Shot = { src: string; alt: string };
export type Feature = {
  id: string;
  label: string;
  caption: string;
  shots: Shot[];
};

export const FEATURES: Feature[] = [
  {
    id: 'chat',
    label: 'Chat',
    caption: 'Chat reaches into your database to provide answers in seconds.',
    shots: [
      {
        src: '/shots/chat.jpg',
        alt: 'Suite Level Chat: an assistant answering questions about the market from the platform’s own data, here breaking down Core Cluster buildings by quality and available suites by use type.',
      },
    ],
  },
  {
    id: 'tims',
    label: 'Tenants in the Market',
    caption: 'Track and manage your market’s active tenant requirements.',
    shots: [
      {
        src: '/shots/tenants-in-the-market-table.jpg',
        alt: 'Suite Level Tenants in the Market table: tenants with minimum and maximum size, deal status, tenant use, industry and covering brokerage.',
      },
      {
        src: '/shots/tenants-in-the-market-cards.jpg',
        alt: 'Suite Level Tenants in the Market card view: demand totals above a detailed card for each tenant with target dates, uses, submarkets and comments.',
      },
    ],
  },
  {
    id: 'comps',
    label: 'Lease Comps',
    caption: 'Manage lease comps in a presentable format.',
    shots: [
      {
        src: '/shots/lease-comps-cards.jpg',
        alt: 'Suite Level Lease Comps card view: recent lease comps, each with tenant, landlord, address, size, dates, base rent, escalations, term, free rent, TI allowance and net effective rent.',
      },
      {
        src: '/shots/lease-comps-leasing-totals.jpg',
        alt: 'Suite Level Lease Comps with leasing totals: gross leasing, direct versus sublease, new deals versus renewals, gross subleasing and average rent for the last 12 months, above the lease comp cards.',
      },
    ],
  },
  {
    id: 'supply',
    label: 'Market Supply',
    caption: 'Every property you care about, down to the suite.',
    shots: [
      {
        src: '/shots/market-supply-projects.jpg',
        alt: 'Suite Level Market Supply: a card for each project with landlord, size, availability, representation and location, filtered by landlord, market and micromarket.',
      },
      {
        src: '/shots/market-supply-suite-table.jpg',
        alt: 'Suite Level Market Supply suite table: every suite with project, address, size, contiguous suites, use, floor, market and submarket, editable in place.',
      },
      {
        src: '/shots/market-supply-project-view.jpg',
        alt: 'Suite Level Market Supply project view for Soledad Center: its buildings with size, availability and quality, the competitive set with landlords and asking rents, and the project’s composition by suite use.',
      },
    ],
  },
  {
    id: 'compset',
    label: 'Competitive Sets',
    caption: 'Create comp sets in seconds, not hours.',
    shots: [
      {
        src: '/shots/competitive-set-grid.jpg',
        alt: 'Suite Level competitive set grid comparing a subject property with its competitors by landlord, size, representation, location, use and asking rent.',
      },
      {
        src: '/shots/competitive-set-map.jpg',
        alt: 'Suite Level competitive set map view: a subject and a competing property compared side by side with asking rent, plotted on a map with the distance between them.',
      },
    ],
  },
  {
    id: 'stack',
    label: 'Stacking Plans',
    caption: 'Beautiful, highly interactive suite-by-suite diagrams.',
    shots: [
      {
        src: '/shots/stacking-plan-lease-expiration.jpg',
        alt: 'Suite Level stacking plan for 1155 Island Avenue by lease expiration: each floor’s suites with tenant, current or asking rent, lease expiration and size, shaded by the year each lease expires.',
      },
      {
        src: '/shots/stacking-plan-suite-condition.jpg',
        alt: 'Suite Level stacking plan for 1155 Island Avenue by suite condition: suites shaded from spec and first generation through warm and cold shell.',
      },
    ],
  },
  {
    id: 'listings',
    label: 'Team Listings',
    caption: 'Your team’s listings, activity and assignments in one place.',
    shots: [
      {
        src: '/shots/team-listings.jpg',
        alt: 'Suite Level Team Listings: a card for each listing the team represents, with project, landlord, size, availability, location and the assigned broker.',
      },
    ],
  },
  {
    id: 'meetings',
    label: 'Client Meet',
    caption: 'Walk clients through live data instead of last week’s deck.',
    shots: [
      {
        src: '/shots/client-meet-market-snapshot.jpg',
        alt: 'Suite Level client view for BioREIT: a market snapshot with industry news and current demand by deal stage.',
      },
      {
        src: '/shots/client-meet-listings.jpg',
        alt: 'Suite Level client view of BioREIT’s listings: MED with its current tenant activity and deal stages.',
      },
      {
        src: '/shots/client-meet-stacking-plan.jpg',
        alt: 'Suite Level client view of the Generate Tower listing: the building’s stacking plan, color-coded by suite condition.',
      },
    ],
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Who owns the data my team puts in?',
    a: 'You do. What your team enters is private to your team by default. Nothing goes into a shared database unless you deliberately turn that on, you control what a client can see, and you can export everything at any time. This is the first question every broker asks, and the answer has no asterisk on it.',
  },
  {
    q: 'Do we have to share our data with clients or other brokers?',
    a: 'No. You decide who you share your data with, and you can customize each client’s or broker’s access permissions.',
  },
  {
    q: 'Why use Suite Level if I’m not sharing my data?',
    a: 'On its own, Suite Level tracks your market data and runs your team from one place, organized the way you see the market. Sharing with clients and other brokers is there when you want it, and optional when you don’t.',
  },
  {
    q: 'How is this different from a national listings database?',
    a: 'A national listings database is an inventory you subscribe to. Suite Level is where your team’s own market knowledge lives — the demand side tracked as seriously as supply, maintained by the people actually working the market, and turned directly into the competitive sets, stacking plans and client reporting you produce.',
  },
  {
    q: 'How do we populate the data?',
    a: 'Start with what you already have. Upload your market data spreadsheets, and AI helps turn them into entries in bulk. For one-off updates, add records by hand.',
  },
];

export const FOUNDERS = [
  {
    name: 'Taylor DeBerry',
    role: 'CEO & co-founder',
    bio: 'Taylor has spent his entire career in CRE, starting as an analyst before brokering for a decade in San Diego at Colliers and JLL. Suite Level is the tool he wished he had.',
  },
  {
    name: 'Michael Sipich',
    role: 'Engineering & co-founder',
    bio: 'Michael has spent over a decade building legal tech and finance software, and has led engineering teams in his recent roles. Now he leads the engineering behind Suite Level.',
  },
];
