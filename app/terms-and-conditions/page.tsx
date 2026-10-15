import type { Metadata } from "next";
import PolicyPage from "@/components/legal/PolicyPage";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Terms and Conditions",
  description:
    "Read the terms for using the Limra Clothing website, shopping, payments, delivery and orders.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      intro="These terms apply to your use of the Limra Clothing website and the products and services offered through it. By using the website, you agree to comply with applicable terms and laws."
      sections={[
        {
          heading: "1. Business information",
          paragraphs: [
            `Limra Clothing is the trade name of VAVER ALI, based at ${siteConfig.address.street}, ${siteConfig.address.city} - ${siteConfig.address.postalCode}, India.`,
            `Website: ${siteConfig.url}. Contact number: ${siteConfig.contact.phone}. Email: ${siteConfig.contact.email}. GSTIN: ${siteConfig.gstin}.`,
          ],
        },
        {
          heading: "2. Products and availability",
          paragraphs: [
            "We offer clothing through our wholesale and retail channels. Product descriptions, images, colours, sizes, specifications, prices and availability are provided as accurately as reasonably possible but may vary due to display settings, stock changes or product updates.",
            "An item displayed on the website is not a guarantee that it will remain available. Please contact us if you need clarification about a product or a wholesale quantity.",
          ],
        },
        {
          heading: "3. Prices and payment",
          paragraphs: [
            "Prices, applicable taxes, shipping charges and the final amount payable will be shown or communicated as part of the ordering process, where applicable. The amount payable is the amount confirmed for your order before payment.",
            "Online payments may be processed through Razorpay or another payment method presented at checkout. Payment-provider terms may also apply.",
          ],
        },
        {
          heading: "4. Orders",
          paragraphs: [
            "Order details must be accurate and complete, including contact and delivery information. We may contact you to clarify order details or verify availability.",
            "An order may require confirmation and stock verification before fulfilment. If we cannot fulfil a paid order, we will contact you to arrange an appropriate resolution in accordance with applicable law.",
          ],
        },
        {
          heading: "5. Shipping and delivery",
          paragraphs: [
            "We offer shipping across India, subject to serviceability. Shipping charges may vary according to destination, order and courier requirements. Any applicable charge should be confirmed during the ordering process or with our team before the order is finalised.",
            "Order handling generally takes around 1–2 days. Transit time varies by destination, courier and circumstances outside our control. Delivery estimates are not a guarantee of a specific delivery date.",
          ],
        },
        {
          heading: "6. Returns, exchanges and legal rights",
          paragraphs: [
            "Our general business policy is that returns and exchanges are not accepted. This policy does not exclude rights or remedies that cannot lawfully be excluded, including rights that may apply to defective, incorrect, misrepresented or undelivered goods.",
            "If you have a concern about an order, contact us promptly with your order details and supporting information so that we can review it.",
          ],
        },
        {
          heading: "7. Website use",
          bullets: [
            "Do not misuse the website, attempt unauthorised access or interfere with its security or operation.",
            "Do not submit fraudulent orders or knowingly provide false information.",
            "Do not copy or use website content, branding or images in a way that infringes applicable rights.",
          ],
        },
        {
          heading: "8. Third-party services",
          paragraphs: [
            "The website may rely on third-party providers for payments, analytics, advertising, hosting or other services. Their own terms and policies may govern those services.",
          ],
        },
        {
          heading: "9. Changes and applicable law",
          paragraphs: [
            "We may update website content and these terms from time to time. Changes will be published on this page. These terms are subject to applicable laws of India, and nothing here limits mandatory consumer rights or remedies.",
          ],
        },
        {
          heading: "10. Contact",
          paragraphs: [
            `Email: ${siteConfig.contact.email}. Phone: ${siteConfig.contact.phone}.`,
            `Business address: ${siteConfig.address.street}, ${siteConfig.address.city} - ${siteConfig.address.postalCode}, India.`,
          ],
        },
      ]}
    />
  );
}
