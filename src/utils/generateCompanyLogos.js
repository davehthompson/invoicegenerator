// src/utils/generateCompanyLogos.js

const generateLogoURL = (companyName) => {
  // Create a deterministic color based on company name
  const hash = Array.from(companyName).reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
    0
  );

  const hue = hash % 360;
  const saturation = 60 + (hash % 20); // 60-80%
  const lightness = 45 + (hash % 10); // 45-55%

  // Generate SVG logo with company initials
  const initials = companyName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="hsl(${hue}, ${saturation}%, ${lightness}%)" />
        <text
          x="50"
          y="50"
          dy="0.35em"
          fill="white"
          font-family="Arial, sans-serif"
          font-size="40"
          text-anchor="middle"
          font-weight="bold"
        >
          ${initials}
        </text>
      </svg>
    `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export { generateLogoURL };
