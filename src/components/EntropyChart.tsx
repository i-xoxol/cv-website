/**
 * Recipient entropy from the public G.H.O.S.T. results
 * (github.com/i-xoxol/GHOST-paper-data, results/results_entropy.csv):
 * 1,000 simulated recipients, 1,000 runs per setting.
 */
const results: { branching: number; points: [number, number][] }[] = [
  { branching: 2, points: [[3, 6.6641], [4, 7.7828], [5, 8.6477]] },
  { branching: 3, points: [[3, 8.4568], [4, 9.4177], [5, 9.8036]] },
  { branching: 4, points: [[3, 9.2713], [4, 9.8121], [5, 9.9297]] },
];

const MAX_BITS = Math.log2(1000);
const W = 360;
const H = 230;
const PAD = { left: 36, right: 92, top: 26, bottom: 40 };
const Y_MIN = 6;
const Y_MAX = 10.2;

const x = (depth: number) => PAD.left + ((depth - 3) / 2) * (W - PAD.left - PAD.right);
const y = (bits: number) => PAD.top + (1 - (bits - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);

export default function EntropyChart({
  title,
  caption,
  depthLabel,
  bitsLabel,
  branchingLabel,
  locale,
}: {
  title: string;
  caption: string;
  depthLabel: string;
  bitsLabel: string;
  branchingLabel: string;
  locale: "en" | "uk";
}) {
  const fmt = (n: number) => n.toLocaleString(locale === "uk" ? "uk-UA" : "en-US", { maximumFractionDigits: 2 });
  const description = results
    .map((s) => `${branchingLabel} ${s.branching}: ${s.points.map(([d, b]) => `${d} → ${fmt(b)}`).join(", ")}`)
    .join("; ");

  return (
    <figure className="chart">
      <p className="chart__title" id="entropy-title">
        {title}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="entropy-title" aria-describedby="entropy-desc">
        <desc id="entropy-desc">{description}</desc>
        {[6, 7, 8, 9, 10].map((b) => (
          <g key={b}>
            <line className="chart__grid" x1={PAD.left} x2={W - PAD.right} y1={y(b)} y2={y(b)} />
            <text className="chart__axis-label" x={PAD.left - 8} y={y(b) + 4} textAnchor="end">
              {b}
            </text>
          </g>
        ))}
        <line className="chart__max" x1={PAD.left} x2={W - PAD.right} y1={y(MAX_BITS)} y2={y(MAX_BITS)} />
        {[3, 4, 5].map((d) => (
          <text key={d} className="chart__axis-label" x={x(d)} y={H - PAD.bottom + 18} textAnchor="middle">
            {d}
          </text>
        ))}
        <text className="chart__axis-label" x={(PAD.left + W - PAD.right) / 2} y={H - 4} textAnchor="middle">
          {depthLabel}
        </text>
        <text className="chart__axis-label" x={PAD.left - 8} y={PAD.top - 14} textAnchor="end">
          {bitsLabel}
        </text>
        {results.map((s, i) => {
          const d = s.points.map(([dx, by], j) => `${j ? "L" : "M"}${x(dx)} ${y(by)}`).join("");
          const [lx, ly] = s.points[s.points.length - 1];
          const labelOffset = [0, 8, -8][i];
          return (
            <g key={s.branching}>
              <path className={`chart__line series-${i + 1}`} d={d} pathLength={1} />
              {s.points.map(([dx, by]) => (
                <circle key={dx} className={`series-${i + 1}`} cx={x(dx)} cy={y(by)} r={3.2} />
              ))}
              <text className={`chart__series-label series-${i + 1}`} x={x(lx) + 10} y={y(ly) + 4 + labelOffset}>
                {`${branchingLabel} ${s.branching}`}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
