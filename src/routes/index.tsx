import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles, ArrowRight, Zap, Shield, Layers } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aria Workplace AI" },
      { name: "description", content: "Your AI productivity workspace." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft polished, on-tone emails in seconds.",
    icon: Mail,
    href: "/email",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into TL;DRs, decisions, and action items.",
    icon: FileText,
    href: "/meetings",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    title: "AI Task Planner",
    description: "Break goals into milestones and actionable tasks.",
    icon: ListTodo,
    href: "/tasks",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "AI Research Assistant",
    description: "Get structured briefings on any topic.",
    icon: Search,
    href: "/research",
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "AI Chatbot",
    description: "Ask Aria anything — context-aware conversation.",
    icon: MessageSquare,
    href: "/chat",
    accent: "from-fuchsia-500 to-pink-500",
  },
] as const;

function Dashboard() {
  return (
    <AppShell title="Dashboard" icon={<Sparkles className="h-4 w-4 text-primary" />}>
      <section className="mb-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div className="absolute inset-0 -z-0 opacity-[0.07]" aria-hidden>
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full gradient-brand blur-3xl" />
          </div>
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <Zap className="h-3 w-3" /> Powered by Lovable AI
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Your workplace, <span className="text-gradient-brand">on autopilot.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              Aria helps professionals automate the busywork — emails, summaries, plans, and
              research — so you can focus on the work that matters.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/email">
                  Start with an email <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/chat">Open AI Chat</Link>
              </Button>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-3 self-end">
            <Stat label="Tools" value="5" />
            <Stat label="Avg. time saved" value="6.2h/wk" />
            <Stat label="Models" value="Gemini 3" />
            <Stat label="Setup" value="0 min" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tools
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} to={t.href} className="group">
              <Card className="h-full transition hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className={`mb-3 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br text-white shadow-sm ${t.accent}`}>
                    <t.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                  <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-xs font-medium text-primary group-hover:underline">
                    Open <ArrowRight className="ml-1 h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <Feature icon={Shield} title="Responsible AI" text="Every output ships with a verify-before-send disclaimer." />
        <Feature icon={Layers} title="Editable outputs" text="Switch from preview to edit mode and tweak any response." />
        <Feature icon={Zap} title="Structured prompts" text="Each tool uses tuned prompts for consistent, high-quality results." />
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background/60 p-3 backdrop-blur">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Shield; title: string; text: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-2 text-sm font-semibold">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
