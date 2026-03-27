"use client";

import { useEffect, useRef, useState, Children, cloneElement, isValidElement } from "react";

export default function StaggerReveal({
  children,
  stagger = 80,
  className,
  style,
}: {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {Children.map(children, (child, i) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
              style: {
                ...(child as React.ReactElement<{ style?: React.CSSProperties }>).props.style,
                opacity: visible ? 1 : 0,
                filter: visible ? "blur(0px)" : "blur(6px)",
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.55s ease ${i * stagger}ms, filter 0.55s ease ${i * stagger}ms, transform 0.55s ease ${i * stagger}ms`,
              },
            })
          : child
      )}
    </div>
  );
}
