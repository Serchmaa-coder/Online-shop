'use client';
import React, { useEffect, useState } from 'react';
import { Carousel, Spin } from 'antd';
import styles from './page.module.css';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeFirebase } from '../../lib/firebaseClient';
// Initialize Firebase
const app = initializeFirebase();
const storage = getStorage(app);

export default function TopBanner() {
  const [bannerImages, setBannerImages] = useState<string[]>([]);

  useEffect(() => {
    // Fetch Banner Images
    const fetchBannerImages = async () => {
      const folderRef = ref(storage, 'banner photos');
      try {
        const result = await listAll(folderRef);
        const urls = await Promise.all(
          result.items.map((item) => getDownloadURL(item)),
        );
        setBannerImages(urls);
      } catch (error) {
        console.error('Error fetching banner images:', error);
      }
    };

    fetchBannerImages();
  }, []);
  return (
    <div>
      <div className={styles['carousel-section']}>
        <Carousel autoplay>
          {bannerImages.length > 0 ? (
            bannerImages.map((url, index) => (
              <div key={index}>
                <Image
                  priority={index === 0} // Apply priority to the first image in the carousel
                  width={900}
                  height={500}
                  alt={`carousel-image-${index}`}
                  className={styles.contentStyle}
                  src={url}
                />
              </div>
            ))
          ) : (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 100, margin: 'auto', marginTop: '200px' }}
                  spin
                />
              }
            />
          )}
        </Carousel>
      </div>
    </div>
  );
}
