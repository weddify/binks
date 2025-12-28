import { QrCode, CreditCard } from "lucide-svelte";

export type PaymentChannel = {
  id: string;
  name: string;
  logo_path?: string; // Local SVG path
  logo_url?: string; // Fallback URL
  type: "va" | "qris" | "ewallet" | "retail";
  instructions?: {
    title: string;
    steps?: string[];
    tabs?: {
      [key: string]: string[];
    };
    notes?: string;
  };
};

export const PAYMENT_CHANNELS = [
  {
    id: "qris",
    name: "QRIS (Instant)",
    type: "qris",
    section_id: "qris", // For grouping in UI if needed
    logo_component: QrCode, // For lucide icons
    logo_path: "/payment_logo/QRIS.svg",
    instructions: {
      title: "Scan QR Code (QRIS)",
      steps: [
        "Open any payment app (GoPay, OVO, DANA, ShopeePay, LinkAja, BCA Mobile, etc).",
        'Select "Scan" or "Pay" and point your camera at the QR code.',
        "Alternatively, upload the QR Code image from your gallery.",
        'Check the merchant name is "PAKASIR".',
        "Confirm payment. Status will update automatically.",
      ],
    },
  },
  // VA Banks
  {
    id: "bni_va",
    name: "BNI Virtual Account",
    type: "va",
    logo_path: "/payment_logo/BNI.svg",
    instructions: {
      title: "BNI Virtual Account",
      tabs: {
        mobile: [
          "Open **BNI Mobile Banking** app.",
          "Login with User ID and MPIN.",
          "Select **Transfer** menu.",
          "Select **Virtual Account Billing**.",
          "Select debit account, then enter Virtual Account Number: **{{vaNumber}}**.",
          "Bill details will appear on confirmation screen.",
          "Confirm transaction and enter Transaction Password.",
          "Transaction complete.",
        ],
        atm: [
          "Insert BNI ATM Card & PIN.",
          "Select **Other Menu** > **Transfer**.",
          "Select **Virtual Account Billing**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Check bill details on confirmation screen.",
          "If correct, proceed to complete transaction.",
        ],
        "Internet Banking": [
          "Login to **BNI Internet Banking** (ibank.bni.co.id).",
          "Select menu **Transfer** > **Virtual Account Billing**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Check transaction details, then approve confirmation.",
          "Transaction success.",
        ],
      },
    },
  },
  {
    id: "bri_va",
    name: "BRI Virtual Account",
    type: "va",
    logo_path: "/payment_logo/BRI.svg",
    instructions: {
      title: "BRI Virtual Account (BRIVA)",
      tabs: {
        mobile: [
          "Login to **BRImo** application.",
          "Select menu **Payment** > **BRIVA**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Enter payment amount according to bill.",
          "Enter BRImo PIN.",
          "Save payment notification as proof.",
        ],
        atm: [
          "Insert ATM Card & PIN.",
          "Select **Other Transaction** > **Payment** > **Other** > **BRIVA**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Select **Yes** to process payment.",
          "Save transaction receipt.",
        ],
        "Internet Banking": [
          "Login to **IB BRI**.",
          "Select menu **Payment** > **BRIVA**.",
          "Enter Payment Code with Virtual Account Number: **{{vaNumber}}**.",
          "Enter IB Password and mToken.",
          "Transaction complete.",
        ],
      },
    },
  },
  {
    id: "cimb_niaga_va",
    name: "CIMB Niaga Virtual Account",
    type: "va",
    logo_path: "/payment_logo/CIMBN.svg",
    instructions: {
      title: "CIMB Niaga Virtual Account",
      tabs: {
        mobile: [
          "Login to **OCTO Mobile**.",
          "Select menu **Transfer** > **Transfer to Other CIMB Niaga Account**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Enter payment amount (if requested).",
          "Confirm payment with OCTO Mobile PIN.",
        ],
        atm: [
          "Insert ATM Card & PIN.",
          "Select menu **Transfer** > **Between CIMB Niaga Accounts**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Enter payment amount.",
          "Check transaction data and press **OK**.",
        ],
      },
    },
  },
  {
    id: "permata_va",
    name: "Permata Virtual Account",
    type: "va",
    logo_path: "/payment_logo/PERMATA.svg",
    instructions: {
      title: "Permata Virtual Account",
      tabs: {
        mobile: [
          "Open **PermataMobile X** app.",
          "Select menu **Pay Bills** > **Virtual Account**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Select source account.",
          "Enter payment amount.",
          "Confirm with Mobile PIN.",
        ],
        atm: [
          "Insert ATM Card & PIN.",
          "Select **Other Transactions** > **Payment** > **Other Payments** > **Virtual Account**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Select source account.",
          "Press **Yes** to confirm.",
        ],
        "Internet Banking": [
          "Login to **PermataNet**.",
          "Select **Bill Payment** > **Virtual Account**.",
          "Enter Virtual Account Number: **{{vaNumber}}**.",
          "Enter payment amount.",
          "Confirm with SMS Token.",
        ],
      },
    },
  },
  {
    id: "maybank_va",
    name: "Maybank Virtual Account",
    type: "va",
    logo_path: "/payment_logo/Maybank.svg",
    instructions: {
      title: "Maybank Virtual Account",
      steps: [
        "Select menu **Online Transfer** on Mobile Banking/ATM.",
        "Enter Bank Code **016** (Maybank).",
        "Enter Virtual Account Number: **{{vaNumber}}**.",
        "Enter payment amount according to bill.",
        "Confirm payment details and complete transaction.",
      ],
    },
  },
  {
    id: "sampoerna_va",
    name: "Sampoerna Virtual Account",
    type: "va",
    logo_path: "/payment_logo/SAMPOERNA.svg",
    instructions: {
      title: "Sampoerna Virtual Account",
      steps: [
        "Select menu **Transfer Online** on Mobile Banking/Other Bank ATM.",
        "Enter Bank Code **523** (Bank Sampoerna).",
        "Enter Virtual Account Number: **{{vaNumber}}**.",
        "Enter amount to pay.",
        "Confirm payment and complete transaction.",
      ],
    },
  },
  {
    id: "bnc_va",
    name: "Bank Neo Commerce (BNC)",
    type: "va",
    logo_path: "/payment_logo/BNC.svg",
    instructions: {
      title: "BNC Virtual Account",
      steps: [
        "Select menu **Transfer Online** on Mobile Banking/ATM.",
        "Enter Bank Code **490** (Bank Neo Commerce).",
        "Enter Virtual Account Number: **{{vaNumber}}**.",
        "Enter exact payment amount.",
        "Confirm payment.",
      ],
    },
  },
  {
    id: "artha_graha_va",
    name: "Artha Graha Virtual Account",
    type: "va",
    logo_path: "/payment_logo/ARTHAGI.svg",
    instructions: {
      title: "Artha Graha Virtual Account",
      steps: [
        "Select menu **Online Transfer** on Mobile Banking/ATM.",
        "Enter Bank Code **037** (Bank Artha Graha).",
        "Enter Virtual Account Number: **{{vaNumber}}**.",
        "Enter payment amount.",
        "Confirm transaction.",
      ],
    },
  },
  {
    id: "atm_bersama_va",
    name: "ATM Bersama Virtual Account",
    type: "va",
    logo_path: "/payment_logo/ATMBersama.svg",
    instructions: {
      title: "ATM Bersama Virtual Account",
      steps: [
        "Select menu **Transfer to Other Bank** on ATM.",
        "Enter destination Bank Code + Virtual Account Number: **{{vaNumber}}**.",
        "Enter appropriate payment amount.",
        "Confirm payment details and complete transaction.",
      ],
    },
  },
];
