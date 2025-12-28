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
          "Buka aplikasi **BNI Mobile Banking**.",
          "Login dengan User ID dan MPIN.",
          "Pilih menu **Transfer**.",
          "Pilih menu **Virtual Account Billing**.",
          "Pilih rekening debit, lalu masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Tagihan akan muncul pada layar konfirmasi.",
          "Konfirmasi transaksi dan masukkan Password Transaksi.",
          "Transaksi selesai.",
        ],
        atm: [
          "Masukkan Kartu ATM BNI & PIN.",
          "Pilih **Menu Lainnya** > **Transfer**.",
          "Pilih **Virtual Account Billing**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Cek rincian tagihan pada layar konfirmasi.",
          "Jika sesuai, lanjutkan transaksi hingga selesai.",
        ],
        "Internet Banking": [
          "Login ke **BNI Internet Banking** (ibank.bni.co.id).",
          "Pilih menu **Transfer** > **Virtual Account Billing**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Cek detail transaksi, lalu setujui konfirmasi.",
          "Transaksi sukses.",
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
          "Login ke aplikasi **BRImo**.",
          "Pilih menu **Pembayaran** > **BRIVA**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Masukkan jumlah pembayaran sesuai tagihan.",
          "Masukkan PIN BRImo.",
          "Simpan notifikasi pembayaran sebagai bukti.",
        ],
        atm: [
          "Masukkan Kartu ATM & PIN.",
          "Pilih **Transaksi Lain** > **Pembayaran** > **Lainnya** > **BRIVA**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Pilih **Ya** untuk memproses pembayaran.",
          "Simpan struk transaksi.",
        ],
        "Internet Banking": [
          "Login ke **IB BRI**.",
          "Pilih menu **Pembayaran** > **BRIVA**.",
          "Masukkan Kode Bayar dengan Nomor Virtual Account: **{{vaNumber}}**.",
          "Masukkan Password IB dan mToken.",
          "Transaksi selesai.",
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
          "Login ke **OCTO Mobile**.",
          "Pilih menu **Transfer** > **Transfer ke Rekening CIMB Niaga Lainnya**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Masukkan nominal pembayaran (bila diminta).",
          "Konfirmasi pembayaran dengan PIN OCTO Mobile.",
        ],
        atm: [
          "Masukkan Kartu ATM & PIN.",
          "Pilih menu **Transfer** > **Antar Rekening CIMB Niaga**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Masukkan nominal pembayaran.",
          "Periksa data transaksi dan tekan **OK**.",
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
          "Buka aplikasi **PermataMobile X**.",
          "Pilih menu **Bayar Tagihan** (Pay Bills) > **Virtual Account**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Pilih rekening sumber dana.",
          "Masukkan nominal pembayaran.",
          "Konfirmasi dengan Mobile PIN.",
        ],
        atm: [
          "Masukkan Kartu ATM & PIN.",
          "Pilih **Transaksi Lainnya** > **Pembayaran** > **Pembayaran Lainnya** > **Virtual Account**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Pilih rekening sumber dana.",
          "Tekan **Ya** untuk konfirmasi.",
        ],
        "Internet Banking": [
          "Login ke **PermataNet**.",
          "Pilih **Pembayaran Tagihan** > **Virtual Account**.",
          "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
          "Masukkan nominal pembayaran.",
          "Konfirmasi dengan SMS Token.",
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
        "Pilih menu **Online Transfer** pada Mobile Banking/ATM.",
        "Masukkan Kode Bank **016** (Maybank).",
        "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
        "Masukkan nominal pembayaran sesuai tagihan.",
        "Konfirmasi detail pembayaran dan selesaikan transaksi.",
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
        "Pilih menu **Transfer Online** di Mobile Banking/ATM Bank Lain.",
        "Masukkan Kode Bank **523** (Bank Sampoerna).",
        "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
        "Masukkan nominal yang harus dibayar.",
        "Konfirmasi pembayaran dan selesaikan transaksi.",
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
        "Pilih menu **Transfer Online** di Mobile Banking/ATM.",
        "Masukkan Kode Bank **490** (Bank Neo Commerce).",
        "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
        "Masukkan nominal pembayaran yang tepat.",
        "Konfirmasi pembayaran.",
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
        "Pilih menu **Transfer Online** di Mobile Banking/ATM.",
        "Masukkan Kode Bank **037** (Bank Artha Graha).",
        "Masukkan Nomor Virtual Account: **{{vaNumber}}**.",
        "Masukkan nominal pembayaran.",
        "Konfirmasi transaksi.",
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
        "Pilih menu **Transfer ke Bank Lain** di ATM.",
        "Masukkan Kode Bank tujuan + Nomor Virtual Account: **{{vaNumber}}**.",
        "Masukkan nominal pembayaran yang sesuai.",
        "Konfirmasi detail pembayaran dan selesaikan transaksi.",
      ],
    },
  },
];
