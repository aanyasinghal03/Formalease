export default function Disclaimer({ compact = false }) {
  if (compact) {
    return (
      <p className="text-xs text-charcoal/50 leading-relaxed">
        Informational prototype — estimates are illustrative and not a substitute for professional advice.
      </p>
    )
  }

  return (
    <div className="rounded-xl bg-sand/70 border border-charcoal/8 px-5 py-4 text-sm text-charcoal/70 leading-relaxed">
      <span className="font-semibold text-charcoal/85">Informational prototype: </span>
      Results are estimates based on the information provided and a curated prototype ruleset. Actual tax
      liability, registration requirements and scheme eligibility depend on current laws and individual
      circumstances.
    </div>
  )
}
