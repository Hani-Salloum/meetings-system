import Image from "next/image";

import { ImageBaseUrl } from "@/configs/api";

const validImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

export const ImageCell = ({
  path,
  width,
  height,
}: {
  path: string;
  width?: number;
  height?: number;
}) => {
  const isValidImage =
    path &&
    validImageExtensions.some((ext) => path.toLowerCase().endsWith(ext));

  return (
    isValidImage && (
      <a
        href={`${ImageBaseUrl}/${path}`}
        target="_blank"
        className="flex items-center justify-center"
      >
        <Image
          src={`${ImageBaseUrl}/${path}`}
          alt="not image"
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={"rounded-full object-cover w-10 h-10"}
          width={100}
          height={100}
        />
      </a>
    )
  );
};
