'use client';
import Link from 'next/link';
import styles from './page.module.css';
import {
  HeartFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Input } from 'antd';
import { initializeFirebase } from '../../lib/firebaseClient';
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const app = initializeFirebase();
const db = getFirestore(app);

type Category = {
  name: string;
  id: string;
  counter: string | number;
};

export default function Header() {
  const [collapsed, setCollapsed] = useState(true);
  const [categories, setCategories] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCol = collection(db, 'Product categories');
        const categorySnapshot = await getDocs(categoriesCol);

        // Log raw data to inspect the structure
        const rawCategoryData = categorySnapshot.docs.map((doc) => doc.data());
        console.log('Raw category data: ', rawCategoryData);

        // Map the raw data to the desired structure
        const categoryData: Category[] = rawCategoryData.flatMap(
          (categoryObject) => {
            return Object.entries(categoryObject).map(
              ([categoryName, categoryDetails]) => ({
                name: categoryName,
                id: categoryDetails.id,
                counter: categoryDetails.counter,
              }),
            );
          },
        );

        // Sort categories alphabetically by name
        const sortedCategories = categoryData.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        // Set the categories state
        setCategories(sortedCategories);
        console.log('Processed and sorted category data: ', sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <p className={styles.text}>Sale info xxxxxxxxxxxx of xxxxxxxxx</p>
        </div>
        <div className={styles.btns}>
          <Link href="/login">
            <button className={styles['btn-login']}>Login</button>
          </Link>
          <p className="divider">/</p>
          <Link href="/signup">
            <button className={styles['btn-signup']}>SignUp</button>
          </Link>
        </div>
      </div>
      <nav className={styles.header}>
        <button className={styles['btn-menu']} onClick={toggleCollapsed}>
          {collapsed ? (
            <MenuUnfoldOutlined className="icon-menu" />
          ) : (
            <MenuFoldOutlined className="icon-menu" />
          )}
        </button>

        <div className={`${styles.menu} ${collapsed ? styles.hiddenMenu : ''}`}>
          {categories.map((category, index) => (
            <div key={index}>
              <div
                onClick={() => console.log(`${category} clicked`)}
                className={styles.categoryItem}
              >
                {Object.entries(category).map(([categoryName]) => (
                  <button
                    key={categoryName}
                    className={styles.categoryItem}
                    onClick={() => setCollapsed(collapsed!)}
                  >
                    <h2>{categoryName}</h2>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${styles.background} ${collapsed ? styles.hiddenback : ''}`}
          onClick={toggleCollapsed}
        ></button>

        <p className={styles.title}>SHOP NAME</p>
        <div className={styles.con1}>
          <button className={styles['btn-cart']}>
            <ShoppingCartOutlined
              className={styles.icon}
              style={{ color: 'gray' }}
            />
          </button>
          <button className={styles['btn-wishlist']}>
            <HeartFilled className={styles.icon} style={{ color: 'gray' }} />
          </button>
          <button className={styles['btn-profile']}>
            <UserOutlined className={styles['icon-profile']} />
          </button>
        </div>
      </nav>
      <div className={styles['search-section']}>
        <Input
          type="text"
          placeholder="Хайлт хийх"
          className={styles['search-input']}
          size="large"
          prefix={<SearchOutlined />}
        />
      </div>
    </div>
  );
}
