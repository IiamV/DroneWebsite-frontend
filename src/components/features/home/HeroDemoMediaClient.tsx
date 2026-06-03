"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { mediaUrl } from "@/lib/media-url";

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

export function HeroDemoMediaClient({ label }: { label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(homepageVideoUrl);

  async function playVideo() {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  if (youtubeEmbedUrl) {
    return (
      <div className="relative aspect-[16/9] bg-[#1e1e1e]">
        <iframe
          src={youtubeEmbedUrl}
          title={label}
          loading="lazy"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="group relative aspect-[16/9] bg-[#1e1e1e]">
      <video
        ref={videoRef}
        src={mediaUrl(homepageVideoUrl)}
        poster={mediaUrl(homepageVideoPoster)}
        preload="none"
        className="h-full w-full object-cover"
        playsInline
        controls
        muted
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          onClick={playVideo}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 transition-colors group-hover:bg-black/40"
          aria-label={label}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-transform group-hover:scale-110">
            <Play size={24} className="ml-0.5 text-white" />
          </span>
          <span className="absolute bottom-6 text-xs font-medium text-white/50">
            {label}
          </span>
        </button>
      )}
      {playing && (
        <div className="pointer-events-none absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur">
            <Pause size={12} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
