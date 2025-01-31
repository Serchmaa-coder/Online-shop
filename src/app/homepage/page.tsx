'use client';
import React from 'react';
import TopBanner from '../component/top-banner/page';
import PopularCategories from '../component/popular-category/page';
import styles from './page.module.css';

export default function Homepage() {
  return (
    <div className={styles.container}>
      <TopBanner />
      <PopularCategories />
    </div>
  );
}
