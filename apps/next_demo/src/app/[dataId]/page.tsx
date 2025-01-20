"use client";
import { Breadcrumbs, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import React from "react";

const DataDetails = () => {
  const pagination = () => {
    return axios.get(`http://localhost:4001/posts/${dataId}`);
  };

  const { dataId } = useParams();
  const { data } = useQuery({
    queryKey: ["posts", dataId],
    queryFn: () => pagination(),
  });
  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ margin: 5 }}
      >
        <Link color="inherit" href="/">
          Home
        </Link>

        <Typography sx={{ color: "text.primary" }}>
          {data?.data.title}
        </Typography>
      </Breadcrumbs>
      <div
        className="post-item"
        style={{ width: "50%", margin: "auto", marginTop: "20px" }}
      >
        <h3 className="post-title">{data?.data.title}</h3>
        <p className="post-body">{data?.data.body}</p>
      </div>
    </>
  );
};

export default DataDetails;
