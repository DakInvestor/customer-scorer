// app/terms/page.tsx
export default function TermsPage() {
    return (
      <div className="min-h-screen bg-white px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-charcoal">Terms of Service</h1>

          <div className="prose max-w-none space-y-6 text-text-secondary">
            <p className="text-sm text-text-muted">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">1. Acceptance of Terms</h2>
              <p>
                By accessing or using ForSure ("the Platform"), you agree to be bound by these
                Terms of Service. If you do not agree, do not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">2. Description of Service</h2>
              <p>
                ForSure is a customer reliability tracking tool that allows businesses to
                voluntarily log and track customer behavior events. The Platform generates reliability
                scores based on submitted data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">3. Not a Consumer Reporting Agency</h2>
              <p>
                ForSure is NOT a consumer reporting agency as defined under the Fair Credit
                Reporting Act (FCRA). The Platform does not provide consumer reports and should not
                be used to make decisions about employment, credit, insurance, housing, or any other
                purpose covered by the FCRA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">4. User Responsibilities</h2>
              <p>As a business user, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit only truthful, accurate information about customer interactions</li>
                <li>Not submit false, defamatory, or misleading reports</li>
                <li>Not use the Platform to harass, discriminate, or retaliate against customers</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">5. Data Accuracy Disclaimer</h2>
              <p>
                The Platform does NOT guarantee the accuracy, completeness, or reliability of any
                information submitted by users. All data is contributed voluntarily by businesses
                and reflects their subjective experiences. Users acknowledge that reliability scores
                are calculated based on user-submitted data and may not reflect a complete picture
                of any individual's behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, ForSure and its operators shall not
                be liable for any indirect, incidental, special, consequential, or punitive damages,
                including loss of profits, revenue, or data, arising from your use of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">7. Dispute Resolution</h2>
              <p>
                Individuals who believe information about them is inaccurate may submit a dispute
                through the Platform. Businesses are responsible for reviewing and responding to
                disputes about their submitted data. The Platform is not responsible for resolving
                disputes between businesses and their customers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">8. Data Retention</h2>
              <p>
                Event data is retained for up to 2 years from the date of submission. Severe events
                (severity 4-5) may be retained for up to 3 years. Disputed entries may be hidden
                during review. Businesses may export their data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">9. Privacy</h2>
              <p>
                Your use of the Platform is also governed by our Privacy Policy. Between businesses,
                customer information is anonymized to protect individual privacy. Only the submitting
                business can view full customer details for their own records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">10. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account for violations of these
                Terms, abuse of the Platform, or any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">11. Changes to Terms</h2>
              <p>
                We may update these Terms at any time. Continued use of the Platform after changes
                constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-charcoal">12. Contact</h2>
              <p>
                For questions about these Terms, contact us at support@myforsure.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }
