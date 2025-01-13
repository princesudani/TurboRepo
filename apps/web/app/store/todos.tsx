"use client";
import React, { createContext, ReactNode, useState, useContext } from "react";

export type Todo = {
  id: string;
  task: string;
  complated: boolean;
  createdAt: Date;
};

export type TodosContext = {
  todos: Todo[];
  handleAddTodo: (task: string) => void;
  toggleTodoIsComplated: (id: string) => void;
  handleRemoveTodos: (id: string) => void;
};

export const todoContext = createContext<TodosContext | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const newTodos = localStorage.getItem("todos") || "[]";
    return JSON.parse(newTodos) as Todo[];
  });

  const handleAddTodo = (task: string) => {
    setTodos((prev) => {
      const newTodos: Todo[] = [
        {
          id: Math.random().toString(),
          task,
          complated: false,
          createdAt: new Date(),
        },
        ...prev,
      ];
      localStorage.setItem("todos", JSON.stringify(newTodos));
      return newTodos;
    });
  };

  const toggleTodoIsComplated = (id: string) => {
    setTodos((prev) => {
      const newComplated = prev.map((task) => {
        if (task.id === id) {
          return { ...task, complated: !task.complated };
        }
        return task;
      });
      localStorage.setItem("todos", JSON.stringify(newComplated));
      return newComplated;
    });
  };

  const handleRemoveTodos = (id: string) => {
    setTodos((prev) => {
      const newTodos = prev.filter((task) => {
        return task.id !== id;
      });
      localStorage.setItem("todos", JSON.stringify(newTodos));
      return newTodos;
    });
  };

  return (
    <todoContext.Provider
      value={{ todos, handleAddTodo, toggleTodoIsComplated, handleRemoveTodos }}
    >
      {children}
    </todoContext.Provider>
  );
};

export function userTodos() {
  const todoContextValue = useContext(todoContext);

  if (!todoContextValue) {
    throw new Error("useTodos used outside of Provider");
  }
  return todoContextValue;
}
