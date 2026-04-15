import React, { memo } from "react";
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

/** Default box width in columns.  Chosen to fit the classic 80-column
 *  terminal with a small visual margin, while still being narrower than
 *  any modern terminal so the box isn't forced to reflow on resize.
 *  Publishers can override with `style={{ width: N }}`. */
const DEFAULT_WIDTH = 78;

/**
 * A bordered box with "ads via Carbon" embedded in the bottom border.
 *
 * ╭──────────────────────────────────────────────────────────────────────╮
 * │ content                                                              │
 * ╰──────────────────────────────────────────────── ads via Carbon ──────╯
 *
 * Width model: the box defaults to a fixed column count (`DEFAULT_WIDTH`)
 * so that resizing the terminal wider doesn't reflow the border lines.
 * Terminals that soft-wrap on shrink leave ghost fragments when wide lines
 * reflow (upstream Ink issue vadimdemedes/ink#907), and a full-bleed box
 * would trigger that on every resize.  Pass `style={{ width: N }}` to pin
 * a different width.
 *
 * Rendering model: Ink draws the whole border itself via `borderStyle="round"`
 * and handles sizing through Yoga.  The attribution is a right-aligned child
 * row with `marginBottom={-1}`, which pulls it down one line so its cells
 * overlap Ink's bottom border row.  Empty cells in the overlay don't
 * overwrite anything, so the border rule shows through everywhere except
 * under the label.  No `measureElement`, no resize listener, no width state.
 */
export const CarbonBox = memo(function CarbonBox({
  children,
  showAttribution = true,
  style,
}: CarbonBoxProps) {
  const { width, borderColor } = style ?? {};
  const borderProps = borderColor ? { borderColor } : { borderDimColor: true };
  const widthProp = typeof width === "number" ? width : DEFAULT_WIDTH;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      {...borderProps}
      paddingX={1}
      width={widthProp}
    >
      {children}
      {showAttribution ? (
        <Box width="100%" justifyContent="flex-end" marginBottom={-1}>
          <Text inverse wrap="truncate">
            {LABEL}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
});
