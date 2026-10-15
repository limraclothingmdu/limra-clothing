import type { Metadata } from "next";
import PolicyPage from "@/components/legal/PolicyPage";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description:
    "Learn how Limra Clothing uses browser storage, Google Analytics and Meta Pixel.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <PolicyPage
      title="Cookie Policy"
      intro="This policy explains the browser storage and tracking technologies currently identified on the Limra Clothing website."
      sections={[
        {
          heading: "1. What are cookies and similar technologies?",
          paragraphs: [
            "Cookies are small files stored by a website in a browser. Similar technologies, including local storage and tracking pixels, can remember information or help measure website activity.",
          ],
        },
        {
          heading: "2. Retail cart storage",
          paragraphs: [
            'Our retail cart uses browser local storage under the key "limra-retail-cart" to remember cart items, selected sizes, quantities and related product information. A separate local-storage entry, "limra-retail-cart-user-id", stores a user identifier associated with the cart.',
            "This storage helps keep your cart available as you navigate the website. You can remove locally stored data through your browser settings, but doing so may clear your cart or affect the shopping experience.",
          ],
        },
        {
          heading: "3. Google Analytics",
          paragraphs: [
            "We use Google Analytics to understand how visitors use the website and to assess website performance. Google Analytics may use cookies or similar technologies to collect information about visits and interactions.",
            "You can learn more about Google's data practices in Google's published privacy information and manage available controls through your browser or Google tools.",
          ],
        },
        {
          heading: "4. Meta Pixel",
          paragraphs: [
            "We load Meta Pixel to measure website page views and support advertising measurement. Meta technologies may collect information about browser activity and interactions according to Meta's policies and settings.",
          ],
        },
        {
          heading: "5. Managing browser settings",
          paragraphs: [
            "Most browsers allow you to block or delete cookies and clear local storage. The available controls vary by browser and device. Blocking or clearing storage may affect cart functionality, account sessions or other website features.",
          ],
        },
        {
          heading: "6. Changes to this policy",
          paragraphs: [
            "We may update this page if our storage, analytics or tracking integrations change. Please review it periodically.",
          ],
        },
        {
          heading: "7. Contact",
          paragraphs: [
            `Email: ${siteConfig.contact.email}. Phone: ${siteConfig.contact.phone}.`,
          ],
        },
      ]}
    />
  );
}
