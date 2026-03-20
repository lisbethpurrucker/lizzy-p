import styles from './page.module.css'

export default function Work() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.label}>studio pilz</p>
        <h1 className={styles.title}>Studio</h1>
      </div>

      <div className={styles.grid}>
        {CARDS.map((card) => (
          <div key={card.id} className={styles.card} style={{ '--hue': card.hue } as React.CSSProperties}>
            <div className={styles.cardBg} />
            <div className={styles.cardContent}>
              <p className={styles.cardTag}>{card.tag}</p>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

const CARDS = [
  { id: 1, tag: 'installations', title: 'Art Installations', desc: 'Physical spaces that make you feel something unexpected.', hue: '22' },
  { id: 2, tag: 'code',         title: 'Creative Tech',     desc: 'Building worlds at the edge of code and sensation.',    hue: '200' },
  { id: 3, tag: 'web',          title: 'Web & Product',     desc: 'Digital experiences with soul.',                         hue: '30' },
  { id: 4, tag: 'teaching',     title: 'Teaching',          desc: 'Passing the spark. Making others see what\'s possible.', hue: '15' },
]
