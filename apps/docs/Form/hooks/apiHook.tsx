import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./basicUrl";
import { User } from "./types";

const fetchUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

const createUser = async (newUser: { name: string }) => {
  const response = await axiosInstance.post("/users", newUser);
  return response.data;
};

const deleteUser = async (userId: number) => {
  const response = await axiosInstance.delete(`/users/${userId}`);
  return response.data;
};

const updateUser = async (updatedUser: User) => {
  const response = await axiosInstance.put(
    `/users/${updatedUser.id}`,
    updatedUser
  );
  return response.data;
};

export const apiHook = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    initialData: [],
  });

  const { mutate: createUserMutate, error: createError } = useMutation({
    mutationFn: createUser,
  });

  const { mutate: deleteUserMutate, error: deleteError } = useMutation({
    mutationFn: deleteUser,
  });

  const { mutate: updateUserMutate, error: updateError } = useMutation({
    mutationFn: updateUser,
  });

  return {
    users,
    isLoading,
    error,
    createUserMutate,
    createError,
    deleteUserMutate,
    deleteError,
    updateUserMutate,
    updateError,
  };
};
