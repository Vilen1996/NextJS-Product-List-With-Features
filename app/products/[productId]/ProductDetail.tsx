"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Product {
  id: string;
  title: string;
  body: string;
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();

  const handleBackToProducts = () => {
    router.push("/products");
  };

  return (
    <div className={styles.productDetail}>
      <h1>{product.title}</h1>
      <p>{product.body}</p>
      <button onClick={handleBackToProducts} className={styles.backButton}>
        Back to Products
      </button>
    </div>
  );
}
