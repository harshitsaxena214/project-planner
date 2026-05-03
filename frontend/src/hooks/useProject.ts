"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApi } from "@/lib/api";

export function useProject(projectId: string) {
  const { getToken } = useAuth();

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const token = await getToken();
      const api = createApi(token);

      const res = await api.get(`/projects/${projectId}`);
      return res.data.data;
    },
  });

  return { project };
}