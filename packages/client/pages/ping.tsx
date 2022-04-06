import type { NextPage } from 'next'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import styles from '@/styles/home.module.scss'
import { baseURL, ping, PingData } from 'utils/api'

const Ping: NextPage = () => {
  const [pingData, setPingData] = useState<PingData>({ message: 'loading' })

  useEffect(() => {
    ping()
      .then(data => {
        console.log(data)
        setPingData(data)
      })
      .catch(error => {
        console.error('error => ', error)
        setPingData({ message: 'server is down' })
      })
  }, [])

  return (
    <div className={classnames(styles.container)}>
      <h1>Is server up ?</h1>
      <h3>Ping result from url: {baseURL}</h3>
      <pre>
        <code>{pingData.message}</code>
      </pre>
    </div>
  )
}

export default Ping
