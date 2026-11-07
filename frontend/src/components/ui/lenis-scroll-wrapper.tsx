"use client";

import { useEffect, useRef } from "react";

import Lenis from "lenis";

const LenisScrollWrapper = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <div ref={scrollRef} className="">
      {children}
    </div>
  );
};

export default LenisScrollWrapper;
