"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Play,
  Pause,
  ArrowRight,
  Blocks,
  Cable,
  Code2,
  Activity,
  BarChart3,
  Share2,
  Cpu,
  Zap,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ROUTES, localePath } from "@/constants/routes";
import { mediaUrl } from "@/lib/media-url";
import { useState, useRef, type Ref } from "react";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const homepageVideoUrl = "/images/home/hero-video.mp4";
const homepageVideoPoster = "/images/home/hero-poster.png";

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/").filter(Boolean)[1] ?? "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/").filter(Boolean)[1] ?? "";
      } else {
        videoId = parsed.searchParams.get("v") ?? "";
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  async function playVideo() {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Centered headline + dual CTA + video demo
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23888' stroke-width='.5'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Gradient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none opacity-20"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, var(--accent) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-[1100px] mx-auto px-6 pt-24 pb-16 md:pt-36 md:pb-24">
          {/* Badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-xs font-medium text-[var(--accent)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              {t("badge")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.08] tracking-tight text-[var(--text-primary)] mb-5 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {t("headline")}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-center text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            {t("subheadline")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              href={localePath(locale, ROUTES.DOWNLOADS)}
              className="group inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-semibold text-sm shadow-md shadow-[var(--accent)]/25 hover:shadow-lg hover:shadow-[var(--accent)]/30 hover:brightness-110 transition-all"
            >
              <Download size={14} />
              {t("downloadTrial")}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href={localePath(locale, ROUTES.SUBSCRIPTION)}
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] font-semibold text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {t("viewPlans")}
            </Link>
          </motion.div>

          {/* Video / IDE Demo */}
          <motion.div
            className="relative mx-auto max-w-[960px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl shadow-black/10 dark:shadow-black/40 bg-[#1e1e1e]">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-[#252526]">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="flex-1 text-center text-[11px] text-white/30 font-mono truncate">
                  Flyntic Studio IDE by Insai
                </span>
              </div>

              <HeroDemoMedia
                videoRef={videoRef}
                playing={playing}
                onPlayRequest={playVideo}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                label={t("watchDemo")}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CAPABILITIES — Bento grid
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1100px] mx-auto px-6 py-20 md:py-28">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            {t("featuresHeading")}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            {t("featuresSubheading")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {[
            { icon: Blocks, key: "build", color: "#6366f1" },
            { icon: Cable, key: "wire", color: "#0ea5e9" },
            { icon: Code2, key: "code", color: "#10b981" },
            { icon: Activity, key: "sim", color: "#f59e0b" },
            { icon: BarChart3, key: "stats", color: "#ec4899" },
            { icon: Share2, key: "export", color: "#8b5cf6" },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.key}
                className="bg-[var(--bg-primary)] p-6 hover:bg-[var(--bg-secondary)] transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center mb-3"
                  style={{ backgroundColor: f.color + "12", color: f.color }}
                >
                  <Icon size={16} />
                </div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                  {t(`${f.key}Title`)}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {t(`${f.key}Description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURE DEEP-DIVES — Alternating rows with media
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-28 space-y-20 md:space-y-28">
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
            imageLeft={true}
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
            imageLeft={true}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FULL IDE SHOWCASE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-28">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
              {t("ideHeading")}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
              {t("ideSubheading")}
            </p>
          </motion.div>

          <motion.div
            className="relative rounded-xl overflow-hidden border border-[var(--border)] shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <IdeFallback />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DOWNLOAD CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-[800px] mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-6">
              <Zap size={20} className="text-[var(--accent)]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
              {t("ctaHeading")}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-8">
              {t("ctaSubheading")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={localePath(locale, ROUTES.DOWNLOADS)}
                className="group inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-semibold text-sm hover:brightness-110 transition-all"
              >
                <Download size={14} />
                {t("downloadTrial")}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href={localePath(locale, ROUTES.SUBSCRIPTION)}
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 round--text-primaryed-lg border border-[var(--border)] font-semibold text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                {t("viewPlans")}
              </Link>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-4">
              {t("fullVersionNote")}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ─── Hero Demo Media ──────────────────────────────────────────────────────── */

function HeroDemoMedia({
  videoRef,
  playing,
  onPlayRequest,
  onPlay,
  onPause,
  label,
}: {
  videoRef: Ref<HTMLVideoElement>;
  playing: boolean;
  onPlayRequest: () => void;
  onPlay: () => void;
  onPause: () => void;
  label: string;
}) {
  const youtubeEmbedUrl = getYouTubeEmbedUrl(homepageVideoUrl);

  if (youtubeEmbedUrl) {
    return (
      <div className="relative aspect-[16/9] bg-[#1e1e1e]">
        <iframe
          src={youtubeEmbedUrl}
          title={label}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] bg-[#1e1e1e] group">
      <video
        ref={videoRef}
        src={mediaUrl(homepageVideoUrl)}
        poster={mediaUrl(homepageVideoPoster)}
        className="w-full h-full object-cover"
        playsInline
        controls
        muted
        loop
        onPlay={onPlay}
        onPause={onPause}
      />
      {!playing && (
        <button
          type="button"
          onClick={onPlayRequest}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors"
          aria-label={label}
        >
          <span className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={24} className="text-white ml-0.5" />
          </span>
          <span className="absolute bottom-6 text-xs text-white/50 font-medium">
            {label}
          </span>
        </button>
      )}
      {playing && (
        <div className="pointer-events-none absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
            <Pause size={12} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── IDE Screenshot with fallback ─────────────────────────────────────────── */

function IdeFallback() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative aspect-[16/9] bg-[#1e1e1e]">
      {!errored && (
        <Image
          src={`${base}/images/home/ide-full.png`}
          alt="Drone Application by Insai — full IDE workspace"
          fill
          sizes="(min-width: 1100px) 1100px, 100vw"
          className={`object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1e1e1e]">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-white/5">
            <div className="w-3 h-3 rounded-sm bg-[#6366f1]" />
            <div className="w-3 h-3 rounded-sm bg-[#0ea5e9]" />
            <div className="w-3 h-3 rounded-sm bg-[#10b981]" />
            <div className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white/50">
              Drone Application by Insai
            </p>
            <p className="text-xs text-white/30 mt-1">
              Build · Wire · Code · Simulate
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="w-32 h-20 rounded border border-white/10 bg-white/[0.03]" />
            <div className="w-48 h-20 rounded border border-white/10 bg-white/[0.03]" />
            <div className="w-32 h-20 rounded border border-white/10 bg-white/[0.03]" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Feature Row ──────────────────────────────────────────────────────────── */

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
    <motion.div
      className={`flex flex-col ${imageLeft ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Text */}
      <div className="flex-1 space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          {eyebrow}
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-snug">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
          {description}
        </p>
      </div>

      {/* Media */}
      <div className="flex-1 w-full">
        <FeatureMedia src={mediaSrc} alt={mediaAlt} />
      </div>
    </motion.div>
  );
}

function FeatureMedia({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow-md">
      {!errored && (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-cover"
          onError={() => setErrored(true)}
        />
      )}
      {errored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)]">
          <Cpu size={24} className="opacity-20" />
          <p className="text-[10px] font-medium opacity-40">
            {src.split("/").pop()}
          </p>
        </div>
      )}
    </div>
  );
}
