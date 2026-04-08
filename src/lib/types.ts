export type RouteSegment =
  | { type: "straight"; endX: number; endY: number }
  | { type: "curve"; endX: number; endY: number; controlX: number; controlY: number }
  | { type: "cut"; endX: number; endY: number };

export type Player = {
  label: string; // CFL: QB, RB, SB, WR, TE, C, G, T, DE, DT, LB, CB, S, HB
  side: "offense" | "defense";
  x: number; // 0-100
  y: number; // 0-100 (0 = defensive side, 100 = offensive backfield)
  route?: RouteSegment[];
};

export type CoverageZone = {
  label?: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color?: "red" | "blue" | "yellow";
};

export type GapLabel = {
  label: string; // "A", "B", "C", "D"
  x: number;
  y: number;
};

export type DiagramData = {
  title?: string;
  players: Player[];
  coverageZones?: CoverageZone[];
  gapLabels?: GapLabel[];
  lineOfScrimmageY?: number; // default 50
};

export type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  diagram?: DiagramData;
};
