"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "@repo/fun-demo/Button";
import ModalBox from "@repo/ui/ModalBox";
import TanstackQR from "../components/TanstackQR";
import Link from "next/link";
import { CircularProgress } from "@mui/material";

const pagination = (_page: number, _limit: number = 4) => {
  return axios.get(`http://localhost:4001/posts`, {
    // params: { _page, _limit },
  });
};

const postData = (post: any) => {
  return axios.post(`http://localhost:4001/posts`, post);
};

const removePost = (postId: string) => {
  return axios.delete(`http://localhost:4001/posts/${postId}`);
};

const updatePost = (post: { title: string; body: string; id: string }) => {
  return axios.put(`http://localhost:4001/posts/${post.id}`, post);
};

export const Home = () => {
  const [page, setPage] = useState(1);
  const [isInitialFetch, setIsInitialFetch] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postIdToRemove, setPostIdToRemove] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (postId: string) => {
    setPostIdToRemove(postId);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleConfirm = () => {
    if (postIdToRemove) {
      removeMutate(postIdToRemove);
    }
    handleCloseModal();
  };

  const queryClient = useQueryClient();

  const { data, isError, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => pagination(page, 4),
    enabled: isInitialFetch,

    // enabled: false,

    // staleTime: 30000,

    // refetchInterval: 1000,
    // refetchIntervalInBackground: true,
  });

  const { mutate: updatePostMutate } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", page] });
    },
  });

  const { mutate } = useMutation({
    mutationFn: postData,
    // onSuccess: (newData: any) => {
    // 1st Method
    // queryClient.invalidateQueries({ queryKey: ["posts", page] });
    // 2nd Method
    // queryClient.setQueryData(["posts", page], (oldData: any) => {
    //   return {
    //     ...oldData,
    //     data: [...oldData.data, newData.data],
    //   };
    // });
    // 3rd Method
    // refetch();
    // },
    // onMutate: async (newPost: any) => {
    //   await queryClient.cancelQueries({ queryKey: ["posts"] });
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
    //   queryClient.invalidateQueries({ queryKey: ["posts"] });
    // },
  });

  const { mutate: removeMutate } = useMutation({
    mutationFn: removePost,
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["posts", page], (oldData: any) => {
        console.log("oldData", oldData);

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

  const handleShowData = () => {
    setIsInitialFetch(true);
  };

  if (isLoading) {
    return (
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <CircularProgress />
      </h1>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  const handleRemove = (postId: string) => {
    handleOpenModal(postId);
  };

  const handleEdit = (postId: string) => {
    const postToEdit = data?.data.find((post: any) => post.id === postId);
    setEditingPost(postToEdit);
  };

  const handleEditSubmit = (editedPost: {
    id: string;
    title: string;
    body: string;
  }) => {
    updatePostMutate(editedPost);
    setEditingPost(null);
  };

  console.log("call-", data);
  console.log(isLoading, isFetching);

  return (
    <>
      {!data?.data ? (
        <div style={{ margin: 10 }}>
          <Button
            variant="outlined"
            className="border border-black bg-slate-300 max-w-4xl m-5"
            onClick={() => handleShowData()}
          >
            Show Data
          </Button>
        </div>
      ) : (
        ""
      )}

      <div className="post max-w-4xl mx-auto pt-5">
        <TanstackQR
          handleEditSubmit={handleEditSubmit}
          editingPost={editingPost}
        />

        {data?.data.map((post: any) => (
          <div className="post-item" key={post.id}>
            <Link href={`/${post.id}`}>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.body}</p>
            </Link>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => handleRemove(post.id)}
                style={{ backgroundColor: "white", color: "black" }}
              >
                Remove
              </Button>
              <Button
                onClick={() => handleEdit(post.id)}
                style={{ backgroundColor: "white", color: "black" }}
              >
                Edit
              </Button>
            </div>
            <ModalBox
              open={openModal}
              onClose={handleCloseModal}
              title="Confirm Delete"
              onConfirm={handleConfirm}
              confirmText="Yes"
              cancelText="No"
              titleTextStyle={{ fontWeight: "bold" }}
              modalBoxStyle={{
                opacity: 0.4,
                transition: "opacity 0.3s ease, visibility 0.3s ease",
              }}
            >
              <p style={{ fontWeight: "bold" }}>
                Are you sure want to Remove this Data ?
              </p>
            </ModalBox>
          </div>
        ))}

        {/* {data?.data ? (
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <Button
              variant="contained"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page == 1 ? true : false}
            >
              Prev Page
            </Button>
            <span style={{ marginTop: "5px" }}>{page}</span>
            <Button
              variant="contained"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data.data.length < 4}
            >
              Next Page
            </Button>
          </div>
        ) : (
          ""
        )} */}
      </div>
    </>
  );
};

export default Home;
