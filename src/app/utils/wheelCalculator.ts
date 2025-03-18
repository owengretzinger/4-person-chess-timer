export interface WheelSegment {
  clipPath: string;
  midAngle: number;
  textRotation: number;
  textPosition: { x: number; y: number };
}

/**
 * Calculates positioning and styling for player segments in wheel layout
 */
export const calculateWheelSegment = (
  playerIndex: number,
  numPlayers: number
): WheelSegment => {
  const segmentAngle = 360 / numPlayers;
  const startAngle = segmentAngle * playerIndex;
  const endAngle = startAngle + segmentAngle;
  const midAngle = (startAngle + endAngle) / 2;

  // For SVG path creation - convert to radians
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  // Center point
  const centerX = 50;
  const centerY = 50;

  // Create a different clip path for 2 players to ensure they're visible
  let clipPath;

  if (numPlayers === 2) {
    // For 2 players, use a left/right division
    if (playerIndex === 0) {
      clipPath = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`; // Right half
    } else {
      clipPath = `polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)`; // Left half
    }
  } else {
    // For 3+ players, use the normal radial segments
    const containerRadius = 1000; // Much larger than needed to ensure it extends beyond the visible area
    const ex1 = centerX + containerRadius * Math.cos(startRad);
    const ey1 = centerY + containerRadius * Math.sin(startRad);
    const ex2 = centerX + containerRadius * Math.cos(endRad);
    const ey2 = centerY + containerRadius * Math.sin(endRad);

    // Combine the points to create the clip path
    clipPath = `polygon(${centerX}% ${centerY}%, ${ex1}% ${ey1}%, ${ex2}% ${ey2}%)`;
  }

  // Fixed distance from center for text positioning, regardless of player count
  const textDistanceFromCenter = 36; // % from center point

  const textX =
    centerX +
    textDistanceFromCenter * Math.cos((midAngle - 90) * (Math.PI / 180));
  const textY =
    centerY +
    textDistanceFromCenter * Math.sin((midAngle - 90) * (Math.PI / 180));

  // Calculate text rotation so it's readable from outside the wheel
  const textRotation = midAngle;

  return {
    clipPath,
    midAngle,
    textRotation,
    textPosition: { x: textX, y: textY },
  };
};
