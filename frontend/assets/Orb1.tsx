import * as React from "react";
const SVGComponent = (props) => (
  <svg
    viewBox="0 0 200 200"
    width={200}
    height={200}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <radialGradient id="orb" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
        <stop offset="40%" stopColor="#77c0ff" />
        <stop offset="100%" stopColor="#2573d8" />
      </radialGradient>
    </defs>
    <circle cx={65} cy={90} r={45} fill="url(#orb)" />
    <circle cx={135} cy={90} r={45} fill="url(#orb)" />
    <circle cx={100} cy={130} r={45} fill="url(#orb)" />
  </svg>
);
export default SVGComponent;
