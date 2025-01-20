import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Post = {
  id?: string;
  title: string;
  body: string;
}

const API_URL = "http://localhost:4001/posts";

// Fetch posts
const fetchPosts = (page: number, limit: number = 4) => {
  return axios.get(API_URL, { params: { _page: page, _limit: limit } });
};

// Create a post
const createPost = (post: Post) => axios.post(API_URL, post);

// Delete a post
const deletePost = (postId: string) => axios.delete(`${API_URL}/${postId}`);

// Update a post
const updatePost = (post: { title: string; body: string; id: string }) =>
  axios.put(`${API_URL}/${post.id}`, post);

export const usePosts = (page: number) => {
  return useQuery({ queryKey: ["posts", page] }, () => fetchPosts(page));
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePost, {
    onSuccess: (_: any, postId: any) => {
      queryClient.setQueryData(["posts"], (oldData: any) => ({
        ...oldData,
        data: oldData.data.filter((post: any) => post.id !== postId),
      }));
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
