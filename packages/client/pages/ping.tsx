import type { NextPage } from 'next'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import styles from '@/styles/home.module.scss'
import { baseURL, ping, PingData } from 'utils/api'

const Ping: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PingData>()

  useEffect(() => {
    setLoading(true)
    ping()
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(error => {
        console.log('error => ', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className={classnames(styles.container)}>
      <h1>Is server up ?</h1>
      <h3>Ping result from url: {baseURL}</h3>
      <pre>
        <code>{data}</code>
      </pre>
    </div>
  )
}

export default Ping
