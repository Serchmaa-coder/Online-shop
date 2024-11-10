import styles from './page.module.css';

export default function HeaderOfAuthentication() {
  return (
    <div>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <p className={styles.text}>Sale info xxxxxxxxxxxx of xxxxxxxxx</p>
        </div>
      </div>
      <div className={styles.header}>
        <p className={styles.title}>SHOP NAME</p>
      </div>
    </div>
  );
}
