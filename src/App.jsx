import { useState, useCallback } from 'react';
import { phases as initialPhases, getStats } from './data/buildPlan';
import Stats from './components/Stats';
import GanttChart from './components/GanttChart';
import PhaseDetail from './components/PhaseDetail';
import DependencyArrows from './components/DependencyArrows';

export default function App() {
  const [phases, setPhases] = useState(initialPhases);
  const [selectedPhase, setSelectedPhase] = useState(null);

  const toggleTask = useCallback((phaseId, taskId) => {
    setPhases((prev) =>
      prev.map((p) =>
        p.id === phaseId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : p
      )
    );
  }, []);

  const stats = getStats(phases);
  const activePhase = selectedPhase !== null ? phases.find((p) => p.id === selectedPhase) : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1426',
        color: '#c8d6e5',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        padding: '24px 32px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff' }}>
            iNTERSKEP — תוכנית בנייה
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8b9dc3' }}>
            11 שבועות · 4 phases · {stats.total} משימות · {stats.required} חובה
          </p>
        </div>
        <div
          style={{
            background: '#0f1923',
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 14,
            color: stats.percent >= 80 ? '#00d4aa' : stats.percent >= 40 ? '#f5b731' : '#ff4757',
            fontWeight: 700,
            border: '1px solid #1a2535',
          }}
        >
          {stats.percent}% הושלם
        </div>
      </div>

      {/* Stats */}
      <Stats stats={stats} />

      {/* Dependency flow */}
      <DependencyArrows phases={phases} />

      {/* Gantt */}
      <div
        style={{
          background: '#0f1923',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          border: '1px solid #1a253544',
        }}
      >
        <h2 style={{ margin: '0 0 12px', fontSize: 16, color: '#fff' }}>תרשים גאנט</h2>
        <GanttChart
          phases={phases}
          selectedPhase={selectedPhase}
          onSelectPhase={setSelectedPhase}
          onToggleTask={toggleTask}
        />
      </div>

      {/* Phase detail */}
      {activePhase && <PhaseDetail phase={activePhase} onToggleTask={toggleTask} />}
    </div>
  );
}
