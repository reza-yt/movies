export const metadata = { title: "Terms of Service - StreamBro" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up py-8">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <div className="prose prose-invert prose-sm text-gray-300 space-y-4">
        <p>By accessing and using StreamBro, you agree to the following terms:</p>
        <h2 className="text-lg font-semibold text-white mt-6">1. Use of Service</h2>
        <p>StreamBro provides a video aggregation service. Content is fetched from third-party APIs. You must be at least 18 years old to access adult content sections.</p>
        <h2 className="text-lg font-semibold text-white mt-6">2. User Accounts</h2>
        <p>When creating an account, you must provide accurate information. You are responsible for maintaining the security of your account and password.</p>
        <h2 className="text-lg font-semibold text-white mt-6">3. Subscription & Payments</h2>
        <p>Premium subscriptions are activated manually by admin after payment confirmation. Refunds are not available once the subscription is activated.</p>
        <h2 className="text-lg font-semibold text-white mt-6">4. Prohibited Activities</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Redistribution of content without permission</li>
          <li>Attempting to bypass access controls</li>
          <li>Automated scraping of the service</li>
          <li>Sharing account credentials</li>
        </ul>
        <h2 className="text-lg font-semibold text-white mt-6">5. Disclaimer</h2>
        <p>StreamBro does not host video files. All content is provided as-is from third-party APIs. We make no guarantees regarding content availability or quality.</p>
        <h2 className="text-lg font-semibold text-white mt-6">6. Changes</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
      </div>
    </div>
  );
}
