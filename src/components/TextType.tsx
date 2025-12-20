import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface TextTypeProps {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  className?: string;
}

const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 100,
  pauseDuration = 2000,
  showCursor = true,
  cursorCharacter = '|',
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    const currentText = text[currentTextIndex];

    if (!isDeleting) {
      // Typing
      if (currentCharIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + currentText[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Pause before deleting
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting
      if (currentCharIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, -1));
          setCurrentCharIndex(prev => prev - 1);
        }, typingSpeed / 2);
        return () => clearTimeout(timeout);
      } else {
        // Move to next text
        setIsDeleting(false);
        setCurrentTextIndex(prev => (prev + 1) % text.length);
      }
    }
  }, [currentCharIndex, isDeleting, currentTextIndex, text, typingSpeed, pauseDuration]);

  // Cursor blinking animation
  useEffect(() => {
    if (showCursor) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to('.cursor', { opacity: 0, duration: 0.5 })
        .to('.cursor', { opacity: 1, duration: 0.5 });
    }
  }, [showCursor]);

  return (
    <span className={`text-type ${className}`}>
      {displayedText}
      {showCursor && <span className="cursor">{cursorCharacter}</span>}
    </span>
  );
};

export default TextType;
