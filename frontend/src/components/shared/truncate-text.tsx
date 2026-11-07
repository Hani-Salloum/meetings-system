"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type TruncatedTextProps = {
  text: string
  maxLength?: number
  className?: string
  t: {
    showMore: string
    fullText: string
  }
  locale?: string
}

export default function TruncatedText({ text, maxLength = 30, className = "", t, locale = "en" }: TruncatedTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if the locale is RTL (right-to-left)
  const isRTL = locale === "ar" ;

  // Check if text needs truncation
  const needsTruncation = text?.length > maxLength;
  const truncatedText = needsTruncation ? `${text?.substring(0, maxLength)}...` : text;

  return (
    <div className={className}>
      <p className="inline">{truncatedText}</p>

      {needsTruncation && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="px-1.5 h-auto font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              {t.showMore}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl w-[90vw] border-purple-200" dir={isRTL ? "rtl" : "ltr"}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 rounded-t-lg"></div>

            {/* Custom header with forced alignment */}
            <div className="w-full pb-2" style={{ textAlign: isRTL ? "right" : "left" }}>
              <h2
                className="text-lg font-semibold leading-none tracking-tight text-purple-700"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  direction: isRTL ? "rtl" : "ltr",
                  width: "100%",
                  display: "block",
                }}
              >
                {t.fullText}
              </h2>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-2">
              <p
                className="mt-2 text-gray-700 leading-relaxed whitespace-pre-wrap"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  direction: isRTL ? "rtl" : "ltr",
                }}
              >
                {text}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

