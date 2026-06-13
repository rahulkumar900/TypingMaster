import React from 'react';
import { LayoutId } from '@/lib/transliterate';
import { VirtualKeyboard } from './virtual-keyboard';

interface KeyboardVisualizerProps {
  languageId: LayoutId;
  fontFamily?: string;
}

export function KeyboardVisualizer({ languageId, fontFamily }: KeyboardVisualizerProps) {
  // We no longer rely on static PNGs! 
  // The VirtualKeyboard dynamically renders the keys using the maps and current theme colors.
  return (
    <VirtualKeyboard layoutId={languageId} fontFamily={fontFamily} />
  );
}
