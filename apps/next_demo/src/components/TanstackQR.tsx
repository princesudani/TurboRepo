"use client";

import { Button } from "@repo/fun-demo/Button";
import TextField from "@repo/ui/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

type PostData = {
  title: string;
  body: string;
};

interface TanstackQRProps {
  handleEditSubmit: (editedPost: {
    id: string;
    title: string;
    body: string;
  }) => void;
  editingPost: {
    id: any;
    title: string;
    body: string;
  } | null;
}
const postData = (post: PostData): Promise<AxiosResponse<any>> => {
  return axios.post(`http://localhost:4001/posts`, post);
};

const TanstackQR: React.FC<TanstackQRProps> = ({
  handleEditSubmit,
  editingPost,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const queryClient: any = useQueryClient();

  const { mutate } = useMutation<AxiosResponse<any>, Error, PostData>({
    mutationFn: postData,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setBody(editingPost.body);
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPost) {
      const post = { title, body, id: editingPost.id };
      handleEditSubmit(post);
      setTitle("");
      setBody("");
    } else {
      const newPost = { title, body };
      mutate(newPost);
      setTitle("");
      setBody("");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="post"
        style={{ display: "flex", gap: "5px", marginBottom: "10px" }}
      >
        <TextField
          sx={{ width: "50%", border: "white" }}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          value={title}
        />
        <TextField
          sx={{ width: "50%", border: "white" }}
          onChange={(e: any) => setBody(e.target.value)}
          placeholder="Enter post body"
          value={body}
        />
        <Button type="submit" variant="contained">
          Post
        </Button>
      </form>
    </div>
  );
};

export default TanstackQR;
