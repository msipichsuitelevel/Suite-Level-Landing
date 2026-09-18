import type { Metadata } from 'next';

import { LegalPage } from '@/components/LegalPage';
import { COMPANY } from '@/lib/site';

/**
 * The Privacy Policy, mirrored from the Suite Level application, where the same
 * text lives in `src/components/legal/PrivacyPolicyDocument.tsx`.
 *
 * THE APPLICATION IS THE SOURCE OF TRUTH. Users accept a *version* of this
 * policy at signup and the API rejects any version but the current one, so a
 * change made only here would leave the public page describing terms nobody
 * accepted. Any material edit must land in the app, bump
 * PRIVACY_POLICY_VERSION and PRIVACY_POLICY_LAST_UPDATED there, and then be
 * copied here with VERSION below updated to match.
 */
const VERSION = '2026-09-15';
const LAST_UPDATED = 'September 15, 2026';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Suite Level collects, uses, shares and retains personal information, and the choices and rights you have.',
  alternates: { canonical: '/privacy-policy/' },
  // A policy page competing with the landing page in search results helps
  // nobody, but it must stay crawlable so the link is understood as genuine.
  robots: { index: true, follow: true },
  other: { 'policy-version': VERSION },
};

const Contact = () => <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <section>
        <h2>1. Who we are</h2>
        <p>
          Suite Level is a commercial real estate platform where broker teams track tenants in the
          market, lease comps, market supply and deals, and share selected information with their
          clients. It is operated by {COMPANY.legalName} (&ldquo;Suite Level,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us&rdquo;). This policy explains what personal information we
          collect when you use Suite Level, how we use and share it, and the choices you have.
        </p>
        <p>
          Suite Level is built for businesses. Much of the information in the platform is added by
          broker teams about their own work. For that information, the team decides what is entered
          and who can see it, and we handle it to provide the service to them.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>

        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Account details:</strong> your first and last name, email address and password.
            We store only a secure one-way hash of your password, never the password itself.
          </li>
          <li>
            <strong>Profile and team details:</strong> your team or brokerage name, company, region,
            job title, phone number and display preferences, such as how rates are quoted.
          </li>
          <li>
            <strong>Invitations:</strong> the email addresses of colleagues or clients you invite,
            and the client name and region you assign them.
          </li>
          <li>
            <strong>Content your team adds:</strong> records such as tenants in the market, lease
            comps, market supply, competitive sets, deal pipeline entries, listings and comments.
            These records can include the names of people outside Suite Level, such as tenants,
            landlords, brokers and agents, along with business terms.
          </li>
          <li>
            <strong>Files you upload:</strong> company logos, building photos, floor plans, branding
            logos, spreadsheets for import, and lease or listing documents for automatic data
            extraction.
          </li>
          <li>
            <strong>Messages to us:</strong> anything you send when you contact us for support.
          </li>
        </ul>

        <h3>Information collected as you use Suite Level</h3>
        <ul>
          <li>
            <strong>Activity records:</strong> who created or changed a record and when, recently
            viewed records, which user is currently editing a record, and sign-in session records
            (when a session started, when it expires and when you signed out).
          </li>
          <li>
            <strong>Error diagnostics:</strong> when something goes wrong, our error-monitoring
            provider receives details about the error. That includes the page, your browser and
            device type, and the request that failed with the server&rsquo;s response. That request
            and response can include parts of the business records involved. Before anything is
            sent, we remove passwords, sign-in tokens, and account contact details such as names,
            email addresses and phone numbers. A report may also include a replay of the session
            leading up to the error, with all text, form entries and images masked.
          </li>
        </ul>

        <h3>What we don&rsquo;t collect</h3>
        <p>
          We do not collect payment card details, precise location from your device or government ID
          numbers. We do not use advertising trackers or third-party analytics.
        </p>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <ul>
          <li>Create and secure your account, sign you in and keep your session active</li>
          <li>
            Provide Suite Level&rsquo;s features to you, your team, and the clients and
            collaborators your team chooses
          </li>
          <li>
            Send service emails: welcome messages, invitations, password resets, email-change
            confirmations and notices about team or access changes
          </li>
          <li>
            Answer questions you ask the AI assistant and pull terms out of documents you upload
          </li>
          <li>Show maps, suggest addresses and place properties on a map</li>
          <li>Diagnose errors, keep the service reliable and improve it</li>
          <li>Prevent misuse, enforce our terms and meet legal obligations</li>
        </ul>
        <p>We do not sell personal information or use it for targeted advertising.</p>
      </section>

      <section>
        <h2>4. AI features</h2>
        <p>
          Suite Level uses Anthropic&rsquo;s Claude models for two features. If you use them, the
          following is sent to Anthropic, which processes it on our behalf:
        </p>
        <ul>
          <li>
            <strong>AI assistant:</strong> your questions, your name, and the data the assistant
            reads to answer. That data comes from your team&rsquo;s records and records shared with
            your team by collaborators. The assistant cannot read account passwords or sign-in
            credentials. We do not save your assistant conversations.
          </li>
          <li>
            <strong>Document extraction:</strong> the lease or listing documents you upload for
            extraction. We do not store the uploaded document after the terms are extracted.
          </li>
        </ul>
        <p>Under its commercial terms, Anthropic does not use this data to train its models.</p>
      </section>

      <section>
        <h2>5. How information is shared</h2>

        <h3>Inside Suite Level</h3>
        <ul>
          <li>
            <strong>Your team:</strong> members of your team can see your team&rsquo;s records and
            the team roster, including members&rsquo; and client contacts&rsquo; names, email
            addresses, phone numbers, job titles and regions.
          </li>
          <li>
            <strong>Collaborating teams:</strong> your team&rsquo;s admin can grant another broker
            team access to specific areas, such as tenants in the market or lease comps. The other
            team can see only those areas, and can view your team roster while the collaboration is
            active.
          </li>
          <li>
            <strong>Clients:</strong> client contacts see only the areas your team admin grants
            them.
          </li>
          <li>
            <strong>Exports:</strong> PDFs and spreadsheets you export leave Suite Level and can be
            shared by whoever downloads them.
          </li>
        </ul>

        <h3>Service providers</h3>
        <p>
          We share information with providers that help us run Suite Level, only as they need it:
        </p>
        <ul>
          <li>
            <strong>Anthropic</strong>: AI assistant and document extraction
          </li>
          <li>
            <strong>Microsoft</strong>: sending service emails through Microsoft 365
          </li>
          <li>
            <strong>Google</strong>: maps, address suggestions, turning property addresses into map
            locations, web fonts, and reCAPTCHA on our public access-request form
          </li>
          <li>
            <strong>Sentry</strong>: error monitoring and session replay
          </li>
          <li>
            <strong>Hosting and infrastructure providers</strong>: running our servers, database and
            file storage
          </li>
        </ul>

        <h3>Other disclosures</h3>
        <ul>
          <li>When required by law, or to respond to valid legal requests</li>
          <li>To protect the rights, safety and property of Suite Level, our users or others</li>
          <li>As part of a merger, acquisition or sale of assets, subject to this policy</li>
          <li>With your consent or at your direction</li>
        </ul>
      </section>

      <section>
        <h2>6. Uploaded images</h2>
        <p>
          Images such as company logos, building photos and floor plans can be viewed only by
          signed-in Suite Level users, through links that expire. When you delete a record, or
          replace its image, we delete the old image file.
        </p>
      </section>

      <section>
        <h2>7. Cookies and browser storage</h2>
        <p>
          Suite Level does not use cookies to sign you in or to track you. Instead, your browser
          stores your sign-in token, your basic profile and your display preferences in local
          storage on your device. If you choose &ldquo;Remember me,&rdquo; it also stores your email
          address. Signing out removes the sign-in token and profile. Google Maps, reCAPTCHA and our
          other providers may set their own cookies under their own privacy policies.
        </p>
      </section>

      <section>
        <h2>8. How long we keep information</h2>
        <ul>
          <li>We keep account information while your account is active.</li>
          <li>
            <strong>When you delete your account</strong> in Settings, we end your access right away
            and erase your account details: your name, email address, phone number and password.
            Records you added stay with your team, and activity history shows them as made by a
            former team member.
          </li>
          <li>
            <strong>Team records:</strong> a broker team&rsquo;s records are kept as long as at
            least one broker on the team has an active account. When the last broker deletes their
            account, the team&rsquo;s records, uploaded files, invitations, collaborations and
            client access are scheduled for deletion, and permanently deleted 30 days later. Contact
            us within those 30 days if the deletion was a mistake and you want the team restored.
          </li>
          <li>
            Client contacts don&rsquo;t keep a team&rsquo;s records active. When a client contact
            deletes their account, their details are erased and the team&rsquo;s records are
            unaffected.
          </li>
          <li>
            Deleted information can remain in backups for a limited time before those backups are
            overwritten. Our error-monitoring provider keeps error diagnostics for a limited period.
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Security</h2>
        <p>
          We protect information with measures including hashed passwords, encryption in transit,
          role- and team-based access controls, and sign-in sessions that expire after 24 hours of
          inactivity and 30 days at most. No system is perfectly secure, so please use a strong,
          unique password and tell us right away if you suspect unauthorized access to your account.
        </p>
      </section>

      <section>
        <h2>10. Your choices and rights</h2>
        <ul>
          <li>
            Update your name, phone number and job title in Settings; changing your email requires
            confirming the new address.
          </li>
          <li>
            Delete your account in Settings. Section 8 explains what happens to your team&rsquo;s
            records.
          </li>
          <li>
            Ask for a copy of your personal information, or ask us to correct or delete it, by
            emailing <Contact />. We will verify your request, usually by confirming it from the
            email address on your account.
          </li>
        </ul>
        <p>
          If a broker team added information about you, such as your name on a lease comp, we may
          refer your request to that team, because the team controls its records.
        </p>
      </section>

      <section>
        <h2>11. California privacy rights</h2>
        <p>
          If you are a California resident, the California Consumer Privacy Act gives you additional
          rights. In the past 12 months we collected these categories of personal information:
        </p>
        <ul>
          <li>
            <strong>Identifiers:</strong> name, email address, phone number, account ID
          </li>
          <li>
            <strong>Professional information:</strong> company, job title, region and team
          </li>
          <li>
            <strong>Internet or network activity:</strong> activity records and error diagnostics
            described above
          </li>
          <li>
            <strong>Account login credentials:</strong> email address and password, used only to
            sign you in
          </li>
          <li>
            <strong>User content:</strong> records, comments and files you add
          </li>
        </ul>
        <p>
          We collect this information from you, from your team (for example, when you are invited),
          and automatically as you use Suite Level. We use it for the purposes in section 3 and
          disclose it to the service providers in section 5. We do not sell or share personal
          information for cross-context behavioral advertising, and we have not done so in the past
          12 months. We do not knowingly collect personal information of anyone under 16.
        </p>
        <p>You have the right to:</p>
        <ul>
          <li>Know what personal information we collect, use and disclose, and get a copy</li>
          <li>Request deletion of your personal information, subject to legal exceptions</li>
          <li>Correct inaccurate personal information</li>
          <li>Not be discriminated against for exercising these rights</li>
        </ul>
        <p>
          To make a request, email <Contact />. An authorized agent can submit a request for you
          with your signed permission. We will verify both you and the agent before acting on it.
        </p>
      </section>

      <section>
        <h2>12. Children</h2>
        <p>
          Suite Level is a professional tool for people 18 and older. It is not directed to
          children, and we do not knowingly collect their personal information.
        </p>
      </section>

      <section>
        <h2>13. Changes to this policy</h2>
        <p>
          We may update this policy as Suite Level changes. When we make a material change, we will
          update the &ldquo;Last updated&rdquo; date and ask you to review and accept the new policy
          the next time you use Suite Level.
        </p>
      </section>

      <section>
        <h2>14. Contact us</h2>
        <p>Questions or requests about this policy or your personal information:</p>
        <address className="addr">
          {COMPANY.legalName}
          {COMPANY.addressLines.map((line) => (
            <span key={line}>
              <br />
              {line}
            </span>
          ))}
          <br />
          <Contact />
        </address>
      </section>
    </LegalPage>
  );
}
