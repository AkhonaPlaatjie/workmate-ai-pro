import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListTodo, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Aria" }] }),
  component: TasksPage,
});

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onPlan = async () => {
    if (goal.trim().length < 3) return toast.error("Describe your goal first.");
    setLoading(true);
    setOutput("");
    try {
      const res = await fn({ data: { goal, deadline, context } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Task Planner"
      icon={<ListTodo className="h-4 w-4 text-primary" />}
      description="Tell Aria what you want to achieve. Get a structured plan with milestones, tasks, and risks."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Textarea id="goal" rows={3} placeholder="e.g. Launch the new pricing page" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (optional)</Label>
            <Input id="deadline" placeholder="e.g. End of October" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (optional)</Label>
            <Textarea id="context" rows={4} placeholder="Team, constraints, what's done already…" value={context} onChange={(e) => setContext(e.target.value)} />
          </div>
          <Button onClick={onPlan} disabled={loading} className="w-full gap-2">
            <Wand2 className="h-4 w-4" /> {loading ? "Planning…" : "Build Plan"}
          </Button>
        </div>
        <AiOutput value={output} onChange={setOutput} loading={loading} placeholder="Your structured plan will appear here." minHeight="500px" />
      </div>
    </AppShell>
  );
}
