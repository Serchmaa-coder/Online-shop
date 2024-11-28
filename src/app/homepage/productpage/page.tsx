'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { StarFilled } from '@ant-design/icons';
import { initializeFirebase } from '../../../../lib/firebaseClient';
import { collection, getDocs, getFirestore, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const app = initializeFirebase();
export const db = getFirestore(app);
export const auth = getAuth(app);

type Product = {
  id: string;
  ProductID: string;
  Name: string;
  Price: number;
  Rating: number;
  Size: string[];
  Color: string[];
  Images: string[];
  [key: string]: unknown;
};

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // const [translatedName, setTranslatedName] = useState<string | null>(null); // Add state for translated name

  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const querySnapshot = await getDocs(collection(db, 'Product'));
        const products = querySnapshot.docs.flatMap((doc) => {
          const data = doc.data();
          return Object.values(data).map((product) => ({
            ...product,
            id: doc.id,
          }));
        });

        const selectedProduct = products.find(
          (item) => item.ProductId === productId,
        );

        if (selectedProduct) {
          setProduct(selectedProduct);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCollection = async (collectionName: string) => {
    if (!product || !userId) {
      alert('Please log in to perform this action.');
      return;
    }

    try {
      const payload = {
        productId: product.ProductId,
        name: product.Name,
        price: product.Price,
        size: selectedSize || product.Size[0],
        color: selectedColor || product.Color[0],
        quantity,
        images: product.Images,
        rating: product.Rating,
        bought: collectionName === 'cart' ? false : undefined,
      };

      const userCartRef = collection(db, collectionName, userId, 'products');
      await addDoc(userCartRef, payload);

      alert(`Added to ${collectionName}!`);
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
    }
  };

  // const handleTranslate = async () => {
  //   if (product) {
  //     try {
  //       const response = await fetch('/api/translate', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ text: product.Name, targetLanguage: 'mn' }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         // Safely access translations and check for null/undefined
  //         const translatedText = data.translatedText || 'Translation failed'; // Default text if null/undefined
  //         setTranslatedName(translatedText);
  //       } else {
  //         console.error('Error translating product name:', response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Error translating product name:', error);
  //     }
  //   }
  // };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles['main-container']}>
      <div className={styles['image-section']}>
        <hr className={styles.line} />
        <div className={styles['image-col1']}>
          {product.Images.map((img, index) => (
            <Image
              key={index}
              alt={`Product image ${index}`}
              src={img}
              layout="intrinsic"
              width={30}
              height={30}
              className={styles['image-thumbnail']}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        <Image
          alt="Main product image"
          layout="intrinsic"
          width={160}
          height={160}
          src={selectedImage || product.Images[0]}
          className={styles['main-image']}
        />
      </div>

      <div className={styles['information-section']}>
        <div className={styles.con}>
          <p className={styles.title}>Product name</p>
          <h1 className={styles.info}>{product.Name}</h1>{' '}
          {/* Show translated name if available */}
        </div>
        <div className={styles.con}>
          <p className={styles.title}>Product price</p>
          <h3
            className={styles.info}
          >{`${product.Price.toLocaleString('mn-MN')} ₮`}</h3>
        </div>
        <div className={styles.con}>
          <p className={styles.title}>Colors</p>
          <div className={styles.conColor}>
            {product.Color.map((color, index) => (
              <button
                key={index}
                className={`${styles['color-choice']} ${
                  selectedColor === color ? styles.selected : ''
                }`}
                style={{
                  height: '30px',
                  width: '30px',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid black' : 'none',
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
        <div className={styles['rating-section']}>
          <p className={styles.title}>Rating</p>
          <StarFilled /> {product.Rating}
        </div>
        <div className={styles.con}>
          <p className={styles.title}>Size choices</p>
          <div className={styles.con2}>
            {product.Size.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`${styles['size-choice']} ${
                  selectedSize === size ? styles.selected : ''
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.con}>
          <p className={styles.title}>Quantity</p>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.quantityInput}
          />
        </div>
        <button
          className={styles.btn}
          onClick={() => handleAddToCollection('order')}
        >
          Order
        </button>
        <button
          className={styles.btn}
          onClick={() => handleAddToCollection('cart')}
        >
          Cart
        </button>
        {/* <button
          className={styles.btn}
          onClick={handleTranslate} // Translate when clicked
        >
          Translate to Mongolian language
        </button> */}
      </div>
    </div>
  );
}
