import Link from "next/link";
import styles from "./page.module.css";
import { HeartFilled, MenuOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

export default function Header() {
  return (
    <div>
      <div className={styles.top}>
        <div className={styles["info-section"]}>
          <p className={styles.text}>Sale info xxxxxxxxxxxx of xxxxxxxxx</p>
          </div>
        <div className={styles.btns}>
          <Link href="/login">
            <button className={styles["btn-login"]}>Нэвтрэх</button>
          </Link>
          <p className="divider">/</p>
          <Link href="/signup">
            <button className={styles["btn-signup"]}>Бүртгүүлэх</button>
          </Link>
        </div>
      </div>
      <div className={styles.header}>
        <button className={styles["btn-menu"]}>
          <MenuOutlined className="icon-menu" />
        </button>

        <p className={styles.title}>SHOP NAME</p>


        <div className={styles.con1}>
          <button className={styles["btn-search"]}>
            <SearchOutlined className={styles.icon} />
          </button>
          <button className={styles["btn-cart"]}>
            <ShoppingCartOutlined className={styles.icon} style={{color:"gray"}} />
          </button>
          <button className={styles["btn-wishlist"]}>
            <HeartFilled className={styles.icon} style={{color:"gray"}}/>
          </button>
          <button className={styles["btn-profile"]}>
            <UserOutlined className={styles["icon-profile"]} />
          </button>
        </div>

      </div>
    </div>
  );
}
