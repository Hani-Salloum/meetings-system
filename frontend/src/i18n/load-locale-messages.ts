import fs from "fs";
import path from "path";

export function loadLocaleMessages(locale: string): Record<string, any> {
  const dirPath = path.join(process.cwd(), "src", "i18n", "messages", locale);
  const messages: Record<string, any> = {};

  let content: Record<string, any> = {};
  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(dirPath, file);

        const fileNameWithoutExt = path.basename(file, ".json");
        const fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        if (fileNameWithoutExt === locale) {
          content = { ...content, ...fileContent };
        } else {
          content[fileNameWithoutExt] = fileContent;
        }

        Object.assign(messages, content);
      }
    }
  } catch (error) {
    console.error(`[i18n] Failed to load messages for "${locale}":`, error);
  }

  return messages;
}
