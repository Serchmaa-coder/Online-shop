'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import {
  ContainerOutlined,
  CreditCardOutlined,
  HeartFilled,
  HeartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  PushpinOutlined,
  SearchOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Input, Menu } from 'antd';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { style } from 'framer-motion/client';
import { ClassNames } from '@emotion/react';

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

export default function Mainheader() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Update the profile photo URL if the user is signed in
        setProfilePhoto(user.photoURL);
      } else {
        console.log('User logged out');
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

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

  //Menu items
  const item2: MenuProps['items'] = [
    {
      label: (
        <div
          className={styles['category-menu-items']}
          onClick={() => console.log('Fashion and Apparel clicked')}
        >
          Fashion and Apparel
        </div>
      ),
      key: '2',
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

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
        <Menu
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={item2}
          className={`${styles.menu} ${collapsed ? styles.hiddenMenu : ''}`}
        />
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
