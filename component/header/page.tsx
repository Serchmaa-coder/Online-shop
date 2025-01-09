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
import ReactTextRotator from 'react-text-rotator';
import { useRouter } from 'next/navigation';

const app = initializeFirebase();
const db = getFirestore(app);

type Category = {
  name: string;
  id: string;
  counter: string | number;
};

export default function Header() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [categories, setCategories] = useState<DocumentData[]>([]);
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [query, setQuery] = useState('');

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search-result-page?query=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCol = collection(db, 'Product categories');
        const categorySnapshot = await getDocs(categoriesCol);
        const rawCategoryData = categorySnapshot.docs.map((doc) => doc.data());
        console.log('Raw category data: ', rawCategoryData);
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
        const sortedCategories = categoryData.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        setCategories(sortedCategories);
        console.log('Processed and sorted category data: ', sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCol = collection(db, 'important messages');
        const messagesSnapshot = await getDocs(messagesCol);
        const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
        console.log('Fetched messages: ', messagesData);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching sale messages: ', error);
      }
    };

    fetchMessages();
  }, []);

  const content = messages
    .map((message) => [
      {
        text: message[`m01`],
        className: 'classA',
        animation: 'fade',
      },
      {
        text: message[`m02`],
        className: 'classB',
        animation: 'fade',
      },
      {
        text: message[`m03`],
        className: 'classC',
        animation: 'fade',
      },
    ])
    .flat();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const loadGoogleTranslate = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src =
          'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;

        script.onload = () => {
          window.googleTranslateElementInit = function () {
            new window.google.translate.TranslateElement(
              { pageLanguage: 'en' },
              'google_translate_element',
            );
          };
        };

        document.head.appendChild(script);
      }
    };

    loadGoogleTranslate();
  }, []);

  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div id="google_translate_element" className={styles.translateBtn}></div>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <div className={styles.text}>
            <ReactTextRotator
              content={content}
              time={100000}
              startDelay={5000}
            />
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
          {categories.map((category, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  router.push(`/categorypage?categoryId=${category.id}`);
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
      <div className={styles['search-section']}>
        <form onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Search.."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles['search-input']}
          />
          <button type="submit" className={styles.searchBtn}>
            <SearchOutlined />
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
