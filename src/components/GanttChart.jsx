import { WEEKS_TOTAL } from '../data/buildPlan';
import Pill from './Pill';

const CELL_W = 72;
const ROW_H = 32;
const LABEL_W = 200;

export default function GanttChart({ phases, selectedPhase, onSelectPhase, onToggleTask }) {
  const weeks = Array.from({ length: WEEKS_TOTAL }, (_, i) => i + 1);

  return (
    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
      <div style={{ minWidth: LABEL_W + WEEKS_TOTAL * CELL_W + 40 }}>
        {/* Week headers */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ width: LABEL_W, flexShrink: 0, fontSize: 12, color: '#8b9dc3', paddingInlineStart: 8 }}>
            משימה
          </div>
          {weeks.map((w) => (
            <div
              key={w}
              style={{
                width: CELL_W,
                flexShrink: 0,
                textAlign: 'center',
                fontSize: 11,
                color: '#8b9dc3',
                borderInlineStart: '1px solid #1a2535',
              }}
            >
              שבוע {w}
            </div>
          ))}
        </div>

        {/* Phase groups */}
        {phases.map((phase) => (
          <div key={phase.id}>
            {/* Phase header row */}
            <div
              onClick={() => onSelectPhase(phase.id === selectedPhase ? null : phase.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: selectedPhase === phase.id ? `${phase.color}15` : '#0f1923',
                borderRadius: 6,
                marginBottom: 2,
                cursor: 'pointer',
                borderInlineStart: `3px solid ${phase.color}`,
                transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  width: LABEL_W,
                  flexShrink: 0,
                  padding: '6px 8px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: phase.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: selectedPhase === phase.id ? 'rotate(90deg)' : 'rotate(0)' }}>
                  ◀
                </span>
                {phase.nameHe}
                <Pill
                  text={`${phase.tasks.filter((t) => t.done).length}/${phase.tasks.length}`}
                  color={phase.color}
                />
              </div>
              {/* Phase bar spanning its weeks */}
              {weeks.map((w) => (
                <div
                  key={w}
                  style={{
                    width: CELL_W,
                    height: ROW_H,
                    flexShrink: 0,
                    borderInlineStart: '1px solid #1a2535',
                    background: w >= phase.weekStart && w <= phase.weekEnd ? `${phase.color}25` : 'transparent',
                  }}
                />
              ))}
            </div>

            {/* Task rows (visible when phase is selected) */}
            {selectedPhase === phase.id &&
              phase.tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 1,
                    opacity: task.done ? 0.5 : 1,
                  }}
                >
                  <div
                    style={{
                      width: LABEL_W,
                      flexShrink: 0,
                      padding: '4px 8px 4px 24px',
                      fontSize: 12,
                      color: '#c8d6e5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => onToggleTask(phase.id, task.id)}
                      style={{ accentColor: phase.color, cursor: 'pointer' }}
                    />
                    <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.nameHe}
                    </span>
                    {task.required && (
                      <Pill text="חובה" color="#ff4757" />
                    )}
                  </div>
                  {weeks.map((w) => {
                    const isInRange = w >= task.weekStart && w <= task.weekEnd;
                    return (
                      <div
                        key={w}
                        style={{
                          width: CELL_W,
                          height: ROW_H - 4,
                          flexShrink: 0,
                          borderInlineStart: '1px solid #1a2535',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isInRange && (
                          <div
                            style={{
                              width: '90%',
                              height: 14,
                              borderRadius: 7,
                              background: task.done
                                ? `${phase.color}88`
                                : task.required
                                ? phase.color
                                : `${phase.color}55`,
                              border: !task.required && !task.done ? `1px dashed ${phase.color}` : 'none',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
