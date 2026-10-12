import type { MetadataRoute } from "next";
import { SITE_URL } from "../data/profile";

const pages = ["", "/teaching", "/publications", "/cv"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) => [
    {
      url: `${SITE_URL}${p || "/"}`,
      changeFrequency: "monthly" as const,
      priority: p ? 0.8 : 1,
      alternates: { languages: { en: `${SITE_URL}${p || "/"}`, uk: `${SITE_URL}/uk${p}` } },
    },
    {
      url: `${SITE_URL}/uk${p}`,
      changeFrequency: "monthly" as const,
      priority: p ? 0.6 : 0.8,
      alternates: { languages: { en: `${SITE_URL}${p || "/"}`, uk: `${SITE_URL}/uk${p}` } },
    },
  ]);
}
