import type { Metadata } from "next";
import PolicyPage from "@/components/legal/PolicyPage";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Refund Policy",
  description:
    "Review Limra Clothing's returns, exchanges, payment issues and order refund policy.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      intro="This policy explains Limra Clothing's general position on returns, exchanges and payment or order issues for retail purchases."
      sections={[
        {
          heading: "1. General returns and exchanges",
          paragraphs: [
            "Our general business policy is that returns and exchanges are not accepted for ordinary change-of-mind requests or ordering preferences.",
            "This policy does not remove any consumer rights or remedies that apply under mandatory law. Concerns involving an incorrect, defective, misrepresented or undelivered product will be reviewed on their individual facts.",
          ],
        },
        {
          heading: "2. Incorrect, defective or undelivered orders",
          paragraphs: [
            "If you believe you received the wrong product, a defective product or did not receive your order, contact us promptly. Include your order reference, a description of the issue and relevant photographs or other supporting information where available.",
            "We will review the details and communicate an appropriate resolution in accordance with applicable law and the circumstances of the order.",
          ],
        },
        {
          heading: "3. Failed, duplicate or incorrect payments",
          paragraphs: [
            "If money appears to have been debited but your order was not confirmed, or you believe a payment was duplicated or charged incorrectly, contact us with the transaction reference and order details.",
            "Payment reversals and refunds, where applicable, may depend on payment-provider processing and the nature of the transaction. We will investigate the issue and communicate the next steps. No specific processing timeline is promised by this policy.",
          ],
        },
        {
          heading: "4. Order cancellation",
          paragraphs: [
            "Contact us as soon as possible if you need to request cancellation. Whether an order can be cancelled may depend on its processing, dispatch and applicable legal requirements. A cancellation request is not confirmed until we communicate our decision.",
          ],
        },
        {
          heading: "5. How to contact us",
          paragraphs: [
            `Email: ${siteConfig.contact.email}. Phone: ${siteConfig.contact.phone}. You may also use the Contact page on ${siteConfig.url}.`,
            `Business address: ${siteConfig.address.street}, ${siteConfig.address.city} - ${siteConfig.address.postalCode}, India.`,
          ],
        },
      ]}
    />
  );
}
