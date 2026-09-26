import { getArchiveStats } from "@/lib/archive/stats";

export function ArchiveStatsBar() {
  const stats = getArchiveStats();

  return (
    <div className="archive-stats-bar">
      <div className="archive-stats-inner">
        {stats.map((stat) => (
          <div key={stat.label} className="archive-stat">
            <span className="archive-stat-value">{stat.value}</span>
            <span className="archive-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
