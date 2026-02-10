// lib/industry-types.ts

export const INDUSTRIES = [
  { value: 'hvac', label: 'HVAC', icon: '🔧', category: 'trades' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧', category: 'trades' },
  { value: 'electrical', label: 'Electrical', icon: '⚡', category: 'trades' },
  { value: 'roofing', label: 'Roofing', icon: '🏠', category: 'trades' },
  { value: 'general_contractor', label: 'General Contractor', icon: '🏗️', category: 'trades' },
  { value: 'remodeler', label: 'Remodeler', icon: '🏗️', category: 'trades' },
  { value: 'painter', label: 'Painter', icon: '🎨', category: 'trades' },
  { value: 'landscaper', label: 'Landscaper', icon: '🌿', category: 'trades' },
  { value: 'pest_control', label: 'Pest Control', icon: '🐛', category: 'trades' },
  { value: 'solar_energy', label: 'Solar / Energy', icon: '☀️', category: 'trades' },
  { value: 'cleaning_service', label: 'Cleaning Service', icon: '🧹', category: 'trades' },
  { value: 'pool_company', label: 'Pool Company', icon: '🏊', category: 'trades' },
  { value: 'garage_door_fencing', label: 'Garage Door / Fencing', icon: '🚪', category: 'trades' },
  { value: 'window_door', label: 'Window / Door', icon: '🪟', category: 'trades' },
  { value: 'moving_company', label: 'Moving Company', icon: '🚚', category: 'services' },
  { value: 'realtor', label: 'Realtor / Real Estate Agent', icon: '🏡', category: 'real_estate' },
  { value: 'home_inspector', label: 'Home Inspector', icon: '🔍', category: 'real_estate' },
  { value: 'insurance_agent', label: 'Insurance Agent', icon: '🛡️', category: 'financial' },
  { value: 'property_manager', label: 'Property Manager', icon: '🏢', category: 'real_estate' },
  { value: 'attorney_real_estate', label: 'Attorney (Real Estate)', icon: '⚖️', category: 'professional' },
  { value: 'financial_advisor', label: 'Financial Advisor', icon: '💰', category: 'financial' },
  { value: 'other', label: 'Other', icon: '📋', category: 'other' },
] as const;

export type BusinessIndustry = typeof INDUSTRIES[number]['value'];

export const INDUSTRY_CATEGORIES = {
  trades: 'Trades & Construction',
  services: 'Home Services',
  real_estate: 'Real Estate',
  financial: 'Financial Services',
  professional: 'Professional Services',
  other: 'Other',
} as const;

export function getIndustryLabel(industry: string): string {
  return INDUSTRIES.find(i => i.value === industry)?.label || 'Other';
}

export function getIndustryIcon(industry: string): string {
  return INDUSTRIES.find(i => i.value === industry)?.icon || '📋';
}

// Tools available per industry
export const INDUSTRY_TOOLS: Record<BusinessIndustry, string[]> = {
  hvac: [
    'aging_systems_finder',
    'warranty_expiration_leads',
    'multi_zone_home_finder',
    'seasonal_prep_lists',
    'neighborhood_blitz_planner',
    'flip_alert',
  ],
  plumbing: [
    'aging_systems_finder',
    'sewer_line_prospects',
    'water_heater_leads',
    'flip_alert',
    'seasonal_prep_lists',
  ],
  electrical: [
    'aging_systems_finder',
    'panel_upgrade_prospects',
    'solar_prewire_leads',
    'flip_alert',
  ],
  roofing: [
    'reroof_calculator',
    'storm_damage_prospecting',
    'insurance_claim_helper',
    'post_storm_priority',
  ],
  general_contractor: [
    'renovation_candidates',
    'permit_cost_benchmarking',
    'flip_tracker',
    'pre_bid_property_brief',
  ],
  remodeler: [
    'renovation_candidates',
    'permit_cost_benchmarking',
    'flip_tracker',
    'pre_bid_property_brief',
  ],
  realtor: [
    'live_sales_feed',
    'comparable_sales',
    'pre_listing_report',
    'off_market_finder',
    'rental_property_identifier',
    'new_construction_tracker',
    'neighborhood_report_card',
    'divorce_estate_detector',
  ],
  home_inspector: [
    'sales_feed_pipeline',
    'pre_inspection_brief',
    'reinspection_opportunities',
    'repeat_investor_tracker',
    'inspection_red_flag_brief',
  ],
  insurance_agent: [
    'new_homeowner_feed',
    'risk_profiling',
    'policy_review_triggers',
    'property_value_monitor',
  ],
  property_manager: [
    'portfolio_dashboard',
    'maintenance_scheduling',
    'tenant_screening_supplement',
    'tax_appeal_alerts',
    'contractor_performance_tracker',
  ],
  landscaper: [
    'lot_size_leads',
    'new_homeowner_targeting',
    'high_value_property_finder',
    'seasonal_push_lists',
  ],
  pest_control: [
    'property_age_targeting',
    'new_homeowner_alerts',
    'multi_unit_property_finder',
  ],
  solar_energy: [
    'ideal_candidate_scoring',
    'panel_upgrade_crosssell',
    'new_construction_solar',
  ],
  painter: [
    'exterior_paint_leads',
    'new_homeowner_make_it_mine',
    'renovation_companion_leads',
  ],
  cleaning_service: [
    'sq_footage_leads',
    'new_homeowner_move_in',
    'high_value_home_finder',
  ],
  pool_company: [
    'pool_property_identifier',
    'pool_age_estimator',
    'seasonal_opening_closing',
  ],
  garage_door_fencing: [
    'age_based_targeting',
    'new_construction_missing',
    'neighborhood_matching',
  ],
  window_door: [
    'energy_efficiency_prospects',
    'renovation_companion',
  ],
  moving_company: [
    'sales_feed_pipeline',
    'move_size_estimator',
  ],
  attorney_real_estate: [
    'lien_judgment_monitor',
    'property_ownership_history',
    'permit_violation_finder',
    'contractor_dispute_tracker',
  ],
  financial_advisor: [
    'equity_estimator',
    'refinance_candidates',
    'new_homeowner_followup',
    'investment_property_identifier',
  ],
  other: [
    'new_homeowner_feed',
  ],
};

// Universal tools available to all industries
export const UNIVERSAL_TOOLS = [
  'enhanced_search',
  'property_profile',
  'new_homeowner_feed',
  'competitor_intelligence',
];

// Tool display metadata
export const TOOL_METADATA: Record<string, { label: string; description: string; icon: string }> = {
  // Universal
  enhanced_search: { label: 'Enhanced Search', description: 'Search properties by address, name, phone, or email', icon: '🔍' },
  property_profile: { label: 'Property Profile', description: 'Detailed property information and history', icon: '🏠' },
  new_homeowner_feed: { label: 'New Homeowner Feed', description: 'Recent property sales in your service area', icon: '🏡' },
  competitor_intelligence: { label: 'Competitor Intelligence', description: 'See where competitors are working', icon: '📊' },
  reputation_reports: { label: 'Reputation Reports', description: 'Generate PDF reports on properties', icon: '📄' },

  // HVAC
  aging_systems_finder: { label: 'Aging Systems Finder', description: 'Properties with old or no HVAC permits', icon: '🔧' },
  warranty_expiration_leads: { label: 'Warranty Expiration Leads', description: 'Systems approaching end of warranty', icon: '📅' },
  multi_zone_home_finder: { label: 'Multi-Zone Home Finder', description: 'Large homes likely with multiple zones', icon: '🏠' },
  seasonal_prep_lists: { label: 'Seasonal Prep Lists', description: 'Heating/cooling prep by season', icon: '🌡️' },
  neighborhood_blitz_planner: { label: 'Neighborhood Blitz Planner', description: 'Door-knock neighbors of completed jobs', icon: '🚪' },
  flip_alert: { label: 'Flip Alert', description: 'Properties being flipped by investors', icon: '🔄' },

  // Plumbing
  sewer_line_prospects: { label: 'Sewer Line Prospects', description: 'Homes likely needing sewer work', icon: '🔧' },
  water_heater_leads: { label: 'Water Heater Leads', description: 'Water heaters approaching end of life', icon: '🚿' },

  // Electrical
  panel_upgrade_prospects: { label: 'Panel Upgrade Prospects', description: 'Homes needing electrical panel upgrades', icon: '⚡' },
  solar_prewire_leads: { label: 'Solar Pre-Wire Leads', description: 'Candidates for solar installation prep', icon: '☀️' },

  // Roofing
  reroof_calculator: { label: 'Re-Roof Calculator', description: 'Score properties by roof replacement likelihood', icon: '🏠' },
  storm_damage_prospecting: { label: 'Storm Damage Prospecting', description: 'Target properties after weather events', icon: '⛈️' },
  insurance_claim_helper: { label: 'Insurance Claim Helper', description: 'Package property data for insurance', icon: '📋' },
  post_storm_priority: { label: 'Post-Storm Priority List', description: 'Prioritized outreach after storms', icon: '🎯' },

  // General Contractor / Remodeler
  renovation_candidates: { label: 'Renovation Candidates', description: 'High-value homes with few recent permits', icon: '🏗️' },
  permit_cost_benchmarking: { label: 'Permit Cost Benchmarking', description: 'Average permit costs by type and area', icon: '💰' },
  flip_tracker: { label: 'Flip Tracker', description: 'Track active house flippers', icon: '🔄' },
  pre_bid_property_brief: { label: 'Pre-Bid Property Brief', description: 'Property history before bidding', icon: '📋' },

  // Realtor
  live_sales_feed: { label: 'Live Sales Feed', description: 'Real-time property sales', icon: '📈' },
  comparable_sales: { label: 'Comparable Sales', description: 'Find comps within radius', icon: '🏘️' },
  pre_listing_report: { label: 'Pre-Listing Report', description: 'Generate listing prep reports', icon: '📄' },
  off_market_finder: { label: 'Off-Market Finder', description: 'Find motivated sellers', icon: '🔍' },
  rental_property_identifier: { label: 'Rental Property Identifier', description: 'Identify investment properties', icon: '🏢' },
  new_construction_tracker: { label: 'New Construction Tracker', description: 'Track new builds from permit to completion', icon: '🏗️' },
  neighborhood_report_card: { label: 'Neighborhood Report Card', description: 'Aggregate stats per area', icon: '📊' },
  divorce_estate_detector: { label: 'Divorce/Estate Detector', description: 'Find distressed sales indicators', icon: '⚠️' },

  // Home Inspector
  sales_feed_pipeline: { label: 'Sales Feed Pipeline', description: 'Every sale is an inspection opportunity', icon: '🔍' },
  pre_inspection_brief: { label: 'Pre-Inspection Brief', description: 'Auto-generated inspection checklist', icon: '📋' },
  reinspection_opportunities: { label: 'Re-Inspection Opportunities', description: '1-year warranty inspections', icon: '🔄' },
  repeat_investor_tracker: { label: 'Repeat Investor Tracker', description: 'Find investors who buy repeatedly', icon: '👤' },
  inspection_red_flag_brief: { label: 'Red Flag Brief', description: 'Known issues for home age/type', icon: '🚩' },

  // Insurance
  risk_profiling: { label: 'Risk Profiling', description: 'Score properties on insurance risk', icon: '📊' },
  policy_review_triggers: { label: 'Policy Review Triggers', description: 'Alert on coverage-changing events', icon: '🔔' },
  property_value_monitor: { label: 'Property Value Monitor', description: 'Track assessed value changes', icon: '📈' },

  // Property Manager
  portfolio_dashboard: { label: 'Portfolio Dashboard', description: 'Manage all properties in one view', icon: '🏢' },
  maintenance_scheduling: { label: 'Maintenance Scheduling', description: 'Track system ages across portfolio', icon: '📅' },
  tenant_screening_supplement: { label: 'Tenant Screening Supplement', description: 'Cross-reference court records', icon: '👤' },
  tax_appeal_alerts: { label: 'Tax Appeal Alerts', description: 'Flag assessment value jumps', icon: '💰' },
  contractor_performance_tracker: { label: 'Contractor Performance', description: 'Track contractor permit history', icon: '📊' },

  // Landscaper
  lot_size_leads: { label: 'Lot Size Leads', description: 'Sort properties by lot size', icon: '🌿' },
  new_homeowner_targeting: { label: 'New Homeowner Targeting', description: 'New buyers with large lots', icon: '🏡' },
  high_value_property_finder: { label: 'High-Value Property Finder', description: 'Premium homes for premium services', icon: '💎' },
  seasonal_push_lists: { label: 'Seasonal Push Lists', description: 'Spring/fall service campaigns', icon: '🍂' },

  // Pest Control
  property_age_targeting: { label: 'Property Age Targeting', description: 'Older homes = more pest issues', icon: '🏠' },
  new_homeowner_alerts: { label: 'New Homeowner Alerts', description: 'New buyers need pest inspections', icon: '🔔' },
  multi_unit_property_finder: { label: 'Multi-Unit Property Finder', description: 'Find commercial opportunities', icon: '🏢' },

  // Solar
  ideal_candidate_scoring: { label: 'Ideal Candidate Scoring', description: 'Score properties for solar potential', icon: '☀️' },
  panel_upgrade_crosssell: { label: 'Panel Upgrade Cross-Sell', description: 'Homes needing panel upgrades first', icon: '⚡' },
  new_construction_solar: { label: 'New Construction Solar', description: 'New builds without solar permits', icon: '🏗️' },

  // Painter
  exterior_paint_leads: { label: 'Exterior Paint Leads', description: 'Homes due for exterior repaint', icon: '🎨' },
  new_homeowner_make_it_mine: { label: 'New Homeowner "Make It Mine"', description: 'Recent buyers who repaint', icon: '🏡' },
  renovation_companion_leads: { label: 'Renovation Companion', description: 'Properties with recent permits', icon: '🔧' },

  // Cleaning
  sq_footage_leads: { label: 'Square Footage Leads', description: 'Bigger homes = bigger contracts', icon: '🏠' },
  new_homeowner_move_in: { label: 'Move-In Cleaning', description: 'New buyers need deep cleans', icon: '🧹' },
  high_value_home_finder: { label: 'High-Value Home Finder', description: 'Premium homes want recurring service', icon: '💎' },

  // Pool
  pool_property_identifier: { label: 'Pool Property Identifier', description: 'Properties with pool permits', icon: '🏊' },
  pool_age_estimator: { label: 'Pool Age Estimator', description: 'Estimate equipment replacement needs', icon: '📅' },
  seasonal_opening_closing: { label: 'Seasonal Opening/Closing', description: 'Pool opening and closing leads', icon: '🍂' },

  // Garage Door / Fencing
  age_based_targeting: { label: 'Age-Based Targeting', description: 'Old homes with original equipment', icon: '🚪' },
  new_construction_missing: { label: 'New Construction Missing', description: 'New builds without features', icon: '🏗️' },
  neighborhood_matching: { label: 'Neighborhood Matching', description: 'Neighbors follow neighbors', icon: '🏘️' },

  // Window / Door
  energy_efficiency_prospects: { label: 'Energy Efficiency Prospects', description: 'Old windows = replacement opportunity', icon: '🪟' },
  renovation_companion: { label: 'Renovation Companion', description: 'Pair with remodel projects', icon: '🔧' },

  // Moving
  move_size_estimator: { label: 'Move Size Estimator', description: 'Estimate move complexity from sq ft', icon: '📦' },

  // Attorney
  lien_judgment_monitor: { label: 'Lien & Judgment Monitor', description: 'Track court filings by name', icon: '⚖️' },
  property_ownership_history: { label: 'Ownership History', description: 'Full chain of title', icon: '📜' },
  permit_violation_finder: { label: 'Permit Violation Finder', description: 'Find unpermitted work', icon: '⚠️' },
  contractor_dispute_tracker: { label: 'Contractor Dispute Tracker', description: 'Contractors with legal history', icon: '⚖️' },

  // Financial Advisor
  equity_estimator: { label: 'Equity Estimator', description: 'Estimate homeowner equity', icon: '💰' },
  refinance_candidates: { label: 'Refinance Candidates', description: 'Homes ripe for refinancing', icon: '🏦' },
  new_homeowner_followup: { label: 'New Homeowner Follow-Up', description: '6-month post-purchase outreach', icon: '📞' },
  investment_property_identifier: { label: 'Investment Property Identifier', description: 'Find investor-owned properties', icon: '🏢' },
};

// Default alert preferences by industry
export const DEFAULT_ALERT_PREFERENCES: Record<BusinessIndustry, string[]> = {
  hvac: ['new_homeowner', 'aging_system', 'competitor_activity'],
  plumbing: ['new_homeowner', 'aging_system', 'competitor_activity'],
  electrical: ['new_homeowner', 'aging_system', 'competitor_activity'],
  roofing: ['new_homeowner', 'aging_system', 'competitor_activity'],
  general_contractor: ['new_homeowner', 'new_permit', 'competitor_activity'],
  remodeler: ['new_homeowner', 'new_permit', 'competitor_activity'],
  realtor: ['new_homeowner', 'new_permit', 'assessment_change'],
  home_inspector: ['new_homeowner'],
  insurance_agent: ['new_homeowner', 'assessment_change'],
  property_manager: ['new_permit', 'assessment_change', 'court_filing'],
  landscaper: ['new_homeowner'],
  pest_control: ['new_homeowner'],
  solar_energy: ['new_homeowner', 'new_permit'],
  painter: ['new_homeowner', 'new_permit'],
  cleaning_service: ['new_homeowner'],
  pool_company: ['new_homeowner', 'new_permit'],
  garage_door_fencing: ['new_homeowner', 'new_permit'],
  window_door: ['new_homeowner', 'new_permit'],
  moving_company: ['new_homeowner'],
  attorney_real_estate: ['court_filing', 'new_permit'],
  financial_advisor: ['new_homeowner', 'assessment_change'],
  other: ['new_homeowner'],
};
