'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { Spin, Card } from 'antd';
import Image from 'next/image';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '../../../../lib/firebaseClient';
import Link from 'next/link';

const { Meta } = Card;

type Product = {
  id: string;
  Name: string;
  Price: number;
  Images: string[];
  Color: string[];
  CategoryId: string;
  CategoryName: string;
};

const app = initializeFirebase();
const db = getFirestore(app);

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || ''; // Fetch the query parameter
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsCol = collection(db, 'Product');
        const productSnapshot = await getDocs(productsCol);
        const allProducts: Product[] = Object.keys(
          productSnapshot.docs[0].data(),
        ).map((productKey) => {
          const product = productSnapshot.docs[0].data()[productKey];
          return {
            id: product.ProductId,
            Name: product.Name || 'Unnamed Product',
            Price: product.Price || 0,
            Images: product.Images || [],
            Color: product.Color || [],
            CategoryId: product.CategoryId || '',
            CategoryName: product.CategoryName,
          };
        });

        // Filter products by search query (case-insensitive)
        const filtered = query
          ? allProducts.filter((product) =>
              product.Name.toLowerCase().includes(query),
            )
          : allProducts;

        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className={styles['main-container']}>
      <h1 className={styles.title}>
        Search Results for "{query || 'All Products'}"
      </h1>
      {loading ? (
        <div className={styles['loading-container']}>
          <Spin size="large" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <p>No products found matching "{query}".</p>
      ) : (
        <div className={styles.categories}>
          {filteredProducts.map((product) => (
            <div className={styles.items} key={product.id}>
              <Link href={`/productpage?productId=${product.id}`}>
                <Card
                  hoverable
                  style={{
                    width: '220px',
                    height: '360px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  cover={
                    product.Images.length > 0 ? (
                      <Image
                        priority={true}
                        className={styles.photo}
                        width={200}
                        height={250}
                        alt={product.Name}
                        src={product.Images[0]}
                      />
                    ) : (
                      <div
                        style={{
                          width: '200px',
                          height: '250px',
                          backgroundColor: 'gray',
                        }}
                      />
                    )
                  }
                >
                  <Meta
                    title={
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {product.Name}
                      </span>
                    }
                    description={`Price: ${Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(product.Price)}₮`}
                  />
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
