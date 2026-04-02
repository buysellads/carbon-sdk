import React, { memo } from "react";
import { Text } from "ink";

interface AdLinkProps {
  url: string;
  label: string;
}

const OSC = "\u001B]";
const BEL = "\u0007";

/** Displays a labeled link. Terminal users can copy the URL. */
export const AdLink = memo(function AdLink({ url, label }: AdLinkProps) {
  // OSC 8 hyperlink: separate the invisible sequences from the visible label
  // so ink can measure the label width correctly for layout.
  const open = `${OSC}8;;${url}${BEL}`;
  const close = `${OSC}8;;${BEL}`;
  return (
    <Text bold underline>
      {open}
      {label}
      {close}
    </Text>
  );
});
