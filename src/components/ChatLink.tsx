'use client';

export default function ChatLink({ label, question }: { label: string; question: string }) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const w = window as unknown as { AncestroWidget?: { open: () => void } };
    if (w.AncestroWidget) {
      w.AncestroWidget.open();
    }
  }

  return (
    <button type="button" onClick={handleClick} className="footer-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit', textAlign: 'left' }}>
      {label}
    </button>
  );
}
