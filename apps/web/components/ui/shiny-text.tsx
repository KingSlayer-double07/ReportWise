"use client";

import { CSSProperties } from "react";

interface ShinyTextProps {
  text: string;
  color?: string;
  shineColor?: string;
  speed?: number;       // animation duration in seconds
  delay?: number;       // animation delay in seconds
  spread?: number;      // width of the shine band (deg)
  direction?: "left" | "right";
  yoyo?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ShinyText({
  text,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  speed = 2,
  delay = 0,
  spread = 120,
  direction = "left",
  pauseOnHover = false,
  disabled = false,
  className = "",
}: ShinyTextProps) {
  const animationDirection = direction === "left" ? "normal" : "reverse";

  const style: CSSProperties = disabled
    ? { color }
    : ({
        "--shine-color": shineColor,
        "--base-color": color,
        "--spread": `${spread}deg`,
        "--speed": `${speed}s`,
        "--delay": `${delay}s`,
        "--direction": animationDirection,
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundImage: `linear-gradient(
          var(--spread),
          var(--base-color) 0%,
          var(--base-color) 40%,
          var(--shine-color) 50%,
          var(--base-color) 60%,
          var(--base-color) 100%
        )`,
        backgroundSize: "200% auto",
        animation: `shiny-text-sweep var(--speed) linear var(--delay) infinite var(--direction)`,
      } as CSSProperties);

  return (
    <>
      <style>{`
        @keyframes shiny-text-sweep {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        .shiny-text-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
      <span
        style={style}
        className={`inline-block ${pauseOnHover ? "shiny-text-pause" : ""} ${className}`}
      >
        {text}
      </span>
    </>
  );
}
