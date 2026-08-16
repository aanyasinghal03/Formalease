import { buildMockAnalysisResult, extractSignalsFromText } from '../data/mockAnalysis'

// The backend will eventually expose POST /api/analyze with:
//   { description, location, monthly_revenue, employees }
//
// To switch from mock data to the real API once it's available:
//   1. `npm install axios`
//   2. Uncomment the axios import and the API branch below.
//   3. Set VITE_USE_MOCK_ANALYSIS=false in your .env
//
// No component needs to change — they only call analyzeBusiness().

const USE_MOCK = true // flip to false once /api/analyze is live

// import axios from 'axios'

export function detectSignals(description) {
  return extractSignalsFromText(description)
}

export async function analyzeBusiness(fields) {
  if (USE_MOCK) {
    // Simulate network latency so the loading sequence feels real.
    await new Promise((resolve) => setTimeout(resolve, 400))
    return buildMockAnalysisResult(fields)
  }

  // const { data } = await axios.post('/api/analyze', {
  //   description: fields.description,
  //   location: fields.location ?? null,
  //   monthly_revenue: fields.monthlyRevenue ?? null,
  //   employees: fields.employees ?? null,
  // })
  // return data
}
