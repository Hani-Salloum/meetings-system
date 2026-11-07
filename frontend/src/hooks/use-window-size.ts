import { useEffect, useState } from "react";

const useWindowSize = () => {
  // Initialize with undefined to avoid hydration mismatch
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // This runs only on the client side
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set size on initial mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let cs: "sm" | "xl" | "lg" | "md" = "sm";
  if (windowSize.width && windowSize.width > 1360) cs = "xl";
  else if (windowSize.width && windowSize.width > 980) cs = "lg";
  else if (windowSize.width && windowSize.width > 480) cs = "md";
  else cs = "sm";

  return { ...windowSize, cs };
};

export default useWindowSize;
