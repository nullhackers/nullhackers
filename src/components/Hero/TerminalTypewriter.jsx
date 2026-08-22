import { useState, useEffect, useRef, useCallback } from 'react';

const LINES = [
  { prompt: '$ ', text: 'whoami', pauseAfter: 3000 },
  { prompt: '$ ', text: 'scanning the internet...', pauseAfter: 800 },
  { prompt: '$ ', text: 'access granted', pauseAfter: 1200 },
  { prompt: '$ ', text: 'root@nullhackers:~$', pauseAfter: null }, // idle
];

const CHAR_DELAY = 50;

export default function TerminalTypewriter({ onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const termRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [displayedLines, currentCharIndex]);

  // Typing logic
  useEffect(() => {
    if (currentLineIndex >= LINES.length) {
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    const line = LINES[currentLineIndex];
    const fullText = line.text;

    if (reducedMotion.current) {
      // Skip animation, show all at once
      setDisplayedLines(LINES.map(l => l.prompt + l.text));
      setCurrentLineIndex(LINES.length);
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    if (currentCharIndex <= fullText.length) {
      const typingTimeout = setTimeout(() => {
        if (currentCharIndex === fullText.length) {
          // Line complete
          setDisplayedLines(prev => {
            const updated = [...prev];
            updated[currentLineIndex] = line.prompt + fullText;
            return updated;
          });

          if (line.pauseAfter === null) {
            // Final idle line
            setIsTyping(false);
            if (onComplete) onComplete();
            return;
          }

          // Pause then advance
          setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
            setCurrentCharIndex(0);
          }, line.pauseAfter);
        } else {
          // Type next char
          setDisplayedLines(prev => {
            const updated = [...prev];
            updated[currentLineIndex] = line.prompt + fullText.slice(0, currentCharIndex + 1);
            return updated;
          });
          setCurrentCharIndex(prev => prev + 1);
        }
      }, CHAR_DELAY);

      return () => clearTimeout(typingTimeout);
    }
  }, [currentLineIndex, currentCharIndex, onComplete]);

  return (
    <div className="terminal glass" ref={termRef}>
      <div className="terminal__header">
        <span className="terminal__dot terminal__dot--red"></span>
        <span className="terminal__dot terminal__dot--yellow"></span>
        <span className="terminal__dot terminal__dot--green"></span>
        <span className="terminal__title mono">nullhackers@root</span>
      </div>
      <div className="terminal__body mono">
        {displayedLines.map((line, i) => (
          <div key={i} className="terminal__line">
            <span className="terminal__text">{line}</span>
            {i === currentLineIndex && !isTyping && currentLineIndex === LINES.length - 1 && (
              <span className={`terminal__cursor ${cursorVisible ? 'visible' : ''}`}>▊</span>
            )}
            {i === currentLineIndex && isTyping && (
              <span className={`terminal__cursor ${cursorVisible ? 'visible' : ''}`}>▊</span>
            )}
          </div>
        ))}
        {/* Show cursor on idle final line */}
        {!isTyping && currentLineIndex >= LINES.length && displayedLines.length > 0 && (
          <div className="terminal__line">
            <span className={`terminal__cursor ${cursorVisible ? 'visible' : ''}`}>▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
