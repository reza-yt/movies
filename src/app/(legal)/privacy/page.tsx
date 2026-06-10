export const metadata = { title: "Privacy Policy - StreamBro" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up py-8">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <div className="prose prose-invert prose-sm text-gray-300 space-y-4">
        <p>StreamBro values your privacy. This policy explains what data we collect and how we use it.</p>
        <h2 className="text-lg font-semibold text-white mt-6">1. Data We Collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Account Data:</strong> Email address when you register</li>
          <li><strong>Watch History:</strong> Stored locally in your browser (localStorage). We do not track your viewing habits on our servers</li>
          <li><strong>Payment Info:</strong> Transaction records for subscription management</li>
        </ul>
        <h2 className="text-lg font-semibold text-white mt-6">2. How We Use Your Data</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Account management and authentication</li>
          <li>Subscription and payment processing</li>
          <li>Service improvement</li>
        </ul>
        <h2 className="text-lg font-semibold text-white mt-6">3. Data Storage</h2>
        <p>Your account data is stored securely on Supabase (PostgreSQL). Watch history is stored locally on your device only.</p>
        <h2 className="text-lg font-semibold text-white mt-6">4. Third-Party Services</h2>
        <p>We use Supabase for authentication and database. Video content is served from third-party APIs. We do not share your personal data with third parties.</p>
        <h2 className="text-lg font-semibold text-white mt-6">5. Cookies</h2>
        <p>We use essential cookies for authentication session management. No tracking or advertising cookies are used.</p>
        <h2 className="text-lg font-semibold text-white mt-6">6. Contact</h2>
        <p>Questions about privacy? Email: <span className="text-red-400">privacy@streambro.com</span></p>
      </div>
    </div>
  );
}
