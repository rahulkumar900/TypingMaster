import React, { useEffect, useState } from 'react';
import { LayoutId } from '@/lib/transliterate';
import { KRUTIDEV_010_MAP, REMINGTON_GAIL_MAP } from '@/lib/maps';
import { HINDI_INSCRIPT_MAP } from '@/lib/mappings/hindi';

interface VirtualKeyboardProps {
  layoutId: LayoutId;
  fontFamily?: string;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
  ['Space']
];

// Base US layout shifted characters for lookup in simple string maps
const SHIFT_MAP: Record<string, string> = {
  '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
  '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?'
};

// Helper to get the mapped character for a physical key
function getMappedChar(layoutId: LayoutId, physicalKey: string, isShift: boolean, isAlt: boolean): string {
  if (physicalKey.length > 1 && physicalKey !== 'Space') return physicalKey; // Special keys

  if (layoutId === 'MANGAL_GAIL') {
    let lookupKey = physicalKey;
    if (isShift && SHIFT_MAP[physicalKey]) lookupKey = SHIFT_MAP[physicalKey];
    else if (isShift && physicalKey.match(/[a-z]/)) lookupKey = physicalKey.toUpperCase();

    if (isAlt && isShift) {
      return (REMINGTON_GAIL_MAP.altShift as Record<string, string>)[lookupKey] || '';
    } else if (isAlt) {
      return (REMINGTON_GAIL_MAP.alt as Record<string, string>)[lookupKey] || '';
    } else if (isShift) {
      return (REMINGTON_GAIL_MAP.shift as Record<string, string>)[lookupKey] || '';
    } else {
      return (REMINGTON_GAIL_MAP.default as Record<string, string>)[lookupKey] || '';
    }
  }

  // Generic lookup for map-based layouts (Inscript, KrutiDev)
  let lookupKey = physicalKey;
  if (isShift) {
    lookupKey = SHIFT_MAP[physicalKey] || physicalKey.toUpperCase();
  }
  
  if (layoutId === 'KRUTIDEV_010') {
    return KRUTIDEV_010_MAP[lookupKey] || '';
  }
  
  if (layoutId === 'MANGAL_INSCRIPT') {
     return HINDI_INSCRIPT_MAP[lookupKey] || '';
  }

  // Fallback for OS_DEFAULT or unsupported
  return isShift ? lookupKey : physicalKey;
}

export function VirtualKeyboard({ layoutId, fontFamily }: VirtualKeyboardProps) {
  const [shiftPressed, setShiftPressed] = useState(false);
  const [altPressed, setAltPressed] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys(prev => new Set(prev).add(e.code));
      if (e.key === 'Shift') setShiftPressed(true);
      if (e.key === 'Alt' || e.key === 'AltGraph') setAltPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
      if (e.key === 'Shift') setShiftPressed(false);
      if (e.key === 'Alt' || e.key === 'AltGraph') setAltPressed(false);
    };

    const handleBlur = () => {
      setActiveKeys(new Set());
      setShiftPressed(false);
      setAltPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const getKeyLabel = (key: string) => {
    if (key.length > 1 && !['Space', 'ShiftLeft', 'ShiftRight'].includes(key)) {
      return key;
    }
    if (key === 'Space') return 'Space';
    if (key === 'ShiftLeft' || key === 'ShiftRight') return 'Shift';

    const mapped = getMappedChar(layoutId, key, shiftPressed, altPressed);
    return mapped || (shiftPressed ? (SHIFT_MAP[key] || key.toUpperCase()) : key);
  };

  const getEnglishLabel = (key: string) => {
    if (key.length > 1) return '';
    return shiftPressed ? (SHIFT_MAP[key] || key.toUpperCase()) : key;
  };

  const getKeyWidthClass = (key: string) => {
    switch (key) {
      case 'Backspace': return 'w-24 flex-grow';
      case 'Tab': return 'w-16 flex-grow';
      case '\\': return 'w-16 flex-grow';
      case 'CapsLock': return 'w-20 flex-grow';
      case 'Enter': return 'w-24 flex-grow';
      case 'ShiftLeft': return 'w-28 flex-grow';
      case 'ShiftRight': return 'w-28 flex-grow';
      case 'Space': return 'w-[32rem] flex-shrink-0';
      default: return 'w-12 flex-grow';
    }
  };

  const isKeyActive = (key: string) => {
    if (key === 'Space') return activeKeys.has('Space');
    if (key === 'ShiftLeft') return activeKeys.has('ShiftLeft') || activeKeys.has('ShiftRight');
    if (key === 'ShiftRight') return activeKeys.has('ShiftRight') || activeKeys.has('ShiftLeft');
    if (key === 'Enter') return activeKeys.has('Enter');
    if (key === 'Backspace') return activeKeys.has('Backspace');
    if (key === 'Tab') return activeKeys.has('Tab');
    if (key === 'CapsLock') return activeKeys.has('CapsLock');
    
    // For normal keys, try to match by key code (e.g. 'KeyQ', 'Digit1', 'Minus')
    for (const code of activeKeys) {
      if (code.replace('Key', '').toLowerCase() === key.toLowerCase()) return true;
      if (code.replace('Digit', '') === key) return true;
      if (code === 'Minus' && key === '-') return true;
      if (code === 'Equal' && key === '=') return true;
      if (code === 'BracketLeft' && key === '[') return true;
      if (code === 'BracketRight' && key === ']') return true;
      if (code === 'Backslash' && key === '\\') return true;
      if (code === 'Semicolon' && key === ';') return true;
      if (code === 'Quote' && key === "'") return true;
      if (code === 'Comma' && key === ',') return true;
      if (code === 'Period' && key === '.') return true;
      if (code === 'Slash' && key === '/') return true;
      if (code === 'Backquote' && key === '`') return true;
    }
    return false;
  };

  return (
    <div className="w-full flex flex-col items-center mt-6 mb-2 animate-in fade-in zoom-in-95 duration-300">
      <div className="inline-block w-full max-w-4xl">
        <div className="flex flex-col gap-1.5">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1.5 w-full">
              {row.map((key, keyIndex) => {
                const active = isKeyActive(key);
                const isSpecial = key.length > 1;
                const mappedChar = getKeyLabel(key);
                const englishChar = getEnglishLabel(key);

                return (
                  <div
                    key={keyIndex}
                    className={`
                      relative flex flex-col justify-center items-center h-12 rounded-lg shadow-sm border transition-all duration-75 select-none
                      ${getKeyWidthClass(key)}
                      ${active 
                        ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] translate-y-[2px] shadow-none' 
                        : 'bg-[var(--bg-element)] text-[var(--text-main)] border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] shadow-[0_2px_0_rgba(0,0,0,0.1)]'
                      }
                    `}
                  >
                    {!isSpecial && (
                      <span className={`absolute top-1 left-2 text-[10px] font-sans leading-none ${active ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                        {englishChar}
                      </span>
                    )}
                    <span 
                      className={`${isSpecial ? 'text-xs font-semibold tracking-wide uppercase opacity-70 font-sans' : 'text-xl mt-1.5'} leading-none`}
                      style={!isSpecial && fontFamily ? { fontFamily } : {}}
                    >
                      {mappedChar}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center mt-3 px-2">
          <div className="text-sm text-[var(--text-muted)] font-medium tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse"></span>
            {layoutId.replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );
}
