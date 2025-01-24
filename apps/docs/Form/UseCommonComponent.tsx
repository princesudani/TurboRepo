"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, DialogActions } from "@mui/material";
import {
  Autocomplete,
  Button,
  CheckBox,
  Dialog,
  RadioGroupField,
  TextField,
} from "@repo/shared-components";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiHook } from "./hooks/apiHook";
import { useGetAgeGroupOptions } from "./hooks/useAgeOption";
import { useGetGenderOptions } from "./hooks/useGenderOption";
import { useGetHobbyGroupOptions } from "./hooks/useHobbyOption";
import { UserData } from "./UserData";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "./hooks/types";

const FormValuesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is Required")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  gender: z
    .string()
    .min(1, "Gender is Required")
    .refine((value) => !!value, {
      message: "common.required",
    }),
  hobby: z.array(z.string()).min(1, "At least one hobby must be selected"),
  age: z.enum(["18-25", "26-35"]).refine((value) => !!value, {
    message: "common.required",
  }),
});

export type FormValuesTypes = z.infer<typeof FormValuesSchema>;

export const UseCommonComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const childRef = useRef<any>(null);

  const { users, createUserMutate, updateUserMutate } = apiHook();

  const { genderOptions } = useGetGenderOptions();
  const { ageGroupOptions } = useGetAgeGroupOptions();
  const { hobbyGroupOptions } = useGetHobbyGroupOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValuesTypes>({
    defaultValues: {
      name: "",
      gender: "",
      hobby: [],
      age: "18-25",
    },
    resolver: zodResolver(FormValuesSchema),
    mode: "all",
  });

  const queryClient = useQueryClient();

  const onSubmit = (data: FormValuesTypes) => {
    const userData = {
      name: data.name ?? "",
      gender: data.gender ?? "",
      hobby: data.hobby ?? [],
      age: data.age ?? "",
    };

    if (selectedUser) {
      updateUserMutate(
        { ...selectedUser, ...userData },
        {
          onSuccess: (updatedData) => {
            console.log("Updated user data:", updatedData);
            queryClient.setQueryData(["users"], (oldData: User[]) => {
              return oldData.map((user) =>
                user.id === updatedData.id ? updatedData : user
              );
            });
          },
          onError: (error) => {
            console.log("Update Error:", error);
          },
        }
      );
    } else {
      createUserMutate(userData, {
        onSuccess: (newData) => {
          console.log("New user data:", newData);
          queryClient.setQueryData(["users"], (oldData: User[]) => {
            return [...oldData, newData];
          });
        },
        onError: (error) => {
          console.log("Create Error:", error);
        },
      });
    }

    reset();
    handleClose();
  };

  const defaultValue = {
    name: "",
    gender: "",
    hobby: [] as string[],
    age: "18-25" as "18-25",
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenDialog = (user: any) => {
    setSelectedUser(user);
    reset(user);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setIsOpen(false);
    reset(defaultValue);
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button onClick={handleOpen} sx={{ mb: 2 }}>
          Open Modal
        </Button>
      </Box>
      <UserData users={users} ref={childRef} onEdit={handleOpenDialog} />
      <Dialog open={isOpen} onClose={handleClose} title="User">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register}
            name="name"
            label="Enter Name"
            control={control}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            label="Gender"
            name="gender"
            options={genderOptions}
            control={control}
            error={!!errors.gender}
            helperText={errors.gender?.message}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <CheckBox
              label="Hobby"
              name="hobby"
              control={control}
              rules={{ required: "Please select at least one option" }}
              options={hobbyGroupOptions}
              error={!!errors.hobby}
              helperText={errors.hobby?.message || ""}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <RadioGroupField
              name="age"
              label="Age"
              control={control}
              options={ageGroupOptions}
              size="small"
              color="primary"
            />
          </Box>
          <DialogActions>
            <Button onClick={() => setIsOpen(false)} color="primary">
              Cancel
            </Button>

            <Button type="submit" disabled={selectedUser && !isDirty}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
