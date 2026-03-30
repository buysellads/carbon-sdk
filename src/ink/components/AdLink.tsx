import React from "react";
import { Text } from "ink";

interface AdLinkProps {
  url: string;
  label: string;
}

/** Displays a labeled link. Terminal users can copy the URL. */
export function AdLink({ url, label }: AdLinkProps) {
  // Use OSC 8 hyperlink escape sequence for terminals that support it
  const href = `\u001B]8;;${url}\u0007${label}\u001B]8;;\u0007`;
  return (
    <Text bold underline>
      {href}
    </Text>
  );
}
