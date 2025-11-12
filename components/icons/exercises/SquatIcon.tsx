import React from 'react';

export const SquatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v5" />
        <path d="M12 12l-2 4" />
        <path d="M12 12l2 4" />
        <path d="M10 16l-2 4" />
        <path d="M14 16l2 4" />
        <path d="M5 8h14" />
        <path d="M4 8h-.5a1.5 1.5 0 0 1 0-3h1" />
        <path d="M20 8h.5a1.5 1.5 0 0 0 0-3h-1" />
    </svg>
);
