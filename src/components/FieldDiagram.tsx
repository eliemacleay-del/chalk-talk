import type { DiagramData, Player, RouteSegment, CoverageZone, GapLabel } from "@/lib/types";

function clamp(v: number) {
  return Math.max(0, Math.min(100, v));
}

function buildRoutePath(startX: number, startY: number, segments: RouteSegment[]): string {
  let d = `M ${clamp(startX)} ${clamp(startY)}`;
  for (const seg of segments) {
    const ex = clamp(seg.endX);
    const ey = clamp(seg.endY);
    if (seg.type === "curve" && "controlX" in seg) {
      d += ` Q ${clamp(seg.controlX)} ${clamp(seg.controlY)} ${ex} ${ey}`;
    } else {
      d += ` L ${ex} ${ey}`;
    }
  }
  return d;
}

function FieldBackground({ losY }: { losY: number }) {
  const yardLines = [];
  for (let y = 10; y <= 100; y += 16.67) {
    yardLines.push(y);
  }

  return (
    <>
      {/* Field — dark bg */}
      <rect x="0" y="5" width="100" height="100" rx="2" fill="#141414" />

      {/* Yard lines */}
      {yardLines.map((y, i) => (
        <g key={i}>
          <line x1="2" y1={y} x2="98" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
          {/* Hash marks */}
          <line x1="35" y1={y - 1} x2="35" y2={y + 1} stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
          <line x1="65" y1={y - 1} x2="65" y2={y + 1} stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
        </g>
      ))}

      {/* Line of scrimmage */}
      <line
        x1="2" y1={losY} x2="98" y2={losY}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.4"
        strokeDasharray="2 1.5"
      />
    </>
  );
}

function CoverageZones({ zones }: { zones: CoverageZone[] }) {
  return (
    <>
      {zones.map((zone, i) => (
        <g key={i}>
          <ellipse
            cx={clamp(zone.x)}
            cy={clamp(zone.y)}
            rx={zone.radiusX}
            ry={zone.radiusY}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.3"
            strokeDasharray="1.5 1"
          />
          {zone.label && (
            <text
              x={clamp(zone.x)}
              y={clamp(zone.y)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.2)"
              fontSize="2.5"
              fontWeight="500"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {zone.label}
            </text>
          )}
        </g>
      ))}
    </>
  );
}

function GapLabels({ gaps }: { gaps: GapLabel[] }) {
  return (
    <>
      {gaps.map((gap, i) => (
        <text
          key={i}
          x={clamp(gap.x)}
          y={clamp(gap.y)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="3"
          fontWeight="bold"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {gap.label}
        </text>
      ))}
    </>
  );
}

function RoutePaths({ players }: { players: Player[] }) {
  return (
    <>
      {players
        .filter((p) => p.route && p.route.length > 0)
        .map((p, i) => (
          <path
            key={i}
            d={buildRoutePath(clamp(p.x), clamp(p.y), p.route!)}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#arrowhead)"
          />
        ))}
    </>
  );
}

function PlayerMarkers({ players }: { players: Player[] }) {
  return (
    <>
      {players.map((p, i) => {
        const x = clamp(p.x);
        const y = clamp(p.y);
        const isOffense = p.side === "offense";

        return (
          <g key={i}>
            {isOffense ? (
              // Offense: white filled circle
              <circle cx={x} cy={y} r="3" fill="white" />
            ) : (
              // Defense: white outline square
              <rect
                x={x - 2.8}
                y={y - 2.8}
                width="5.6"
                height="5.6"
                rx="0.5"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            )}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isOffense ? "#111" : "white"}
              fontSize="2.2"
              fontWeight="bold"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

export function FieldDiagram({ data }: { data: DiagramData }) {
  if (!data.players || data.players.length === 0) return null;

  const losY = data.lineOfScrimmageY ?? 50;

  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 100 115"
        width="100%"
        height="auto"
        className="rounded-xl border border-border overflow-hidden"
        style={{ background: "#0A0A0A" }}
      >
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="4"
            markerHeight="3"
            refX="3.5"
            refY="1.5"
            orient="auto"
          >
            <polygon points="0 0, 4 1.5, 0 3" fill="rgba(255,255,255,0.7)" />
          </marker>
        </defs>

        <FieldBackground losY={losY} />

        {data.coverageZones && <CoverageZones zones={data.coverageZones} />}
        {data.gapLabels && <GapLabels gaps={data.gapLabels} />}
        <RoutePaths players={data.players} />
        <PlayerMarkers players={data.players} />

        {data.title && (
          <text
            x="50"
            y="110"
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="2.8"
            fontWeight="500"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {data.title}
          </text>
        )}
      </svg>
    </div>
  );
}
