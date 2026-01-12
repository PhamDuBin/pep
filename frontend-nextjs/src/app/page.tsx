import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>PEP Application</h1>
        <p className={styles.description}>
          A modern Next.js application with TypeScript and DaisyUI
        </p>
      </section>
    </main>
  );
}
