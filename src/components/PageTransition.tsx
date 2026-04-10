'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setTransitioning(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitioning(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      {displayChildren}
    </div>
  );
}
