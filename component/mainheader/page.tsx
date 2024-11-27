/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import {
  HeartFilled,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { DocumentData, getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { Dropdown, Input, MenuProps } from 'antd';
import { initializeFirebase } from '../../lib/firebaseClient';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';

const app = initializeFirebase();
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);

type Category = {
  name: string;
  id: string;
  counter: string | number;
};

export default function Mainheader() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [categories, setCategories] = useState<DocumentData[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.photoURL) {
          setProfilePhoto(user.photoURL);
        } else {
          try {
            // Fetch profilePictureUrl from Firestore
            const userRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              setProfilePhoto(userData.profilePictureUrl || null);
            } else {
              console.log('User document does not exist in Firestore');
            }
          } catch (error) {
            console.error('Error fetching user document:', error);
          }
        }
      } else {
        console.log('User logged out');
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, firestore, router]);

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

  const items: MenuProps['items'] = [
    {
      label: (
        <div className={styles['dropdown-items']}>
          <UserOutlined className={styles['item-icon']} />
          <button
            className={styles['dropdown-btn']}
            onClick={() => {
              router.push('/profilepage');
            }}
          >
            Profile
          </button>
        </div>
      ),
      key: '0',
    },
    {
      label: (
        <div className={styles['dropdown-items']}>
          <LogoutOutlined className={styles['item-icon']} />
          <button
            className={styles['dropdown-btn']}
            onClick={() => {
              signOut(auth).catch((error) => {
                console.error('Logout error', error);
              });
            }}
          >
            Logout
          </button>
        </div>
      ),
      key: '1',
    },
  ];

  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <p className={styles.text}>Sale info xxxxxxxxxxxx of xxxxxxxxx</p>
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
                onClick={() => {
                  router.push(
                    `/homepage/categorypage?categoryId=${category.id}`,
                  );

                  console.log(category.id);
                }}
                className={styles.categoryItem}
              >
                <button
                  className={styles.categoryItem}
                  onClick={() => setCollapsed(!collapsed)}
                >
                  <h2>{category.name}</h2>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${styles.background} ${collapsed ? styles.hiddenback : ''}`}
          onClick={toggleCollapsed}
        ></button>

        <p className={styles.title} onClick={() => router.push('/homepage')}>
          SHOP NAME
        </p>

        <div className={styles.con1}>
          <div className={styles['cart-section']}>
            <div className={styles['order-money']}></div>
            <button className={styles['btn-cart']}>
              <ShoppingCartOutlined className={styles.icon1} />
            </button>
          </div>
          <button className={styles['btn-wishlist']}>
            <HeartFilled className={styles.icon2} />
          </button>

          <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <button className={styles['btn-profile']}>
                {profilePhoto ? (
                  <Image
                    height={40}
                    width={40}
                    src={profilePhoto}
                    alt="Profile"
                    className={styles['profile-photo']}
                  />
                ) : (
                  <UserOutlined className={styles['icon-profile']} />
                )}
              </button>
            </a>
          </Dropdown>
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
