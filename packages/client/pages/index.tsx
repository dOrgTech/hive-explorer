import React, { useState } from 'react'
import type { NextPage } from 'next'
import classnames from 'classnames'
import { getRankByAddress, isAxiosError, RankData } from 'utils/api'
import Nav from 'components/nav'
import D3Chart, { drawImage, removeImage } from 'components/d3chart'

type InitialState = {
  loading: boolean
  address: string
  rankData: RankData | null
  showD3chartCopyBtn: boolean
  error: string
}

const initialState: InitialState = {
  loading: false,
  address: '',
  rankData: null,
  showD3chartCopyBtn: false,
  error: ''
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState<InitialState['loading']>(initialState.loading)
  const [address, setAddress] = useState<InitialState['address']>(initialState.address)
  const [rankData, setRankData] = useState<InitialState['rankData']>(initialState.rankData)
  const [showD3chartCopyBtn, setShowD3chartCopyBtn] = useState<InitialState['showD3chartCopyBtn']>(
    initialState.showD3chartCopyBtn
  )
  const [error, setError] = useState<InitialState['error']>(initialState.error)

  const resetStateForRequest = () => {
    setRankData(initialState.rankData)
    setShowD3chartCopyBtn(initialState.showD3chartCopyBtn)
    setError(initialState.error)
  }

  const handleSetAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
  }

  const handleGetRank = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    removeImage()
    resetStateForRequest()
    try {
      if (!address) {
        throw new Error('Address field is empty')
      }

      setLoading(true)
      const data = await getRankByAddress(address)
      setRankData(data)
      drawImage(data)
      setShowD3chartCopyBtn(true)
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
    <div className="bg-white">
      <Nav />
      <div className="flex justify-center align-middle pt-4 pb-4">
        <form className="w-full max-w-sm">
          <div className="md:flex md:items-center mb-4">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" form="inline-full-name">
                Eth Address
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-800"
                type="text"
                value={address}
                onChange={handleSetAddress}
              />
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3" />
            <div className="md:w-2/3">
              <button
                className="shadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handleGetRank}
              >
                Get Ranks
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex justify-center align-middle pt-4 pb-4">
        <D3Chart showCopyButton={showD3chartCopyBtn} />
      </div>
      <div>
        {loading ? <h5>Loading...</h5> : null}
        {error ? <h5>{error}</h5> : null}
        {rankData ? (
          <div className="flex justify-center align-middle pt-4 pb-4">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="w-1/2 px-4 py-2">Collections</th>
                </tr>
              </thead>
              <tbody>
                {rankData.collections.map((address, index) => (
                  <tr key={index} className={classnames(index % 2 ? 'bg-gray-100' : null)}>
                    <td className="border px-4 py-2">{address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {rankData ? (
          <div className="flex justify-center align-middle pt-4 pb-4">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="w-1/2 px-4 py-2">Address</th>
                  <th className="w-1/4 px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {rankData.rank.map(({ address, score }, index) => (
                  <tr key={index} className={classnames(index % 2 ? 'bg-gray-100' : null)}>
                    <td className="border px-4 py-2">{address}</td>
                    <td className="border px-4 py-2">{score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Home
