import React, { memo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Box, Text } from "ink";
import type { CarbonBoxStyle } from "../../core/types.js";

interface CarbonBoxProps {
  children: ReactNode;
  /** Show "ads via Carbon" in the bottom border. Defaults to true. */
  showAttribution?: boolean;
  /** Style overrides for the box container. */
  style?: CarbonBoxStyle;
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
export const CarbonBox = memo(function CarbonBox({
  children,
  showAttribution = true,
  style,
}: CarbonBoxProps) {
  const { width: fixedWidth, borderColor } = style ?? {};
  const [termWidth, setTermWidth] = useState(getWidth);

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
    const priorListeners = process.stdout.rawListeners("resize").slice() as ((
      ...args: unknown[]
    ) => void)[];

    for (const listener of priorListeners) {
      process.stdout.off("resize", listener);
    }

    function onResize() {
      process.stdout.write(CLEAR_SCREEN);
      setTermWidth(getWidth());
    }
    process.stdout.on("resize", onResize);

    return () => {
      process.stdout.off("resize", onResize);
      for (const listener of priorListeners) {
        process.stdout.on("resize", listener);
      }
    };
  }, []);

  const width = fixedWidth ?? termWidth;
  const innerWidth = width - 2;
  const topRule = "─".repeat(innerWidth);

  let bottomRule: string;
  if (showAttribution) {
    const labelLen = LABEL.length + TRAILING.length;
    bottomRule = "─".repeat(Math.max(innerWidth - labelLen, 0));
  } else {
    bottomRule = "─".repeat(innerWidth);
  }

  return (
    <Box flexDirection="column" width={width}>
      <Text dimColor={!borderColor} color={borderColor}>
        ╭{topRule}╮
      </Text>
      <Box
        borderLeft
        borderRight
        borderTop={false}
        borderBottom={false}
        borderStyle="round"
        {...(borderColor ? { borderColor } : { borderDimColor: true })}
        paddingX={1}
        flexDirection="column"
      >
        {children}
      </Box>
      <Text dimColor={!borderColor} color={borderColor}>
        ╰{bottomRule}
        {showAttribution ? (
          <>
            <Text inverse>{LABEL}</Text>
            {TRAILING}
          </>
        ) : null}
        ╯
      </Text>
    </Box>
  );
});
