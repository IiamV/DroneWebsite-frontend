import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Blocks,
  Cable,
  Code2,
  Cpu,
  Download,
  Share2,
  Zap,
} from "lucide-react";
import { ROUTES, localePath } from "@/constants/routes";
import { HeroDemoMediaClient } from "./HeroDemoMediaClient";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function HeroSection() {
  const t = await getTranslations("hero");
  const locale = await getLocale();

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23888' stroke-width='.5'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 opacity-20"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, var(--accent) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-6 pb-16 pt-24 md:pb-24 md:pt-36">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-3.5 py-1.5 text-xs font-medium text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {t("badge")}
            </span>
          </div>

          <h1 className="mx-auto mb-5 max-w-3xl text-center text-4xl font-extrabold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            {t("headline")}
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            {t("subheadline")}
          </p>

          <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={localePath(locale, ROUTES.DOWNLOADS)}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--bg-primary)] shadow-md shadow-[var(--accent)]/25 transition-all hover:brightness-110"
            >
              <Download size={14} />
              {t("downloadTrial")}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={localePath(locale, ROUTES.SUBSCRIPTION)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
            >
              {t("viewPlans")}
            </Link>
          </div>

          <div className="relative mx-auto max-w-[960px]">
            <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[#1e1e1e] shadow-2xl shadow-black/10 dark:shadow-black/40">
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#252526] px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="flex-1 truncate text-center font-mono text-[11px] text-white/30">
                  Flyntic Studio IDE by Insai
                </span>
              </div>
              <HeroDemoMediaClient label={t("watchDemo")} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20 md:py-28">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            {t("featuresHeading")}
          </h2>
          <p className="mx-auto max-w-md text-sm text-[var(--text-secondary)]">
            {t("featuresSubheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Blocks, key: "build", color: "#6366f1" },
            { icon: Cable, key: "wire", color: "#0ea5e9" },
            { icon: Code2, key: "code", color: "#10b981" },
            { icon: Activity, key: "sim", color: "#f59e0b" },
            { icon: BarChart3, key: "stats", color: "#ec4899" },
            { icon: Share2, key: "export", color: "#8b5cf6" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.key}
                className="bg-[var(--bg-primary)] p-6 transition-colors hover:bg-[var(--bg-secondary)]"
              >
                <div
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded-md"
                  style={{ backgroundColor: f.color + "12", color: f.color }}
                >
                  <Icon size={16} />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-[var(--text-primary)]">
                  {t(`${f.key}Title`)}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  {t(`${f.key}Description`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-[1100px] space-y-20 px-6 py-20 md:space-y-28 md:py-28">
          <FeatureRow
            eyebrow={t("buildEyebrow")}
            title={t("buildTitle")}
            description={t("buildDescription")}
            mediaSrc={`${base}/images/home/feature-build.png`}
            mediaAlt="Drag-and-drop drone assembly"
            imageLeft={false}
          />
          <FeatureRow
            eyebrow={t("wireEyebrow")}
            title={t("wireTitle")}
            description={t("wireDescription")}
            mediaSrc={`${base}/images/home/feature-wire.png`}
            mediaAlt="Visual wiring between components"
            imageLeft
          />
          <FeatureRow
            eyebrow={t("codeEyebrow")}
            title={t("codeTitle")}
            description={t("codeDescription")}
            mediaSrc={`${base}/images/home/feature-code.png`}
            mediaAlt="Block code and real code editor"
            imageLeft={false}
          />
          <FeatureRow
            eyebrow={t("simEyebrow")}
            title={t("simTitle")}
            description={t("simDescription")}
            mediaSrc={`${base}/images/home/feature-simulate.png`}
            mediaAlt="Physics simulation running"
            imageLeft
          />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-28">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
              {t("ideHeading")}
            </h2>
            <p className="mx-auto max-w-lg text-sm text-[var(--text-secondary)]">
              {t("ideSubheading")}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-[var(--border)] shadow-xl">
            <IdeImage />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-[800px] px-6 py-20 text-center md:py-28">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10">
            <Zap size={20} className="text-[var(--accent)]" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            {t("ctaHeading")}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-[var(--text-secondary)]">
            {t("ctaSubheading")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={localePath(locale, ROUTES.DOWNLOADS)}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--bg-primary)] transition-all hover:brightness-110"
            >
              <Download size={14} />
              {t("downloadTrial")}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={localePath(locale, ROUTES.SUBSCRIPTION)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
            >
              {t("viewPlans")}
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--text-secondary)]">
            {t("fullVersionNote")}
          </p>
        </div>
      </section>
    </>
  );
}

function IdeImage() {
  return (
    <div className="relative aspect-[16/9] bg-[#1e1e1e]">
      <Image
        src={`${base}/images/home/ide-full.png`}
        alt="Drone Application by Insai - full IDE workspace"
        fill
        loading="lazy"
        sizes="(min-width: 1100px) 1100px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

function FeatureRow({
  eyebrow,
  title,
  description,
  mediaSrc,
  mediaAlt,
  imageLeft,
}: {
  eyebrow: string;
  title: string;
  description: string;
  mediaSrc: string;
  mediaAlt: string;
  imageLeft: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${imageLeft ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16`}
    >
      <div className="flex-1 space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          {eyebrow}
        </span>
        <h3 className="text-xl font-bold leading-snug text-[var(--text-primary)] md:text-2xl">
          {title}
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      <div className="w-full flex-1">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow-md">
          <Image
            src={mediaSrc}
            alt={mediaAlt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 500px, 100vw"
            className="object-cover"
          />
          <noscript>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)]">
              <Cpu size={24} className="opacity-20" />
            </div>
          </noscript>
        </div>
      </div>
    </div>
  );
}
