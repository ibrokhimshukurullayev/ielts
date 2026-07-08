"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chatApi";

export function useMyGroups() {
  return useQuery({
    queryKey: ["my-groups"],
    queryFn: () => chatApi.getMyGroups(),
  });
}

export function useGroupInfo(groupId) {
  return useQuery({
    queryKey: ["group", groupId, "info"],
    queryFn: () => chatApi.getGroup(groupId),
    enabled: !!groupId,
  });
}

export function useGroupPosts(groupId) {
  return useQuery({
    queryKey: ["group", groupId, "posts"],
    queryFn: () => chatApi.getPosts(groupId),
    enabled: !!groupId,
    refetchInterval: 4000,
  });
}

export function useCreatePost(groupId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text) => chatApi.createPost(groupId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["group", groupId, "posts"] }),
  });
}

export function useEditPost(groupId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, text }) => chatApi.editPost(groupId, postId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["group", groupId, "posts"] }),
  });
}

export function useAddComment(groupId, postId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text) => chatApi.addComment(groupId, postId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["group", groupId, "posts"] }),
  });
}
