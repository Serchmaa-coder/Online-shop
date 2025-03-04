'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Spin, Card } from 'antd';
import Image from 'next/image';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '../../../../lib/firebaseClient';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const { Meta } = Card;

const app = initializeFirebase();
const db = getFirestore(app);

interface Product {
  productId: string;
  name: string;
  price: number;
  images: string[];
}

export default function WishlistPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [cartData, setCartData] = useState<{ products: Product[] } | null>(
    null,
  );

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);

          const userCartRef = collection(db, 'wishlist', user.uid, 'products');
          const cartSnapshot = await getDocs(userCartRef);

          if (cartSnapshot.empty) {
            console.warn('No cart found for this user.');
            setCartData(null);
            setLoading(false);
            return;
          }

          const cartProducts: Product[] = cartSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              productId: data.ProductId || '',
              name: data.Name || 'Unknown Product',
              price: data.Price || 0,
              images: Array.isArray(data.Images) ? data.Images : [],
            };
          });

          setCartData({ products: cartProducts });
        } catch (error) {
          console.error('Error fetching cart data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user is logged in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.con}>
      <div className={styles['main-container']}>
        {loading ? (
          <div className={styles['loading-container']}>
            <Spin size="large" />
          </div>
        ) : cartData === null ||
          !cartData.products ||
          cartData.products.length === 0 ? (
          <p>No products in your cart.</p>
        ) : (
          <div className={styles.categories}>
            {cartData.products.map((product, index) => (
              <div className={styles.items} key={product.productId || index}>
                <Link
                  href={`/homepage/productpage?productId=${product.productId}`}
                >
                  <Card
                    hoverable
                    style={{
                      width: '220px',
                      height: '360px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    cover={
                      product.images && product.images.length > 0 ? (
                        <Image
                          priority
                          className={styles.photo}
                          width={200}
                          height={250}
                          alt={product.name}
                          src={product.images[0]}
                        />
                      ) : (
                        <div
                          style={{
                            width: '200px',
                            height: '250px',
                            backgroundColor: 'gray',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          No Image
                        </div>
                      )
                    }
                  >
                    <Meta
                      title={
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                          {product.name}
                        </span>
                      }
                      description={`Price: ${product.price.toLocaleString('mn-MN')} ₮`}
                    />
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
