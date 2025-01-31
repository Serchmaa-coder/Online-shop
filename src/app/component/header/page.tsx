/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import {
  HeartFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import {
  fetchCategories,
  fetchMessages,
} from '../../../../lib/fetchCategoryData';

type Category = {
  name: string;
  id: string;
  counter: string | number;
};

export default function Header() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      const data = await fetchMessages();
      const texts = data
        .flatMap((message) => [message.m01, message.m02, message.m03])
        .filter(Boolean);
      setMessages(texts);
    };
    getMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % messages.length,
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [messages]);

  useEffect(() => {
    (window as any).googleTranslateElementInit = function () {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element',
      );
    };

    const loadGoogleTranslate = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src =
          'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }
    };

    loadGoogleTranslate();
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div id="google_translate_element" className={styles.translateBtn}></div>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <div className={styles.text}>
            <span className="text-rotate">{messages[currentMessageIndex]}</span>
          </div>
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
          {categories.map((category) => (
            <div key={category.id}>
              <div
                onClick={() => {
                  router.push(`/categorypage?categoryId=${category.id}`);
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
        <Link className={styles.title} href="/">
          SHOP NAME
        </Link>
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
    </div>
  );
}
