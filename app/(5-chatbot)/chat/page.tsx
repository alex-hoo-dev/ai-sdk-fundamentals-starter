"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

// Add ALL these new Elements imports
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit
} from "@/components/ai-elements/prompt-input";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap mb-4">
          <strong>{message.role === "user" ? "User: " : "AI: "}</strong>
          {message.parts?.map(
            (part, i) =>
              part.type === "text" && (
                <span key={`${message.id}-${i}`}>{part.text}</span>
              ),
          )}
        </div>
      ))}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim()) return;

          try {
            await sendMessage({ text: input });
            setInput("");
          } catch (error) {
            console.error("Failed to send message:", error);
            // TODO: Show user-friendly error message
            // You could add a toast notification here
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}