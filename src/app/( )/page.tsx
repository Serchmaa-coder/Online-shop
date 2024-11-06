import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page} style={{ padding: "0px", margin: "0px" }}>
      <main className={styles.main}>
        <p className={styles.text}>PRODUCTS</p>
      </main>
    </div>
  );
}
