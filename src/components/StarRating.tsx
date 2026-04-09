"use client";

type DifficultyLevel = {
  value: "easy" | "medium" | "hard";
  stars: 3 | 4 | 5;
  label: string;
  desc: string;
};

const LEVELS: DifficultyLevel[] = [
  { value: "easy", stars: 3, label: "Walk-On", desc: "Recall & terms" },
  { value: "medium", stars: 4, label: "Starter", desc: "Mixed difficulty" },
  { value: "hard", stars: 5, label: "All-American", desc: "Application & analysis" },
];

export function StarRating({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "easy" | "medium" | "hard") => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
      {LEVELS.map((lvl) => {
        const active = value === lvl.value;
        return (
          <button
            key={lvl.value}
            type="button"
            onClick={() => onChange(lvl.value)}
            className={`px-5 py-5 text-left transition-colors ${
              active
                ? "bg-ink text-bg"
                : "bg-surface hover:bg-surface-2 text-ink"
            }`}
          >
            <div className="flex items-center gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  filled={i < lvl.stars}
                  active={active}
                />
              ))}
            </div>
            <div
              className="display-up text-2xl"
              style={{
                color: active ? "var(--color-bg)" : "var(--color-ink)",
              }}
            >
              {lvl.label}
            </div>
            <div
              className={`text-[10px] uppercase tracking-wider mt-1 font-semibold ${
                active ? "text-bg/60" : "text-muted"
              }`}
            >
              {lvl.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Star({ filled, active }: { filled: boolean; active: boolean }) {
  const color = active
    ? filled
      ? "var(--color-bg)"
      : "rgba(0,0,0,0.2)"
    : filled
      ? "var(--color-ink)"
      : "var(--color-muted-2)";
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-3.5 h-3.5"
      fill={color}
      aria-hidden
    >
      <path d="M10 1l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L10 14.9 4.4 18.2l1.4-6.3L1 7.5l6.4-.6L10 1z" />
    </svg>
  );
}
