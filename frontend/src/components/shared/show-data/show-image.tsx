import Image from "next/image";
import { useEffect, useState } from "react";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { Lens } from "./lens";

export default function ShowImageDialog({ imgLinks }: { imgLinks: string[] }) {
  const t = useTranslations("ShowImageDialog");
  const [copySuccess, setCopySuccess] = useState("");
  const [zoomFactor, setZoomFactor] = useState(2);
  const [lensSize, setLensSize] = useState(150);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    if (thumbsSwiper) {
      // تهيئة Swiper هنا
    }
  }, [thumbsSwiper]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(imgLinks[0])
      .then(() => {
        setCopySuccess(t("CopySuccess"));
      })
      .catch(() => {
        setCopySuccess(t("CopyError"));
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-12 w-12 overflow-hidden rounded-full"
          key={imgLinks[0]} // استخدام key لإعادة تحميل المكون
        >
          <Image
            src={imgLinks[0]}
            alt="image"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-auto border-none p-0"
        style={{
          maxHeight: "100vh",
          maxWidth: "100vw",
        }}
      >
        <DialogHeader className="bg-primary p-4">
          <DialogTitle className="text-md mb-2 text-center font-semibold text-white md:text-lg">
            {t("ShowImage")}
          </DialogTitle>
          <DialogDescription className="mb-2 text-center text-white">
            {t("ShowImageDescription")}
          </DialogDescription>
          <div className="flex items-center gap-4 space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                {t("Link")}
              </Label>
              <Input
                id="link"
                defaultValue={imgLinks[0]}
                readOnly
                className="border-primary bg-white"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-white px-3"
              onClick={handleCopy}
            >
              <span className="sr-only">{t("CopyLink")}</span>
              <Copy />
            </Button>
          </div>
          {copySuccess && (
            <p className="text-center text-white">{copySuccess}</p>
          )}
        </DialogHeader>
        <div className="flex">
          <div className="w-64 border-r bg-gray-50 px-4 py-12">
            <div className="space-y-6">
              <div>
                <Label htmlFor="zoom" className="mb-2 block font-semibold">
                  {t("ZoomLevel")}
                </Label>
                <Slider
                  id="zoom"
                  defaultValue={[zoomFactor]}
                  min={1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => setZoomFactor(value[0])}
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-600">
                  {t("CurrentZoom")}
                  {":"} {zoomFactor}
                  {"x"}
                </p>
              </div>
              <div>
                <Label htmlFor="lens-size" className="mb-2 block font-semibold">
                  {t("LensSize")}
                </Label>
                <Slider
                  id="lens-size"
                  defaultValue={[lensSize]}
                  min={50}
                  max={300}
                  step={10}
                  onValueChange={(value) => setLensSize(value[0])}
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-600">
                  {t("CurrentLensSize")}
                  {":"} {lensSize}
                  {"px"}
                </p>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-5xl p-4">
            {imgLinks && imgLinks.length > 0 && (
              <Swiper
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2 mb-5"
                onInit={(swiper) => {
                  console.log("Swiper initialized:", swiper);
                }}
              >
                {imgLinks.map((link, index) => (
                  <SwiperSlide key={index}>
                    <Lens
                      zoomFactor={zoomFactor}
                      lensSize={lensSize}
                      isStatic={false}
                      ariaLabel="Zoom Area"
                    >
                      <Image
                        src={link}
                        alt={`image-${index}`}
                        width={1200}
                        height={600}
                      />
                    </Lens>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            {imgLinks && imgLinks.length > 0 && (
              <Swiper
                onSwiper={(swiper) => {
                  console.log("Swiper instance:", swiper); // Debugging line
                  setThumbsSwiper(swiper as any);
                }}
                spaceBetween={10}
                slidesPerView={7}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper3"
              >
                {imgLinks.map((link, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <Image
                      src={link}
                      alt={`thumbnail-${index}`}
                      width={150}
                      height={100}
                      style={{ objectFit: "cover" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
