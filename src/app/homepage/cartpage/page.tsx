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

export default function CartPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [cartData, setCartData] = useState<any>(null); // To hold the raw cart data

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);

          const userCartRef = collection(db, 'cart', user.uid, 'products');
          const cartSnapshot = await getDocs(userCartRef);

          if (cartSnapshot.empty) {
            console.warn('No cart found for this user.');
            setCartData(null);
            setLoading(false);
            return;
          }

          // Extract all product data from cartSnapshot
          const cartProducts = cartSnapshot.docs.map((doc) => doc.data());
          console.log('Cart Products:', cartProducts); // Log all cart products

          setCartData({ products: cartProducts }); // Set the products array in the state
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

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Log the cart data once it is updated
  useEffect(() => {
    console.log('Updated cartData:', cartData); // This will log when cartData is updated
  }, [cartData]); // This effect runs every time cartData changes

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
            {cartData.products.map((product: any) => (
              <div className={styles.items} key={product.productId}>
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
                      product.images.length > 0 ? (
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
                      description={`Price: ${Intl.NumberFormat('en-US', {
                        maximumFractionDigits: 0,
                      }).format(product.price)}₮`}
                    />
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.foother}>
        <button className={styles.btn}>Order</button>
      </div>
    </div>
  );
}
