'use client';

import React, { useRef, useEffect } from 'react';

interface WpmChartProps {
  wpmHistory: number[];
  rawWpmHistory: number[];
  timeHistory: number[];
  testTimeLimit: number;
  accentTheme: string;
}

export const WpmChart: React.FC<WpmChartProps> = ({
  wpmHistory,
  rawWpmHistory,
  timeHistory,
  testTimeLimit,
  accentTheme
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleDraw = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const w = rect.width;
      const h = rect.height;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Get colors based on accent theme
      const style = window.getComputedStyle(document.body);
      const activeThemeColor = style.getPropertyValue('--accent-color').trim() || '#60a5fa';
      const activeThemeRgb = style.getPropertyValue('--accent-rgb').trim() || '96, 165, 250';

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      const gridRows = 4;
      const gridCols = 5;

      // Horizontal lines
      for (let i = 0; i <= gridRows; i++) {
        const y = 15 + (h - 35) * (i / gridRows);
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(w - 15, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText(String(Math.round(120 - 120 * (i / gridRows))), 10, y + 3);
      }

      // Vertical lines
      for (let i = 0; i < gridCols; i++) {
        const x = 35 + (w - 50) * (i / (gridCols - 1));
        ctx.beginPath();
        ctx.moveTo(x, 15);
        ctx.lineTo(x, h - 20);
        ctx.stroke();

        // Time labels
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Outfit, sans-serif';
        const secondsInterval = Math.round((testTimeLimit / (gridCols - 1)) * i);
        ctx.fillText(`${secondsInterval}s`, x - 8, h - 5);
      }

      if (wpmHistory.length === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = '12px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Data will appear here once you begin typing", w / 2, h / 2);
        return;
      }

      // Setup points
      const points: { x: number; y: number; value: number }[] = [];
      const paddingLeft = 35;
      const paddingRight = 15;
      const paddingTop = 15;
      const paddingBottom = 20;

      const chartWidth = w - paddingLeft - paddingRight;
      const chartHeight = h - paddingTop - paddingBottom;

      const maxVal = Math.max(120, ...wpmHistory, ...rawWpmHistory);

      for (let i = 0; i < wpmHistory.length; i++) {
        const val = wpmHistory[i];
        const timeIdx = timeHistory[i];

        const xRatio = timeIdx / testTimeLimit;
        const x = paddingLeft + chartWidth * xRatio;

        const yRatio = val / maxVal;
        const y = paddingTop + chartHeight * (1 - yRatio);

        points.push({ x, y, value: val });
      }

      if (points.length > 1) {
        // Draw glow fill gradient
        const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
        fillGrad.addColorStop(0, `rgba(${activeThemeRgb}, 0.15)`);
        fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, h - paddingBottom);
        ctx.lineTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineTo(points[points.length - 1].x, h - paddingBottom);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Draw spline curve line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        ctx.strokeStyle = activeThemeColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Highest & Lowest tags
        let highestIdx = 0;
        let lowestIdx = 0;

        for (let i = 1; i < wpmHistory.length; i++) {
          if (wpmHistory[i] > wpmHistory[highestIdx]) highestIdx = i;
          if (wpmHistory[i] < wpmHistory[lowestIdx]) lowestIdx = i;
        }

        const highestPt = points[highestIdx];
        const lowestPt = points[lowestIdx];

        // Draw tags
        drawGraphTag(ctx, highestPt.x, highestPt.y, `Highest ${highestPt.value}`, activeThemeColor, '#000000', w);
        
        if (highestIdx !== lowestIdx && wpmHistory.length > 2) {
          drawGraphTag(ctx, lowestPt.x, lowestPt.y, `Lowest ${lowestPt.value}`, '#1e293b', '#cbd5e1', w);
        }
      }
    };

    const drawGraphTag = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      label: string,
      bgColor: string,
      textColor: string,
      canvasW: number
    ) => {
      c.save();
      c.font = 'bold 9px Outfit, sans-serif';
      const paddingX = 8;
      const paddingY = 4;
      const textWidth = c.measureText(label).width;

      const rw = textWidth + paddingX * 2;
      const rh = 16;

      const rx = Math.max(35, Math.min(x - rw / 2, canvasW - rw - 15));
      const ry = Math.max(10, y - rh - 8);

      // Draw point indicator
      c.beginPath();
      c.arc(x, y, 4, 0, Math.PI * 2);
      c.fillStyle = bgColor;
      c.fill();
      c.strokeStyle = '#ffffff';
      c.lineWidth = 1;
      c.stroke();

      // Draw tag bubble box
      c.fillStyle = bgColor;
      c.beginPath();
      if (typeof c.roundRect === 'function') {
        c.roundRect(rx, ry, rw, rh, 4);
      } else {
        c.rect(rx, ry, rw, rh); // fallback
      }
      c.fill();

      // Draw label text
      c.fillStyle = textColor;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(label, rx + rw / 2, ry + rh / 2 + 0.5);
      c.restore();
    };

    handleDraw();

    // Listen to resize events
    const observer = new ResizeObserver(() => {
      handleDraw();
    });
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [wpmHistory, rawWpmHistory, timeHistory, testTimeLimit, accentTheme]);

  return <canvas ref={canvasRef} className="block w-full h-full" />;
};
