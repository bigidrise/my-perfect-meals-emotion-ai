import type { LookupKey } from "@/data/planSkus";

export interface CheckoutOptions {
  customerEmail?: string;
  context?: string;
}

export async function startCheckout(
  priceLookupKey: LookupKey,
  opts?: CheckoutOptions
) {
  try {
    // Get current user for security validation
    const userStr = localStorage.getItem("mpm_current_user");
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user?.id) {
      throw new Error("Please log in to checkout");
    }

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceLookupKey,
        customerEmail: opts?.customerEmail || user.email,
        metadata: { 
          context: opts?.context || "unknown",
          user_id: user.id,
        },
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Checkout failed");
    }

    const { url } = await res.json();
    window.location.href = url;
  } catch (error) {
    console.error("[Checkout Error]", error);
    throw error;
  }
}

export async function openCustomerPortal(customerId: string, returnUrl?: string) {
  try {
    const res = await fetch("/api/stripe/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        returnUrl: returnUrl || window.location.href,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Portal failed");
    }

    const { url } = await res.json();
    window.location.href = url;
  } catch (error) {
    console.error("[Portal Error]", error);
    throw error;
  }
}
