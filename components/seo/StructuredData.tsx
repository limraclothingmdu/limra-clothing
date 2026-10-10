import { siteConfig } from "@/lib/site";

export default function StructuredData() {
  const businessId = `${siteConfig.url}/#business`;
  const websiteId = `${siteConfig.url}/#website`;

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": ["ClothingStore", "Organization"],
    "@id": businessId,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    telephone: `+91-${siteConfig.contact.phone}`,
    logo: `${siteConfig.url}/images/limra-favicon.jpeg`,
    image: `${siteConfig.url}/images/limra-favicon.jpeg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: "Tamil Nadu",
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    areaServed: [
      { "@type": "City", name: "Madurai" },
      { "@type": "State", name: "Tamil Nadu" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+91-${siteConfig.contact.phone}`,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": businessId },
    inLanguage: "en-IN",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
