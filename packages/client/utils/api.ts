import axios from 'axios'

const getBaseURL = (): string => {
  switch (process.env.NODE_ENV) {
    case 'development':
      // return 'http://localhost:5001'
    case 'production':
      return 'https://j.cent.co'
    default:
      return ''
  }
}

export const baseURL = getBaseURL()

export const isAxiosError = axios.isAxiosError

export type PingData = { message: string }

export const ping = async () => {
  const res = await axios.request<PingData>({
    method: 'get',
    url: `${baseURL}/ping`,
    transformResponse: res => JSON.parse(res)
  })
  return res.data
}

export type RankData = { 
  collections: { collection_address: string, collection_name: string }[]; 
  rank: { address: string, ens: string, score: string }[] 
}

export const getRankByAddress = async (address: string) => {
  const res = await axios.request<RankData>({
    method: 'get',
    url: `${baseURL}/ranks/${address}`,
    transformResponse: res => JSON.parse(res)
  })
  return res.data
}

export type SignedTokenURI = { tokenURI: string, signature: string }

export const createTokenMetadata = async (image: string, address: string, timestamp: number, signature: string) => {
  const res = await axios.request<SignedTokenURI>({
    method: 'post',
    url: `${baseURL}/token/upload`,
    data: {
      image,
      address,
      timestamp,
      signature
    },
    transformResponse: res => JSON.parse(res)
  })
  return res.data
}
