// app/privacy/page.tsx
export default function PrivacyPage() {
    return (
      <div className="min-h-screen bg-slate-900 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-white">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
  
            <section>
              <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-200 mt-4">From Businesses:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Business name, type, and location</li>
                <li>Contact email and account credentials</li>
                <li>Customer data you voluntarily submit (names, contact info, locations)</li>
                <li>Event and behavior logs you create</li>
              </ul>
  
              <h3 className="text-lg font-medium text-gray-200 mt-4">About Customers:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full name</li>
                <li>Phone number and email (for identification purposes)</li>
                <li>City, state, and county (no street addresses or ZIP codes)</li>
                <li>Behavior event records submitted by businesses</li>
              </ul>
  
              <h3 className="text-lg font-medium text-gray-200 mt-4">We Do NOT Collect:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Street addresses or ZIP codes</li>
                <li>Social Security numbers or government IDs</li>
                <li>Financial information or credit data</li>
                <li>Photos or file attachments</li>
                <li>Location tracking data</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">2. How We Use Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To calculate and display reliability scores</li>
                <li>To help businesses track customer behavior patterns</li>
                <li>To provide anonymized, aggregated insights (no personal identification)</li>
                <li>To maintain and improve the Platform</li>
                <li>To communicate with businesses about their accounts</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">3. Information Sharing</h2>
              
              <h3 className="text-lg font-medium text-gray-200 mt-4">What Businesses See:</h3>
              <p>
                Each business can ONLY see full details for customers they have added themselves. 
                This includes name, contact information, location, and all event history.
              </p>
  
              <h3 className="text-lg font-medium text-gray-200 mt-4">Anonymized Network Data (Future Feature):</h3>
              <p>
                In the future, businesses may see anonymized reliability indicators for customers 
                who have been logged by other businesses. This will NEVER include:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The reporting business's identity</li>
                <li>Exact dates or timestamps</li>
                <li>Specific notes or subjective comments</li>
                <li>Personal contact information</li>
              </ul>
  
              <h3 className="text-lg font-medium text-gray-200 mt-4">We Never:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sell personal data to third parties</li>
                <li>Share data with advertisers</li>
                <li>Provide data to credit bureaus</li>
                <li>Share full customer identities between businesses</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">4. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard events: Retained for 2 years</li>
                <li>Severe events (severity 4-5): Retained for up to 3 years</li>
                <li>Disputed entries: May be hidden during review period</li>
                <li>Deleted accounts: Associated data is removed within 30 days</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
              
              <h3 className="text-lg font-medium text-gray-200 mt-4">For Businesses:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Export all your data at any time</li>
                <li>Delete your account and associated data</li>
                <li>Update or correct your business information</li>
              </ul>
  
              <h3 className="text-lg font-medium text-gray-200 mt-4">For Individuals (Customers):</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request to know if data exists about you</li>
                <li>Dispute inaccurate entries</li>
                <li>Request removal of your data (subject to our removal policy)</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, contact us at privacy@customerscorer.com.
              </p>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">6. Data Security</h2>
              <p>
                We use industry-standard security measures to protect your data, including 
                encryption in transit and at rest, secure authentication, and regular security 
                audits. However, no system is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">7. Children's Privacy</h2>
              <p>
                The Platform is not intended for use by individuals under 18. We do not knowingly 
                collect data about minors. If you believe a minor's data has been submitted, 
                contact us immediately.
              </p>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify users of 
                significant changes via email or in-app notification.
              </p>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold text-white">9. Contact Us</h2>
              <p>
                For privacy-related questions or requests, contact:<br />
                Email: privacy@customerscorer.com
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }