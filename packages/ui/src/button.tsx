"use client";

import React from "react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  className,
  appName,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={className}
      onClick={() => alert(`Post Done`)}
    >
      {children}
    </button>
  );
};
