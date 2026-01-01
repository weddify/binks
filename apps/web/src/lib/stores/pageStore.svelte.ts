export type Page = {
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
  isPublished: boolean;
};

export const DEFAULT_PAGES: Page[] = [
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    content: `
                <h2>Payment & Orders</h2>
                <p><strong>Q: How long does delivery take?</strong><br>A: For automated products (Tokens, Vouchers), delivery is instant. For assisted services, it may take 10-30 minutes during online hours.</p>
                <p><strong>Q: What payment methods are accepted?</strong><br>A: We accept QRIS, Virtual Accounts (BCA, BRI, Mandiri, etc.), and E-Wallets.</p>
                
                <h2>Warranty & Support</h2>
                <p><strong>Q: Is there a warranty?</strong><br>A: Yes, all premium accounts come with a full warranty for the duration of the subscription.</p>
            `,
    lastUpdated: new Date().toISOString(),
    isPublished: true,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `
        <h2>1. Introduction</h2>
        <p>Welcome to <strong>SwiftAcc</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>

        <h2>2. Data We Collect</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
        <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone number.</li>
            <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
      `,
    lastUpdated: "2025-12-27T00:00:00.000Z",
    isPublished: true,
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    content: `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

        <h2>2. Digital Products</h2>
        <p>All products sold on SwiftAcc are digital goods.</p>
        <ul>
            <li><strong>Instant Delivery</strong>: Products are delivered automatically to your email/dashboard upon successful payment.</li>
            <li><strong>No Physical Shipment</strong>: There are no physical items to be shipped.</li>
        </ul>

        <h2>3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.</p>

        <h2>4. Refund Policy</h2>
        <p>Please refer to our Warranty Policy for details on refunds and replacements. Generally, refunds are only issued if the digital product is proven to be invalid/defective upon delivery and we cannot provide a replacement.</p>
      `,
    lastUpdated: "2025-12-27T00:00:00.000Z",
    isPublished: true,
  },
  {
    slug: "warranty-policy",
    title: "Warranty Policy",
    content: `
        <h2>1. Coverage</h2>
        <p>We provide a warranty for all digital accounts and licenses sold on our platform. The warranty period varies by product type:</p>
        <ul>
            <li><strong>Streaming Accounts</strong>: Full warranty for the duration of the subscription.</li>
            <li><strong>Game Accounts</strong>: 7-day initial warranty against login issues.</li>
            <li><strong>Software Licenses</strong>: Lifetime activation guarantee.</li>
        </ul>

        <h2>2. Claim Process</h2>
        <p>To claim a warranty:</p>
        <ol>
            <li>Determine the issue (e.g., Incorrect password, Subscription expired early).</li>
            <li>Contact our support via WhatsApp or Email.</li>
            <li>Provide your Order ID and screenshots of the error.</li>
            <li>We will verify and issue a replacement within 24 hours.</li>
        </ol>

        <h2>3. Exclusions</h2>
        <p>Warranty is void if:</p>
        <ul>
            <li>You change the account email/password without authorization.</li>
            <li>The account is banned due to your violation of the platform's terms (e.g., using cheats/hacks on a game account).</li>
            <li>You share the account with others (for personal single-user accounts).</li>
        </ul>
      `,
    lastUpdated: "2025-12-27T00:00:00.000Z",
    isPublished: true,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    content: `
        <h2>1. General Info</h2>
        <p>The information provided by SwiftAcc ("we," "us", or "our") on our website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the Site.</p>

        <h2>2. External Links</h2>
        <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p>

        <h2>3. Professional Disclaimer</h2>
        <p>The Site cannot and does not provide legal advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice.</p>
      `,
    lastUpdated: "2025-12-27T00:00:00.000Z",
    isPublished: true,
  },
];

class PageStore {
  pages = $state<Page[]>(DEFAULT_PAGES);

  constructor() {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("cms_pages");
      if (stored) {
        this.pages = JSON.parse(stored);
      }
    }

    $effect.root(() => {
      $effect(() => {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("cms_pages", JSON.stringify(this.pages));
        }
      });
    });
  }

  addPage(page: Page) {
    this.pages.push(page);
  }

  updatePage(slug: string, data: Partial<Page>) {
    const index = this.pages.findIndex((p) => p.slug === slug);
    if (index !== -1) {
      this.pages[index] = {
        ...this.pages[index],
        ...data,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  deletePage(slug: string) {
    this.pages = this.pages.filter((p) => p.slug !== slug);
  }

  getPage(slug: string) {
    return this.pages.find((p) => p.slug === slug);
  }
}

export const pageStore = new PageStore();
