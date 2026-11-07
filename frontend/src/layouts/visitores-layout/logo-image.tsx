import Image from "next/image";

import PropTypes from "prop-types";

import ProgressLink from "@/components/shared/progress-link";
import { ValidHref } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function LogoImage({
  src = "/logo.png",
  alt = "Website Logo",
  width = 100,
  height = 100,
  className = "",
  priority = false,
  objectFit = "contain",
  href,
}: {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: string;
  href?: ValidHref;
}) {
  if (href) {
    return (
      <ProgressLink href={href as any}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(`object-${objectFit}`,className)}
          priority={priority}
        />
      </ProgressLink>
    );
  } else {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(`object-${objectFit}`,className)}
        priority={priority}
      />
    );
  }
}

LogoImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  priority: PropTypes.bool,
  objectFit: PropTypes.oneOf([
    "contain",
    "cover",
    "fill",
    "none",
    "scale-down",
  ]),
};

export default LogoImage;
