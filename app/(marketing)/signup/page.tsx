"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const INDUSTRIES = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "roofing", label: "Roofing" },
  { value: "landscaping", label: "Landscaping" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "pest_control", label: "Pest Control" },
  { value: "appliance_repair", label: "Appliance Repair" },
  { value: "general_contractor", label: "General Contractor" },
  { value: "painting", label: "Painting" },
  { value: "flooring", label: "Flooring" },
  { value: "windows_doors", label: "Windows & Doors" },
  { value: "garage_doors", label: "Garage Doors" },
  { value: "fencing", label: "Fencing" },
  { value: "pool_service", label: "Pool Service" },
  { value: "locksmith", label: "Locksmith" },
  { value: "moving", label: "Moving Services" },
  { value: "handyman", label: "Handyman" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail" },
  { value: "automotive", label: "Automotive" },
  { value: "other", label: "Other" },
];

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com"
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Business Identity
  const [businessName, setBusinessName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [legalNameSame, setLegalNameSame] = useState(true);
  const [industry, setIndustry] = useState("");
  const [einNumber, setEinNumber] = useState("");
  const [isSoleProp, setIsSoleProp] = useState(false);

  // Step 3: Business Contact
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");

  // Step 4: Business Address
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessZip, setBusinessZip] = useState("");

  function validateStep1(): boolean {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (!businessName || !industry) {
      setError("Please fill in business name and industry.");
      return false;
    }
    if (!legalNameSame && !legalName) {
      setError("Please enter your legal business name.");
      return false;
    }
    if (!isSoleProp && !einNumber) {
      setError("Please enter your EIN.");
      return false;
    }
    if (!isSoleProp && einNumber.replace(/\D/g, "").length !== 9) {
      setError("EIN must be 9 digits.");
      return false;
    }
    return true;
  }

  function validateStep3(): boolean {
    if (!businessEmail || !businessPhone) {
      setError("Please enter business email and phone.");
      return false;
    }
    const emailDomain = businessEmail.split("@")[1]?.toLowerCase();
    if (FREE_EMAIL_DOMAINS.includes(emailDomain)) {
      setError("Please use a business email address, not a personal email.");
      return false;
    }
    const phoneDigits = businessPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Please enter a valid phone number.");
      return false;
    }
    return true;
  }

  function validateStep4(): boolean {
    if (!businessAddress || !businessCity || !businessState || !businessZip) {
      setError("Please fill in all address fields.");
      return false;
    }
    if (businessZip.replace(/\D/g, "").length < 5) {
      setError("Please enter a valid ZIP code.");
      return false;
    }
    return true;
  }

  function handleNext() {
    setError("");
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  }

  function handleBack() {
    setError("");
    setStep(step - 1);
  }

  function formatEin(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "-" + digits.slice(2);
  }

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  async function handleSubmit() {
    setError("");
    
    if (!validateStep4()) return;

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create account.");
      }

      const userId = authData.user.id;

      // Create business record
      const { error: bizError } = await supabase.from("businesses").insert({
        owner_user_id: userId,
        name: businessName,
        legal_name: legalNameSame ? businessName : legalName,
        industry: industry,
        ein_number: isSoleProp ? null : einNumber.replace(/\D/g, ""),
        business_email: businessEmail,
        business_phone: businessPhone.replace(/\D/g, ""),
        business_website: businessWebsite || null,
        business_address: businessAddress,
        business_city: businessCity,
        business_state: businessState,
        business_zip: businessZip,
        subscription_tier: "starter",
        customer_count_limit: 50,
        verification_level: "none",
        network_write_access: false,
      });

      if (bizError) {
        throw bizError;
      }

      // Update profile with verification status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          verification_status: "unverified",
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      // Redirect to app
      router.push("/app");
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Customer Scorer
          </Link>
          <p className="mt-2 text-slate-gray">Create your account</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(function(num) {
              const isActive = step === num;
              const isComplete = step > num;
              return (
                <div key={num} className="flex items-center">
                  <div
                    className={
                      isComplete
                        ? "flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-sm font-medium text-white"
                        : isActive
                        ? "flex h-8 w-8 items-center justify-center rounded-full bg-forsure-blue text-sm font-medium text-white"
                        : "flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-slate-400"
                    }
                  >
                    {isComplete ? "✓" : num}
                  </div>
                  {num < 4 && (
                    <div
                      className={
                        step > num
                          ? "h-1 w-12 bg-emerald sm:w-16"
                          : "h-1 w-12 bg-slate-700 sm:w-16"
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Account</span>
            <span>Business</span>
            <span>Contact</span>
            <span>Address</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          {/* Step 1: Account */}
          {step === 1 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white">Create Your Account</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={function(e) { setEmail(e.target.value); }}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={function(e) { setPassword(e.target.value); }}
                    placeholder="At least 8 characters"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={function(e) { setConfirmPassword(e.target.value); }}
                    placeholder="Confirm your password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Identity */}
          {step === 2 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white">Business Identity</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Business Name (DBA)
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={function(e) { setBusinessName(e.target.value); }}
                    placeholder="e.g., Joe's HVAC Services"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={legalNameSame}
                      onChange={function(e) { setLegalNameSame(e.target.checked); }}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                    />
                    Legal name is the same as business name
                  </label>
                </div>

                {!legalNameSame && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                      Legal Business Name
                    </label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={function(e) { setLegalName(e.target.value); }}
                      placeholder="e.g., Joseph Smith LLC"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={function(e) { setIndustry(e.target.value); }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none focus:border-forsure-blue"
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map(function(ind) {
                      return (
                        <option key={ind.value} value={ind.value}>
                          {ind.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={isSoleProp}
                      onChange={function(e) { setIsSoleProp(e.target.checked); }}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                    />
                    I'm a sole proprietor without an EIN
                  </label>
                </div>

                {!isSoleProp && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                      EIN (Employer Identification Number)
                    </label>
                    <input
                      type="text"
                      value={einNumber}
                      onChange={function(e) { setEinNumber(formatEin(e.target.value)); }}
                      placeholder="XX-XXXXXXX"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Your EIN is kept secure and used only for verification.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Business Contact */}
          {step === 3 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white">Business Contact</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={function(e) { setBusinessEmail(e.target.value); }}
                    placeholder="contact@yourbusiness.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Must be a business email, not Gmail/Yahoo/etc.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={function(e) { setBusinessPhone(formatPhone(e.target.value)); }}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Website <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={businessWebsite}
                    onChange={function(e) { setBusinessWebsite(e.target.value); }}
                    placeholder="https://yourbusiness.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Business Address */}
          {step === 4 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white">Business Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={function(e) { setBusinessAddress(e.target.value); }}
                    placeholder="123 Main St, Suite 100"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                      City
                    </label>
                    <input
                      type="text"
                      value={businessCity}
                      onChange={function(e) { setBusinessCity(e.target.value); }}
                      placeholder="City"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                      State
                    </label>
                    <select
                      value={businessState}
                      onChange={function(e) { setBusinessState(e.target.value); }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white outline-none focus:border-forsure-blue"
                    >
                      <option value="">State</option>
                      {STATES.map(function(st) {
                        return (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={businessZip}
                    onChange={function(e) { setBusinessZip(e.target.value.slice(0, 10)); }}
                    placeholder="12345"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-forsure-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg border border-critical/20 bg-critical/10 px-4 py-3 text-sm text-critical">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 font-medium text-white hover:bg-slate-800"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-lg bg-forsure-blue px-4 py-2.5 font-medium text-white hover:bg-forsure-blue/90"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-forsure-blue px-4 py-2.5 font-medium text-white hover:bg-forsure-blue/90 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-slate-gray">
          Already have an account?{" "}
          <Link href="/login" className="text-forsure-blue hover:underline">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-slate-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-slate-400 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-slate-400 hover:underline">
            Privacy Policy
          </Link>
          . Your business data may be used to verify your identity and shared with other verified businesses as part of the Customer Scorer network.
        </p>
      </div>
    </div>
  );
}