import _ from 'lodash'
import { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import classnames from 'classnames'
import styles from '@/styles/home.module.scss'

type Theme = 'light' | 'dark'

const Home: NextPage = () => {
  const router = useRouter()

  const [theme, setTheme] = useState<Theme>('light')

  const handleThemeChange = (theme: Theme) => setTheme(theme)

  const handleNavigateToPing = () => router.push('/ping')

  const handleNavigateToRank = () => router.push('/rank')

  return (
    <div
      className={classnames(
        styles.container,
        theme === 'light' && styles['container-light'],
        theme === 'dark' && styles['container-dark']
      )}
    >
      <Head>
        <title>cent-social-index</title>
        <meta name="description" content="Cent Social Index" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://cent.app.bio">Cent Social Index</a>
        </h1>

        <p className={styles.description}>Check routing and and server api</p>
        <button
          className={classnames(
            styles['theme-btn'],
            theme === 'light' ? styles['theme-btn-dark'] : null,
            theme === 'dark' ? styles['theme-btn-light'] : null
          )}
          onClick={handleNavigateToPing}
        >
          Ping The Server
        </button>

        <button
          className={classnames(
            styles['mt-16'],
            styles['theme-btn'],
            theme === 'light' ? styles['theme-btn-dark'] : null,
            theme === 'dark' ? styles['theme-btn-light'] : null
          )}
          onClick={handleNavigateToRank}
        >
          Check Your ETH Address Rank
        </button>

        <p className={styles.description}>SCSS at work</p>
        {theme === 'light' && (
          <button
            className={classnames(styles['theme-btn'], styles['theme-btn-dark'])}
            onClick={() => handleThemeChange('dark')}
          >
            {_.startCase('dark theme')}
          </button>
        )}
        {theme === 'dark' && (
          <button
            className={classnames(styles['theme-btn'], styles['theme-btn-light'])}
            onClick={() => handleThemeChange('light')}
          >
            {_.startCase('light theme')}
          </button>
        )}

        <p className={styles.description}>
          Get started by editing <code className={styles.code}>pages/index.tsx</code>
        </p>

        <p className={styles.description}>Next.js Docs</p>
        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a href="https://github.com/vercel/next.js/tree/canary/examples" className={styles.card}>
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home