import type { Metadata } from "next";
import PolicyPage from "@/components/legal/PolicyPage";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Limra Clothing handles personal information, orders, payments, analytics and website data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="This Privacy Policy explains how Limra Clothing collects, uses and protects information when you visit our website, contact us, create an account or place an order."
      sections={[
        {
          heading: "1. Who we are",
          paragraphs: [
            `Limra Clothing is the trade name of VAVER ALI, operating from ${siteConfig.address.street}, ${siteConfig.address.city} - ${siteConfig.address.postalCode}, India.`,
            `Website: ${siteConfig.url}. Phone: ${siteConfig.contact.phone}. Email: ${siteConfig.contact.email}.`,
          ],
        },
        {
          heading: "2. Information we may collect",
          bullets: [
            "Contact and account information, such as your name, email address and phone number, when you provide it.",
            "Order and delivery information, such as products purchased, sizes, quantities, billing details and shipping address.",
            "Messages and information you send through contact forms, WhatsApp or other customer-support channels.",
            "Payment-related transaction references and payment status needed to process and reconcile orders. Payment credentials are handled by the relevant payment provider where applicable.",
            "Website usage and device information collected through analytics and advertising technologies.",
          ],
        },
        {
          heading: "3. How we use information",
          bullets: [
            "To process orders, payments, delivery and customer requests.",
            "To manage customer accounts, order history and order-related communications.",
            "To respond to enquiries and provide support.",
            "To maintain website security, prevent misuse and troubleshoot technical issues.",
            "To understand website activity and measure advertising or marketing performance through Google Analytics and Meta Pixel.",
            "To comply with applicable legal, tax, accounting and regulatory obligations.",
          ],
        },
        {
          heading: "4. Payments",
          paragraphs: [
            "Online payments may be processed through Razorpay or another payment method made available at checkout. Payment processing is subject to the relevant provider's terms and privacy practices. We use transaction information as necessary to confirm and manage orders.",
          ],
        },
        {
          heading: "5. Service providers and sharing",
          paragraphs: [
            "We may share necessary information with service providers that support website hosting, database and account services, payment processing, delivery, analytics, advertising and customer support. We may also disclose information where required by law or to protect legitimate rights and security.",
            "Google Analytics and Meta Pixel are integrated into this website and may collect website activity information according to their own technologies and policies.",
          ],
        },
        {
          heading: "6. Browser storage and tracking",
          paragraphs: [
            'Our retail cart uses browser local storage to remember selected products, sizes, quantities and related cart information. The cart also uses a separate local-storage entry to associate cart data with a user identifier. See our Cookie Policy for more details.',
          ],
        },
        {
          heading: "7. Security and retention",
          paragraphs: [
            "We take reasonable measures intended to protect information against unauthorised access, loss or misuse. No online system can be guaranteed to be completely secure.",
            "Information is retained for as long as reasonably necessary for the purposes described in this policy, including order servicing, business records, security and legal obligations. Actual retention periods may vary by record type and applicable requirements.",
          ],
        },
        {
          heading: "8. Your choices and requests",
          paragraphs: [
            "You may contact us to request access to, correction of or deletion of personal information, subject to identity verification, applicable law and records we are required to retain. You can also manage browser storage and tracking through your browser settings; blocking certain features may affect website functionality.",
          ],
        },
        {
          heading: "9. Children's information",
          paragraphs: [
            "Our website is intended for people who can lawfully use online shopping services. Please do not submit another person's personal information without appropriate authority.",
          ],
        },
        {
          heading: "10. Changes to this policy",
          paragraphs: [
            "We may update this policy when our services, technology or legal obligations change. The revised version will be published on this page with an updated date.",
          ],
        },
        {
          heading: "11. Contact",
          paragraphs: [
            `Email: ${siteConfig.contact.email}. Phone: ${siteConfig.contact.phone}.`,
            `Address: ${siteConfig.address.street}, ${siteConfig.address.city} - ${siteConfig.address.postalCode}, India.`,
          ],
        },
      ]}
    />
  );
}
