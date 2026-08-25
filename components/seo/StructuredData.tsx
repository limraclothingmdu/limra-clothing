import { siteConfig } from "@/lib/site";

export default function StructuredData() {
  const businessId = `${siteConfig.url}/#business`;
  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${siteConfig.url}/#website`;

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": businessId,

    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,

    telephone: `+91-${siteConfig.contact.phone}`,

    logo: `${siteConfig.url}/images/limra-favicon.png`,
    image: `${siteConfig.url}/images/limra-favicon.png`,

    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: "Tamil Nadu",
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },

    areaServed: [
      {
        "@type": "City",
        name: "Madurai",
      },
      {
        "@type": "State",
        name: "Tamil Nadu",
      },
    ],

    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+91-${siteConfig.contact.phone}`,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,

    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,

    logo: `${siteConfig.url}/images/limra-favicon.png`,
    telephone: `+91-${siteConfig.contact.phone}`,

    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: "Tamil Nadu",
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },

    parentOrganization: {
      "@id": businessId,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,

    name: siteConfig.name,
    url: siteConfig.url,

    publisher: {
      "@id": organizationId,
    },

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
          __html: JSON.stringify(organizationSchema),
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
