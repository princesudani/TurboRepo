"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import { FieldErrors, useForm } from "react-hook-form";

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

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<formValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      details: {
        contact: "",
        address: ""
      },
      personal_detail: [ "", "" ],
    },
    mode: "all"
  });
  console.log("errors", errors);

  const onSubmit = (data: formValues) => {
    console.log("Submitted", data);
    reset();
  };
  const onError = (errors: FieldErrors<formValues>) => {
    console.log("Errrorrrr",errors );
    
  }

  const theme = createTheme({
      palette: { 
        mode: localStorage.getItem("darkMode") == "true" ? 'dark' : 'light',
      },
    });

  return (
    <div className="max-w-4xl mx-auto px-4 my-5 py-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Contact Us
      </h1>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <ThemeProvider theme={theme}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Full Name:
            </label>
            <input
              {...register("name", { required: "This is Required Name." })}
              placeholder="Enter Name"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email Address:
            </label>
            <input
              {...register("email", {
                required: "This is Required Email.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid Email",
                },
                validate: (fieldValues) => {
                  return (
                    fieldValues !== "hello@gmail.com" ||
                    "Enter a Different Email"
                  );
                },
              })}
              placeholder="Enter Email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-lg font-medium text-gray-700"
            >
              Your Message:
            </label>
            <textarea
              {...register("message", {
                required: "This is Required Message.",
                minLength: { value: 4, message: "This is Minlength 4" },
              })}
              rows={4}
              cols={50}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            <p className="text-red-500 text-sm mt-1">
              {errors.message?.message}
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="contact"
              className="block text-lg font-medium text-gray-700"
            >
              Contact No:
            </label>
            <input
              {...register("details.contact", {
                required: "This is Required Contact.",
              })}
              placeholder="Enter Contact Number"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.details?.contact?.message}
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-lg font-medium text-gray-700"
            >
              Address:
            </label>
            <input
              {...register("details.address", {
                required: "This is Required Address.",
              })}
              placeholder="Enter Address"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.details?.address?.message}
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-lg font-medium text-gray-700"
            >
              Age:
            </label>
            <input
              {...register("personal_detail.0", {
                valueAsNumber: true,
                required: "This is Required Age.",
              })}
              placeholder="Enter Age"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm mt-1"> 
              {errors.personal_detail?.[0]?.message}
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="height"
              className="block text-lg font-medium text-gray-700"
            >
              Height:
            </label>
            <input
              {...register("personal_detail.1", {
                required: "This is Required Height.",
              })}
              placeholder="Enter Height"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.personal_detail?.[1]?.message}
            </p>
          </div>

          <div className="text-center">
            <input
              type="submit"
              value="Submit"
              disabled={!isValid || !isDirty}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
            />
          </div>
        </ThemeProvider>
      </form>
      {/* <DevTool control={control} /> */}
    </div>
  );
};

export default Contact;
