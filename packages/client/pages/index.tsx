import React, { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'

import classnames from 'classnames'
import Nav from 'components/nav'

type InitialState = {
  address: string
  error: string
}

const initialState: InitialState = {
  address: '',
  error: ''
}

const Home: NextPage = () => {
  const router = useRouter()

  const [address, setAddress] = useState<InitialState['address']>(initialState.address)
  const [error, setError] = useState<InitialState['error']>(initialState.error)

  const handleSetAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(initialState.error)
    }
    setAddress(event.target.value)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (!address) {
      setError('Address field is empty')
    } else {
      router.push(`/address/${address}`)
    }
  }

  return (
    <div className="bg-white">
      <Head>
        <title>Hive</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Nav onClickTitle={() => router.push('/')} />
      <div className="fixed right-2 bottom-3 md:top-3">
        <ConnectButton />
      </div>
      <div className="flex justify-center align-middle pt-4 pb-4">
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <input
              placeholder="eth address"
              className="ml-4 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-800"
              type="text"
              value={address}
              onChange={handleSetAddress}
            />
            <div className="ml-4 mr-4">
              <button
                // disabled={loading}
                className="shadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
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
            .
          </h2>
          <p className="my-4">
            This service explores public blockchain data to surface affinities and shared interests among collectors of
            NFTs. This is a first proof of concept on Ethereum and uses a simple algorithm. In the future we plan to
            index multiple blockchains and more robust matching.
          </p>
        </div>
      </div>
      <div className="flex justify-center align-middle">
        <div className="px-4 w-full max-w-lg">
          <Image src="/hive-example.png" alt="hive-exmple" />
          <h2 style={{ fontSize: '150%' }}>Join the community: mint your HIVE token.</h2>
          <p className="my-4">
            Interested in exploring the future of web3 data? Mint your HIVE token then hop on over to our&nbsp;
            <a className="underline" href="https://discord.gg/JjYUrPnDJT" target="_blank" rel="noreferrer">
              Discord
            </a>
            ! Start by entering your ETH address above. You will also be able to discover who shares the most NFTs in
            common with you and mint your HIVE token.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
