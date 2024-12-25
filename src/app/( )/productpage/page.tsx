'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { StarFilled } from '@ant-design/icons';
import { initializeFirebase } from '../../../../lib/firebaseClient';
import { collection, getDocs, getFirestore, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'antd';

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
<<<<<<< HEAD
=======
  Options: string[];
>>>>>>> 391d1e7 (a)
  Color: string[];
  Images: string[];
  [key: string]: unknown;
};

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
<<<<<<< HEAD
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
=======
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
>>>>>>> 391d1e7 (a)

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

  const handleAddToCollection = async (collectionName: string) => {
    if (!product || !userId) {
      setError('Please log in to perform this action.');
      return;
    }

    try {
      const payload = {
        userId,
        productId: product.ProductId,
        name: product.Name,
        price: product.Price,
        size: selectedSize || product.Size[0],
        color: selectedColor || product.Color[0],
        quantity,
      };

      console.log('Payload:', payload);

      await addDoc(collection(db, collectionName), payload);

      alert(`Added to ${collectionName}!`);
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
    }
  };

  if (!product) {
<<<<<<< HEAD
    return <p>Loading...</p>;
=======
    return <div>Loading...</div>;
>>>>>>> 391d1e7 (a)
  }

  return (
    <div className={styles['main-container']}>
      <div className={styles['image-section']}>
        <hr className={styles.line} />
        <div className={styles['image-col1']}>
          {product.Images.map((img, index) => (
            <Image
              key={index}
<<<<<<< HEAD
              height={160}
              width={160}
              alt={`Product image ${index}`}
              src={img}
=======
              alt={`Product image ${index}`}
              src={img}
              width={185}
              height={185}
              className={styles['image-thumbnail']}
              onClick={() => setSelectedImage(img)}
>>>>>>> 391d1e7 (a)
            />
          ))}
        </div>
        <Image
<<<<<<< HEAD
          height={500}
          width={400}
          alt="Main product image"
          src={product.Images[0]}
=======
          alt="Main product image"
          width={400}
          height={576}
          src={selectedImage || product.Images[0]}
          className={styles['main-image']}
>>>>>>> 391d1e7 (a)
        />
      </div>

      <div className={styles['information-section']}>
        <div className={styles.con}>
<<<<<<< HEAD
          <p className={styles.title}>Product name</p>
          <h1 className={styles.info}>{product.Name}</h1>
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
=======
          <div className={styles.title}>Product name</div>
          <h1 className={styles.info}>{product.Name}</h1>
        </div>
        <div className={styles.con}>
          <div className={styles.title}>Product price</div>
          <h3
            className={styles.info}
          >{`${Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(product.Price)}₮`}</h3>
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
>>>>>>> 391d1e7 (a)
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.quantityInput}
          />
        </div>
<<<<<<< HEAD
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
      </div>

      {/* Display error message */}
=======
        <div className={styles.btns}>
          <button
            disabled
            className={styles.btn}
            onClick={() => handleAddToCollection('order')}
          >
            Order
          </button>
          <button
            disabled
            className={styles.btn}
            onClick={() => handleAddToCollection('cart')}
          >
            Add to cart
          </button>
          <button disabled className={styles.btn}>
            Add to wishlist
          </button>
        </div>
      </div>

>>>>>>> 391d1e7 (a)
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className={styles.alert}
<<<<<<< HEAD
          onClose={() => setError(null)} // Allow users to dismiss the alert
=======
          onClose={() => setError(null)}
>>>>>>> 391d1e7 (a)
        />
      )}
    </div>
  );
}
