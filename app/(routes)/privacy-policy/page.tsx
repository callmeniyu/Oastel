"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type PrivacySection = {
  title: string;
  content: string[];
  id: string;
};

export default function PrivacyPolicy() {
  const privacyData: PrivacySection[] = [
    {
      title: "Information We Collect",
      content: [
        "Personal identification information: We collect your full name, email address, phone number, and residential address when you create an account or make a booking with us.",
        "Travel documentation For international tours and certain activities, we may collect passport information, visa details, and date of birth as required by local authorities and service providers.",
        "Payment information: We collect payment card details, billing address, and transaction history when you make purchases through our platform. All payment information is securely processed through encrypted payment gateways.",
        "Booking preferences: We record your tour selections, accommodation preferences, dietary requirements, special needs, and any additional requests you make during the booking process.",
        "Location data: With your consent, we may collect your device location to provide location-based services, nearby tour recommendations, and emergency assistance during your travels.",
        "Communication records: We maintain records of your correspondence with our customer support team, including emails, chat messages, and phone call logs for quality assurance and service improvement.",
        "Device and usage information: We automatically collect technical data such as IP address, browser type, device identifiers, operating system, and how you interact with our website and mobile applications.",
      ],
      id: "collection",
    },
    {
      title: "How We Collect Your Data",
      content: [
        "Direct submissions: Most of your personal data is provided directly by you when you register an account, complete booking forms, contact customer support, or subscribe to our newsletter.",
        "Automated technologies: We use cookies, web beacons, and similar tracking technologies to collect information about your browsing behavior, preferences, and interactions with our website automatically.",
        "Third-party sources: We may receive information about you from our business partners, such as payment processors, travel insurance providers, and social media platforms when you connect your accounts.",
        "Service providers: Our tour operators, accommodation partners, and transportation providers may share information about your bookings, check-ins, and service feedback with us.",
        "Mobile applications: When you use our mobile app, we collect data about your device, app usage patterns, and location if you have granted the necessary permissions.",
        "Customer feedback: We collect information through surveys, reviews, ratings, and testimonials you voluntarily provide about your experiences with our services.",
      ],
      id: "howcollect",
    },
    {
      title: "How We Use Your Information",
      content: [
        "Booking management: We use your personal data to process, confirm, and manage your tour bookings, transfers, and accommodation reservations from start to completion.",
        "Service delivery: Your information enables us to coordinate with hotels, tour guides, transportation providers, and other service partners to deliver the experiences you've booked.",
        "Customer support: We use your contact details and booking history to respond to your inquiries, resolve issues, provide assistance during your travels, and handle complaints or refund requests.",
        "Payment processing: Your payment information is used to complete transactions, issue invoices, process refunds, and maintain accurate financial records in compliance with accounting regulations.",
        "Personalization: We analyze your preferences, past bookings, and browsing behavior to recommend tours, create personalized offers, and enhance your overall experience with tailored content.",
        "Marketing communications: With your consent, we send promotional emails, newsletters, special offers, and updates about new tours and services that may interest you based on your profile.",
        "Analytics and improvement: We use aggregated and anonymized data to analyze website performance, understand user behavior, improve our services, and develop new features and offerings.",
        "Legal compliance: We process your data to comply with legal obligations, respond to lawful requests from authorities, enforce our terms and conditions, and protect our rights and interests.",
        "Safety and security: We use your information to verify identities, prevent fraud, detect suspicious activities, ensure the safety of our guests during tours, and maintain platform security.",
      ],
      id: "usage",
    },
    {
      title: "Information Sharing and Disclosure",
      content: [
        "Service providers: We share relevant booking details with hotels, guesthouses, tour operators, and transportation providers who deliver the services you've booked to ensure smooth operations.",
        "Payment processors: Your payment information is securely transmitted to authorized payment gateway providers like Stripe, PayPal, or local banking partners to process your transactions.",
        "Tour guides and drivers: We provide your name, contact number, hotel location, and special requirements to local guides and drivers assigned to your tours and transfers.",
        "Insurance providers: If you purchase travel insurance through our platform, we share necessary information with insurance companies to facilitate policy issuance and claims processing.",
        "Business partners: We may share data with marketing partners, analytics providers, and affiliate platforms that help us improve services, but only in aggregated or anonymized form where possible.",
        "Legal authorities: We disclose personal information when required by law, court orders, government requests, or to protect our rights, property, safety, or that of our users and the public.",
        "Business transfers: In the event of a merger, acquisition, or sale of company assets, your personal data may be transferred to the new entity, and you will be notified of any such changes.",
        "With your consent: We may share your information with third parties for purposes not described in this policy if we have obtained your explicit consent to do so.",
      ],
      id: "sharing",
    },
    {
      title: "Data Security and Storage",
      content: [
        "Encryption: We use industry-standard SSL/TLS encryption to protect data transmission between your device and our servers, ensuring your information remains confidential during transfer.",
        "Secure servers: Your personal data is stored on secure servers protected by firewalls, intrusion detection systems, and regular security audits conducted by independent security experts.",
        "Access controls: We implement strict access controls ensuring only authorized personnel with legitimate business needs can access your personal information on a need-to-know basis.",
        "Payment security: We are PCI DSS compliant and use tokenization to ensure that sensitive payment card information is never stored on our servers in its complete form.",
        "Data retention: We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by applicable laws and regulations.",
        "Regular backups: We maintain regular encrypted backups of data to prevent loss and ensure business continuity while implementing measures to protect backup data from unauthorized access.",
        "Employee training: Our staff undergo regular training on data protection, privacy practices, and security protocols to ensure responsible handling of your personal information.",
        "Incident response: We have established procedures to detect, respond to, and notify you of any data breaches or security incidents that may affect your personal information in accordance with applicable laws.",
      ],
      id: "security",
    },
    {
      title: "Your Privacy Rights",
      content: [
        "Access: You have the right to request access to the personal information we hold about you and receive a copy of your data in a commonly used, machine-readable format.",
        "Correction: You can request corrections to any inaccurate or incomplete personal information we maintain about you, and we will update our records promptly upon verification.",
        "Deletion: You may request deletion of your personal data, subject to certain legal obligations and legitimate business interests such as completing existing bookings or resolving disputes.",
        "Objection: You have the right to object to the processing of your personal information for direct marketing purposes or when processing is based on our legitimate interests.",
        "Restriction: You can request that we restrict the processing of your personal data in certain circumstances, such as while we verify its accuracy or assess your objection to processing.",
        "Data portability: You have the right to receive your personal data in a structured, commonly used format and transmit it to another service provider where technically feasible.",
        "Withdraw consent: Where processing is based on your consent, you may withdraw that consent at any time, though this will not affect the lawfulness of processing before withdrawal.",
        "Opt-out of marketing: You can unsubscribe from our marketing communications at any time by clicking the unsubscribe link in our emails or adjusting your account preferences.",
        "Lodge complaints: If you believe we have violated your privacy rights, you have the right to lodge a complaint with your local data protection authority or supervisory body.",
      ],
      id: "rights",
    },
    {
      title: "Cookies and Tracking Technologies",
      content: [
        "Essential cookies: We use necessary cookies that are required for the website to function properly, including session management, security features, and shopping cart functionality.",
        "Analytics cookies: These cookies help us understand how visitors use our website, which pages are most popular, and how users navigate through our content to improve user experience.",
        "Marketing cookies: With your consent, we use cookies to deliver relevant advertisements, track campaign effectiveness, and remember your preferences for personalized content.",
        "Third-party cookies: Our website may contain cookies from third-party services like Google Analytics, social media platforms, and advertising networks with their own privacy policies.",
        "Cookie management: You can control and manage cookies through your browser settings, but please note that disabling certain cookies may affect website functionality and your user experience.",
        "Do Not Track: We currently do not respond to Do Not Track signals, but you can use browser settings and privacy tools to manage tracking preferences and opt-out mechanisms.",
      ],
      id: "cookies",
    },
    {
      title: "International Data Transfers",
      content: [
        "Cross-border transfers: As we operate tours and services in multiple countries, your personal information may be transferred to and processed in countries outside your country of residence.",
        "Safeguards: We ensure appropriate safeguards are in place when transferring data internationally, including standard contractual clauses, adequacy decisions, or other lawful transfer mechanisms.",
        "Service provider locations: Some of our service providers, including cloud storage and payment processors, may be located in different jurisdictions with varying data protection standards.",
        "EU-US transfers: For transfers from the EU to the United States, we comply with applicable frameworks and regulations such as Standard Contractual Clauses approved by the European Commission.",
      ],
      id: "transfers",
    },
    {
      title: "Children's Privacy",
      content: [
        "Age restrictions: Our services are not intended for individuals under the age of 18, and we do not knowingly collect personal information from children without parental consent.",
        "Parental responsibility: If a minor is included in a booking, we collect their information through an adult guardian or parent who is responsible for providing accurate data and managing the booking.",
        "Verification: If we become aware that we have collected personal data from a child without appropriate parental consent, we will take steps to delete that information promptly.",
        "Family bookings: For family tours that include children, we only collect necessary information such as names, ages, and special requirements as provided by the responsible adult making the booking.",
      ],
      id: "children",
    },
    {
      title: "Legal Compliance and Regulations",
      content: [
        "GDPR compliance: For users in the European Union, we comply with the General Data Protection Regulation (GDPR), ensuring lawful, fair, and transparent processing of personal data.",
        "CCPA compliance: California residents have specific rights under the California Consumer Privacy Act (CCPA), including the right to know what information is collected and opt-out of sale.",
        "Local data protection laws: We comply with applicable data protection and privacy laws in the jurisdictions where we operate, including Malaysia's Personal Data Protection Act (PDPA).",
        "Tourism regulations: We adhere to tourism industry regulations and requirements that mandate certain data collection and sharing with local authorities for visitor management and safety.",
        "Financial regulations: We comply with financial and tax regulations that require retention of transaction records, invoices, and payment information for specified periods.",
      ],
      id: "compliance",
    },
    {
      title: "Updates to This Privacy Policy",
      content: [
        "Policy changes: We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or business operations.",
        "Notification: We will notify you of any material changes to this policy by posting a prominent notice on our website or sending you an email notification to your registered email address.",
        "Effective date: Changes to this Privacy Policy become effective when posted on our website unless otherwise stated. We encourage you to review this page periodically for updates.",
        "Continued use: Your continued use of our services after any modifications to this Privacy Policy constitutes your acceptance of the updated terms and practices.",
      ],
      id: "updates",
    },
    {
      title: "Contact Us",
      content: [
        "Privacy inquiries: If you have questions about this Privacy Policy or how we handle your personal information, please contact our Data Protection Officer.",
        "Email: You can reach us at oastel.com@gmail.com for all privacy-related inquiries, requests to exercise your rights, or concerns about data handling practices.",
        "Response time: We aim to respond to all privacy requests and inquiries within 30 days, though complex requests may require additional time with notification to you.",
        "Written requests: For formal requests regarding your data rights, you may send written correspondence to: Oastel Privacy Office, Cameron Highlands, Malaysia.",
        "Phone support: You can also call our customer service team during business hours (9 AM to 10 PM daily) who can direct your privacy concerns to the appropriate department.",
      ],
      id: "contact",
    },
    {
      title: "Refund Policy",
      content: [
        "Oastel offers a 5-day early cancellation refund policy for  bookings",
        "Full refunds are available when cancellations are made at least 5 days before the scheduled check-in date or tour departure time.",
        "Refunds will be issued using the same payment method originally used for the booking, unless otherwise agreed upon with the guest.",
        "Processing fees, bank charges, or third-party service fees may apply and will be deducted from the refund amount where applicable.",
        "Refunds are not available for no-shows, late cancellations (within 5 days of service), or cancellations due to force majeure events under our control.",
        "All refund requests must be submitted in writing through our official channels, and approval is subject to verification of booking details and eligibility.",
        "For questions about refunds or to initiate a refund request, please contact us.",
      ],
      id: "refund",
    },
    {
      title: "Governing Law and Jurisdiction",
      content: [
        "These Terms and Conditions shall be governed by and construed in accordance with the laws of Malaysia.",
        "Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Malaysia.",
      ],
      id: "governing-law",
    },
  ];

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    () => {
      const allExpanded: Record<string, boolean> = {};
      privacyData.forEach((section) => {
        allExpanded[section.id] = true;
      });
      return allExpanded;
    },
  );

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    privacyData.forEach((section) => {
      allExpanded[section.id] = true;
    });
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Hero Section */}
      <div className="bg-primary_green text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl max-w-2xl mx-auto">
          How we collect, use, and protect your personal information
        </p>
        <p className="text-sm mt-4 opacity-90">
          Last Updated: January 17, 2026
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <p className="text-desc_gray leading-relaxed">
            At Oastel, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy
            explains how we collect, use, share, and safeguard your data when
            you use our website, book tours and transfers, or interact with our
            services. By using our platform, you consent to the practices
            described in this policy.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-sm bg-primary_green text-white px-4 py-2 rounded hover:bg-primary_green/90 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-4">
          {privacyData.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleItem(section.id)}
                className={`w-full flex items-center justify-between p-5 text-left ${
                  expandedItems[section.id] ? "bg-primary_green/5" : ""
                }`}
              >
                <h3 className="font-semibold text-lg text-title_black">
                  {section.title}
                </h3>
                {expandedItems[section.id] ? (
                  <FiChevronUp className="text-primary_green" />
                ) : (
                  <FiChevronDown className="text-primary_green" />
                )}
              </button>
              <div
                className={`px-5 pb-5 transition-all duration-300 ease-in-out ${
                  expandedItems[section.id] ? "block" : "hidden"
                }`}
              >
                <div className="prose text-desc_gray">
                  <ul className="list-disc pl-5 space-y-2">
                    {section.content.map((line, i) => (
                      <li key={i} className="text-sm leading-relaxed">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-semibold text-title_black mb-2">
            Your Privacy Matters
          </h3>
          <p className="text-sm text-desc_gray leading-relaxed">
            We take your privacy seriously and are committed to transparency in
            how we handle your personal information. If you have any questions
            or concerns about our privacy practices, please don't hesitate to
            contact us. We're here to help ensure your experience with Oastel is
            safe, secure, and enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
}
