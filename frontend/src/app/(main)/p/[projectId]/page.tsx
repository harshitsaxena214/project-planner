"use client";

import { useParams } from "next/navigation";

import { useTasks } from "@/hooks/useTasks";
import { useProject } from "@/hooks/useProject";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectPage() {
 const { projectId } = useParams();

const {
  tasks,
  isLoading,
  updateStatus,
  deleteTask,
  isUpdating,
  isDeleting,
} = useTasks(projectId as string);

const { project } = useProject(projectId as string);

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
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus({
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
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus({
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
                      disabled={isDeleting}
                      onClick={() => deleteTask(task.id)}
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
