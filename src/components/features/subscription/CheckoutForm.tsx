"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CreditCard } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/layout/AuthProvider";
import { localePath, ROUTES } from "@/constants/routes";
import type { SubscriptionTier } from "@/types";

type PaymentMethod = "vnpay" | "payos";

const PAYMENT_METHODS: { id: PaymentMethod; logo: string; label: string }[] = [
  { id: "vnpay", logo: "/images/payments/vnpay.svg", label: "VNPay" },
  { id: "payos", logo: "/images/payments/payos.svg", label: "PayOS" },
];

interface CheckoutFormProps {
  tier: SubscriptionTier;
  locale?: string;
}

export function CheckoutForm({ tier, locale: localeProp }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("vnpay");
  const t = useTranslations("checkout");
  const localeHook = useLocale();
  const locale = localeProp ?? localeHook;
  const isVi = locale === "vi";
  const { user } = useAuth();
  const router = useRouter();

  const priceDisplay = isVi
    ? `${new Intl.NumberFormat("vi-VN").format(tier.priceVnd)}₫`
    : `$${tier.price.toFixed(2)}`;
  const billingLabel =
    tier.billingCycle === "monthly" ? t("monthly") : t("yearly");

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const paymentStatus = searchParams?.get("payment");

  async function handlePay() {
    if (!user) {
      router.push(localePath(locale, ROUTES.AUTH_LOGIN));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: method, tierId: tier.id, locale }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create payment");

      window.location.href = json.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {!user && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400">
          {t("signInRequired")}{" "}
          <a
            href={localePath(locale, ROUTES.AUTH_LOGIN)}
            className="underline font-medium"
          >
            {t("signInLink")}
          </a>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {t("paymentFailed")}
        </div>
      )}

      {paymentStatus === "cancelled" && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-600 dark:text-yellow-400">
          {t("paymentCancelled")}
        </div>
      )}

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5 space-y-3">
        <div className="flex justify-between text-sm text-[var(--text-secondary)]">
          <span>
            {tier.name} {t("plan")}
          </span>
          <span>
            {priceDisplay}/{billingLabel}
          </span>
        </div>
        <div className="flex justify-between font-semibold border-t border-[var(--border)] pt-3 text-[var(--text-primary)]">
          <span>{t("total")}</span>
          <span>{priceDisplay}</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {t("selectMethod")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              onClick={() => setMethod(pm.id)}
              className={[
                "flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all",
                method === pm.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--text-primary)] ring-1 ring-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              <CreditCard size={18} aria-hidden="true" />
              <span>{pm.label}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span className="text-green-500">✓</span> {f}
          </li>
        ))}
      </ul>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <Button
        onClick={handlePay}
        className="w-full"
        size="lg"
        disabled={loading || !user}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />{" "}
            {t("redirecting")}
          </>
        ) : (
          `${t("payWith")} ${PAYMENT_METHODS.find((p) => p.id === method)?.label}`
        )}
      </Button>

      <p className="text-xs text-center text-[var(--text-secondary)] flex items-center justify-center gap-1">
        <Lock size={11} /> {t("secureMessage")}
      </p>
    </div>
  );
}
