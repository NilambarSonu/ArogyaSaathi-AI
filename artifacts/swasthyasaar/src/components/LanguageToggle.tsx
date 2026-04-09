import { useLanguage } from "@/context/LanguageContext";

const options = [
  { value: "en" as const, label: "EN" },
  { value: "odia" as const, label: "ଓଡ଼ି" },
  { value: "hindi" as const, label: "हिं" },
];

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-muted rounded-lg p-0.5 border border-border" data-testid="language-toggle">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          data-testid={`lang-${opt.value}`}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            language === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
