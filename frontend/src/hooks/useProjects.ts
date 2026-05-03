"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApi } from "@/lib/api";

export function useProjects() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = await getToken();
      const api = createApi(token);

      const res = await api.get("/projects/");
      return res.data.data;
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const api = createApi(token);

      await api.delete(`/projects/${id}`);
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const prev = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData(["projects"], (old: any[]) =>
        old?.filter((p) => p.id !== id)
      );

      return { prev };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["projects"], context?.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects,
    isLoading,
    deleteProject: deleteProject.mutate,
  };
}