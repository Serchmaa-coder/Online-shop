'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Spin, Card } from 'antd';
import Image from 'next/image';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
} from 'firebase/firestore';
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

export default function CartPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [cartData, setCartData] = useState<{ products: Product[] } | null>(
    null,
  );

  const [priceSum, setPriceSum] = useState<number>(0);

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
            setPriceSum(0);
            setLoading(false);
            return;
          }

          const cartProducts = cartSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              productId: data.ProductId || '',
              name: data.Name || 'Unknown Product',
              price: Number(data.Price) || 0, // Ensure price is a valid number
              images: Array.isArray(data.Images) ? data.Images : [],
            };
          });

          const totalPrice = cartProducts.reduce(
            (sum, product) => sum + product.price,
            0,
          );
          setPriceSum(totalPrice); // Update the total price

          setCartData({ products: cartProducts });
        } catch (error) {
          console.error('Error fetching cart data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user is logged in');
        setPriceSum(0); // Reset price if no user is logged in
        setLoading(false);
      }
    });
    return () => unsubscribe(); // Cleanup
  }, [db]);

  const handleOrder = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user?.uid) {
      console.error('User ID is required to place an order.');
      return;
    }

    try {
      if (!cartData?.products || cartData.products.length === 0) {
        console.error('No products available to place an order.');
        return;
      }

      const ordersCollectionRef = collection(
        db,
        'orders',
        user.uid,
        'userOrders',
      );
      const userCartRef = collection(db, 'cart', user.uid, 'products');
      const batch = writeBatch(db);

      cartData.products.forEach((product) => {
        const orderDocRef = doc(ordersCollectionRef);
        batch.set(orderDocRef, {
          productId: product.productId,
          name: product.name,
          price: product.price,
          images: product.images,
          orderDate: new Date().toISOString(),
        });
      });

      const cartProductsSnapshot = await getDocs(userCartRef);
      cartProductsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      alert('Order placed and cart cleared successfully!');
      console.log('Order placed and cart cleared.');
      setCartData(null);
      setPriceSum(0);
    } catch (error) {
      console.error('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    }
  };

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
          <p className={styles.emptyCartText}>No products in your cart.</p>
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
      <div className={styles.foother}>
        <input
          className={styles.priceSum}
          value={`Price sum: ${Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(priceSum)}₮`}
          readOnly
        />
        <button className={styles.btn} onClick={handleOrder}>
          Order
        </button>
      </div>
    </div>
  );
}
