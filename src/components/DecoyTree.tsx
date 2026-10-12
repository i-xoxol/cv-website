/**
 * A radial routing tree in the style of G.H.O.S.T.: one real message (the
 * highlighted route) is hidden among decoy deliveries. Branching 3, depth 4,
 * so 81 deliveries. Geometry is computed once and rendered as static SVG.
 */

const SIZE = 500;
const C = SIZE / 2;
const BRANCHING = 3;
const DEPTH = 4;
const PORTRAIT_R = 62;
const RADII = [0, 104, 150, 196, 238];
const REAL_LEAF = 14;

interface TreeNode {
  depth: number;
  angle: number;
  index: number;
  parent: TreeNode | null;
  children: TreeNode[];
}

const leafCount = BRANCHING ** DEPTH;
const step = (Math.PI * 2) / leafCount;

function build(depth: number, firstLeaf: number, parent: TreeNode | null): TreeNode {
  const node: TreeNode = { depth, angle: 0, index: firstLeaf, parent, children: [] };
  if (depth === DEPTH) {
    node.angle = -Math.PI / 2 + (firstLeaf + 0.5) * step;
    return node;
  }
  const span = BRANCHING ** (DEPTH - depth - 1);
  for (let i = 0; i < BRANCHING; i++) {
    node.children.push(build(depth + 1, firstLeaf + i * span, node));
  }
  node.angle = node.children.reduce((sum, c) => sum + c.angle, 0) / node.children.length;
  return node;
}

const root = build(0, 0, null);

const r2 = (n: number) => Math.round(n * 100) / 100;

function point(radius: number, angle: number): [number, number] {
  return [r2(C + radius * Math.cos(angle)), r2(C + radius * Math.sin(angle))];
}

function edge(child: TreeNode): string {
  const parent = child.parent!;
  const rp = parent.depth === 0 ? PORTRAIT_R + 2 : RADII[parent.depth];
  const rc = RADII[child.depth];
  const startAngle = parent.depth === 0 ? child.angle : parent.angle;
  const [x1, y1] = point(rp, startAngle);
  const [x2, y2] = point(rc, child.angle);
  if (parent.depth === 0) return `M${x1} ${y1}L${x2} ${y2}`;
  const mid = (rp + rc) / 2;
  const [c1x, c1y] = point(mid, parent.angle);
  const [c2x, c2y] = point(mid, child.angle);
  return `M${x1} ${y1}C${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`;
}

const all: TreeNode[] = [];
(function walk(n: TreeNode) {
  all.push(n);
  n.children.forEach(walk);
})(root);

const leaves = all.filter((n) => n.depth === DEPTH);
const realLeaf = leaves[REAL_LEAF];
const realPath: TreeNode[] = [];
for (let n: TreeNode | null = realLeaf; n && n.parent; n = n.parent) realPath.unshift(n);
const onRealPath = new Set(realPath);

const decoyEdges = all.filter((n) => n.parent && !onRealPath.has(n)).map(edge).join("");
const realEdge = realPath.map(edge).join("");
const internal = all.filter((n) => n.depth > 0 && n.depth < DEPTH);
const [rx, ry] = point(RADII[DEPTH], realLeaf.angle);

export default function DecoyTree({ title, portrait }: { title: string; portrait: string }) {
  return (
    <svg className="tree" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby="tree-title">
      <title id="tree-title">{title}</title>
      <defs>
        <clipPath id="tree-portrait">
          <circle cx={C} cy={C} r={PORTRAIT_R} />
        </clipPath>
      </defs>
      <path className="tree__decoy" d={decoyEdges} />
      {internal.map((n) => {
        const [x, y] = point(RADII[n.depth], n.angle);
        return onRealPath.has(n) ? null : <circle key={`n${n.depth}-${n.index}`} className="tree__node" cx={x} cy={y} r={3} />;
      })}
      {leaves.map((n) => {
        if (n === realLeaf) return null;
        const [x, y] = point(RADII[DEPTH], n.angle);
        return <circle key={`l${n.index}`} className="tree__leaf" cx={x} cy={y} r={2.6} />;
      })}
      <path className="tree__real" d={realEdge} pathLength={1} />
      {realPath.slice(0, -1).map((n) => {
        const [x, y] = point(RADII[n.depth], n.angle);
        return <circle key={`r${n.depth}`} className="tree__real-node" cx={x} cy={y} r={4} />;
      })}
      <circle className="tree__recipient-ring" cx={rx} cy={ry} r={11} />
      <circle className="tree__recipient" cx={rx} cy={ry} r={5.5} />
      <image
        href={portrait}
        x={C - PORTRAIT_R}
        y={C - PORTRAIT_R}
        width={PORTRAIT_R * 2}
        height={PORTRAIT_R * 2}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#tree-portrait)"
      />
      <circle className="tree__portrait-edge" cx={C} cy={C} r={PORTRAIT_R + 0.5} />
    </svg>
  );
}
