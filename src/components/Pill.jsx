export default function Pill({ text, color = '#00d4aa', bg }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        color: color,
        background: bg || `${color}22`,
        marginInlineStart: 6,
      }}
    >
      {text}
    </span>
  );
}
