import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,

    start_url: "/",
    display: "standalone",

    background_color: "#F8F8F8",
    theme_color: "#081A4A",

    icons: [
      {
        src: "/images/limra-favicon.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}