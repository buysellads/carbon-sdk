import React, { memo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Box, Text } from "ink";

interface CarbonBoxProps {
  children: ReactNode;
}

const LABEL = " ads via Carbon ";
const TRAILING = "─";

// Clear visible screen + cursor home. Does NOT clear scrollback (\x1b[3J).
const CLEAR_SCREEN = "\x1b[2J\x1b[H";

function getWidth(): number {
  return (process.stdout.columns || 80) - 1;
}

/**
 * A bordered box with "ads via Carbon" embedded in the bottom border.
 *
 * ╭──────────────────────────────────────────────────────────────────────╮
 * │ content                                                              │
 * ╰──────────────────────────────────────────────── ads via Carbon ──────╯
 */
export const CarbonBox = memo(function CarbonBox({ children }: CarbonBoxProps) {
  const [width, setWidth] = useState(getWidth);

  // Ink's resize handler uses eraseLines(previousLineCount), which under-erases
  // when the terminal shrinks (the terminal re-wraps old content into more lines
  // than Ink expects).  It also paints immediately with the stale React tree,
  // producing a visible ghost frame before our state update lands.
  //
  // Fix: on mount, snapshot existing resize listeners and remove them so our
  // handler is the only one that fires.  We clear the screen and update state;
  // the React re-render triggers Ink's reconciler → calculateLayout → onRender
  // for a single clean paint.  On unmount, our listener is removed and the
  // original listeners are restored in their original order.
  useEffect(() => {
    const priorListeners = process.stdout
      .rawListeners("resize")
      .slice() as ((...args: unknown[]) => void)[];

    for (const listener of priorListeners) {
      process.stdout.off("resize", listener);
    }

    function onResize() {
      process.stdout.write(CLEAR_SCREEN);
      setWidth(getWidth());
    }
    process.stdout.on("resize", onResize);

    return () => {
      process.stdout.off("resize", onResize);
      for (const listener of priorListeners) {
        process.stdout.on("resize", listener);
      }
    };
  }, []);

  const innerWidth = width - 2;
  const topRule = "─".repeat(innerWidth);
  const labelLen = LABEL.length + TRAILING.length;
  const leadingRule = "─".repeat(Math.max(innerWidth - labelLen, 0));

  return (
    <Box flexDirection="column" width={width}>
      <Text dimColor>╭{topRule}╮</Text>
      <Box
        borderLeft
        borderRight
        borderTop={false}
        borderBottom={false}
        borderStyle="round"
        borderDimColor
        paddingX={1}
        flexDirection="column"
      >
        {children}
      </Box>
      <Text dimColor>
        ╰{leadingRule}
        <Text inverse>{LABEL}</Text>
        {TRAILING}╯
      </Text>
    </Box>
  );
});
