"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chatApi";

export function useGroup() {
  return useQuery({
    queryKey: ["group"],
    queryFn: () => chatApi.getGroup(),
    refetchInterval: 4000,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text) => chatApi.createPost(text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["group"] }),
  });
}

export function useAddComment(postId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text) => chatApi.addComment(postId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["group"] }),
  });
}
