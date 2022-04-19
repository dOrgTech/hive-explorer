import React from 'react'
import * as d3 from 'd3'
import { ethers } from 'ethers'
import axios from 'axios'
import { RankData, SignedTokenURI, createTokenMetadata } from 'utils/api'

const width = 500
const height = 500

const hashCode = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase()

  return `#${'00000'.substring(0, 6 - c.length) + c}`
}

export const drawImage = (d: RankData) => {
  const floor = d.rank.length ? parseFloat(d.rank[d.rank.length - 1].score) : 0
  const data = {
    name: '',
    children: d.rank.map(r => ({
      name: shortAddress(r.address),
      size: 1000 * (parseFloat(r.score) - floor) + 10
    }))
  }

  const diameter = width
  const format = Math.floor

  const pack = d3.layout
    .pack()
    .size([diameter - 4, diameter - 4])
    .sort((a: any, b: any) => -(a.value - b.value))
    .value((d: any) => d.size)

  const svg = d3.select('#d3-chart-wrapper').append('svg').attr('width', diameter).attr('height', diameter)

  const vis = svg.datum(data).selectAll('.node').data(pack.nodes).enter().append('g')

  const titles = vis
    .append('title')
    .attr('x', (d: any) => d.x)
    .attr('y', (d: any) => d.y)
    .text((d: any) => (d.children ? '' : `${d.name}: ${format(d.value)}`))

  const circles = vis
    .append('circle')
    .style('fill', (d: any) => {
      if (d.children) {
        return 'transparent'
      }

      return intToRGB(hashCode(d.name))
    })
    .attr('cx', (d: any) => d.x)
    .attr('cy', (d: any) => d.y)
    .attr('r', (d: any) => d.r)
}

export const removeImage = () => {
  document.getElementById('d3-chart-wrapper')!.innerHTML = ''
}

const copyImage = () => {
  const svg = document.getElementById('d3-chart-wrapper')?.children[0]
  const img = new Image()
  const serializer: any = new XMLSerializer()
  const svgStr = serializer.serializeToString(svg)
  const data = 'data:image/svg+xml;base64,' + window.btoa(svgStr)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  img.src = data
  img.onload = () => {
    context?.drawImage(img, 0, 0, width, height)
    canvas.toBlob(blob => {
      const item = new ClipboardItem({ 'image/png': blob as ClipboardItemDataType })
      navigator.clipboard.write([item])
    })
  }
}

const mintImage = async () => {
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    window.alert('No Web3 found')
    return;
  }

  await ethereum.request({
    method: 'eth_requestAccounts'
  })
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()

  const svg = document.getElementById('d3-chart-wrapper')?.children[0]
  const img = new Image()
  const serializer: any = new XMLSerializer()
  const svgStr = serializer.serializeToString(svg)
  const data = 'data:image/svg+xml;base64,' + window.btoa(svgStr)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  img.src = data
  img.onload = async () => {
    context?.drawImage(img, 0, 0, width, height)
    const image = canvas.toDataURL()
    const timestamp = Math.floor(new Date().getTime() / 1000)
    const signature = await signer.signMessage(`Minting my Hive. Timestamp: ${timestamp}`)
    const address = await signer.getAddress()
    console.log(timestamp, signature)
    const result: SignedTokenURI = await createTokenMetadata(image, address, timestamp, signature)
    console.log(result)
  }
}

const shortAddress = (address: string) => address.substr(0, 8)

type D3ChartProps = {
  show: boolean
}

const D3Chart = ({ show }: D3ChartProps) => {
  return (
    <div>
      <div className={show ? '' : 'invisible'} id="d3-chart-wrapper" />
      {show ? (
        <div className="flex justify-center align-middle">
          <button
            className="hadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            onClick={copyImage}
          >
            Copy Image
          </button>
          &nbsp;
          <button
            className="hadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            onClick={mintImage}
          >
            Mint Ξ0.01
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default D3Chart
