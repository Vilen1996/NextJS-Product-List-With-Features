"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";

export default function CreateProductPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3 || body.trim().length < 5) {
      setError(
        "Title must be at least 3 characters and body at least 5 characters."
      );
      return;
    }

    const newProduct = {
      title,
      body,
    };

    try {
      await axios.post(
        "https://67e3028097fc65f535386f3c.mockapi.io/api/products/products",
        newProduct
      );
      router.push("/products");
    } catch (err) {
      setError("Failed to create product. Please try again.");
    }
  };

  return (
    <div className={styles.createPage}>
      <h1>Create a New Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
