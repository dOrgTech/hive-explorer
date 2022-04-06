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

export type PingData = { message: string }

export const ping = async () => {
  const res = await axios.request<PingData>({
    method: 'get',
    url: `${baseURL}/ping`,
    transformResponse: (r: PingData) => r
  })

  return res.data
}
