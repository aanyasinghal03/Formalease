// Mock result shape. The frontend renders everything dynamically from this
// object — swap analysisService's mock branch for a real API call later
// without touching any component.

export const FIELD_LABELS = {
  businessType: 'Business type',
  businessCategory: 'Business category',
  location: 'Location',
  monthlyRevenue: 'Revenue',
  employees: 'Employees',
}

// Very small keyword heuristic so the prototype "understands" free text
// without a backend. Replace with a real NLP/LLM call later.
const CATEGORY_RULES = [
  { keywords: ['bak', 'cake', 'cook', 'food', 'tiffin', 'catering', 'snack'], type: 'Home Bakery', category: 'Food & Beverage', emoji: '🧁' },
  { keywords: ['tailor', 'stitch', 'boutique', 'clothing', 'garment'], type: 'Tailoring & Garments', category: 'Apparel & Textiles', emoji: '✂️' },
  { keywords: ['retail', 'shop', 'store', 'sell'], type: 'Retail Shop', category: 'Retail & Trade', emoji: '🛍️' },
  { keywords: ['street food', 'cart', 'stall', 'vendor'], type: 'Street Food Vendor', category: 'Food & Beverage', emoji: '🍲' },
  { keywords: ['handmade', 'craft', 'art', 'jewel', 'pottery'], type: 'Handmade Products', category: 'Arts & Crafts', emoji: '🎨' },
  { keywords: ['salon', 'beauty', 'parlour', 'parlor'], type: 'Beauty & Salon Services', category: 'Personal Services', emoji: '💇' },
  { keywords: ['consult', 'freelance', 'design', 'develop'], type: 'Freelance Services', category: 'Professional Services', emoji: '💼' },
]

const INDIAN_STATE_HINTS = [
  'rajasthan', 'jaipur', 'maharashtra', 'mumbai', 'delhi', 'karnataka', 'bengaluru', 'bangalore',
  'tamil nadu', 'chennai', 'gujarat', 'ahmedabad', 'west bengal', 'kolkata', 'uttar pradesh', 'lucknow',
  'telangana', 'hyderabad', 'kerala', 'punjab', 'haryana', 'pune',
]

export function extractSignalsFromText(description) {
  const text = (description || '').toLowerCase()
  const match = CATEGORY_RULES.find((rule) => rule.keywords.some((k) => text.includes(k)))

  const locationHit = INDIAN_STATE_HINTS.find((place) => text.includes(place))

  const revenueMatch = text.match(/(?:₹|rs\.?|inr)?\s?([\d,]{4,7})\s?(?:per month|\/month|monthly|a month|pm)?/i)
  let monthlyRevenue = null
  if (revenueMatch) {
    const num = parseInt(revenueMatch[1].replace(/,/g, ''), 10)
    if (!Number.isNaN(num) && num >= 1000 && num <= 5000000) monthlyRevenue = num
  }

  const employeeMatch = text.match(/(\d+)\s?(?:employees?|people|staff|workers?)/i)
  const employees = employeeMatch ? parseInt(employeeMatch[1], 10) : null

  return {
    businessType: match?.type || null,
    businessCategory: match?.category || null,
    emoji: match?.emoji || '🏪',
    location: locationHit ? locationHit.replace(/\b\w/g, (c) => c.toUpperCase()) : null,
    monthlyRevenue,
    employees,
  }
}

export function computeCompleteness(fields) {
  const keys = ['businessType', 'businessCategory', 'location', 'monthlyRevenue', 'employees']
  const found = keys.filter((k) => fields[k] !== null && fields[k] !== undefined && fields[k] !== '')
  const percent = Math.round((found.length / keys.length) * 100)
  return {
    percent,
    foundCount: found.length,
    totalCount: keys.length,
    missing: keys.filter((k) => !found.includes(k)),
    found,
  }
}

export function buildMockAnalysisResult(fields) {
  const { businessType, businessCategory, emoji, location, monthlyRevenue, employees } = fields
  const completeness = computeCompleteness(fields)
  const annualRevenue = monthlyRevenue ? monthlyRevenue * 12 : null

  // Very rough illustrative estimate — never presented as a real liability figure.
  const illustrativeTax = annualRevenue ? Math.round(annualRevenue * 0.05) : null

  const qualityLevel =
    completeness.percent >= 80 ? 'Good' : completeness.percent >= 40 ? 'Indicative' : 'Needs more information'

  return {
    profile: {
      businessType: businessType || 'Small Business',
      businessCategory: businessCategory || 'General',
      emoji,
      location: location || 'Not specified',
      monthlyRevenue,
      annualRevenue,
      employees,
    },
    completeness,
    quality: {
      level: qualityLevel,
      explanation:
        completeness.percent >= 80
          ? 'Your result is based on business type, location and revenue.'
          : 'This result is indicative because some key information is missing.',
    },
    formalizationPath: [
      { key: 'identified', title: 'Business Identified', description: 'We understood what your business does.', status: 'done' },
      { key: 'registration', title: 'Registration', description: 'Formal registration establishes your business identity.', status: location ? 'relevant' : 'check' },
      { key: 'compliance', title: 'Tax & Compliance', description: 'Obligations that may apply based on your profile.', status: 'check' },
      { key: 'benefits', title: 'Benefits', description: 'Schemes and credit access you may be able to explore.', status: 'relevant' },
      { key: 'growth', title: 'Growth', description: 'What formalization unlocks as your business scales.', status: 'upcoming' },
    ],
    compliance: [
      {
        key: 'registration',
        title: 'Business Registration',
        status: 'Likely Relevant',
        explanation: 'Formal registration can establish your business identity and may help with access to formal services and schemes.',
      },
      {
        key: 'gst',
        title: 'GST',
        status: 'Check Applicability',
        explanation: 'GST registration depends on factors such as turnover, business activity, location and applicable rules.',
      },
      {
        key: 'incomeTax',
        title: 'Income Tax',
        status: 'Depends on Income',
        explanation: 'Your actual tax liability depends on income, expenses, business structure and applicable rules.',
      },
    ],
    obligationSummary: illustrativeTax
      ? {
          available: true,
          total: illustrativeTax,
          breakdown: [
            { label: 'Registration', value: 0, note: 'applicable registration guidance' },
            { label: 'Tax', value: Math.round(illustrativeTax * 0.85) },
            { label: 'Other', value: Math.round(illustrativeTax * 0.15) },
          ],
        }
      : { available: false },
    whatThisMeans:
      "You don't need to become a tax expert. Based on what you've told us, your main focus should be understanding the applicable registration, confirming your tax obligations and checking which government schemes may be relevant.",
    benefits: [
      {
        key: 'credit',
        icon: '🏦',
        title: 'Formal Credit',
        description: 'Potential access to eligible business credit and loan programs.',
        badge: 'Potential benefit',
        eligibility: 'Typically requires business registration and basic financial records.',
        source: 'Reserve Bank of India — priority sector lending guidelines',
      },
      {
        key: 'schemes',
        icon: '🏛',
        title: 'Government Schemes',
        description: 'Potentially relevant government support schemes for small businesses.',
        badge: '3 potential matches',
        eligibility: 'Eligibility varies by scheme, turnover and business category.',
        source: 'Ministry of MSME',
      },
      {
        key: 'growth',
        icon: '📈',
        title: 'Business Growth',
        description: 'Formal documentation can help with expansion and access to services.',
        badge: 'Long-term',
        eligibility: 'Available once basic registration is complete.',
        source: 'MSME Development Institute',
      },
      {
        key: 'subsidy',
        icon: '💰',
        title: 'Subsidies / Support',
        description: 'Potential programs depending on eligibility.',
        badge: 'Check eligibility',
        eligibility: 'Depends on category, location and business type.',
        source: 'State industries department',
      },
    ],
    actionPlan: [
      { step: 1, title: 'Complete the relevant registration', description: 'Start with the registration most applicable to your business type.', status: 'Recommended' },
      { step: 2, title: 'Confirm your applicable tax obligations', description: 'Check current thresholds and rules that apply to your revenue level.', status: 'Recommended' },
      { step: 3, title: 'Explore your matched benefits', description: 'Review the schemes and credit programs that may be relevant.', status: 'Optional' },
    ],
  }
}
