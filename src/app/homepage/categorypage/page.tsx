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

type Category = {
  name: string;
  id: string;
  counter: string | number;
};

const app = initializeFirebase();
const db = getFirestore(app);

export default function CatalogPage() {
  const [, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true); // Add a loading state for categories

  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCol = collection(db, 'Product categories');
        const categorySnapshot = await getDocs(categoriesCol);
        const categoryData: Category[] = categorySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            name: data.name,
            id: data.id,
            counter: data.counter,
          };
        });
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false); // Set loadingCategories to false after fetching is complete
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
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

        setProducts(allProducts);

        // Filter products based on categoryId if provided
        let filtered = categoryId
          ? allProducts.filter((product) => product.CategoryId === categoryId)
          : allProducts;

        // Sort filtered products by price in ascending order
        filtered = filtered.sort((a, b) => a.Price - b.Price);

        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div className={styles['main-container']}>
      {loadingCategories ? (
        <h1 className={styles.title}>Loading Category...</h1>
      ) : filteredProducts.length > 0 ? (
        // Use the CategoryName from the first product in the filteredProducts list
        <h1 className={styles.title}>{filteredProducts[0].CategoryName}</h1>
      ) : (
        <h1 className={styles.title}>Category Not Found</h1>
      )}
      {loadingProducts ? (
        <div className={styles['loading-container']}>
          <Spin size="large" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className={styles.categories}>
          {filteredProducts.map((product) => (
            <div className={styles.items} key={product.id}>
              <Link href={`/homepage/productpage?productId=${product.id}`}>
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
