export type Product = {
  id: string;
  slug: string;
  title: string;
  category?: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sold: number;
  image?: string;
  discountType?: "PERCENTAGE" | "FIXED" | "NONE";
  discountValue?: number;
  validUntil?: string;
  warranty?: string;
  warrantyPolicy?: string;
  instructions?: string[];
  additionalNotes?: string;
  instantDelivery?: boolean;
};

export type ProductGroup = {
  groupTitle: string;
  products: Product[];
};

export type CategoryData = {
  title: string;
  description: string;
  groups: ProductGroup[];
};

import { MonitorPlay, Gamepad2, Grid, Lock } from "lucide-svelte";

export const categories = [
  {
    title: "Streaming",
    desc: "Netflix, Disney+, Spotify",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUMqSFkD7fzYtlb1rl9z2-X0hnoj4YR5nOR3YgvCmUdQzAyGkVW6dcSJ5jHZVv0tkmUA9dmVXnaoKHy0G3lgtefSb2r6a_JwyWgLO7D6mjPPZYAjFTpXNHUFwtWJvBMqpUT2dKbCuZKHVFLbiOtNOWU47HXbIB-cxgSCs6q-oKKB2RaPYOmK6yolLnzlFUuv9pgAPwIMoe2VT60aP6ZzQy9HSLYm3tWnzSs7t-IN2o9dkLRXVVpPBmCojAUjEZZuivDYcO6Wiz_NEh",
    icon: MonitorPlay,
  },
  {
    title: "Gaming",
    desc: "Steam, Valorant, PSN",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDJdyMBdka8n56wwXe1feEkpcfOQU5dgl0uKfzNcM-wmeRG1ewU3e6WYYEat12PldnWCyjeeZOD_JXNUAEb2zj57r7fmhnKMGLs-hp1Ne-_tEH9FJP3A2wi_H0xKSAC3P9j1IlrF3RPShD3wzKNqIeLWSMc-y0b1N38JOBBK4HEiD6Q14ipl3vYEiJegDmiS6H3xwXFll45IA2nTNGfg7jIwsBykvGKRa6AOp_-CR_chxSpxX3zl6NFfVUBDEwbF-eJ2EU5i-HEge",
    icon: Gamepad2,
  },
  {
    title: "Software",
    desc: "Adobe, Microsoft Office",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoEud1bJzV0V4YN1uPXalfPL6Ivkw32RWG2JIV07WZRw83RWE4lwrcwt1T3lNLQQdMqT6K7RufT9K_6amoLTnPhfcAIUL0cfXdsfpwjS61bw4T7oIOlQ0zUOjoE402hXEHODgXZZq4QqrzdsmGVdpcYCRbsb_Q9sjbzDoIpwvL71NFv8SG5C4VylYX0-7VP66B83GHuI652PeciUL7zlf_7TYV_UkWTAvR0NgtnUfWI_aa0lUyM3zR6hu_-igtRvr0_kXgKYmiGFE3",
    icon: Grid,
  },
  {
    title: "VPN & Tools",
    desc: "NordVPN, Canva Pro",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6CHraz-61CzsGXG4wtKrvwvgTlXjpI6FwSXXL7sdE4U88rwbkmH1JGgGJu8BIhgbGI6cJhIg0ObAg292SDGl9TgHginhmat8zhFcPjdDUUTs1Hi-PgjOUrW-12RnsRQ92amujqQQB5VtG4REbWbJ3R3adAUg8JtYNfkEGmiopljQNyD43jgslvnlHjjXaANV6tovnrfnwhTHQQAE7_PVgI-tglx2BnSKWoInLYiP9nUgsWF8m8I0VH1HoGY2aZcpqysNlw-PCzy4i",
    icon: Lock,
  },
];

export const database: Record<string, CategoryData> = {
  streaming: {
    title: "Streaming",
    description:
      "Instant delivery on the world's most popular streaming services.",
    groups: [
      {
        groupTitle: "Netflix Premium 1 Month",
        products: [
          {
            id: "n1-1",
            slug: "netflix-premium-1-device",
            title: "Netflix Premium 1 Device",
            description: "Private profile, 1 device allowed. UHD supported.",
            price: 45000,
            originalPrice: 50000,
            stock: 42,
            sold: 156,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA3CS1x0SPVbPPZCPR0NsXLTWCw55HrmIlLyTfVy-SeIxBW4l7OGBPfYsBCj-HZ28BpWmbmQrhT5aHBZ1_DfrpzrKQKAGEjxDBX0sHcg3GN7mGogQ8pK_bSvW7I3bzHPSFiq6WY0wVKgCGXVi-KYnbkPzuBGEWsw_hQBsiOXwDAM8JvKmPrO5kZy-ppYWLeYlqf41xVN4glJXK5ho8DtnsPZEFq22r6gUsl1pudJZTaoCPA0gZ9kqk2EPUPxRnSVmgQLe22iun3B2NP",

            warranty: "30 Days Full Warranty",
            instantDelivery: true,
            instructions: [
              "Login with provided credentials",
              "Do not change password/email",
              "Create your own profile",
              "Enjoy watching!",
            ],
          },
          {
            id: "n1-2",
            slug: "netflix-premium-2-device",
            title: "Netflix Premium 2 Device",
            description: "Share with a friend. UHD supported.",
            price: 40000,
            stock: 42,
            sold: 89,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA3CS1x0SPVbPPZCPR0NsXLTWCw55HrmIlLyTfVy-SeIxBW4l7OGBPfYsBCj-HZ28BpWmbmQrhT5aHBZ1_DfrpzrKQKAGEjxDBX0sHcg3GN7mGogQ8pK_bSvW7I3bzHPSFiq6WY0wVKgCGXVi-KYnbkPzuBGEWsw_hQBsiOXwDAM8JvKmPrO5kZy-ppYWLeYlqf41xVN4glJXK5ho8DtnsPZEFq22r6gUsl1pudJZTaoCPA0gZ9kqk2EPUPxRnSVmgQLe22iun3B2NP",

            warranty: "30 Days Full Warranty",
          },
          {
            id: "n1-4",
            slug: "netflix-premium-private",
            title: "Netflix Premium 4 Device (Private)",
            description: "Full private account. Create 5 profiles.",
            price: 180000,
            originalPrice: 195000,
            stock: 0,
            sold: 34,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA3CS1x0SPVbPPZCPR0NsXLTWCw55HrmIlLyTfVy-SeIxBW4l7OGBPfYsBCj-HZ28BpWmbmQrhT5aHBZ1_DfrpzrKQKAGEjxDBX0sHcg3GN7mGogQ8pK_bSvW7I3bzHPSFiq6WY0wVKgCGXVi-KYnbkPzuBGEWsw_hQBsiOXwDAM8JvKmPrO5kZy-ppYWLeYlqf41xVN4glJXK5ho8DtnsPZEFq22r6gUsl1pudJZTaoCPA0gZ9kqk2EPUPxRnSVmgQLe22iun3B2NP",
          },
        ],
      },
      {
        groupTitle: "HBO Premium 1 Month",
        products: [
          {
            id: "h1-4",
            slug: "hbo-premium-4-device",
            title: "HBO Premium 4 Device",
            description: "Watch biggest movies and series. Ad-free.",
            price: 25000,
            originalPrice: 35000,
            stock: 120,
            sold: 450,
            image:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/2048px-HBO_Max_Logo.svg.png",
          },
        ],
      },
      {
        groupTitle: "Spotify Premium",
        products: [
          {
            id: "s-ind",
            slug: "spotify-individual",
            title: "Spotify Individual 1 Month",
            description: "Ad-free music listening. Offline playback.",
            price: 28000,
            stock: 99,
            sold: 1200,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCUEykhRksq_R1d72cT6-nDu8m9diHgsHN-sc3qRAbiLxzcSNpVw5nYi6B7G0SaEp1ldBe7zQHf0Adz-qDe7zX1w8AwIJVrSwTz73QkctpEjHEOo4zIS3atQpQbsvohRMzzTSg8pyuAXqn6L4eRMoSPd4hGhojZbqzp3-hdEPeLqy8z6MXmUxfo_BTOlmO3wO5pOnkSA6F9MZ-6TSVv_8nTXAO0-bw4-EcsAWaVTgq3332qtDXYo3DNSFYz7gpq6SCiEaxs73q1HLaX",
          },
          {
            id: "s-fam",
            slug: "spotify-family",
            title: "Spotify Family Plan Owner",
            description: "Invite up to 5 members.",
            price: 45000,
            stock: 10,
            sold: 33,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCUEykhRksq_R1d72cT6-nDu8m9diHgsHN-sc3qRAbiLxzcSNpVw5nYi6B7G0SaEp1ldBe7zQHf0Adz-qDe7zX1w8AwIJVrSwTz73QkctpEjHEOo4zIS3atQpQbsvohRMzzTSg8pyuAXqn6L4eRMoSPd4hGhojZbqzp3-hdEPeLqy8z6MXmUxfo_BTOlmO3wO5pOnkSA6F9MZ-6TSVv_8nTXAO0-bw4-EcsAWaVTgq3332qtDXYo3DNSFYz7gpq6SCiEaxs73q1HLaX",
          },
        ],
      },
    ],
  },
  gaming: {
    title: "Gaming",
    description: "Top-tier accounts for competitive gaming.",
    groups: [
      {
        groupTitle: "Valorant Points",
        products: [
          {
            id: "vp-1",
            slug: "valorant-300-vp",
            title: "300 VP",
            description: "Valorant Points code.",
            price: 35000,
            stock: 100,
            sold: 50,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDJdyMBdka8n56wwXe1feEkpcfOQU5dgl0uKfzNcM-wmeRG1ewU3e6WYYEat12PldnWCyjeeZOD_JXNUAEb2zj57r7fmhnKMGLs-hp1Ne-_tEH9FJP3A2wi_H0xKSAC3P9j1IlrF3RPShD3wzKNqIeLWSMc-y0b1N38JOBBK4HEiD6Q14ipl3vYEiJegDmiS6H3xwXFll45IA2nTNGfg7jIwsBykvGKRa6AOp_-CR_chxSpxX3zl6NFfVUBDEwbF-eJ2EU5i-HEge",
          },
          {
            id: "vp-2",
            slug: "valorant-1200-vp",
            title: "1200 VP",
            description: "Valorant Points code.",
            price: 140000,
            stock: 50,
            sold: 20,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDJdyMBdka8n56wwXe1feEkpcfOQU5dgl0uKfzNcM-wmeRG1ewU3e6WYYEat12PldnWCyjeeZOD_JXNUAEb2zj57r7fmhnKMGLs-hp1Ne-_tEH9FJP3A2wi_H0xKSAC3P9j1IlrF3RPShD3wzKNqIeLWSMc-y0b1N38JOBBK4HEiD6Q14ipl3vYEiJegDmiS6H3xwXFll45IA2nTNGfg7jIwsBykvGKRa6AOp_-CR_chxSpxX3zl6NFfVUBDEwbF-eJ2EU5i-HEge",
          },
        ],
      },
    ],
  },
};

// Helper to flatten all products for simpler access
export const products: Product[] = Object.values(database).flatMap((category) =>
  category.groups.flatMap((group) => group.products)
);

export const findProductBySlug = (slug: string): Product | undefined => {
  for (const category of Object.values(database)) {
    for (const group of category.groups) {
      const product = group.products.find((p) => p.slug === slug);
      if (product) return product;
    }
  }
  return undefined;
};

export const userOrders = [
  {
    id: "INV-20231201-001",
    date: "12 Dec 2023",
    items: "Netflix Premium (1 Month)",
    total: 36500,
    status: "PAID",
    paymentMethod: "VA BCA",
    credentials: Array.from({ length: 66 }).map((_, i) => ({
      email: `bulk-order-${i + 1}@example.com`,
      password: `secure-${Math.random().toString(36).substring(7)}`,
      pin: `${1000 + i}`,
    })),
    products: [
      {
        title: "Netflix Premium 1 Device",
        variant: "1 Month (Private)",
        price: 35000,
        quantity: 66,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA3CS1x0SPVbPPZCPR0NsXLTWCw55HrmIlLyTfVy-SeIxBW4l7OGBPfYsBCj-HZ28BpBmbmQrhT5aHBZ1_DfrpzrKQKAGEjxDBX0sHcg3GN7mGogQ8pK_bSvW7I3bzHPSFiq6WY0wVKgCGXVi-KYnbkPzuBGEWsw_hQBsiOXwDAM8JvKmPrO5kZy-ppYWLeYlqf41xVN4glJXK5ho8DtnsPZEFq22r6gUsl1pudJZTaoCPA0gZ9kqk2EPUPxRnSVmgQLe22iun3B2NP",
      },
    ],
    paymentDetails: {
      subtotal: 70000,
      serviceFee: 1500,
      discount: 0,
      uniqueCode: 0,
    },
  },
  {
    id: "INV-20231220-402",
    date: "20 Dec 2023",
    items: "Spotify Individual (3 Months)",
    total: 165000,
    status: "PENDING",
    paymentMethod: "QRIS",
    expiry: "23:59:59",
    products: [
      {
        title: "Spotify Premium Individual",
        variant: "3 Months",
        price: 163500,
        quantity: 1,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUEykhRksq_R1d72cT6-nDu8m9diHgsHN-sc3qRAbiLxzcSNpVw5nYi6B7G0SaEp1ldBe7zQHf0Adz-qDe7zX1w8AwIJVrSwTz73QkctpEjHEOo4zIS3atQpQbsvohRMzzTSg8pyuAXqn6L4eRMoSPd4hGhojZbqzp3-hdEPeLqy8z6MXmUxfo_BTOlmO3wO5pOnkSA6F9MZ-6TSVv_8nTXAO0-bw4-EcsAWaVTgq3332qtDXYo3DNSFYz7gpq6SCiEaxs73q1HLaX",
      },
    ],
    paymentDetails: {
      subtotal: 163500,
      serviceFee: 1500,
      discount: 0,
      uniqueCode: 123,
    },
  },
  {
    id: "INV-20231115-882",
    date: "15 Nov 2023",
    items: "Mobile Legends 100 Diamonds",
    total: 28000,
    status: "EXPIRED",
    paymentMethod: "E-Wallet",
    products: [
      {
        title: "Mobile Legends Diamonds",
        variant: "100 Diamonds",
        price: 26500,
        quantity: 1,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDJdyMBdka8n56wwXe1feEkpcfOQU5dgl0uKfzNcM-wmeRG1ewU3e6WYYEat12PldnWCyjeeZOD_JXNUAEb2zj57r7fmhnKMGLs-hp1Ne-_tEH9FJP3A2wi_H0xKSAC3P9j1IlrF3RPShD3wzKNqIeLWSMc-y0b1N38JOBBK4HEiD6Q14ipl3vYEiJegDmiS6H3xwXFll45IA2nTNGfg7jIwsBykvGKRa6AOp_-CR_chxSpxX3zl6NFfVUBDEwbF-eJ2EU5i-HEge",
      },
    ],
    paymentDetails: {
      subtotal: 26500,
      serviceFee: 1500,
      discount: 0,
      uniqueCode: 0,
    },
  },
];

export type Order = (typeof userOrders)[number];

export type Coupon = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
};

export const coupons: Coupon[] = [
  {
    id: "c1",
    code: "WELCOME20",
    type: "PERCENTAGE",
    value: 20,
    maxDiscount: 20000,
    usageLimit: 100,
    usedCount: 45,
    expiryDate: "2024-12-31T23:59",
    isActive: true,
  },
  {
    id: "c2",
    code: "FLASHSALE",
    type: "FIXED",
    value: 15000,
    minPurchase: 100000,
    usageLimit: 50,
    usedCount: 50,
    expiryDate: "2023-11-01T12:00",
    isActive: false,
  },
  {
    id: "c3",
    code: "GAMER50",
    type: "PERCENTAGE",
    value: 50,
    maxDiscount: 50000,
    usageLimit: 10,
    usedCount: 2,
    expiryDate: "2024-06-01T00:00",
    isActive: true,
  },
];
