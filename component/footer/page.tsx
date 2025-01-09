'use client';
import styles from './page.module.css';

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.con1}>
        <h1 className={styles.title}>Customer Service</h1>
      </div>
      <div className={styles.con1}>
        <h1 className={styles.title}>Company Info</h1>
      </div>
      <div className={styles.con1}>
        <h1 className={styles.title}>Legal Info</h1>
      </div>
      <div className={styles.con1}>
        <h1 className={styles.title}>Support</h1>
      </div>
    </div>
  );
}
