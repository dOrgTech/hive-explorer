import type { NextPage } from 'next'
import Link from 'next/link'
import classnames from 'classnames'
import React, { useState } from 'react'
import styles from '@/styles/home.module.scss'
import { getRankByAddress, isAxiosError, RankData } from 'utils/api'

type InitialState = {
  loading: boolean
  address: string
  rankData: RankData | null
  error: string
}

const initialState: InitialState = {
  loading: false,
  address: '',
  rankData: null,
  error: ''
}

const Rank: NextPage = () => {
  const [loading, setLoading] = useState<InitialState['loading']>(initialState.loading)
  const [address, setAddress] = useState<InitialState['address']>(initialState.address)
  const [rankData, setRankData] = useState<InitialState['rankData']>(initialState.rankData)
  const [error, setError] = useState<InitialState['error']>(initialState.error)

  const resetStateForRequest = () => {
    setRankData(initialState.rankData)
    setError(initialState.error)
  }

  const handleSetAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
  }

  const handleGetRank = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    resetStateForRequest()

    try {
      if (!address) {
        throw new Error('Address field is empty')
      }

      setLoading(true)
      const data = await getRankByAddress(address)
      setRankData(data)
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message ?? error.message)
        return
      }

      if (error instanceof Error) {
        setError(error.message)
        return
      }

      setError('Unknown Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classnames(styles.container)}>
      <button>
        <Link href="/">/index</Link>
      </button>
      <h1>Rank Page</h1>
      <form onSubmit={handleGetRank}>
        <label>
          Eth Address
          <input type="text" value={address} onChange={handleSetAddress} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        {loading ? <h5>Loading...</h5> : null}
        {error ? <h5>{error}</h5> : null}
        {rankData ? (
          <>
            <h5>Rank Data</h5>
            <pre>
              <code>{JSON.stringify(rankData, null, 2)}</code>
            </pre>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Rank
