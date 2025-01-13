"use client";

import TextField from "@repo/ui/TextField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// import { Button } from "@repo/ui/button";
import React, { useEffect, useState } from "react";
import { Button } from "@repo/fun-demo/Button";

const pagination = (_page: number, _limit: number = 4) => {
  return axios.get(`http://localhost:4001/posts`, {
    params: { _page, _limit },
  });
};

const postData = (post: any) => {
  return axios.post(`http://localhost:4001/posts`, post);
};

const removePost = (postId: string) => {
  return axios.delete(`http://localhost:4001/posts/${postId}`);
};

export const Home = () => {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isInitialFetch, setIsInitialFetch] = useState(false);

  const queryClient = useQueryClient();

  const { data, isError, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => pagination(page, 4),
    enabled: false,

    // staleTime: 30000,

    // refetchInterval: 1000,
    // refetchIntervalInBackground: true,
  });

  const { mutate } = useMutation({
    mutationFn: postData,
    onSuccess: (newData: any) => {
      // queryClient.invalidateQueries("posts")
      queryClient.setQueryData(["posts"], (oldData: any) => {
        return {
          ...oldData,
          data: [...oldData.data, newData.data],
        };
      });
    },

    // onMutate: async (newPost: any) => {
    //   await queryClient.cancelQueries(["posts"]);
    //   const previousPostData = queryClient.getQueryData(["posts"]);
    //   queryClient.setQueryData(["posts"], (oldData: any) => {
    //     return {
    //       ...oldData,
    //       data: [
    //         ...oldData.data,
    //         { ...newPost, id: String(oldData?.data?.length + 1) },
    //       ],
    //     };
    //   });

    //   return {
    //     previousPostData,
    //   };
    // },

    // onError: (_error, context, _post) => {
    //   queryClient.setQueryData(["posts"], context.previousPostData);
    // },
    // onSettled: () => {
    //   queryClient.invalidateQueries(["posts"]);
    // },
  });

  const { mutate: removeMutate } = useMutation({
    mutationFn: removePost,
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["posts"], (oldData: any) => {
        return {
          ...oldData,
          data: oldData.data.filter((post: any) => post.id !== postId),
        };
      });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const post = { title, body };

    mutate(post);
    setTitle("");
    setBody("");
  };

  const handleShowData = () => {
    setIsInitialFetch(true);
    refetch();
  };

  useEffect(() => {
    if (isInitialFetch) {
      refetch();
    }
  }, [page, isInitialFetch, refetch]);

  if (isLoading) {
    return <h1>Page is loading...</h1>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  const handleRemove = (postId: string) => {
    removeMutate(postId);
  };

  console.log("call-", data);
  console.log(isLoading, isFetching);

  return (
    <>
      <Button
        variant="outlined"
        className="border border-black bg-slate-300 max-w-4xl m-5"
        onClick={() => handleShowData()}
      >
        Show Data
      </Button>

      <div className="post max-w-4xl mx-auto pt-5">
        <form onSubmit={handleSubmit} className="post">
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
        {data?.data.map((post: any) => (
          <div className="post-item" key={post.id}>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
            <Button
              onClick={() => handleRemove(post.id)}
              style={{ backgroundColor: "white", color: "black" }}
            >
              Remove
            </Button>
          </div>
        ))}

        {data?.data ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page == 1 ? true : false}
            >
              Prev Page
            </Button>
            <span style={{ marginTop: "5px" }}>{page} of 5</span>
            <Button
              variant="contained"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page == 5 ? true : false}
            >
              Next Page
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Home;
