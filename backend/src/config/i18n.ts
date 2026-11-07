import acceptLanguage from "accept-language";
import { FastifyReply, FastifyRequest } from "fastify";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";

import arTranslation from "../locales/ar.json";
import enTranslation from "../locales/en.json";

i18next.use(i18nextMiddleware.LanguageDetector).init(
  {
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  },
  (err) => {
    if (err) {
      console.error("i18next initialization failed:", err);
    } else {
      console.log("i18next initialized");
    }
  },
);

// change language middleware, depending on the accept-language header
export const changeLanguage = (req: FastifyRequest, res: FastifyReply, next: () => void): void => {
  const language = req.headers["accept-language"] as string;
  acceptLanguage.languages(["ar", "en"]);
  if (language) {
    i18next.changeLanguage(acceptLanguage.get(language) || "en");
  }
  next();
};

export default i18next;
