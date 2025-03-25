import ProductDetail from "./ProductDetail";
import styles from "./page.module.css";

interface Product {
  id: string;
  title: string;
  body: string;
}

// Generate static paths
export async function generateStaticParams() {
  const res = await fetch(
    "https://67e3028097fc65f535386f3c.mockapi.io/api/products/products"
  );
  const products = await res.json();

  return products.map((product: { id: string }) => ({
    productId: product.id,
  }));
}

// Fetch product data at build time
export async function getProductData(productId: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `https://67e3028097fc65f535386f3c.mockapi.io/api/products/products/${productId}`
    );

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    return null;
  }
}

// Page component
export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = await getProductData(params.productId);

  if (!product) {
    return <p className={styles.error}>Product not found</p>;
  }

  return <ProductDetail product={product} />;
}
