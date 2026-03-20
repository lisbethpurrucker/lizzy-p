import styles from './page.module.css'

export default function Now() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.label}>last updated: March 2026</p>
        <h1 className={styles.title}>Now</h1>
        <p className={styles.tagline}>A live document of becoming. Not a résumé.</p>
      </div>

      <ul className={styles.list}>
        {ITEMS.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.arrow}>→</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}

const ITEMS = [
  { id: 1, text: 'Learning animation — the moving image as language' },
  { id: 2, text: 'Writing dispatches I\'m not sure I should send' },
  { id: 3, text: 'Building art installations with Studio Pilz' },
  { id: 4, text: 'Seeking deeper intimacy with myself and others' },
  { id: 5, text: 'Refusing every label I\'m offered' },
  { id: 6, text: 'Expanding. Always.' },
]
