"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createApi } from "@/lib/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const token = await getToken();
      const api = createApi(token);

      const res = await api.get(`/tasks/project/${projectId}`);
      return res.data.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: string;
    }) => {
      const token = await getToken();
      const api = createApi(token);

      await api.patch(`/tasks/${taskId}/status`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const token = await getToken();
      const api = createApi(token);

      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const token = await getToken();
      const api = createApi(token);

      const res = await api.get(`/projects/${projectId}`);
      return res.data.data;
    },
  });
  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">
          Created{" "}
          {project?.created_at
            ? new Date(project.created_at).toLocaleDateString()
            : ""}
        </p>
        <h1 className="text-3xl font-bold mb-2">{project?.title}</h1>
        <p className="text-gray-500 text-base">{project?.description}</p>
      </div>

      <div className="grid gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))
          : tasks.map((task: any) => (
              <Card key={task.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  {/* Task Info */}
                  <div>
                    <p className="font-medium">{task.title}</p>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.status === "done"
                          ? "bg-green-500 text-white"
                          : task.status === "in_progress"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-300"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({
                          taskId: task.id,
                          status: "in_progress",
                        })
                      }
                    >
                      Start
                    </Button>

                    <Button
                      size="sm"
                      variant="default"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({
                          taskId: task.id,
                          status: "done",
                        })
                      }
                    >
                      Done
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deleteTask.isPending}
                      onClick={() => deleteTask.mutate(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
