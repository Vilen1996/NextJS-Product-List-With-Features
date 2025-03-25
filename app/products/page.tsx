"use client";
import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";

interface Product {
  id: number;
  title: string;
  body: string;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onToggleLike: (id: number) => void;
  onEdit: (id: number, updatedProduct: Product) => void;
  isLiked: boolean;
}

const ProductCard = ({
  product,
  onDelete,
  onToggleLike,
  onEdit,
  isLiked,
}: ProductCardProps) => {
  const router = useRouter();

  const handleCardClick = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new title:", product.title);
    if (newTitle) {
      onEdit(product.id, { ...product, title: newTitle });
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <h3>{product.title.slice(0, 60)}</h3>
      <div className={styles.icons} onClick={(e) => e.stopPropagation()}>
        <span
          className={`${styles.icon} ${isLiked ? styles.liked : ""}`}
          onClick={() => onToggleLike(product.id)}
        >
          ❤️
        </span>
        <span className={`${styles.icon} ${styles.edit}`} onClick={handleEdit}>
          ✏️
        </span>
        <span
          className={`${styles.icon} ${styles.delete}`}
          onClick={() => onDelete(product.id)}
        >
          🗑️
        </span>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 14;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(
          "https://67e3028097fc65f535386f3c.mockapi.io/api/products/products"
        );
        setProducts(res.data);
      } catch {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `https://67e3028097fc65f535386f3c.mockapi.io/api/products/products/${id}`
      );
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  const handleToggleLike = (id: number) => {
    setLikedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((likedId) => likedId !== id)
        : [...prev, id]
    );
  };

  const handleEdit = async (id: number, updatedProduct: Product) => {
    try {
      const res = await axios.put(
        `https://67e3028097fc65f535386f3c.mockapi.io/api/products/products/${id}`,
        updatedProduct
      );
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? res.data : product))
      );
    } catch (err) {
      console.error("Failed to edit product", err);
      setError("Failed to edit product. Please try again.");
    }
  };

  const filteredProducts = products
    .filter((product) =>
      filter === "favorites" ? likedProducts.includes(product.id) : true
    )
    .filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => location.reload()}>Retry</button>
      </div>
    );

  return (
    <div>
      <div className={styles.main}>
        <h1>Products</h1>
        <div className={styles.filters}>
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? styles.active : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={filter === "favorites" ? styles.active : ""}
          >
            Favorites
          </button>
        </div>
        <input
          type="text"
          placeholder="Искать по названию"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <a href="/create-product" className={styles.createProduct}>
          Create Product
        </a>
      </div>
      <div className={styles.productList}>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onToggleLike={handleToggleLike}
              onEdit={handleEdit}
              isLiked={likedProducts.includes(product.id)}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Предыдущая
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
}
