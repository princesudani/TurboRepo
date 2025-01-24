import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { apiHook } from "./hooks/apiHook";
import { Button, DeleteDialog } from "@repo/shared-components";

type User = {
  id: number;
  name: string;
  gender: string;
  hobby: string[];
  age: string;
};

export const UserData = forwardRef(
  ({ users, onEdit }: { users: User[]; onEdit: (user: User) => void }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const { deleteUserMutate } = apiHook();

    const handleDelete = () => {
      if (selectedUserId !== null) {
        deleteUserMutate(selectedUserId, {
          onSuccess: () => {
            setIsOpen(false);
            setSelectedUserId(null);
          },
          onError: (error) => {
            console.log("Delete Error:", error);
          },
        });
      }
    };

    const handleEdit = (user: User) => {
      onEdit(user);
    };

    const handleOpenDelete = (userId: number) => {
      setSelectedUserId(userId);
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setSelectedUserId(null);
    };

    useImperativeHandle(ref, () => ({
      openEditDialog: (user: User) => {
        handleEdit(user);
      },
    }));

    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {users.map((user) => (
          <div key={user.id}>
            <Card
              sx={{
                margin: 2,
                padding: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5">{user.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Gender: {user.gender}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Age: {user.age}
                </Typography>
                <Box mt={1}>
                  <Typography variant="body2" color="textSecondary">
                    Hobbies: {user.hobby.join(", ")}
                  </Typography>
                </Box>
              </CardContent>
              <div style={{ display: "flex", gap: "5px" }}>
                <Button onClick={() => handleEdit(user)}>Edit</Button>
                <Button onClick={() => handleOpenDelete(user.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        ))}
        <DeleteDialog
          title="Are you sure you want to Delete this user?"
          open={isOpen}
          onClose={handleClose}
          isDeleteLoading={false}
          onDelete={handleDelete}
        />
      </div>
    );
  }
);
