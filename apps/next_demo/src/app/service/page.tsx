"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import TextField from "@repo/ui/TextField";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(4, "Message must be at least 4 characters"),
  details: z.object({
    contact: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits")
      .regex(/^\d+$/, "Phone number must be numeric"),
    address: z.string().min(1, "Address is required"),
  }),
  personal_detail: z.array(z.string().min(1, "Details are required")).length(2),
});

type formValues = {
  name: string;
  email: string;
  message: string;
  details: {
    contact: string;
    address: string;
  };
  personal_detail: string[];
};

type Post = {
  id: number;
  body: string;
  title: string;
};

const UserInfo = (prop: any) => {
  const { register, control } = prop;
  const { append, remove, fields } = useFieldArray({
    control,
    name: "users",
  });
  return (
    <>
      {fields.map((field: any, index: any) => (
        <div key={index}>
          {/* <input
            placeholder="Enter post title"
            {...register}
            name={`users[${index}.title`}
            defaultValue={field.title}
          /> */}
          {/* <input
            placeholder="Enter post body"
            {...register}
            name={`users[${index}.body`}
            defaultValue={field.body}
          /> */}
           <TextField
            sx={{ color: "black", width: "50%" }}
            placeholder="Enter post title"
            {...register}
            name={`users[${index}.title`}
            defaultValue={field.title}
          />
          <TextField
            sx={{ color: "black", width: "50%" }}
            placeholder="Enter post body"
            {...register}
            name={`users[${index}.body`}
            defaultValue={field.body}
          />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button
        type="submit"
        onClick={() => append({ title: "", body: "" })}
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
      >
        Post
      </button>
    </>
  );
};

export default function Service() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // const fetchPosts = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:4001/todos");
  //     setPosts(response.data);
  //   } catch (error) {
  //     setIsError(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:4001/posts");
      const data = await response.json();
      console.log("data", data);
      setPosts(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty, errors },
    reset,
    control,
  } = useForm<formValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      details: {
        contact: "",
        address: "",
      },
      personal_detail: ["", ""],
    },
    mode: "all",
    resolver: zodResolver(schema),
  });
  console.log("forms errors", errors);

  const onSubmit = (data: formValues) => {
    console.log("Submitted", data);
    reset();
  };
  

  const theme = createTheme({
    palette: {
      mode: localStorage.getItem("darkMode") === "true" ? "dark" : "light",
    },
  });

  if (isLoading) {
    return <div>Page is loading...</div>;
  }

  if (isError) {
    return <div>Error has occurred...</div>;
  }
  

  return (
    <>
      <div className="post-list max-w-4xl mx-auto pt-5">
        {posts.map((post: any) => (
          <div className="post-item" key={post.id}>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-4 my-5 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Form
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ThemeProvider theme={theme}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-700"
              >
                Full Name:
              </label>
              <input
                {...register("name")}
                placeholder="Enter Name"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700"
              >
                Email Address:
              </label>
              <input
                {...register("email")}
                placeholder="Enter Email"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-lg font-medium text-gray-700"
              >
                Your Message:
              </label>
              <textarea
                {...register("message")}
                rows={4}
                cols={50}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="contact"
                className="block text-lg font-medium text-gray-700"
              >
                Contact No:
              </label>
              <input
                {...register("details.contact")}
                placeholder="Enter Contact Number"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.details?.contact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.details?.contact?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-lg font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                {...register("details.address")}
                placeholder="Enter Address"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.details?.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.details?.address?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="age"
                className="block text-lg font-medium text-gray-700"
              >
                Age:
              </label>
              <input
                {...register("personal_detail.0")}
                placeholder="Enter Age"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.personal_detail?.[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personal_detail?.[0]?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="height"
                className="block text-lg font-medium text-gray-700"
              >
                Height:
              </label>
              <input
                {...register("personal_detail.1")}
                placeholder="Enter Height"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.personal_detail?.[1] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personal_detail?.[1]?.message}
                </p>
              )}
            </div>

            <UserInfo register={register} control={control} />

            <div className="text-center">
              <input
                type="submit"
                value="Submit"
                //   disabled={!isValid || !i sDirty}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
              />
            </div>
          </ThemeProvider>
        </form>
      </div>
    </>
  );
}
