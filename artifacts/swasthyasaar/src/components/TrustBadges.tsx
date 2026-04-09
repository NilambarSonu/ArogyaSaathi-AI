import { CheckCircle2 } from "lucide-react";

const badges = [
  { label: "ABHA Linked", colorClass: "bg-green-100 text-green-700 border-green-200" },
  { label: "Ayushman Ready", colorClass: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "NHM Compliant", colorClass: "bg-teal-100 text-teal-700 border-teal-200" },
];

export function TrustBadges() {
  return (
    <div className="mb-6">
      <p className="text-xs text-muted-foreground mb-2 font-medium">Platform Certifications</p>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b.label}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${b.colorClass}`}
          >
            <CheckCircle2 className="w-3 h-3" />
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}
