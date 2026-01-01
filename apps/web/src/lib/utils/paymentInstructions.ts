import { PAYMENT_CHANNELS } from "$lib/constants/payments";

export type PaymentInstruction = {
  title: string;
  steps?: string[];
  notes?: string;
  tabs?: {
    [key: string]: string[]; // e.g. 'atm': [...], 'mobile': [...]
  };
};

// Transform the unified constant back into the structure the Invoice page expects
// This maintains backward compatibility while using the single source of truth
export const PAYMENT_INSTRUCTIONS: Record<
  string,
  Record<string, PaymentInstruction>
> = {
  // QRIS
  QRIS: {
    // Note: Invoice page uses uppercase 'QRIS'
    DEFAULT: PAYMENT_CHANNELS.find((c) => c.id === "qris")
      ?.instructions as PaymentInstruction,
  },

  // Virtual Accounts - Maps provider 'BNI', 'BRI' etc to their instructions
  VA: PAYMENT_CHANNELS.filter((c) => c.type === "va").reduce((acc, channel) => {
    // Channel ID is like 'bni_va', but invoice mock uses 'BNI'
    // We'll normalize by taking the prefix part (e.g., 'bni') or handling specific mapping
    const key = channel.id.replace("_va", "").toUpperCase();
    // Special case for 'cimb_niaga_va' -> 'CIMB' if that was the old key, logic below:
    let mappedKey = key;
    if (channel.id === "cimb_niaga_va") mappedKey = "CIMB";
    if (channel.id === "atm_bersama_va") mappedKey = "ATM_BERSAMA";
    if (channel.id === "artha_graha_va") mappedKey = "ARTHA_GRAHA";

    if (channel.instructions) {
      acc[mappedKey] = channel.instructions as PaymentInstruction;
    }
    return acc;
  }, {} as Record<string, PaymentInstruction>),
};

// Add fallback manually if needed for strict compatibility, but the reduce above covers most
// Note: The invoice page uses 'paymentMethod' ('VA', 'QRIS') and 'paymentProvider' ('BNI', 'BRI')
