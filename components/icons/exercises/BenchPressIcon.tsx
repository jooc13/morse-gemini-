import React from 'react';

export const BenchPressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 12h16" />
        <path d="M6 12v6" />
        <path d="M18 12v6" />
        <circle cx="12" cy="6" r="2" />
        <path d="M12 8v4" />
        <path d="M10 12h4" />
        <path d="M8 8H5a1 1 0 0 0-1 1v2" />
        <path d="M16 8h3a1 1 0 0 1 1 1v2" />
        <path d="M3 8h2" />
        <path d="M19 8h2" />
    </svg>
);
