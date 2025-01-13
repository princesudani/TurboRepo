"use client";
import React from "react";
import { userTodos } from "../app/store/todos";
import { Button } from "@repo/fun-demo/Button";
import { useSearchParams } from "next/navigation";

const Todos = () => {
  const { todos, handleRemoveTodos, toggleTodoIsComplated } = userTodos();

  const searchParams = useSearchParams();
  const todoFilter = searchParams.get("todos");

  let filterItem = todos;

  if (todoFilter === "active") {
    filterItem = todos.filter((todo) => !todo.complated);
  } else if (todoFilter === "completed") {
    filterItem = todos.filter((todo) => todo.complated);
  }

  console.log("Todos", todos);
  return (
    <div>
      <ul className="main-task">
        {filterItem.map((item) => {
          return (
            <li key={item.id}>
              <input
                type="checkbox"
                id={`id-${item.id}`}
                checked={item.complated}
                onChange={() => toggleTodoIsComplated(item.id)}
              />

              <label htmlFor={`id-${item.id}`}>
                {item.task.charAt(0).toUpperCase() + item.task.slice(1)}
              </label>
              {!item.complated && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveTodos(item.id)}
                >
                  Remove
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todos;
