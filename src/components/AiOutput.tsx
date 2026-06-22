import { useEffect, useState } from "react";
import { Copy, Check, Eye, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AiOutputProps {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
  placeholder?: string;
  minHeight?: string;
}

export function AiOutput({ value, onChange, loading, placeholder, minHeight = "320px" }: AiOutputProps) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (value && mode === "edit") return;
    if (value) setMode("preview");
  }, [value, mode]);

  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={mode === "preview" ? "secondary" : "ghost"}
            onClick={() => setMode("preview")}
            className="h-7 gap-1 px-2 text-xs"
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
          <Button
            size="sm"
            variant={mode === "edit" ? "secondary" : "ghost"}
            onClick={() => setMode("edit")}
            className="h-7 gap-1 px-2 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        </div>
        <Button size="sm" variant="ghost" onClick={copy} disabled={!value} className="h-7 gap-1 px-2 text-xs">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="p-4" style={{ minHeight }}>
        {loading && !value ? (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="h-2 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-2 w-48 animate-pulse rounded-full bg-muted" />
            <div className="h-2 w-40 animate-pulse rounded-full bg-muted" />
            <p className="mt-2 text-xs">Aria is thinking…</p>
          </div>
        ) : mode === "edit" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "AI output will appear here…"}
            className="min-h-[280px] resize-y border-0 bg-transparent p-0 font-mono text-sm shadow-none focus-visible:ring-0"
          />
        ) : value ? (
          <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:mt-4 prose-h2:text-base prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
            <ReactMarkdown>{value}</ReactMarkdown>
          </article>
        ) : (
          <p className="text-sm text-muted-foreground">{placeholder ?? "AI output will appear here."}</p>
        )}
      </div>
    </div>
  );
}
