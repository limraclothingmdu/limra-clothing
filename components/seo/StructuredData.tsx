import { siteConfig } from "@/lib/site";

export default function StructuredData() {
  const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${siteConfig.url}/#business`,

  name: siteConfig.name,
  url: siteConfig.url,

  description: siteConfig.description,

  telephone: `+91-${siteConfig.contact.phone}`,

  priceRange: "₹₹",

  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
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
    "@id": `${siteConfig.url}/#organization`,

    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,

    telephone: `+91-${siteConfig.contact.phone}`,

    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },

    parentOrganization: {
      "@id": `${siteConfig.url}/#business`,
    },
  };

  return (
    <>
      {/* Local Business / Clothing Store Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}