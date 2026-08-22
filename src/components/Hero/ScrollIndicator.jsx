export default function ScrollIndicator() {
  const handleClick = () => {
    const target = document.getElementById('interactive-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button className="scroll-indicator" onClick={handleClick} aria-label="Scroll to next section">
      <span className="scroll-indicator__text mono">SCROLL</span>
      <svg
        className="scroll-indicator__arrow"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
  );
}
