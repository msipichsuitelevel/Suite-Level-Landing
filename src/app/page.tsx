import type { Metadata } from 'next';

import { AccessForm } from '@/components/AccessForm';
import { FeatureSwitch } from '@/components/FeatureSwitch';
import { LogoDefs } from '@/components/Logo';
import { Rail } from '@/components/Rail';
import { FAQ, FOUNDERS } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * Product and FAQ structured data. The FAQ answers come from the same module
 * the page renders, so the markup can never describe a question the page does
 * not show - which is what makes Google drop it as mismatched.
 */
function HomeJsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Suite Level',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
        description:
          'A commercial real estate platform where broker teams track tenants in the market, lease comps, market supply, competitive sets and stacking plans, and share a controlled live view with their clients.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free during the private beta.',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <LogoDefs />

      <a className="skip-link" href="#top">
        Skip to content
      </a>

      <div className="app">
        <Rail />

        <div className="col" id="top">
          <section className="hero">
            <h1>
              Your market.
              <br />
              Your portfolio.
            </h1>
            <p className="lede">
              Brokers run most of their data-driven business on spreadsheets, email threads and
              tools that don&rsquo;t communicate. Suite Level is the all-in-one place to track
              demand, supply and listings, and turn them into the professional-grade reporting your
              clients want.
            </p>
          </section>

          <div className="views">
            <section className="sec" id="product">
              <div className="sec-head">
                <span className="sec-badge">Platform</span>
                <span className="rule" />
              </div>
              <h2>
                Everything you track,
                <br />
                in one system.
              </h2>
              <p className="intro">
                Your market data and the deliverables that come out of it &mdash; held in one place
                and maintained by you, the broker actually working the market.
              </p>

              <FeatureSwitch />
            </section>

            <section className="sec" id="share">
              <div className="sec-head">
                <span className="sec-badge">Collaborate</span>
                <span className="rule" />
              </div>
              <h2>Collaborate with clients and across broker teams.</h2>

              <div className="pair">
                <div>
                  <h3 className="grp-h">Clients</h3>
                  <p className="grp-p">
                    Clients want more data, more often, and more current than ever before. Every
                    request routes through you, and slow answers cost you clients. Give your trusted
                    clients a live look into your view of the market. You control exactly what they
                    see.
                  </p>
                </div>
                <div>
                  <h3 className="grp-h">Broker teams</h3>
                  <p className="grp-p">
                    Your data is your edge, and the right partner multiplies it. Team up with a
                    broker you trust in a market you don&rsquo;t cover or a product type outside
                    your specialty, and land bigger clients than either of you could alone. You
                    decide what&rsquo;s shared.
                  </p>
                </div>
              </div>
            </section>

            <section className="sec" id="who">
              <div className="sec-head">
                <span className="sec-badge">Who we are</span>
                <span className="rule" />
              </div>
              <h2>
                Broker-envisioned,
                <br />
                engineer-built.
              </h2>

              <div className="pair">
                {FOUNDERS.map((person) => (
                  <div key={person.name}>
                    <h3 className="grp-h">{person.name}</h3>
                    <span className="role">{person.role}</span>
                    <p>{person.bio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="sec" id="access">
              <div className="sec-head">
                <span className="sec-badge">Early access</span>
                <span className="rule" />
              </div>
              <h2>Get in before launch.</h2>
              <p className="intro">
                Suite Level is in private beta. Joining now gives you access to the platform free of
                charge before it reaches the market, and you get to help shape what it becomes.
              </p>

              <AccessForm />
            </section>

            <section className="sec" id="faq">
              <div className="sec-head">
                <span className="sec-badge">FAQ</span>
                <span className="rule" />
              </div>
              <h2>Before you request access.</h2>

              <div className="qa">
                {FAQ.map((item, i) => (
                  <details key={item.q} open={i === 0}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <div className="foot">
            <span>&copy; {new Date().getFullYear()} Suite Level, Inc.</span>
            <nav>
              <a href="/privacy-policy/">Privacy Policy</a>
              <a href="mailto:operations@suite-level.com">Contact</a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
