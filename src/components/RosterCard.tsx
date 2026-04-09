import type { ReactNode } from "react";

/**
 * RosterCard — quiz question rendered as an NCAA-style roster card.
 * Jersey number top-left, position chip top-right, question in italic display,
 * answer rows below.
 */
export function RosterCard({
  number,
  position,
  children,
}: {
  number: number;
  position?: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-border bg-surface relative">
      {/* left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-ink" />

      {/* header strip */}
      <div className="flex items-start justify-between border-b border-border px-6 pt-5 pb-4">
        <div className="font-mono tabular text-5xl font-black leading-none text-ink">
          {String(number).padStart(2, "0")}
        </div>
        <div className="stat-label">{position ?? "Rep"}</div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

/**
 * Roster-style answer row used inside RosterCard.
 * Renders A/B/C/D label + answer text, with selected/correct/wrong states.
 */
export function AnswerRow({
  letter,
  text,
  state = "default",
  onClick,
  disabled,
}: {
  letter: string;
  text: string;
  state?: "default" | "selected" | "correct" | "wrong" | "muted";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = {
    default:
      "border-border bg-surface hover:bg-surface-2 hover:border-border-2 text-ink cursor-pointer",
    selected: "border-ink bg-surface-2 text-ink",
    correct: "border-good bg-good/5 text-ink",
    wrong: "border-bad bg-bad/5 text-ink",
    muted: "border-border bg-surface text-muted opacity-40",
  }[state];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-5 py-4 border-2 transition-all flex items-start gap-4 ${styles}`}
    >
      <span className="font-mono text-xs tabular pt-0.5 text-muted">
        {letter}
      </span>
      <span className="text-sm leading-snug">{text}</span>
    </button>
  );
}
