import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Sparkles, Send, RefreshCcw, Square } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const STORAGE_KEY = "aria-chat-v1";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Aria" }] }),
  component: ChatPage,
});

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function ChatPage() {
  const initial = useMemo(loadMessages, []);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: "aria-main",
    messages: initial,
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const busy = status === "submitted" || status === "streaming";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  };

  const onReset = () => {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    inputRef.current?.focus();
  };

  const suggestions = [
    "Help me prep for a 1:1 with my manager",
    "Rewrite this Slack message to sound more confident",
    "What are good questions to ask a candidate for a PM role?",
  ];

  return (
    <AppShell
      title="AI Chat"
      icon={<MessageSquare className="h-4 w-4 text-primary" />}
      actions={
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RefreshCcw className="h-3.5 w-3.5" /> New conversation
        </Button>
      }
    >
      <div className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center py-12 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-white shadow-lg">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Chat with Aria</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your AI workplace assistant. Ask anything — drafts, ideas, summaries, plans.
              </p>
              <div className="mt-6 grid w-full gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="rounded-lg border bg-background px-3 py-2 text-left text-sm transition hover:border-primary/50 hover:bg-accent/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "120ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "240ms" }} />
                  </div>
                  Thinking…
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t bg-background/60 p-3 md:p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Message Aria…  (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="max-h-40 min-h-[44px] resize-none"
              disabled={busy}
            />
            {busy ? (
              <Button type="button" onClick={() => stop()} variant="secondary" size="icon" className="shrink-0">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" size="icon" disabled={!input.trim()} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-brand text-white shadow-sm">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="prose prose-sm dark:prose-invert min-w-0 max-w-none flex-1 prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5">
        <ReactMarkdown>{text || "…"}</ReactMarkdown>
      </div>
    </div>
  );
}
