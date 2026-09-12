export function Sparkline({
  points,
  className,
}: {
  points: number[];
  className?: string;
}) {
  if (points.length < 2) {
    return (
      <p className="text-sm text-white/45">
        Log a weekly review to see the trend.
      </p>
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 320;
  const h = 96;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 12) - 6;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className ?? "h-24 w-full text-[#e8b44d]"}
      aria-hidden
    >
      <path d={area} fill="currentColor" className="opacity-15" />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[24px] bg-white/5 p-5">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 font-sans text-3xl font-black tracking-tight text-white">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-[#e8b44d]">{hint}</p> : null}
    </div>
  );
}
