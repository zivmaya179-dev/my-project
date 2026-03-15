import { PHASE_COLORS } from '../data/buildPlan';

export default function DependencyArrows({ phases }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      {phases.map((phase, i) => {
        const done = phase.tasks.filter((t) => t.done).length;
        const total = phase.tasks.length;
        const pct = total ? Math.round((done / total) * 100) : 0;

        return (
          <div key={phase.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                background: '#0f1923',
                border: `2px solid ${phase.color}`,
                borderRadius: 12,
                padding: '12px 20px',
                textAlign: 'center',
                minWidth: 140,
              }}
            >
              <div style={{ fontSize: 11, color: '#8b9dc3', marginBottom: 2 }}>
                שבועות {phase.weekStart}-{phase.weekEnd}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: phase.color, marginBottom: 6 }}>
                {phase.nameHe.split('—')[0].trim()}
              </div>
              <div style={{ fontSize: 12, color: '#c8d6e5' }}>
                {done}/{total} ({pct}%)
              </div>
              {/* Mini progress */}
              <div style={{ height: 4, background: '#1a2535', borderRadius: 2, marginTop: 6 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: phase.color,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
            {i < phases.length - 1 && (
              <div style={{ padding: '0 8px', fontSize: 20, color: '#8b9dc3' }}>←</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
