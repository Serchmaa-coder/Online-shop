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
<<<<<<< HEAD
import { DocumentData, getFirestore, writeBatch } from 'firebase/firestore';
=======
import {
  DocumentData,
  getFirestore,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
>>>>>>> 391d1e7 (a)
import { collection, getDocs } from 'firebase/firestore';
import { Dropdown, Input, MenuProps } from 'antd';
import { initializeFirebase } from '../../lib/firebaseClient';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
<<<<<<< HEAD
=======
import ReactTextRotator from 'react-text-rotator';
import Link from 'next/link';
>>>>>>> 391d1e7 (a)

const app = initializeFirebase();
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
const batch = writeBatch(firestore);

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
  const [totalPrice, setTotalPrice] = useState<number>(0);
<<<<<<< HEAD
  const [userId, setUserId] = useState<string | null>(null);
=======
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [counter, setCounter] = useState(0);
  const [wishCounter, setWishCounter] = useState(0);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(
        `homepage/search-result-page?query=${encodeURIComponent(query)}`,
      );
    }
  };
>>>>>>> 391d1e7 (a)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        if (user.photoURL) {
          setProfilePhoto(user.photoURL);
        } else {
          try {
            const userRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userRef);
<<<<<<< HEAD

=======
>>>>>>> 391d1e7 (a)
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
<<<<<<< HEAD

        // Log raw data to inspect the structure
        const rawCategoryData = categorySnapshot.docs.map((doc) => doc.data());
        console.log('Raw category data: ', rawCategoryData);

        // Map the raw data to the desired structure
=======
        const rawCategoryData = categorySnapshot.docs.map((doc) => doc.data());
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
        const sortedCategories = categoryData.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        setCategories(sortedCategories);
<<<<<<< HEAD
        console.log('Processed and sorted category data: ', sortedCategories);
=======
>>>>>>> 391d1e7 (a)
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

<<<<<<< HEAD
  const fetchCartTotal = async () => {
    try {
      if (!userId) return;
      console.log('h', userId);

      const userCartRef = collection(db, 'cart', userId, 'products');
      const snapshot = await getDocs(userCartRef);

=======
  useEffect(() => {
    if (!userId) return;

    const userCartRef = collection(db, 'cart', userId, 'products');
    const unsubscribe = onSnapshot(userCartRef, (snapshot) => {
      let productCount = 0;
>>>>>>> 391d1e7 (a)
      const total = snapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        const productPrice = data.Price || 0;
        const productQuantity = data.quantity || 1;
<<<<<<< HEAD
        console.log('h', data);

        return sum + productPrice * productQuantity;
      }, 0);

      // Update state
      setTotalPrice(total);
    } catch (error) {
      console.error('Error calculating total price:', error);
    }
  };
  useEffect(() => {
    fetchCartTotal();
  }, [userId]);
=======

        productCount += productQuantity;
        return sum + productPrice * productQuantity;
      }, 0);

      setTotalPrice(total);
      setCounter(productCount);
    });

    return () => unsubscribe();
  }, [userId, db]);

  useEffect(() => {
    if (!userId) return;

    const userWishlistRef = collection(db, 'wishlist', userId, 'products');
    const unsubscribe = onSnapshot(userWishlistRef, (snapshot) => {
      const productCount = snapshot.size;
      setWishCounter(productCount);
    });

    return () => unsubscribe();
  }, [userId, db]);
>>>>>>> 391d1e7 (a)

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
<<<<<<< HEAD
=======
          <UserOutlined className={styles['item-icon']} />
          <button
            className={styles['dropdown-btn']}
            onClick={() => {
              router.push('/homepage/orderpage');
            }}
          >
            Order history
          </button>
        </div>
      ),
      key: '0',
    },
    {
      label: (
        <div className={styles['dropdown-items']}>
>>>>>>> 391d1e7 (a)
          <LogoutOutlined className={styles['item-icon']} />
          <button
            className={styles['dropdown-btn']}
            onClick={async () => {
              if (userId) {
                try {
                  const userCartRef = collection(
                    db,
                    'cart',
                    userId,
                    'products',
                  );
                  const cartProductsSnapshot = await getDocs(userCartRef);

                  if (!cartProductsSnapshot.empty) {
                    cartProductsSnapshot.forEach((doc) => {
                      batch.delete(doc.ref);
                    });

                    await batch.commit();
                    console.log('Cart products deleted successfully.');
                  }
                } catch (error) {
                  console.error('Error deleting cart products:', error);
                }
              }

<<<<<<< HEAD
              // Proceed with signOut
=======
>>>>>>> 391d1e7 (a)
              signOut(auth)
                .then(() => {
                  console.log('User logged out successfully.');
                })
                .catch((error) => {
                  console.error('Logout error:', error);
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

<<<<<<< HEAD
  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <p className={styles.text}>Sale info xxxxxxxxxxxx of xxxxxxxxx</p>
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
            <input
              className={styles['order-money']}
              value={`${totalPrice.toLocaleString('mn-MN')} ₮`}
              readOnly
            />
<<<<<<< HEAD

            <button className={styles['btn-cart']}>
              <ShoppingCartOutlined className={styles.icon1} />
            </button>
          </div>
          <button className={styles['btn-wishlist']}>
            <HeartFilled className={styles.icon2} />
=======
            <button className={styles['btn-cart']}>
              <Link href="/homepage/cartpage">
                <ShoppingCartOutlined className={styles.icon1} />
              </Link>
            </button>
          </div>
          <button className={styles['btn-wishlist']}>
            <Link href="/homepage/wishlist-page">
              <HeartFilled className={styles.icon2} />
            </Link>
>>>>>>> 391d1e7 (a)
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
<<<<<<< HEAD
        <Input
          type="text"
          placeholder="Search"
          className={styles['search-input']}
          size="large"
          prefix={<SearchOutlined />}
        />
      </div>
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
      </div>
      {counter != 0 ? (
        <div className={styles['cart-count']}>{counter}</div>
      ) : (
        <div></div>
      )}

      {wishCounter != 0 ? (
        <div className={styles['wish-count']}>{wishCounter}</div>
      ) : (
        <div></div>
      )}
>>>>>>> 391d1e7 (a)
    </div>
  );
}
