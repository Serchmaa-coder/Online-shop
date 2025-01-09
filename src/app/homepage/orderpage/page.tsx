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
  orderDate: string; // Add this field to group by date
}

interface GroupedProducts {
  [date: string]: Product[];
}

export default function OrderPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [groupedOrders, setGroupedOrders] = useState<GroupedProducts | null>(
    null,
  );
  const [, setPriceSum] = useState<number>(0);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);

          const userOrderRef = collection(db, 'orders', user.uid, 'userOrders');
          const orderSnapshot = await getDocs(userOrderRef);

          if (orderSnapshot.empty) {
            console.warn('No order found for this user.');
            setGroupedOrders(null);
            setLoading(false);
            return;
          }
          const allProducts: Product[] = orderSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              productId: data.productId || '',
              name: data.name || 'Unknown Product',
              price: data.price || 0,
              images: Array.isArray(data.images) ? data.images : [],
              orderDate: data.orderDate || 'Unknown Date',
            };
          });

          const grouped: GroupedProducts = allProducts.reduce(
            (acc, product) => {
              const date = product.orderDate.split('T')[0];
              if (!acc[date]) {
                acc[date] = [];
              }
              acc[date].push(product);
              return acc;
            },
            {} as GroupedProducts,
          );

          setGroupedOrders(grouped);

          const totalPrice = allProducts.reduce(
            (sum, product) => sum + Number(product.price),
            0,
          );
          setPriceSum(totalPrice);
        } catch (error) {
          console.error('Error fetching order data:', error);
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
      <h1 className={styles.title}>Order History</h1>
      <div className={styles['main-container']}>
        {loading ? (
          <div className={styles['loading-container']}>
            <Spin size="large" />
          </div>
        ) : !groupedOrders || Object.keys(groupedOrders).length === 0 ? (
          <p>No products in your orders.</p>
        ) : (
          <div>
            {Object.keys(groupedOrders).map((date) => (
              <div key={date} className={styles.orderGroup}>
                <h2 className={styles.groupTitle}>Order Date: {date}</h2>
                <div className={styles.categories}>
                  {groupedOrders[date].map((product) => (
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
                            Array.isArray(product.images) &&
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
                              <span
                                style={{
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                }}
                              >
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
