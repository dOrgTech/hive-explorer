import type { NextPage } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'
import { getRankByAddress, isAxiosError, RankData } from 'utils/api'
import Nav from 'components/nav'

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

const Home: NextPage = () => {
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
    <div className="bg-white dark:bg-violet-600 h-screen w-screen">
      <Nav />
      <div className="flex justify-center align-middle pt-4 pb-4">
        <Image className="rounded-[50px]" src="/cent_logo.png" alt="logo" width={96} height={96} />
      </div>
      <h1 className="text-center text-white text-5xl">Social Index</h1>
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

export default Home
