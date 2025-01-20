"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  Checkbox,
  createTheme,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, useController } from "react-hook-form";
import { z } from "zod";
import TextField from "@repo/ui/TextField";
import { Button } from "@repo/fun-demo/Button";
import ModalBox from "@repo/ui/ModalBox";

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
    address: z.string().min(10, "Address is required"),
  }),
  personal_detail: z.array(z.string().min(1, "Details are required")).length(2),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
  hobbies: z.array(z.string()).min(1, { message: "Select at least one hobby" }),
  city: z.string().min(1, { message: "City is required" }),
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
  gender: string[];
  acceptTerms: boolean;
  hobbies: string[];
  city: string;
};

type Post = {
  id: number;
  body: string;
  title: string;
};

type FormDetailsCardProps = {
  storedData: any[];
  handleremoveDetail: (index: number) => void;
  handleEditDetail: (index: number) => void;
  openModal: boolean;
  handleCloseModal: () => void;
  handleConfirm: (index: number) => void;
  editPostData: number | null;
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
        <div
          key={index}
          style={{ display: "flex", gap: "5px", marginBottom: "5px" }}
        >
          <TextField
            style={{ color: "black", width: "50%" }}
            placeholder="Enter post title"
            {...register}
            name={`users[${index}.title`}
            defaultValue={field.title}
          />
          <TextField
            style={{ color: "black", width: "50%" }}
            placeholder="Enter post body"
            {...register}
            name={`users[${index}.body`}
            defaultValue={field.body}
          />
          <Button variant="contained" onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="submit"
        variant="contained"
        onClick={() => append({ title: "", body: "" })}
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
      >
        Post
      </Button>
    </>
  );
};

const FormDetailsCard = ({
  storedData,
  handleremoveDetail,
  handleEditDetail,
  openModal,
  handleCloseModal,
  handleConfirm,
  editPostData,
}: FormDetailsCardProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "10px",
        flexWrap: "wrap",
        flexShrink: 1,
        justifyContent: "space-evenly",
      }}
    >
      {storedData.map((formValues: any, index: number) => (
        <Card
          key={index}
          style={{
            maxWidth: 600,
            marginTop: 16,
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", marginBottom: 16 }}
            >
              Name:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.name || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Email:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.email || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Message:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.message || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Contact:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.details?.contact || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Address:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.details?.address || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Age:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.personal_detail?.[0] || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Height:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.personal_detail?.[1] || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Gender:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.gender?.[0] || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              City:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.city || "N/A"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Accepted Terms:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.acceptTerms ? "Yes" : "No"}
              </span>
            </Typography>

            <Typography style={{ fontWeight: "bold", marginBottom: 8 }}>
              Hobbies:{" "}
              <span style={{ fontWeight: "lighter" }}>
                {formValues.hobbies?.join(", ") || "None"}
              </span>
            </Typography>
          </CardContent>
          <div className="text-end mb-3 flex gap-5 justify-center">
            <Button
              variant="contained"
              onClick={() => handleremoveDetail(index)}
              disabled={editPostData !== null}
              className="py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
            >
              Remove
            </Button>

            <Button
              variant="contained"
              disabled={editPostData !== null}
              onClick={() => handleEditDetail(index)}
              className="py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
            >
              Edit
            </Button>
          </div>
        </Card>
      ))}
      <ModalBox
        open={openModal}
        onClose={handleCloseModal}
        title="Confirm Delete"
        onConfirm={handleConfirm}
        confirmText="Yes"
        cancelText="No"
        titleTextStyle={{ fontWeight: "bold" }}
      >
        <p style={{ fontWeight: "bold" }}>
          Are you sure want to Remove this Data ?
        </p>
      </ModalBox>
    </div>
  );
};

export default function Service() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [storedData, setStoredData] = useState([]);
  const [editPostData, setEditPostData] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("FormData") || "[]");
    setStoredData(data);
  }, []);

  const handleremoveDetail = (index: number) => {
    console.log("id", index);
    setModalIndex(index);
    setOpenModal(true);
  };

  const handleEditDetail = (index: number) => {
    console.log("index", index);
    setEditPostData(index);
    const dataToEdit = storedData[index];
    reset(dataToEdit);
  };

  const handleConfirm = (index: number) => {
    if (modalIndex !== null) {
      console.log("id", index);
      const updatedData = storedData.filter(
        (_: any, i: number) => i !== modalIndex
      );
      localStorage.setItem("FormData", JSON.stringify(updatedData));
      setStoredData(updatedData);
      setModalIndex(null);
      setOpenModal(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalIndex(null);
  };

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
      const response = await fetch("http://localhost:4001/todos");
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
    watch,
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
      gender: [],
      acceptTerms: false,
      hobbies: [],
      city: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });
  console.log("forms errors", errors);

  const onSubmit = (data: formValues) => {
    const existingData = JSON.parse(localStorage.getItem("FormData") || "[]");

    if (editPostData !== null) {
      const updatedData = existingData.map((item: any, i: number) =>
        i === editPostData ? data : item
      );
      localStorage.setItem("FormData", JSON.stringify(updatedData));
      setStoredData(updatedData);
      setEditPostData(null);
    } else {
      const updatedData: any = [...existingData, data];
      localStorage.setItem("FormData", JSON.stringify(updatedData));
      setStoredData(updatedData);
    }
    reset(defaultValues);
  };

  const hobby = ["Reading", "Gaming", "Travelling", "Cooking"];
  const getFormData = JSON.parse(localStorage.getItem("FormData") || "[]");
  const acceptTerms = watch("acceptTerms", false);
  const gender = watch("gender", [""]);
  const selectedHobbies: string[] = watch("hobbies", [""]);
  const defaultValues = {
    name: "",
    email: "",
    message: "",
    details: { contact: "", address: "" },
    personal_detail: ["", ""],
    gender: [],
    acceptTerms: false,
    hobbies: [],
    city: "",
  };

  console.log("getFormData", getFormData);

  const {
    field: cityField,
    fieldState: { error },
  } = useController({
    name: "city",
    control,
  });

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
      {/* <div className="post-list max-w-4xl mx-auto pt-5">
        {posts.map((post: any) => (
          <div className="post-item" key={post.id}>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
          </div>
        ))}
      </div> */}
      <div className="max-w-4xl mx-auto px-4 my-5 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Form Zod
        </h1>

        <FormDetailsCard
          storedData={storedData}
          handleremoveDetail={handleremoveDetail}
          handleEditDetail={handleEditDetail}
          handleConfirm={handleConfirm}
          handleCloseModal={handleCloseModal}
          openModal={openModal}
          editPostData={editPostData}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ThemeProvider theme={theme}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-700"
              >
                Full Name:
              </label>
              <TextField
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
              <TextField
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
                placeholder="Enter Your Message.."
                className="w-full px-4 py-2 mt-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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
              <TextField
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
              <TextField
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
              <TextField
                {...register("personal_detail.0")}
                placeholder="Enter Age"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.personal_detail?.[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personal_detail?.[0].message}
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
              <TextField
                {...register("personal_detail.1")}
                placeholder="Enter Height"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.personal_detail?.[1] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personal_detail?.[1].message}
                </p>
              )}
            </div>
            <hr />

            <div className="mb-4">
              <FormControl>
                <label
                  htmlFor="gender"
                  className="block text-lg font-medium text-gray-700"
                >
                  Gender:
                </label>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  sx={{ color: "black" }}
                  value={gender}
                  row
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                    {...register("gender")}
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    {...register("gender")}
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                    {...register("gender")}
                  />
                </RadioGroup>
              </FormControl>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <hr />

            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Hobbies:
              </label>
              {hobby.map((hobby) => (
                <FormControlLabel
                  key={hobby}
                  sx={{ color: "black" }}
                  checked={selectedHobbies.includes(hobby)}
                  control={<Checkbox {...register("hobbies")} value={hobby} />}
                  label={hobby}
                />
              ))}
              {errors.hobbies && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hobbies?.message}
                </p>
              )}
            </div>
            <hr />

            <div className="mb-4 mt-4">
              <FormControl style={{ width: "25%" }} error={!!error}>
                <InputLabel
                  className="block text-lg font-medium text-gray-700"
                  id="city-label"
                >
                  City
                </InputLabel>
                <Select
                  {...cityField}
                  labelId="city-label"
                  id="city-select"
                  label="City"
                >
                  <MenuItem value="Surat">Surat</MenuItem>
                  <MenuItem value="Vadodar">Vadodar</MenuItem>
                  <MenuItem value="Rajkot">Rajkot</MenuItem>
                </Select>
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error.message}</p>
                )}
              </FormControl>
            </div>

            <div className="mb-4">
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("acceptTerms")}
                    checked={acceptTerms}
                  />
                }
                label="I accept the terms and conditions"
                sx={{ color: "black" }}
                defaultValue=""
              />
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-1">
                  You must accept the terms.
                </p>
              )}
            </div>
            {/* <UserInfo register={register} control={control} /> */}

            <div className="text-center flex gap-5 justify-center">
              <Button
                type="submit"
                value="Submit"
                variant="contained"
                //   disabled={!isValid || !i sDirty}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
              >
                {editPostData !== null ? "Update" : "Submit"}
              </Button>
              {editPostData !== null && (
                <Button
                  onClick={() => {
                    setEditPostData(null);
                    reset(defaultValues);
                  }}
                  variant="outlined"
                  className="px-6 py-3 ml-3 text-gray-600 font-medium rounded-md hover:bg-gray-200 transition duration-300 cursor-pointer"
                >
                  Cancel
                </Button>
              )}
            </div>
          </ThemeProvider>
        </form>
      </div>
    </>
  );
}
