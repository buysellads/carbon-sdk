import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import TextInput from "ink-text-input";
import { CarbonAd } from "../dist/ink/index.js";

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const RESPONSES = [
  "Sure, I can help with that. Let me look into it.",
  "Here's what I found — the issue is in the config file.",
  "I've updated the function. Want me to run the tests?",
  "Done! The changes have been applied successfully.",
  "That's an interesting question. Let me think about it...",
  "I'd recommend refactoring that into a separate module.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Spinner({ label }: { label: string }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text>
      <Text color="cyan">{SPINNER_FRAMES[frame]}</Text> {label}
    </Text>
  );
}

// --house-ads: no paid ads, fallback renders as house ad
// --no-ads:    no paid ads AND no fallback, ad slot is empty
const simulateNoAds = process.argv.includes("--house-ads") || process.argv.includes("--no-ads");
const omitFallback = process.argv.includes("--no-ads");
if (simulateNoAds) {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.includes("carbonads.net")) {
      // Mimics the real server response when no paid ad is available:
      // an ads array with an entry that has tracking fields but no
      // statlink, description, company, etc.
      return new Response(
        JSON.stringify({
          ads: [
            {
              active: "1",
              noincrement: "1",
              rendering: "carbon",
              should_record_viewable: "1",
              timestamp: String(Math.floor(Date.now() / 1000)),
            },
            {},
          ],
        }),
        { status: 200 },
      );
    }
    return realFetch(input, init);
  };
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const handleSubmit = (value: string) => {
    if (!value.trim() || thinking) return;

    const userMsg: Message = { role: "user", content: value };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setThinking(true);

    // Simulate assistant response after a delay
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      setMessages((msgs) => [...msgs, { role: "assistant", content: response }]);
      setThinking(false);
      setTurnCount((c) => c + 1);
    }, delay);
  };

  return (
    <Box flexDirection="column" gap={1}>
      <CarbonAd
        interactionId={turnCount}
        {...(omitFallback ? {} : {
          fallback: {
            company: "Acme CLI",
            description: "Build faster with our developer toolkit for the terminal.",
            companyTagline: "Dev tools for the terminal",
            callToAction: "Learn More",
            link: "https://acme.dev",
          },
        })}
      />

      <Box flexDirection="column">
        {messages.map((msg, i) => (
          <Box key={i}>
            <Text bold color={msg.role === "user" ? "blue" : "green"}>
              {msg.role === "user" ? "You: " : "Bot: "}
            </Text>
            <Text>{msg.content}</Text>
          </Box>
        ))}
      </Box>

      {thinking ? (
        <Spinner label="Thinking..." />
      ) : (
        <Box>
          <Text bold color="blue">{"❯ "}</Text>
          <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
        </Box>
      )}
    </Box>
  );
}

render(<App />);
