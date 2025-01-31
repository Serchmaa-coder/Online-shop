// lib/fetchData.ts
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from './firebaseClient';

const app = initializeFirebase();
const db = getFirestore(app);

export const fetchCategories = async () => {
  try {
    const categoriesCol = collection(db, 'Product categories');
    const categorySnapshot = await getDocs(categoriesCol);
    const rawCategoryData = categorySnapshot.docs.map((doc) => doc.data());

    console.log('Raw category data: ', rawCategoryData);

    const categoryData = rawCategoryData.flatMap((categoryObject) =>
      Object.entries(categoryObject).map(([categoryName, categoryDetails]) => ({
        name: categoryName,
        id: categoryDetails.id,
        counter: categoryDetails.counter,
      })),
    );

    const sortedCategories = categoryData.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    console.log('Processed and sorted category data: ', sortedCategories);
    return sortedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchMessages = async () => {
  try {
    const messagesCol = collection(db, 'important messages');
    const messagesSnapshot = await getDocs(messagesCol);
    const messagesData = messagesSnapshot.docs.map((doc) => doc.data());

    console.log('Fetched messages: ', messagesData);
    return messagesData;
  } catch (error) {
    console.error('Error fetching sale messages:', error);
    return [];
  }
};
