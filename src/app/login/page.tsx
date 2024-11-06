import HeaderOfAuthentication from "../../../component/header2/page";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
       <HeaderOfAuthentication />
      </header>
      <main className={styles.main}>
        <h2>Hi</h2>
        <p className={styles.text}>Welcome to the login page.</p>
      </main>
    </div>
  );
}
