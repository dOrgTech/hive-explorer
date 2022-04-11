import axios from 'axios'

const getBaseURL = (): string => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'http://localhost:5001'
    case 'production':
      return ''
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

export type RankData = { collections: string[]; rank: { address: string; score: string }[] }

export const getRankByAddress = async (address: string) => {
  const res = await axios.request<RankData>({
    method: 'get',
    url: `${baseURL}/ranks/${address}`,
    transformResponse: res => JSON.parse(res)
  })
  return res.data
}
