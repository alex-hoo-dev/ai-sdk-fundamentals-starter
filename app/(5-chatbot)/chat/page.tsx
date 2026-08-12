"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import Weather from "./weather";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-screen">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Start a conversation"
              description="Type a message below to begin"
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.role === "assistant"
                    ? message.parts?.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        case "tool-getWeather":
                          // Show Weather component for completed tool calls
                          if (part.state === "output-available" && part.output) {
                            return (
                              <Weather
                                key={part.toolCallId || `${message.id}-${i}`}
                                weatherData={part.output}
                              />
                            );
                          }
                          // Show tool UI for other states (loading, error)
                          return (
                            <Tool key={part.toolCallId || `${message.id}-${i}`}>
                              <ToolHeader type={part.type} state={part.state} />
                              <ToolContent>
                                <ToolInput input={part.input} />
                                <ToolOutput
                                  output={JSON.stringify(part.output, null, 2)}
                                  errorText={part.errorText}
                                />
                              </ToolContent>
                            </Tool>
                          );
                        default:
                          return null;
                      }
                    })
                    : message.parts?.map(
                      (part) => part.type === "text" && part.text
                    )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
      </Conversation>

      <div className="border-t p-4">
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            if (message.text) {
              sendMessage({ text: message.text });
              setInput("");
            }
          }}
          className="max-w-3xl mx-auto flex gap-2 items-end"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="flex-1"
          />
          <PromptInputSubmit disabled={isLoading} />
        </PromptInput>
      </div>
    </div>
  );
}