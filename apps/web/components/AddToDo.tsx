"use client";
import { Button } from "@repo/fun-demo/Button";
import TextField from "@repo/ui/TextField";
import React, { useState } from "react";
import { userTodos } from "../app/store/todos";

const AddToDo = () => {
  const [todo, setTodo] = useState("");

  const { handleAddTodo } = userTodos();
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleAddTodo(todo);
    setTodo("");
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
          <TextField
            className="input"
            placeholder="Add ToDo"
            color="secondary"
            sx={{ bgcolor: "grey" }}
            onChange={(e) => setTodo(e.target.value)}
            value={todo}
          />
          <Button variant="outlined" type="submit" className="button">
            Add
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddToDo;
