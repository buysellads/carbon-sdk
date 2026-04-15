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

/**
 * A bordered box with "ads via Carbon" embedded in the bottom border.
 *
 * ╭──────────────────────────────────────────────────────────────────────╮
 * │ content                                                              │
 * ╰──────────────────────────────────────────────── ads via Carbon ──────╯
 *
 * Width model: by default the box flex-stretches to fill its parent, so
 * publishers can control sizing through their own Ink layout.  Pass
 * `style.width` to pin it to an exact column count instead.
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
  const widthProp = typeof width === "number" ? width : "100%";

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
