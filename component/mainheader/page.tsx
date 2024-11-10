import Link from 'next/link';
import styles from './page.module.css';
import {
  HeartFilled,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';

export default function Mainheader() {
  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div className={styles.top}>
        <div className={styles['info-section']}>
          <p className={styles.text}>Sale info xxxxxxxxxxxx of xxxxxxxxx</p>
        </div>
      </div>
      <div className={styles.header}>
        <button className={styles['btn-menu']}>
          <MenuOutlined className="icon-menu" />
        </button>

        <p className={styles.title}>SHOP NAME</p>

        <div className={styles.con1}>
          <button className={styles['btn-search']}>
            <SearchOutlined className={styles.icon} />
          </button>
          <button className={styles['btn-cart']}>
            <ShoppingCartOutlined
              className={styles.icon}
              style={{ color: 'blue' }}
            />
          </button>
          <button className={styles['btn-wishlist']}>
            <HeartFilled className={styles.icon} style={{ color: 'red' }} />
          </button>
          <button className={styles['btn-profile']}>
            <UserOutlined className={styles['icon-profile']} />
          </button>
        </div>
      </div>
    </div>
  );
}
