import { Card, CardContent } from "@/components/ui/card";
import { TaskSkeleton } from "./skeletons";

export function TaskList({ tasks, isLoading }: any) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task: any) => (
        <Card key={task.id}>
          <CardContent className="p-4 flex justify-between">
            <span>{task.title}</span>
            <span className="text-gray-500">
              {task.status}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}