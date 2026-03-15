export default function Stats({ stats }) {
  const cards = [
    { label: 'סה״כ משימות', value: stats.total, color: '#8b9dc3' },
    { label: 'חובה', value: stats.required, color: '#ff4757' },
    { label: 'הושלמו', value: stats.done, color: '#00d4aa' },
    { label: 'התקדמות', value: `${stats.percent}%`, color: '#f5b731' },
  ];

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            flex: '1 1 140px',
            background: '#0f1923',
            borderRadius: 12,
            padding: '16px 20px',
            border: `1px solid ${c.color}33`,
          }}
        >
          <div style={{ fontSize: 13, color: '#8b9dc3', marginBottom: 4 }}>{c.label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
