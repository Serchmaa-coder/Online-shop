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
<<<<<<< HEAD
=======
import ReactTextRotator from 'react-text-rotator';
import { useRouter } from 'next/navigation';
>>>>>>> 391d1e7 (a)

const app = initializeFirebase();
const db = getFirestore(app);

type Category = {
  name: string;
  id: string;
  counter: string | number;
};

export default function Header() {
<<<<<<< HEAD
  const [collapsed, setCollapsed] = useState(true);
  const [categories, setCategories] = useState<DocumentData[]>([]);
=======
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
>>>>>>> 391d1e7 (a)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCol = collection(db, 'Product categories');
        const categorySnapshot = await getDocs(categoriesCol);
<<<<<<< HEAD

        // Log raw data to inspect the structure
        const rawCategoryData = categorySnapshot.docs.map((doc) => doc.data());
        console.log('Raw category data: ', rawCategoryData);

        // Map the raw data to the desired structure
=======
        const rawCategoryData = categorySnapshot.docs.map((doc) => doc.data());
        console.log('Raw category data: ', rawCategoryData);
>>>>>>> 391d1e7 (a)
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
<<<<<<< HEAD

        // Sort categories alphabetically by name
        const sortedCategories = categoryData.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        // Set the categories state
=======
        const sortedCategories = categoryData.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
>>>>>>> 391d1e7 (a)
        setCategories(sortedCategories);
        console.log('Processed and sorted category data: ', sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

<<<<<<< HEAD
=======
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

>>>>>>> 391d1e7 (a)
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

<<<<<<< HEAD
  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <p className={styles.text}>Sale info xxxxxxxxxxxx of xxxxxxxxx</p>
=======
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
>>>>>>> 391d1e7 (a)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 391d1e7 (a)
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${styles.background} ${collapsed ? styles.hiddenback : ''}`}
          onClick={toggleCollapsed}
        ></button>
<<<<<<< HEAD

        <p className={styles.title}>SHOP NAME</p>
=======
        <Link className={styles.title} href="/">
          SHOP NAME
        </Link>
>>>>>>> 391d1e7 (a)
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
<<<<<<< HEAD
        <Input
          type="text"
          placeholder="Search"
          className={styles['search-input']}
          size="large"
          prefix={<SearchOutlined />}
        />
=======
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
>>>>>>> 391d1e7 (a)
      </div>
    </div>
  );
}
