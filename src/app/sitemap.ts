import { MetadataRoute } from "next";
import { templates } from "@/data/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://runcouncil.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const templatePages: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${baseUrl}/templates/${t.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...templatePages];
}
