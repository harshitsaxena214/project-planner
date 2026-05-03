"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { createApi } from "@/lib/api";
import {
  Code2,
  Loader2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
type Severity = "critical" | "warning" | "info";

type Issue = {
  severity: Severity;
  title: string;
  detail: string;
  line?: number;
};

type ReviewResult = {
  explanation: string;
  score?: number;
  summary?: string;
  issues: Issue[] | string[];
  improvements: string[];
  suggestions?: string[];
};

// ── Severity styling ───────────────────────────────────────────────────────
const severityMap: Record<
  Severity,
  { icon: React.ElementType; color: string; bg: string }
> = {
  critical: {
    icon: ShieldAlert,
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-accent-foreground",
    bg: "bg-accent/20 border-accent/40",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
  },
};

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
];

export default function CodeReviewPage() {
  const { getToken } = useAuth();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [result, setResult] = useState<ReviewResult | null>(null);

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const api = createApi(token);

      const res = await api.post("/ai/explain-code", { code, language });
      return res.data as ReviewResult;
    },
    onSuccess: (data) => setResult(data),
    onError: (error) => console.error("API Error:", error),
  });

  // Normalise issues — API may return string[] or Issue[]
  const normalisedIssues: Issue[] = (result?.issues ?? []).map((issue) =>
    typeof issue === "string"
      ? { severity: "warning" as Severity, title: issue, detail: "" }
      : (issue as Issue)
  );

  const suggestions: string[] =
    result?.suggestions ?? result?.improvements ?? [];

  return (
    <div className="px-6 sm:px-10 lg:px-14 py-8 lg:py-10 w-full max-w-[1200px] mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        AI Code Reviewer
      </div>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Review your code
      </h1>
      <p className="text-muted-foreground mt-3 leading-relaxed text-base">
        Paste a snippet below and get instant feedback on style, bugs, and improvements.
      </p>

      <div className="mt-10 flex gap-6 items-start w-full">

        <div className="flex flex-col gap-4" style={{ flex: "3 1 0%", minWidth: 0 }}>

          <div className="glass rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40 gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Code2 className="h-3.5 w-3.5 shrink-0" />
                <span>snippet</span>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 w-[140px] text-xs bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-xs">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fixed-height code textarea — never collapses */}
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your code here\nfunction sum(a, b) {\n  console.log("adding", a, b);\n  return a + b;\n}`}
              className="font-mono text-sm bg-transparent border-0 rounded-none resize-none focus-visible:ring-0 w-full"
              style={{ height: "500px" }}
              spellCheck={false}
            />
          </div>

          {/* Submit button */}
          <Button
            onClick={() => reviewMutation.mutate()}
            variant="hero"
            size="lg"
            className="w-full gap-2 h-12"
            disabled={reviewMutation.isPending || !code.trim()}
          >
            {reviewMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Review code
              </>
            )}
          </Button>

          {reviewMutation.isError && (
            <p className="text-center text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        {/* Right col: 2/5 width — fixed min-height so it never collapses */}
        <div
          className="flex flex-col gap-4"
          style={{ flex: "2 1 0%", minWidth: 0, minHeight: "560px" }}
        >

          {/* Loading skeletons */}
          {reviewMutation.isPending && (
            <div className="glass rounded-xl p-5 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          )}

          {/* Empty state — same height as editor so layout doesn't shift */}
          {!result && !reviewMutation.isPending && (
            <div className="glass rounded-xl flex flex-col items-center justify-center text-center p-8 h-full" style={{ minHeight: "200px" }}>
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI review will appear here.
              </p>
            </div>
          )}

          {/* Results */}
          {result && !reviewMutation.isPending && (
            <>
              {/* Score + explanation */}
              <div className="glass rounded-xl p-5">
                {result.score !== undefined && (
                  <>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        Quality score
                      </span>
                      <span className="text-3xl font-semibold text-gradient tabular-nums">
                        {result.score}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-primary transition-all"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </>
                )}
                {result.explanation && (
                  <>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                      Explanation
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {result.summary ?? result.explanation}
                    </p>
                  </>
                )}
              </div>

              {/* Issues */}
              {normalisedIssues.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium px-1">
                    Issues
                  </h3>
                  {normalisedIssues.map((issue, i) => {
                    const s = severityMap[issue.severity] ?? severityMap.info;
                    const Icon = s.icon;
                    return (
                      <div key={i} className={cn("rounded-lg border p-3 flex gap-3", s.bg)}>
                        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", s.color)} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{issue.title}</span>
                            {issue.line !== undefined && (
                              <span className="text-[11px] text-muted-foreground font-mono">
                                line {issue.line}
                              </span>
                            )}
                          </div>
                          {issue.detail && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {issue.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {normalisedIssues.length === 0 && (
                <div className="glass rounded-xl p-4 text-center text-sm text-muted-foreground">
                  No issues found 🎉
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Suggestions</h3>
                  </div>
                  <ul className="space-y-2">
                    {suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary mt-1">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}