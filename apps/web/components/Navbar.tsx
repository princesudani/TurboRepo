"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Navbar = () => {
  const searchParams = useSearchParams();
  const todoFilter = searchParams.get("todos");

  console.log("Navbar", todoFilter);

  return (
    <nav>
      <Link href="/" className={todoFilter === null ? "active" : ""}>
        All
      </Link>
      <Link
        href="/?todos=active"
        className={todoFilter === "active" ? "active" : ""}
      >
        Active
      </Link>
      <Link
        href="/?todos=completed"
        className={todoFilter === "completed" ? "active" : ""}
      >
        Completed
      </Link>
    </nav>
  );
};

export default Navbar;
