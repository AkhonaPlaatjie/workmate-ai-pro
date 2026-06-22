import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { researchTopic } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Aria" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onResearch = async () => {
    if (topic.trim().length < 3) return toast.error("Enter a topic.");
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { topic, audience: audience || "a general professional audience" } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Research Assistant"
      icon={<Search className="h-4 w-4 text-primary" />}
      description="Get a structured briefing on any workplace topic — summary, insights, trade-offs, and next steps."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic / question</Label>
            <Input id="topic" placeholder="e.g. Async vs sync standups for remote teams" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aud">Audience (optional)</Label>
            <Input id="aud" placeholder="e.g. engineering managers" value={audience} onChange={(e) => setAudience(e.target.value)} />
          </div>
          <Button onClick={onResearch} disabled={loading} className="w-full gap-2">
            <Wand2 className="h-4 w-4" /> {loading ? "Researching…" : "Run Research"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            AI knowledge may be outdated. Verify time-sensitive facts before relying on them.
          </p>
        </div>
        <AiOutput value={output} onChange={setOutput} loading={loading} placeholder="Your briefing will appear here." minHeight="500px" />
      </div>
    </AppShell>
  );
}
