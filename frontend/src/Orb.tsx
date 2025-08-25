// import * as React from "react";

// interface OrbProps extends React.SVGProps<SVGSVGElement> {
//   size?: number;
//   color?: string; // 3 gradient stops
//   gradientId?: string; // unique id
//   count: 1 | 2 | 3;
// }

// const Orb: React.FC<OrbProps> = ({
//   size = 50,
//   color = "#77c0ff",
//   gradientId = "orbGradient",
//   count=1,
//   ...props
// }) => (
//   <svg
//     viewBox="0 0 200 200"
//     width={size}
//     height={size}
//     xmlns="http://www.w3.org/2000/svg"
//     {...props}
//   >
//     <defs>
//       <radialGradient id={gradientId} cx="35%" cy="35%" r="65%">
//         <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
//         <stop offset="40%" stopColor={color} />
//         <stop offset="100%" stopColor={color} />
//       </radialGradient>
//     </defs>
//     {count >= 1 && <circle cx={65} cy={90} r={45} fill={`url(#${gradientId})`} />}
//     {count >= 2 && <circle cx={135} cy={90} r={45} fill={`url(#${gradientId})`} />}
//     {count >= 3 && <circle cx={100} cy={130} r={45} fill={`url(#${gradientId})`} />}
//     {count >= 4 && <circle cx="170" cy="130" r="45" fill="url(#orb)"/>}
//   </svg>
// );

// export default Orb;

import * as React from "react";

interface OrbProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  gradientId?: string;
  count: 1 | 2 | 3 | 4;
  vibrate?: boolean;
  intensity?: number; // max pixels to vibrate
}

const Orb: React.FC<OrbProps> = ({
  size = 50,
  color = "#77c0ff",
  gradientId = "orbGradient",
  count = 1,
  vibrate = true,
  intensity = 0.9, // smaller value = more intense vibration
  ...props
}) => {
  const getAnimationStyle = (idx: number) => {
    if (!vibrate) return undefined;
    // Different vibration patterns for each orb
    return {
      animation: `vibrate-${idx} 0.2s infinite alternate`,
    };
  };

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="40%" stopColor={color} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>

      {count >= 1 && (
        <circle
          cx={65}
          cy={90}
          r={45}
          fill={`url(#${gradientId})`}
          style={getAnimationStyle(1)}
        />
      )}
      {count >= 2 && (
        <circle
          cx={135}
          cy={90}
          r={45}
          fill={`url(#${gradientId})`}
          style={getAnimationStyle(2)}
        />
      )}
      {count >= 3 && (
        <circle
          cx={100}
          cy={130}
          r={45}
          fill={`url(#${gradientId})`}
          style={getAnimationStyle(3)}
        />
      )}
      {count >= 4 && (
        <circle
          cx={170}
          cy={130}
          r={45}
          fill={`url(#${gradientId})`}
          style={getAnimationStyle(4)}
        />
      )}

      <style>
        {`
          @keyframes vibrate-1 {
            0% { transform: translate(0px, 0px); }
            50% { transform: translate(${count/intensity}px, -${count/intensity}px); }
            100% { transform: translate(-${count/intensity}px, ${count/intensity}px); }
          }
          @keyframes vibrate-2 {
            0% { transform: translate(0px, 0px); }
            50% { transform: translate(-${count/intensity}px, ${count/intensity}px); }
            100% { transform: translate(${count/intensity}px, -${count/intensity}px); }
          }
          @keyframes vibrate-3 {
            0% { transform: translate(0px, 0px); }
            50% { transform: translate(${count/intensity}px, ${count/intensity}px); }
            100% { transform: translate(-${count/intensity}px, -${count/intensity}px); }
          }
          @keyframes vibrate-4 {
            0% { transform: translate(0px, 0px); }
            50% { transform: translate(-${count/intensity}px, -${count/intensity}px); }
            100% { transform: translate(${count/intensity}px, ${count/intensity}px); }
          }
        `}
      </style>
    </svg>
  );
};

export default Orb;
