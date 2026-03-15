import Pill from './Pill';

export default function PhaseDetail({ phase, onToggleTask }) {
  if (!phase) return null;

  const done = phase.tasks.filter((t) => t.done).length;
  const total = phase.tasks.length;
  const requiredLeft = phase.tasks.filter((t) => t.required && !t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div
      style={{
        background: '#0f1923',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        border: `1px solid ${phase.color}33`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, color: phase.color }}>{phase.nameHe}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Pill text={`${done}/${total} הושלמו`} color={phase.color} />
          {requiredLeft > 0 && <Pill text={`${requiredLeft} חובה נותרו`} color="#ff4757" />}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: '#1a2535', borderRadius: 3, marginBottom: 16 }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: phase.color,
            borderRadius: 3,
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Task list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
        {phase.tasks.map((task) => (
          <label
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 8,
              background: task.done ? `${phase.color}10` : '#0b1426',
              cursor: 'pointer',
              border: task.required && !task.done ? `1px solid ${phase.color}44` : '1px solid transparent',
              opacity: task.done ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggleTask(phase.id, task.id)}
              style={{ accentColor: phase.color, cursor: 'pointer' }}
            />
            <span
              style={{
                fontSize: 13,
                color: '#c8d6e5',
                textDecoration: task.done ? 'line-through' : 'none',
                flex: 1,
              }}
            >
              {task.nameHe}
            </span>
            {task.required && <Pill text="חובה" color="#ff4757" />}
            <span style={{ fontSize: 11, color: '#8b9dc3' }}>
              {task.weekStart === task.weekEnd ? `ש׳${task.weekStart}` : `ש׳${task.weekStart}-${task.weekEnd}`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
