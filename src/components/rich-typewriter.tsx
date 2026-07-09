'use client';

import { useEffect, useMemo, useState } from 'react';

type RichTypewriterProps = {
  text: string;
  italicTexts?: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseAfterTyping?: number;
  pauseAfterDeleting?: number;
  loop?: boolean;
  className?: string;
};

export default function RichTypewriter({
  text,
  italicTexts = [],
  speed = 35,
  deleteSpeed = 20,
  pauseAfterTyping = 1800,
  pauseAfterDeleting = 400,
  loop = true,
  className,
}: RichTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let index = 0;
    let deleting = false;

    const runTypewriter = () => {
      if (!deleting) {
        index += 1;
        setDisplayedText(text.slice(0, index));

        if (index >= text.length) {
          if (!loop) return;

          deleting = true;
          timeout = setTimeout(runTypewriter, pauseAfterTyping);
          return;
        }

        timeout = setTimeout(runTypewriter, speed);
        return;
      }

      index -= 1;
      setDisplayedText(text.slice(0, index));

      if (index <= 0) {
        deleting = false;
        timeout = setTimeout(runTypewriter, pauseAfterDeleting);
        return;
      }

      timeout = setTimeout(runTypewriter, deleteSpeed);
    };

    timeout = setTimeout(runTypewriter, speed);

    return () => clearTimeout(timeout);
  }, [text, speed, deleteSpeed, pauseAfterTyping, pauseAfterDeleting, loop]);

  const pattern = useMemo(() => {
    if (!italicTexts.length) return null;

    const escaped = italicTexts.map((item) =>
      item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    return new RegExp(`(${escaped.join('|')})`, 'g');
  }, [italicTexts]);

  const renderedText = pattern
    ? displayedText.split(pattern).map((part, index) =>
        italicTexts.includes(part) ? (
          <em key={`${part}-${index}`} className="italic">
            {part}
          </em>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )
    : displayedText;

  return (
    <span className={className}>
      {renderedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}