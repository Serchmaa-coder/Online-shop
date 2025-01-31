'use client';
import React, { useEffect, useState } from 'react';
import { Spin, Card } from 'antd';
import styles from './page.module.css';
import Image from 'next/image';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '../../../../lib/firebaseClient';
import { useRouter } from 'next/navigation'; // Import useRouter
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const { Meta } = Card;

// Initialize Firebase
const app = initializeFirebase();
const storage = getStorage(app);
const db = getFirestore(app);

export default function PopularCategories() {
  const [topCategories, setTopCategories] = useState<
    { id: string; name: string; imageUrl: string; counter: number }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const docRef = collection(db, 'Product categories');
        const querySnapshot = await getDocs(docRef);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const categoryData = doc.data();

          const categoryArray = Object.entries(categoryData).map(
            ([key, value]) => ({
              id: value.id,
              name: key,
              counter: value.counter,
            }),
          );

          const sortedCategories = categoryArray.sort(
            (a, b) => b.counter - a.counter,
          );

          const categoriesWithImages = await Promise.all(
            sortedCategories.slice(0, 10).map(async (category) => {
              try {
                const folderRef = ref(
                  storage,
                  `category_photos/${category.id}`,
                );
                const images = await listAll(folderRef);
                const imageUrl =
                  images.items.length > 0
                    ? await getDownloadURL(images.items[0])
                    : 'https://via.placeholder.com/200x300?text=No+Image';
                return { ...category, imageUrl };
              } catch (error) {
                console.error(
                  `Error fetching image for category ${category.id}:`,
                  error,
                );
                return {
                  ...category,
                  imageUrl: 'https://via.placeholder.com/200x300?text=No+Image',
                };
              }
            }),
          );

          setTopCategories(categoriesWithImages);
        } else {
          console.log('No categories found!');
        }
      } catch (error) {
        console.error('Error fetching top categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchTopCategories();
  }, []);

  const navigateToCategoryPage = (categoryId: string) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const targetPath = user
        ? `/homepage/categorypage?categoryId=${categoryId}`
        : `/categorypage?categoryId=${categoryId}`;
      router.push(targetPath);
    });
  };

  return (
    <div className={styles['popular-category-section']}>
      <h3 className={styles.titles}>Explore popular categories</h3>
      <div className={styles.categories}>
        {loadingCategories ? (
          <Spin />
        ) : (
          topCategories.map((category, index) => (
            <div className={styles.items} key={category.id}>
              <Card
                hoverable
                style={{
                  width: '200px',
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                cover={
                  <Image
                    priority={index < 5}
                    className={styles.image}
                    width={200}
                    height={250}
                    alt={'category'}
                    src={category.imageUrl}
                  />
                }
                onClick={() => navigateToCategoryPage(category.id)} // Trigger navigation on click
              >
                <Meta title={category.name} />
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
