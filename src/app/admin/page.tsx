'use client';

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firestore and Storage
const db = getFirestore();
const storage = getStorage();

/**
 * Uploads a product's data to Firestore and photo to Firebase Storage.
 * @param {Object} productData - The product data containing name, description, price, additional info.
 * @param {File} photoFile - The product photo file to upload.
 */
async function addProduct(productData, photoFile) {
  try {
    // 1. Upload the photo to Firebase Storage
    const photoRef = ref(storage, `products/${photoFile.name}`);
    await uploadBytes(photoRef, photoFile);

    // 2. Get the download URL of the uploaded photo
    const photoUrl = await getDownloadURL(photoRef);

    // 3. Add product data to Firestore with the photo URL
    const productDocRef = await addDoc(collection(db, 'products'), {
      ...productData,
      photoUrl: photoUrl, // Include the photo URL in the product data
    });

    console.log('Product added with ID:', productDocRef.id);
  } catch (error) {
    console.error('Error adding product:', error);
  }
}
import React, { useState } from 'react';

export default function Admin() {
  const [productData, setProductData] = useState({
    category: '',
    name: '',
    description: '',
    price: 0,
    brand: '',
    additionalInfo: {
      color: '',
      size: '',
    },
  });
  const [photoFile, setPhotoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photoFile) {
      await addProduct(productData, photoFile);
      alert('Product added successfully!');
    } else {
      alert('Please upload a photo.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        onChange={(e) =>
          setProductData({ ...productData, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Product Description"
        onChange={(e) =>
          setProductData({ ...productData, description: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Price"
        onChange={(e) =>
          setProductData({ ...productData, price: Number(e.target.value) })
        }
      />
      <input
        type="text"
        placeholder="Color"
        onChange={(e) =>
          setProductData({
            ...productData,
            additionalInfo: {
              ...productData.additionalInfo,
              color: e.target.value,
            },
          })
        }
      />
      <input
        type="text"
        placeholder="Size"
        onChange={(e) =>
          setProductData({
            ...productData,
            additionalInfo: {
              ...productData.additionalInfo,
              size: e.target.value,
            },
          })
        }
      />
      <input type="file" onChange={(e) => setPhotoFile(e.target.files[0])} />
      <button type="submit">Add Product</button>
    </form>
  );
}
