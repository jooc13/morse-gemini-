import React from 'react';

export const OverheadPressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="10" r="2" />
        <path d="M12 12v7" />
        <path d="M12 19l-2 3" />
        <path d="M12 19l2 3" />
        <path d="M9 12l-2-2" />
        <path d="M15 12l2-2" />
        <path d="M7 10H3" />
        <path d="M17 10h4" />
        <path d="M3 10a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2" />
        <path d="M21 10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2" />
    </svg>
);
