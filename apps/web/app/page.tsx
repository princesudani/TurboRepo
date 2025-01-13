import styles from "./page.module.css";
import AddToDo from "../components/AddToDo";
import Todos from "../components/Todos";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className={styles.page}>
      <div>
        <main>
          <h2>TypeScript & Next.Js</h2>
          <Navbar />
          <AddToDo />
          <Todos />
        </main>
      </div>
    </div>
  );
}
