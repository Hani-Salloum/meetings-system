"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { useThemeStore } from "@/store/theme-store";

function hslStringToRgba(hslString: string, alpha: number) {
  const [hStr, sStr, lStr] = hslString.split(" ");
  const h = parseFloat(hStr);
  const s = parseFloat(sStr.replace("%", ""));
  const l = parseFloat(lStr.replace("%", ""));

  return hslToRgba(h, s, l, alpha);
}

function hslToRgba(h: number, s: number, l: number, alpha: number) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const to255 = (n: number) => Math.round((n + m) * 255);

  return `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${alpha})`;
}

export function GradientBlobs() {
  const [primaryColorState, SetPrimaryColor] = useState("96 90% 80%");

  const { primaryColor } = useThemeStore();

  useEffect(() => {
    SetPrimaryColor(primaryColor);
  }, [primaryColor]);

  const blobs = [
    { x: -200, y: -200, size: 700, delay: 0 },
    { x: 200, y: 200, size: 400, delay: 2 },
    { x: -300, y: 300, size: 600, delay: 4 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          initial={{ x: blob.x, y: blob.y }}
          animate={{
            x: [blob.x, blob.x + 100, blob.x - 100, blob.x],
            y: [blob.y, blob.y - 100, blob.y + 100, blob.y],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: blob.delay,
          }}
          style={{
            // background: `radial-gradient(circle, ${hslStringToRgba(primaryColorState, 0.30)}, transparent 70%)`,
            background: `radial-gradient(circle, #3699FF40, transparent 70%)`,
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            filter: "blur(100px)",
            position: "absolute",
          }}
        />
      ))}
    </div>
  );
}
