"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";

interface Product {
  id: string;
  title: string;
  body: string;
}

// ✅ Generate static paths at build time
export async function generateStaticParams() {
  const res = await fetch(
    "https://67e3028097fc65f535386f3c.mockapi.io/api/products/products"
  );
  const products = await res.json();

  return products.map((product: { id: string }) => ({
    productId: product.id,
  }));
}

// 🎯 Product detail component
export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      axios
        .get<Product>(
          `https://67e3028097fc65f535386f3c.mockapi.io/api/products/products/${productId}`
        )
        .then((res) => setProduct(res.data))
        .catch(() => setError("Failed to fetch product details"))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const handleBackToProducts = () => {
    router.push("/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  if (!product) return <p>Product not found</p>;

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
