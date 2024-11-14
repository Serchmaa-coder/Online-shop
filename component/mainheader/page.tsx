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
import { initializeApp } from 'firebase/app';
import { DocumentData, getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { Dropdown, Input, MenuProps } from 'antd';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBg1uKO4ZcczopU1XaIJgOuUdoNsX-67hk',
  authDomain: 'onlineshop-d6769.firebaseapp.com',
  projectId: 'onlineshop-d6769',
  storageBucket: 'onlineshop-d6769.appspot.com',
  messagingSenderId: '364574940309',
  appId: '1:364574940309:web:20a2ae05c900ffad8b8f9c',
  measurementId: 'G-L8M6HE7JWE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Mainheader() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [categories, setCategories] = useState<DocumentData[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfilePhoto(user.photoURL);
      } else {
        console.log('User logged out');
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCol = collection(db, 'Product categories');
        const categorySnapshot = await getDocs(categoriesCol);
        const categoryData = categorySnapshot.docs.map((doc) => doc.data());
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Profile dropdown items
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

        {/* Custom Category Menu */}
        <div className={`${styles.menu} ${collapsed ? styles.hiddenMenu : ''}`}>
          {categories.map((category, index) => (
            <div key={index}>
              <div
                onClick={() => console.log(`${category} clicked`)}
                className={styles.categoryItem}
              >
                {Object.entries(category).map(([categoryName]) => (
                  <button key={categoryName} className={styles.categoryItem}>
                    <h2>{categoryName}</h2>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${styles.background} ${collapsed ? styles.hiddenback : ''}`}
        ></div>

        <p className={styles.title} onClick={() => router.push('/homepage')}>
          SHOP NAME
        </p>

        <div className={styles.con1}>
          <div className={styles['cart-section']}>
            <div className={styles['order-money']}></div>
            <button className={styles['btn-cart']}>
              <ShoppingCartOutlined className={styles.icon} />
            </button>
          </div>
          <button className={styles['btn-wishlist']}>
            <HeartFilled className={styles.icon} />
          </button>

          <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <button className={styles['btn-profile']}>
                {profilePhoto ? (
                  <img
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
