"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApi } from "@/lib/api";

export function useTasks(projectId: string) {
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

      await api.patch(`/tasks/${taskId}/status`, { status });
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

  return {
    tasks,
    isLoading,
    updateStatus: updateStatus.mutate,
    deleteTask: deleteTask.mutate,
    isUpdating: updateStatus.isPending,
    isDeleting: deleteTask.isPending,
  };
}