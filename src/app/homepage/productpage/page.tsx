'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { StarFilled } from '@ant-design/icons';
import { initializeFirebase } from '../../../../lib/firebaseClient';
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
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
  Options: string[];
  Quantity: number;
  Images: string[];
  [key: string]: unknown;
};

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null); // User is not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('Product ID from URL:', productId);
  }, [productId]);

  useEffect(() => {
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

        console.log('Fetched products:', products);
        console.log('Product Options:', product?.Options);

        const selectedProduct = products.find(
          (item) => item.ProductId === productId,
        );

        console.log('Selected product:', selectedProduct);

        if (selectedProduct) {
          setProduct(selectedProduct);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        setError('Failed to fetch product data. Please try again later.');
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCollection = async (
    product: Product,
    userId: string,
    collectionName: string,
    updateFields?: Partial<Product>,
  ) => {
    if (!product || !userId) {
      alert('Please log in to perform this action.');
      return;
    }

    try {
      const payload = {
        ...product,
        ...updateFields,
      };

      const userCollectionRef = collection(
        db,
        collectionName,
        userId,
        'products',
      );
      await addDoc(userCollectionRef, payload);

      alert(`Product added to ${collectionName}!`);
    } catch (error) {
      console.error(`Error adding product to ${collectionName}:`, error);
    }
  };

  const handleOrder = async () => {
    if (!userId || !product) {
      alert('User not logged in or product data is unavailable.');
      return;
    }

    try {
      const userOrderDocRef = doc(db, 'orders', userId, 'userOrders');
      await setDoc(userOrderDocRef, { bought: true });

      const userProductsRef = collection(db, 'orders', userId, 'products');
      const productPayload = {
        ...product,
        quantity,
        selectedSize,
        selectedColor,
        selectedOption,
      };
      await addDoc(userProductsRef, productPayload);

      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
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
              width={185}
              height={185}
              className={styles['image-thumbnail']}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        <div className={styles['image-wrapper']}>
          <Image
            alt="Main product image"
            layout="fill"
            src={selectedImage || product.Images[0]}
            className={styles['main-image']}
          />
        </div>
      </div>

      <div className={styles['information-section']}>
        <div className={styles.con}>
          <div className={styles.title}>Product name</div>
          <h1 className={styles.info}>{product.Name}</h1>
        </div>
        <div className={styles.con}>
          <div className={styles.title}>Product price</div>
          <h3
            className={styles.info}
          >{`${product.Price.toLocaleString('mn-MN')} ₮`}</h3>
        </div>
        {product.Color.length > 0 && (
          <div className={styles.con}>
            <div className={styles.title}>Colors</div>
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
                    border:
                      selectedColor === color ? '2px solid black' : 'none',
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles['rating-section']}>
          <div className={styles.title}>Rating</div>
          <StarFilled /> {product.Rating}
        </div>
        {product.Options.length > 0 && (
          <div className={styles.con}>
            <div className={styles.title}>Options</div>
            <div className={styles.con2}>
              {product.Options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`${styles['size-choice']} ${
                    selectedOption === option ? styles.selected : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.Size.length > 0 && (
          <div className={styles.con}>
            <div className={styles.title}>Size choices</div>
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
        )}

        <div className={styles.con}>
          <div className={styles.title}>Quantity</div>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.quantityInput}
          />
        </div>
        <div className={styles.btns}>
          <button className={styles.btn} onClick={() => handleOrder()}>
            Order
          </button>
          <button
            className={styles.btn}
            onClick={() => handleAddToCollection(product, userId!, 'cart')}
          >
            Add to Cart
          </button>
          <button
            className={styles.btn}
            onClick={() =>
              handleAddToCollection(product, userId!, 'wishlist', {
                bought: false,
              })
            }
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
