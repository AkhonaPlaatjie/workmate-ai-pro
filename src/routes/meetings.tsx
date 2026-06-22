import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — Aria" }] }),
  component: MeetingsPage,
});

const SAMPLE = `Q3 marketing sync — Jamie kicked off discussing campaign performance. CTR up 12% vs Q2 but conversions flat. Priya thinks we should A/B test new landing page copy by Sept 30. Decision: pause LinkedIn spend until creative refresh. Action: Marcus owns new creative brief by Friday. Open: do we still sponsor the November conference? Need budget signoff from Lisa.`;

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSummarize = async () => {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a few sentences of notes.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { notes } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      icon={<FileText className="h-4 w-4 text-primary" />}
      description="Paste raw notes or a transcript. Aria extracts the TL;DR, decisions, action items, and open questions."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Label htmlFor="notes">Meeting notes / transcript</Label>
            <button onClick={() => setNotes(SAMPLE)} className="text-xs text-primary hover:underline">
              Load sample
            </button>
          </div>
          <Textarea
            id="notes"
            placeholder="Paste notes, bullet points, or transcript…"
            rows={16}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="font-mono text-sm"
          />
          <Button onClick={onSummarize} disabled={loading} className="w-full gap-2">
            <Wand2 className="h-4 w-4" /> {loading ? "Summarizing…" : "Summarize"}
          </Button>
        </div>
        <AiOutput value={output} onChange={setOutput} loading={loading} placeholder="Structured summary will appear here." minHeight="500px" />
      </div>
    </AppShell>
  );
}
