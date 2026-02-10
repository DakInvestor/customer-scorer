// app/app/settings/service-area/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Known municipalities in Bucks and Montgomery County
const MUNICIPALITIES = {
  bucks: [
    "Bensalem Township", "Bristol Borough", "Bristol Township", "Buckingham Township",
    "Chalfont Borough", "Doylestown Borough", "Doylestown Township", "Dublin Borough",
    "Durham Township", "East Rockhill Township", "Falls Township", "Haycock Township",
    "Hilltown Township", "Hulmeville Borough", "Ivyland Borough", "Langhorne Borough",
    "Langhorne Manor Borough", "Lower Makefield Township", "Lower Southampton Township",
    "Middletown Township", "Milford Township", "Morrisville Borough", "New Britain Borough",
    "New Britain Township", "New Hope Borough", "Newtown Borough", "Newtown Township",
    "Nockamixon Township", "Northampton Township", "Penndel Borough", "Perkasie Borough",
    "Plumstead Township", "Quakertown Borough", "Richland Township", "Richlandtown Borough",
    "Riegelsville Borough", "Sellersville Borough", "Silverdale Borough", "Solebury Township",
    "Springfield Township", "Telford Borough", "Tinicum Township", "Trumbauersville Borough",
    "Tullytown Borough", "Upper Makefield Township", "Upper Southampton Township",
    "Warminster Township", "Warrington Township", "Warwick Township", "West Rockhill Township",
    "Wrightstown Township", "Yardley Borough"
  ],
  montgomery: [
    "Abington Township", "Ambler Borough", "Bridgeport Borough", "Bryn Athyn Borough",
    "Cheltenham Township", "Collegeville Borough", "Conshohocken Borough", "Douglass Township",
    "East Greenville Borough", "East Norriton Township", "Franconia Township", "Green Lane Borough",
    "Hatboro Borough", "Hatfield Borough", "Hatfield Township", "Horsham Township",
    "Jenkintown Borough", "Lansdale Borough", "Limerick Township", "Lower Frederick Township",
    "Lower Gwynedd Township", "Lower Merion Township", "Lower Moreland Township",
    "Lower Pottsgrove Township", "Lower Providence Township", "Lower Salford Township",
    "Marlborough Township", "Montgomery Township", "Narberth Borough", "New Hanover Township",
    "Norristown Borough", "North Wales Borough", "Pennsburg Borough", "Perkiomen Township",
    "Plymouth Township", "Pottstown Borough", "Red Hill Borough", "Rockledge Borough",
    "Royersford Borough", "Salford Township", "Schwenksville Borough", "Skippack Township",
    "Souderton Borough", "Springfield Township", "Telford Borough", "Towamencin Township",
    "Trappe Borough", "Upper Dublin Township", "Upper Frederick Township", "Upper Gwynedd Township",
    "Upper Hanover Township", "Upper Merion Township", "Upper Moreland Township",
    "Upper Pottsgrove Township", "Upper Providence Township", "Upper Salford Township",
    "West Conshohocken Borough", "West Norriton Township", "West Pottsgrove Township",
    "Whitemarsh Township", "Whitpain Township", "Worcester Township"
  ]
};

// Common ZIP codes in Bucks and Montgomery County
const ZIP_CODES = {
  bucks: [
    "18901", "18902", "18912", "18914", "18915", "18917", "18920", "18923", "18925",
    "18927", "18929", "18930", "18932", "18933", "18934", "18935", "18938", "18940",
    "18942", "18943", "18944", "18946", "18947", "18950", "18951", "18953", "18954",
    "18955", "18956", "18960", "18962", "18963", "18964", "18966", "18968", "18969",
    "18970", "18972", "18974", "18976", "18977", "19007", "19020", "19021", "19030",
    "19047", "19048", "19049", "19053", "19054", "19055", "19056", "19057", "19067"
  ],
  montgomery: [
    "18041", "18054", "18070", "18073", "18074", "18076", "18084", "18936", "19001",
    "19002", "19003", "19004", "19006", "19009", "19010", "19012", "19025", "19027",
    "19031", "19034", "19035", "19038", "19040", "19041", "19044", "19046", "19050",
    "19066", "19072", "19075", "19076", "19083", "19085", "19090", "19095", "19096",
    "19401", "19403", "19404", "19405", "19406", "19407", "19408", "19409", "19415",
    "19422", "19423", "19426", "19428", "19429", "19430", "19435", "19436", "19437",
    "19438", "19440", "19441", "19443", "19444", "19446", "19450", "19453", "19454",
    "19455", "19456", "19457", "19460", "19462", "19464", "19465", "19468", "19473",
    "19474", "19477", "19478", "19480", "19481", "19482", "19484", "19486", "19490",
    "19492", "19493", "19494", "19495", "19496"
  ]
};

export default function ServiceAreaSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [selectedZips, setSelectedZips] = useState<string[]>([]);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"municipalities" | "zips">("municipalities");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (!profile?.business_id) {
        setError("No business found");
        setLoading(false);
        return;
      }

      setBusinessId(profile.business_id);

      const { data: business } = await supabase
        .from("businesses")
        .select("service_area_zips, service_area_municipalities")
        .eq("id", profile.business_id)
        .single();

      if (business) {
        setSelectedZips(business.service_area_zips || []);
        setSelectedMunicipalities(business.service_area_municipalities || []);
      }

      setLoading(false);
    }
    loadBusiness();
  }, [router]);

  const handleSave = async () => {
    if (!businessId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error: updateError } = await supabase
        .from("businesses")
        .update({
          service_area_zips: selectedZips,
          service_area_municipalities: selectedMunicipalities,
        })
        .eq("id", businessId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const toggleZip = (zip: string) => {
    setSelectedZips((prev) =>
      prev.includes(zip) ? prev.filter((z) => z !== zip) : [...prev, zip]
    );
  };

  const toggleMunicipality = (municipality: string) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((m) => m !== municipality)
        : [...prev, municipality]
    );
  };

  const selectAllBucks = () => {
    if (activeTab === "municipalities") {
      setSelectedMunicipalities((prev) => [
        ...new Set([...prev, ...MUNICIPALITIES.bucks]),
      ]);
    } else {
      setSelectedZips((prev) => [...new Set([...prev, ...ZIP_CODES.bucks])]);
    }
  };

  const selectAllMontgomery = () => {
    if (activeTab === "municipalities") {
      setSelectedMunicipalities((prev) => [
        ...new Set([...prev, ...MUNICIPALITIES.montgomery]),
      ]);
    } else {
      setSelectedZips((prev) => [...new Set([...prev, ...ZIP_CODES.montgomery])]);
    }
  };

  const clearAll = () => {
    if (activeTab === "municipalities") {
      setSelectedMunicipalities([]);
    } else {
      setSelectedZips([]);
    }
  };

  const filteredMunicipalities = {
    bucks: MUNICIPALITIES.bucks.filter((m) =>
      m.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    montgomery: MUNICIPALITIES.montgomery.filter((m) =>
      m.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  const filteredZips = {
    bucks: ZIP_CODES.bucks.filter((z) => z.includes(searchTerm)),
    montgomery: ZIP_CODES.montgomery.filter((z) => z.includes(searchTerm)),
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <Link href="/app/settings" className="text-sm text-text-muted hover:text-charcoal">
          ← Back to settings
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-charcoal">Service Area</h1>
      <p className="mb-8 text-text-muted">
        Select the areas you serve. This filters your leads and alerts to show only relevant properties.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-critical/30 bg-critical/10 px-4 py-3 text-sm text-critical">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-emerald">
          Service area saved successfully!
        </div>
      )}

      <div className="max-w-4xl">
        {/* Summary */}
        <div className="mb-6 rounded-lg bg-surface p-4">
          <p className="text-sm text-text-secondary">
            <strong>Currently selected:</strong>{" "}
            {selectedMunicipalities.length} municipalities, {selectedZips.length} ZIP codes
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("municipalities")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "municipalities"
                ? "border-b-2 border-copper text-copper"
                : "text-text-muted hover:text-charcoal"
            }`}
          >
            Municipalities ({selectedMunicipalities.length})
          </button>
          <button
            onClick={() => setActiveTab("zips")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "zips"
                ? "border-b-2 border-copper text-copper"
                : "text-text-muted hover:text-charcoal"
            }`}
          >
            ZIP Codes ({selectedZips.length})
          </button>
        </div>

        {/* Search and Quick Actions */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === "municipalities" ? "Search municipalities..." : "Search ZIP codes..."}
            className="flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm outline-none focus:border-copper"
          />
          <button
            onClick={selectAllBucks}
            className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
          >
            + All Bucks County
          </button>
          <button
            onClick={selectAllMontgomery}
            className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
          >
            + All Montgomery County
          </button>
          <button
            onClick={clearAll}
            className="rounded-lg border border-critical/30 px-3 py-2 text-sm text-critical hover:bg-critical/10"
          >
            Clear All
          </button>
        </div>

        {/* Selection Grid */}
        {activeTab === "municipalities" ? (
          <div className="space-y-6">
            {/* Bucks County */}
            <div>
              <h3 className="mb-3 font-semibold text-charcoal">
                Bucks County ({filteredMunicipalities.bucks.length})
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMunicipalities.bucks.map((municipality) => (
                  <button
                    key={municipality}
                    onClick={() => toggleMunicipality(municipality)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      selectedMunicipalities.includes(municipality)
                        ? "border-copper bg-copper/10 text-copper"
                        : "border-border bg-white hover:border-copper/50"
                    }`}
                  >
                    {selectedMunicipalities.includes(municipality) && "✓ "}
                    {municipality}
                  </button>
                ))}
              </div>
            </div>

            {/* Montgomery County */}
            <div>
              <h3 className="mb-3 font-semibold text-charcoal">
                Montgomery County ({filteredMunicipalities.montgomery.length})
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMunicipalities.montgomery.map((municipality) => (
                  <button
                    key={municipality}
                    onClick={() => toggleMunicipality(municipality)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      selectedMunicipalities.includes(municipality)
                        ? "border-copper bg-copper/10 text-copper"
                        : "border-border bg-white hover:border-copper/50"
                    }`}
                  >
                    {selectedMunicipalities.includes(municipality) && "✓ "}
                    {municipality}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bucks County ZIPs */}
            <div>
              <h3 className="mb-3 font-semibold text-charcoal">
                Bucks County ({filteredZips.bucks.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {filteredZips.bucks.map((zip) => (
                  <button
                    key={zip}
                    onClick={() => toggleZip(zip)}
                    className={`rounded-lg border px-3 py-2 text-sm font-mono transition-colors ${
                      selectedZips.includes(zip)
                        ? "border-copper bg-copper/10 text-copper"
                        : "border-border bg-white hover:border-copper/50"
                    }`}
                  >
                    {selectedZips.includes(zip) && "✓ "}
                    {zip}
                  </button>
                ))}
              </div>
            </div>

            {/* Montgomery County ZIPs */}
            <div>
              <h3 className="mb-3 font-semibold text-charcoal">
                Montgomery County ({filteredZips.montgomery.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {filteredZips.montgomery.map((zip) => (
                  <button
                    key={zip}
                    onClick={() => toggleZip(zip)}
                    className={`rounded-lg border px-3 py-2 text-sm font-mono transition-colors ${
                      selectedZips.includes(zip)
                        ? "border-copper bg-copper/10 text-copper"
                        : "border-border bg-white hover:border-copper/50"
                    }`}
                  >
                    {selectedZips.includes(zip) && "✓ "}
                    {zip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Service Area"}
          </button>
          <Link
            href="/app/settings"
            className="rounded-lg border border-border px-6 py-3 font-semibold text-charcoal hover:bg-surface"
          >
            Back to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
