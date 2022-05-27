import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { getRankByAddress, isAxiosError, RankData } from 'utils/api'
import Nav from 'components/nav'
import D3Chart, { drawImage, removeImage } from 'components/d3_chart'

type InitialState = {
  loading: boolean
  address: string
  addressInput: string
  rankData: RankData | null
  showD3Chart: boolean
  error: string
}

const initialState: InitialState = {
  address: '',
  loading: false,
  addressInput: '',
  rankData: null,
  showD3Chart: false,
  error: ''
}

const AddressPage: NextPage = () => {
  const router = useRouter()
  const address = router.query.address as string
  const [loading, setLoading] = useState<InitialState['loading']>(initialState.loading)
  const [addressInput, setAddressInput] = useState<InitialState['address']>(address || initialState.addressInput)
  const [rankData, setRankData] = useState<InitialState['rankData']>(initialState.rankData)
  const [showD3Chart, setShowD3Chart] = useState<InitialState['showD3Chart']>(initialState.showD3Chart)
  const [error, setError] = useState<InitialState['error']>(initialState.error)

  const resetStateForRequest = () => {
    setRankData(initialState.rankData)
    setShowD3Chart(initialState.showD3Chart)
    setError(initialState.error)
    removeImage()
  }

  const handleSetAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(initialState.error)
    }
    setAddressInput(event.target.value)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    selectAddress(addressInput)
  }

  const selectAddress = (newAddress: string) => {
    if (!newAddress) {
      setError('Address field is empty')
    } else {
      router.push(`/address/${newAddress}`)
    }
  }

  const generateOpenSeaProfileLink = (address: string) => {
    return `https://opensea.io/${address}`
  }

  const loadRank = async (address: string) => {
    setAddressInput(address)
    resetStateForRequest()
    try {
      if (!address) {
        throw new Error('Address field is empty')
      }

      setLoading(true)
      const data = await getRankByAddress(address)
      setRankData(data)
      drawImage(data)
      setShowD3Chart(true)
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

  useEffect(() => {
    if (address) {
      loadRank(address)
    }
  }, [address])

  return (
    <div className="bg-white">
      <Nav />
      <div className="fixed right-2 bottom-3 md:top-3">
        <ConnectButton showBalance={{ smallScreen: false, largeScreen: false }} />
      </div>
      <div className="flex justify-center align-middle pt-1 pb-4">
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <input
              placeholder="eth address"
              className="ml-4 bg-gray-200 appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-black"
              type="text"
              value={addressInput}
              onChange={handleSetAddress}
            />
            <div className="ml-4 mr-4">
              <button
                disabled={loading}
                className={classnames(
                  'shadow bg-black hover:bg-slate-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-xl',
                  loading ? 'bg-gray-500 hover:bg-gray-500' : null
                )}
                type="submit"
              >
                Explore
              </button>
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3" />
            {error ? (
              <span className="md:w-2/3 font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{error}</span>
            ) : (
              <span className="h-4" />
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center align-middle pt-4 pb-4">
          <svg
            role="status"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : null}
      <div className="flex justify-center align-middle pt-4 pb-4">
        <D3Chart show={showD3Chart} graphAddressOrENS={address} />
      </div>

      {showD3Chart ? (
        <div className="flex justify-center align-middle pt-1 pb-1">
          <svg
            className="animate-bounce w-6 h-6 text-gray-900"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      ) : null}
      {!showD3Chart && !loading ? (
        <div className="flex justify-center align-middle">
          <div className="px-4 w-full max-w-lg">
            <h2 style={{ fontSize: '150%' }}>
              Welcome to Hive, a project by{' '}
              <a className="underline" href="https://cent.co">
                Cent
              </a>{' '}
              and{' '}
              <a className="underline" href="https://dorg.tech">
                dOrg
              </a>
            </h2>
            <p className="my-4">
              This service explores public blockchain data to surface affinities and shared interests among collectors
              of NFTs. This is a first proof of concept on Ethereum and uses a simple algorithm. In the future we plan
              to index multiple blockchains and provide more robust matching.
            </p>
          </div>
        </div>
      ) : null}
      {rankData ? (
        <div className="flex justify-center align-middle p-4">
          <table className="table-fixed">
            <thead>
              <tr>
                <th className="w-1/2 px-4 py-2">Address</th>
                <th className="w-1/4 px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {rankData.rank.map(({ address, ens, score }, index) => (
                <tr key={index} className={classnames(index % 2 ? 'bg-gray-100' : null)}>
                  <td
                    className="border px-4 py-2"
                    style={{ maxWidth: '75vw', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    <span className="underline cursor-pointer" onClick={() => selectAddress(ens ?? address)}>
                      {ens ?? address}
                    </span>
                  </td>
                  <td className="border px-4 py-2">{parseFloat(score).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {rankData ? (
        <div className="flex justify-center align-middle p-4">
          <table className="table-fixed">
            <thead>
              <tr>
                <th className="w-1/2 px-4 py-2">Collections</th>
              </tr>
            </thead>
            <tbody>
              {rankData.collections.map(({ collection_address, collection_name }, index) => (
                <tr key={index} className={classnames(index % 2 ? 'bg-gray-100' : null)}>
                  <td className="border px-4 py-2">{collection_name ?? collection_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="flex justify-center align-middle p-4">
        <p>
          Have a question?&nbsp;
          <a className="underline" href="https://discord.gg/JjYUrPnDJT" target="_blank" rel="noreferrer">
            Jump into our Discord
          </a>
          &nbsp;to chat with us!
        </p>
      </div>
    </div>
  )
}

export default AddressPage
