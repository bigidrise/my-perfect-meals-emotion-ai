import { useId, useState, useMemo } from "react";

const MAP: Record<string, { label: string; desc: string }> = {
  heart:        { label: "Heart-friendly",    desc: "Better for heart health" },
  sugar_low:    { label: "Lower sugar",       desc: "Lower in added sugar" },
  sodium_low:   { label: "Lower sodium",      desc: "Lower in sodium" },
  fiber_high:   { label: "High fiber",        desc: "High in fiber" },
  protein_high: { label: "High protein",      desc: "High in protein" },
  balanced:     { label: "Balanced",          desc: "Balanced protein, carbs, and fat" },
  allergen:     { label: "Allergen",          desc: "Contains common allergens" },
  glp1_friendly:{ label: "GLP-1 friendly",    desc: "Helps GLP-1 goals" },
};

function normalize(keys?: string[]): {key:string,label:string,desc:string}[] {
  if (!keys?.length) return [];
  return keys
    .filter(k => k != null && k !== "") // Remove undefined, null, and empty strings
    .map(k => {
      const canon =
        k in MAP ? k :
        k === "low_sugar" ? "sugar_low" :
        k === "low_sodium" ? "sodium_low" :
        k === "high_fiber" ? "fiber_high" :
        k === "high_protein" ? "protein_high" :
        k;
      const meta = MAP[canon] ?? { label: canon.replace(/_/g," "), desc: "" };
      return { key: canon, label: meta.label, desc: meta.desc };
    })
    .filter((v, i, a) => a.findIndex(x => x.key === v.key) === i);
}

export default function HealthBadgesDropdown({
  badges,
  className = "",
  buttonLabel = "Health Badges",
}: {
  badges?: string[];
  className?: string;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const items = useMemo(() => normalize(badges), [badges]);
  const count = items.length;

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={listId}
        className="w-full px-3 py-2 rounded-2xl bg-black text-white text-sm border border-white/15 shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/30"
        data-testid="button-health-badges"
      >
        {buttonLabel}{count ? ` (${count})` : ""}
        <span className="float-right">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          id={listId}
          className="mt-2 rounded-2xl bg-black/80 text-white border border-white/10 p-3 space-y-2 text-sm"
        >
          {count === 0 ? (
            <div data-testid="text-no-badges">No health badges for this meal.</div>
          ) : (
            items.map(item => (
              <div key={item.key} className="flex items-start gap-2" data-testid={`badge-row-${item.key}`}>
                <span className="inline-flex h-2 w-2 rounded-full bg-white/70 mt-1.5" />
                <div>
                  <div className="font-medium" data-testid={`text-badge-label-${item.key}`}>{item.label}</div>
                  {item.desc && <div className="text-white/80" data-testid={`text-badge-desc-${item.key}`}>{item.desc}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
