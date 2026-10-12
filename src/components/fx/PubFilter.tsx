"use client";

import { useEffect, useState } from "react";

/** Filter chips for the publications page. Without JavaScript every group stays visible. */
export default function PubFilter({ options, allLabel, label }: { options: { id: string; label: string; count: number }[]; allLabel: string; label: string }) {
  const [active, setActive] = useState("all");

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-pub-group]").forEach((el) => {
      el.hidden = active !== "all" && el.dataset.pubGroup !== active;
    });
  }, [active]);

  const total = options.reduce((s, o) => s + o.count, 0);
  return (
    <div className="chips" role="group" aria-label={label}>
      {[{ id: "all", label: allLabel, count: total }, ...options].map((o) => (
        <button key={o.id} type="button" className="chip" aria-pressed={active === o.id} onClick={() => setActive(o.id)}>
          {o.label}
          <span className="chip__count">{o.count}</span>
        </button>
      ))}
    </div>
  );
}
