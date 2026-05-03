"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApi } from "@/lib/api";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProject = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const api = createApi(token);
      
      const res = await api.post("/projects/", {
        name,
        description,
      });

      const project = res.data.data;

      await api.post(`/ai/plan/${project.id}`, {
        title: name,
        description: description,
      });

      return project;
    },

    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/p/${project.id}`);
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    createProject.mutate();
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 bg-hero">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_50%)]" />

      <div className="relative w-full max-w-2xl">
        {/* Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            AI-generated task breakdowns
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          Plan your next project
          <br />
          <span className="text-gradient">in seconds.</span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-muted-foreground mt-4 sm:mt-5 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
          Describe what you want to build. Our AI breaks it into a clear,
          prioritized roadmap so you can start shipping immediately.
        </p>

        {/* Form */}
        <form
          onSubmit={submit}
          className="mt-8 sm:mt-12 glass rounded-2xl p-5 sm:p-6 shadow-elegant space-y-5"
        >
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Project name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Realtime collaborative whiteboard"
              className="h-12 bg-secondary/60 border-border text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does it do? Who's it for? Any key constraints or features?"
              className="min-h-32 bg-secondary/60 border-border text-base resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full h-12 gap-2"
            disabled={createProject.isPending || !name.trim() || !description.trim()}
          >
            {createProject.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating tasks…
              </>
            ) : (
              <>
                Generate task plan
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Error state */}
          {createProject.isError && (
            <p className="text-center text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}