export type WelfareScheme = {
  id: string;
  title_en: string;
  title_ta: string;
  title_hi: string;
  description_en: string;
  description_ta: string;
  description_hi: string;
  category: string;
  level: "central" | "state" | "state_tn" | string;
  target_workers: string | null;
  eligibility_summary_en: string | null;
  eligibility_summary_ta: string | null;
  eligibility_summary_hi: string | null;
  max_benefit_amount: number | null;
  benefit_unit: string | null;
  official_link: string | null;
};

const sameText = (value: string) => value;

export const DEFAULT_WELFARE_SCHEMES: WelfareScheme[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    title_en: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
    title_ta: sameText("Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana"),
    title_hi: sameText("Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana"),
    description_en:
      "Health insurance scheme providing coverage up to INR 5 lakh per family per year for secondary and tertiary care hospitalization.",
    description_ta:
      "Health insurance scheme providing coverage up to INR 5 lakh per family per year for secondary and tertiary care hospitalization.",
    description_hi:
      "Health insurance scheme providing coverage up to INR 5 lakh per family per year for secondary and tertiary care hospitalization.",
    category: "Healthcare",
    level: "central",
    target_workers: "Eligible driver families and low-income households.",
    eligibility_summary_en: "Eligible families as per government beneficiary database",
    eligibility_summary_ta: "Eligible families as per government beneficiary database",
    eligibility_summary_hi: "Eligible families as per government beneficiary database",
    max_benefit_amount: 500000,
    benefit_unit: "INR/year",
    official_link: "https://beneficiary.nha.gov.in/",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    title_en: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    title_ta: sameText("Pradhan Mantri Suraksha Bima Yojana (PMSBY)"),
    title_hi: sameText("Pradhan Mantri Suraksha Bima Yojana (PMSBY)"),
    description_en:
      "Accidental death and disability insurance scheme providing coverage for accidental death, total disability, and partial disability.",
    description_ta:
      "Accidental death and disability insurance scheme providing coverage for accidental death, total disability, and partial disability.",
    description_hi:
      "Accidental death and disability insurance scheme providing coverage for accidental death, total disability, and partial disability.",
    category: "Insurance",
    level: "central",
    target_workers: "Drivers and other workers with a savings bank account.",
    eligibility_summary_en: "Age 18-70, savings bank account, consent for auto-debit",
    eligibility_summary_ta: "Age 18-70, savings bank account, consent for auto-debit",
    eligibility_summary_hi: "Age 18-70, savings bank account, consent for auto-debit",
    max_benefit_amount: 200000,
    benefit_unit: "INR",
    official_link: "https://www.jansuraksha.gov.in/",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    title_en: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    title_ta: sameText("Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)"),
    title_hi: sameText("Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)"),
    description_en:
      "Life insurance scheme providing coverage in case of death due to any reason with a low annual premium.",
    description_ta:
      "Life insurance scheme providing coverage in case of death due to any reason with a low annual premium.",
    description_hi:
      "Life insurance scheme providing coverage in case of death due to any reason with a low annual premium.",
    category: "Insurance",
    level: "central",
    target_workers: "Drivers and other workers with a savings bank account.",
    eligibility_summary_en: "Age 18-50, savings bank account, consent for auto-debit",
    eligibility_summary_ta: "Age 18-50, savings bank account, consent for auto-debit",
    eligibility_summary_hi: "Age 18-50, savings bank account, consent for auto-debit",
    max_benefit_amount: 200000,
    benefit_unit: "INR",
    official_link: "https://www.jansuraksha.gov.in/",
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    title_en: "Atal Pension Yojana (APY)",
    title_ta: sameText("Atal Pension Yojana (APY)"),
    title_hi: sameText("Atal Pension Yojana (APY)"),
    description_en:
      "Pension scheme for unorganized sector workers providing guaranteed monthly pension after age 60 based on contribution amount.",
    description_ta:
      "Pension scheme for unorganized sector workers providing guaranteed monthly pension after age 60 based on contribution amount.",
    description_hi:
      "Pension scheme for unorganized sector workers providing guaranteed monthly pension after age 60 based on contribution amount.",
    category: "Pension",
    level: "central",
    target_workers: "Unorganized workers, including auto and taxi drivers.",
    eligibility_summary_en: "Age 18-40, savings bank account, not income tax payer",
    eligibility_summary_ta: "Age 18-40, savings bank account, not income tax payer",
    eligibility_summary_hi: "Age 18-40, savings bank account, not income tax payer",
    max_benefit_amount: 5000,
    benefit_unit: "INR/month",
    official_link: "https://www.npscra.nsdl.co.in/scheme-details.php",
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    title_en: "E-Shram Registration",
    title_ta: sameText("E-Shram Registration"),
    title_hi: sameText("E-Shram Registration"),
    description_en:
      "Universal registration platform for unorganized workers including auto and taxi drivers. Provides access to welfare schemes and social security benefits.",
    description_ta:
      "Universal registration platform for unorganized workers including auto and taxi drivers. Provides access to welfare schemes and social security benefits.",
    description_hi:
      "Universal registration platform for unorganized workers including auto and taxi drivers. Provides access to welfare schemes and social security benefits.",
    category: "Registration & Identity",
    level: "central",
    target_workers: "Unorganized workers, including drivers.",
    eligibility_summary_en: "Age 16-59, unorganized worker, valid mobile number and Aadhaar",
    eligibility_summary_ta: "Age 16-59, unorganized worker, valid mobile number and Aadhaar",
    eligibility_summary_hi: "Age 16-59, unorganized worker, valid mobile number and Aadhaar",
    max_benefit_amount: null,
    benefit_unit: null,
    official_link: "https://eshram.gov.in/",
  },
  {
    id: "10000000-0000-4000-8000-000000000006",
    title_en: "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)",
    title_ta: sameText("Pradhan Mantri Shram Yogi Maandhan (PM-SYM)"),
    title_hi: sameText("Pradhan Mantri Shram Yogi Maandhan (PM-SYM)"),
    description_en:
      "Voluntary contributory pension scheme for unorganized workers with assured monthly pension after the age of 60.",
    description_ta:
      "Voluntary contributory pension scheme for unorganized workers with assured monthly pension after the age of 60.",
    description_hi:
      "Voluntary contributory pension scheme for unorganized workers with assured monthly pension after the age of 60.",
    category: "Pension",
    level: "central",
    target_workers: "Unorganized workers with modest monthly income.",
    eligibility_summary_en: "Age 18-40, unorganized worker, not covered under EPFO/ESIC/NPS",
    eligibility_summary_ta: "Age 18-40, unorganized worker, not covered under EPFO/ESIC/NPS",
    eligibility_summary_hi: "Age 18-40, unorganized worker, not covered under EPFO/ESIC/NPS",
    max_benefit_amount: 3000,
    benefit_unit: "INR/month",
    official_link: "https://maandhan.in/",
  },
  {
    id: "10000000-0000-4000-8000-000000000007",
    title_en: "Pradhan Mantri Mudra Yojana",
    title_ta: sameText("Pradhan Mantri Mudra Yojana"),
    title_hi: sameText("Pradhan Mantri Mudra Yojana"),
    description_en:
      "Business loan support for small entrepreneurs and self-employed workers to buy, repair, or expand income-generating vehicles and services.",
    description_ta:
      "Business loan support for small entrepreneurs and self-employed workers to buy, repair, or expand income-generating vehicles and services.",
    description_hi:
      "Business loan support for small entrepreneurs and self-employed workers to buy, repair, or expand income-generating vehicles and services.",
    category: "Financial Support",
    level: "central",
    target_workers: "Self-employed drivers and small transport service operators.",
    eligibility_summary_en: "Non-corporate small business or self-employed applicant",
    eligibility_summary_ta: "Non-corporate small business or self-employed applicant",
    eligibility_summary_hi: "Non-corporate small business or self-employed applicant",
    max_benefit_amount: 1000000,
    benefit_unit: "INR loan",
    official_link: "https://www.mudra.org.in/",
  },
  {
    id: "10000000-0000-4000-8000-000000000008",
    title_en: "Educational Assistance for Drivers Children",
    title_ta: sameText("Educational Assistance for Drivers Children"),
    title_hi: sameText("Educational Assistance for Drivers Children"),
    description_en:
      "Financial assistance for education of drivers children from Class 1 to college level. Scholarship amount varies by course and eligibility.",
    description_ta:
      "Financial assistance for education of drivers children from Class 1 to college level. Scholarship amount varies by course and eligibility.",
    description_hi:
      "Financial assistance for education of drivers children from Class 1 to college level. Scholarship amount varies by course and eligibility.",
    category: "Education",
    level: "state",
    target_workers: "Registered drivers and their dependent children.",
    eligibility_summary_en: "Parent must be registered driver for minimum 3 years, child studying in recognized institution",
    eligibility_summary_ta: "Parent must be registered driver for minimum 3 years, child studying in recognized institution",
    eligibility_summary_hi: "Parent must be registered driver for minimum 3 years, child studying in recognized institution",
    max_benefit_amount: 10000,
    benefit_unit: "INR/year",
    official_link: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000009",
    title_en: "Free Eye Check-up and Spectacles",
    title_ta: sameText("Free Eye Check-up and Spectacles"),
    title_hi: sameText("Free Eye Check-up and Spectacles"),
    description_en:
      "Eye screening support for drivers with assistance for spectacles, helping improve road safety and day-to-day work comfort.",
    description_ta:
      "Eye screening support for drivers with assistance for spectacles, helping improve road safety and day-to-day work comfort.",
    description_hi:
      "Eye screening support for drivers with assistance for spectacles, helping improve road safety and day-to-day work comfort.",
    category: "Healthcare",
    level: "state",
    target_workers: "Registered auto, taxi, van, bus, and lorry drivers.",
    eligibility_summary_en: "Registered driver with valid ID and welfare board or association support documents",
    eligibility_summary_ta: "Registered driver with valid ID and welfare board or association support documents",
    eligibility_summary_hi: "Registered driver with valid ID and welfare board or association support documents",
    max_benefit_amount: null,
    benefit_unit: null,
    official_link: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000010",
    title_en: "Chief Minister Comprehensive Health Insurance Scheme",
    title_ta: sameText("Chief Minister Comprehensive Health Insurance Scheme"),
    title_hi: sameText("Chief Minister Comprehensive Health Insurance Scheme"),
    description_en:
      "Tamil Nadu health insurance support for eligible families to access approved hospital treatments through empanelled hospitals.",
    description_ta:
      "Tamil Nadu health insurance support for eligible families to access approved hospital treatments through empanelled hospitals.",
    description_hi:
      "Tamil Nadu health insurance support for eligible families to access approved hospital treatments through empanelled hospitals.",
    category: "Healthcare",
    level: "state",
    target_workers: "Eligible Tamil Nadu resident families, including driver families.",
    eligibility_summary_en: "Tamil Nadu family meeting income and scheme eligibility norms",
    eligibility_summary_ta: "Tamil Nadu family meeting income and scheme eligibility norms",
    eligibility_summary_hi: "Tamil Nadu family meeting income and scheme eligibility norms",
    max_benefit_amount: 500000,
    benefit_unit: "INR/year",
    official_link: "https://www.cmchistn.com/",
  },
  {
    id: "10000000-0000-4000-8000-000000000011",
    title_en: "Medical Assistance for Critical Illness",
    title_ta: sameText("Medical Assistance for Critical Illness"),
    title_hi: sameText("Medical Assistance for Critical Illness"),
    description_en:
      "Financial assistance for serious illness treatment expenses for registered drivers and eligible family members.",
    description_ta:
      "Financial assistance for serious illness treatment expenses for registered drivers and eligible family members.",
    description_hi:
      "Financial assistance for serious illness treatment expenses for registered drivers and eligible family members.",
    category: "Healthcare",
    level: "state",
    target_workers: "Registered drivers and eligible dependents.",
    eligibility_summary_en: "Registered driver with medical certificate, bills, and required identity documents",
    eligibility_summary_ta: "Registered driver with medical certificate, bills, and required identity documents",
    eligibility_summary_hi: "Registered driver with medical certificate, bills, and required identity documents",
    max_benefit_amount: 100000,
    benefit_unit: "INR",
    official_link: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000012",
    title_en: "Tamil Nadu Unorganised Drivers Welfare Board Registration",
    title_ta: sameText("Tamil Nadu Unorganised Drivers Welfare Board Registration"),
    title_hi: sameText("Tamil Nadu Unorganised Drivers Welfare Board Registration"),
    description_en:
      "State welfare-board registration support for unorganized drivers to access education, medical, accident, and family welfare benefits.",
    description_ta:
      "State welfare-board registration support for unorganized drivers to access education, medical, accident, and family welfare benefits.",
    description_hi:
      "State welfare-board registration support for unorganized drivers to access education, medical, accident, and family welfare benefits.",
    category: "Registration & Identity",
    level: "state",
    target_workers: "Tamil Nadu unorganized drivers.",
    eligibility_summary_en: "Tamil Nadu resident driver with valid licence, identity proof, and address proof",
    eligibility_summary_ta: "Tamil Nadu resident driver with valid licence, identity proof, and address proof",
    eligibility_summary_hi: "Tamil Nadu resident driver with valid licence, identity proof, and address proof",
    max_benefit_amount: null,
    benefit_unit: null,
    official_link: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000013",
    title_en: "Accident Relief and Death Assistance for Drivers",
    title_ta: sameText("Accident Relief and Death Assistance for Drivers"),
    title_hi: sameText("Accident Relief and Death Assistance for Drivers"),
    description_en:
      "State-level support for registered drivers or their families in case of accidental injury, disability, or death.",
    description_ta:
      "State-level support for registered drivers or their families in case of accidental injury, disability, or death.",
    description_hi:
      "State-level support for registered drivers or their families in case of accidental injury, disability, or death.",
    category: "Insurance",
    level: "state",
    target_workers: "Registered drivers and nominee family members.",
    eligibility_summary_en: "Registered driver, accident records, medical or death certificate, nominee documents",
    eligibility_summary_ta: "Registered driver, accident records, medical or death certificate, nominee documents",
    eligibility_summary_hi: "Registered driver, accident records, medical or death certificate, nominee documents",
    max_benefit_amount: 200000,
    benefit_unit: "INR",
    official_link: null,
  },
];

export const normalizeSchemeLevel = (level: string | null | undefined): "central" | "state" =>
  level === "central" ? "central" : "state";

export const mergeWithDefaultSchemes = <T extends WelfareScheme>(remoteSchemes: T[]): WelfareScheme[] => {
  const merged = new Map<string, WelfareScheme>();

  DEFAULT_WELFARE_SCHEMES.forEach((scheme) => {
    merged.set(scheme.title_en.toLowerCase(), scheme);
  });

  remoteSchemes.forEach((scheme) => {
    merged.set(scheme.title_en.toLowerCase(), scheme);
  });

  return Array.from(merged.values());
};
