import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Aria" }] }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"formal" | "friendly" | "concise" | "persuasive" | "apologetic">("formal");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!purpose.trim() || !recipient.trim()) {
      toast.error("Add a recipient and purpose first.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { recipient, purpose, tone, keyPoints } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Smart Email Generator"
      icon={<Mail className="h-4 w-4 text-primary" />}
      description="Describe the email you need. Aria drafts a complete message with subject line — ready to review and send."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input id="recipient" placeholder="e.g. Marketing team, Sarah (client)" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea id="purpose" placeholder="What is this email about?" rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="kp">Key points (optional)</Label>
            <Textarea id="kp" placeholder="• Deadline next Friday&#10;• Need budget approval" rows={4} value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full gap-2">
            <Wand2 className="h-4 w-4" /> {loading ? "Generating…" : "Generate Email"}
          </Button>
        </div>
        <AiOutput value={output} onChange={setOutput} loading={loading} placeholder="Your generated email will appear here." />
      </div>
    </AppShell>
  );
}
