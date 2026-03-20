import styles from './PoemBlock.module.css'

interface Poem {
  _id: string
  title: string
  body: string
  publishedAt?: string
}

export default function PoemBlock({ poem }: { poem: Poem }) {
  const lines = (poem.body || '').split('\n')

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <div className={styles.dots} aria-hidden="true">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <span className={styles.filename}>{poem.title}.txt</span>
      </div>
      <div className={styles.body}>
        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            <span className={styles.lineNum}>{i + 1}</span>
            <span className={styles.lineText}>{line || '\u00a0'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
