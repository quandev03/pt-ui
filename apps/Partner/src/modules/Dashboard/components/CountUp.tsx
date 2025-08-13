import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  delayMs?: number;
  className?: string;
  separator?: string;
  decimals?: number;
};

export const CountUp = ({
  to,
  from = 0,
  duration = 2,
  delayMs = 0,
  className,
  separator = ',',
  decimals,
}: CountUpProps) => {
  const [currentValue, setCurrentValue] = useState<number>(from);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const inferredDecimals = (() => {
    if (typeof decimals === 'number') return decimals;
    const countDecimals = (n: number) => {
      const parts = n.toString().split('.');
      return parts[1] ? parts[1].length : 0;
    };
    return Math.max(countDecimals(from), countDecimals(to));
  })();

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    startTimeRef.current = null;
    setCurrentValue(from);

    const totalMs = Math.max(0, duration) * 1000;
    const change = to - from;
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - (startTimeRef.current ?? timestamp);
      const progress = totalMs === 0 ? 1 : Math.min(1, elapsed / totalMs);
      setCurrentValue(from + change * progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const start = () => {
      rafRef.current = requestAnimationFrame(animate);
    };

    if (delayMs > 0) {
      timeoutRef.current = window.setTimeout(start, delayMs);
    } else {
      start();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [to, from, duration, delayMs]);

  const formatted = (() => {
    const hasSeparator = separator != null && separator !== '';
    const formattedNumber = new Intl.NumberFormat('en-US', {
      useGrouping: hasSeparator,
      minimumFractionDigits: inferredDecimals,
      maximumFractionDigits: inferredDecimals,
    }).format(currentValue);
    return hasSeparator
      ? formattedNumber.replace(/,/g, separator)
      : formattedNumber;
  })();

  return <span className={className}>{formatted}</span>;
};
