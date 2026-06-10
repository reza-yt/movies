export const metadata = { title: "DMCA - StreamBro" };

export default function DMCAPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up py-8">
      <h1 className="text-2xl font-bold">DMCA Notice</h1>
      <div className="prose prose-invert prose-sm text-gray-300 space-y-4">
        <p>StreamBro respects the intellectual property rights of others. If you believe that content available on our site infringes your copyright, please send a DMCA notice.</p>
        <h2 className="text-lg font-semibold text-white mt-6">Disclaimer</h2>
        <p>StreamBro does not host any video content on its servers. All videos are provided by third-party APIs and are embedded from external sources. We act as a directory and aggregator only.</p>
        <h2 className="text-lg font-semibold text-white mt-6">How to Submit a DMCA Notice</h2>
        <p>To submit a DMCA takedown notice, please provide the following information:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Identification of the copyrighted work you claim has been infringed</li>
          <li>Identification of the material that is claimed to be infringing</li>
          <li>Your contact information (name, address, phone, email)</li>
          <li>A statement that you have a good faith belief that the use is not authorized</li>
          <li>A statement that the information in the notice is accurate</li>
          <li>Your physical or electronic signature</li>
        </ul>
        <h2 className="text-lg font-semibold text-white mt-6">Contact</h2>
        <p>Send DMCA notices to: <span className="text-red-400">dmca@streambro.com</span></p>
      </div>
    </div>
  );
}
