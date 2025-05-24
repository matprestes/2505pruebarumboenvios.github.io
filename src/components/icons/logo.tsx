import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      aria-label="Rumbos Envios Logo"
      {...props}
    >
      <path d="M10 40 Q15 10 30 40 L20 40 L20 10 L10 10 Z" fill="hsl(var(--primary))" />
      <path d="M35 10 H45 L45 40 H35 Z M35 23 H45" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
      <text
        x="55"
        y="32"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
      >
        Rumbos Envios
      </text>
    </svg>
  );
}
