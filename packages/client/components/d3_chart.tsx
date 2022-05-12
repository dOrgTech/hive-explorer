import React from 'react'
import * as d3 from 'd3'
import {
  useAccount,
  useEnsAddress,
  useSigner,
  useProvider,
  useContract,
} from 'wagmi'
import { ethers, Contract } from 'ethers'
import axios from 'axios'
import { RankData, SignedTokenURI, createTokenMetadata } from 'utils/api'
import { abi } from 'utils/abi'

const renderDims = 1024

export const drawImage = (d: RankData) => {
  const floor = d.rank.length ? parseFloat(d.rank[d.rank.length - 1].score) : 0
  const data = {
    name: '',
    children: d.rank.map(r => ({
      ens: r.ens,
      name: r.address,
      size: 1000 * (parseFloat(r.score) - floor) + 10
    }))
  }

  const diameter = Math.floor(Math.min(window.innerWidth * 0.5, window.innerHeight * 0.5, 1024))

  const addTitles = (vis: any) =>
    vis
      .append('title')
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y)
      .text((d: any) => (d.children ? '' : d.ens))

  const addCircles = (vis: any) =>
    vis
      .append('circle')
      .style('fill', (d: any) => {
        if (d.children) {
          return 'transparent'
        }

        return `#${d.name.substr(2, 6)}`
      })
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', (d: any) => d.r)

  const pack = d3.layout
    .pack()
    .size([diameter - 4, diameter - 4])
    .sort((a: any, b: any) => -(a.value - b.value))
    .value((d: any) => d.size)

  const packShadow = d3.layout
    .pack()
    .size([renderDims - 4, renderDims - 4])
    .sort((a: any, b: any) => -(a.value - b.value))
    .value((d: any) => d.size)

  const svg = d3
    .select('#d3-chart-wrapper')
    .append('svg')
    .attr('width', diameter)
    .attr('height', diameter)
    .style('margin', '0 auto')

  const vis = svg.datum(data).selectAll('.node').data(pack.nodes).enter().append('g')
  addTitles(vis)
  addCircles(vis)

  const shadowSvg = d3
    .select('#d3-chart-wrapper-shadow')
    .append('svg')
    .attr('width', renderDims)
    .attr('height', renderDims)
  const shadowVis = shadowSvg.datum(data).selectAll('.node').data(packShadow.nodes).enter().append('g')
  addTitles(shadowVis)
  addCircles(shadowVis)
}

export const removeImage = () => {
  document.getElementById('d3-chart-wrapper')!.innerHTML = ''
  document.getElementById('d3-chart-wrapper-shadow')!.innerHTML = ''
}

const svgToCanvas = (callback: Function) => {
  const svg = document.getElementById('d3-chart-wrapper-shadow')!.children[0]
  const serializer: any = new XMLSerializer()
  const svgStr = serializer.serializeToString(svg)
  const data = 'data:image/svg+xml;base64,' + window.btoa(svgStr)

  const canvas = document.createElement('canvas')
  canvas.width = renderDims
  canvas.height = renderDims
  const img = new Image()
  img.src = data
  img.onload = () => {
    canvas.getContext('2d')?.drawImage(img, 0, 0, renderDims, renderDims)
    callback(canvas)
  }
}

const copyImage = () => {
  svgToCanvas((canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob: any) => {
      const item = new ClipboardItem({ 'image/png': blob as ClipboardItemDataType })
      navigator.clipboard.write([item])
    })
  })
}

const shortAddress = (address: string) => address.substr(0, 8)

type D3ChartProps = {
  show: boolean
  graphAddressOrENS: string
}

const D3Chart = ({ show, graphAddressOrENS }: D3ChartProps) => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: '0xc5195f83dd41a5dc1b0d493dc44aa4a4bc4cd076',
    contractInterface: abi,
    signer
  });
  // Get connected wallet address
  const { data, isError, isLoading } = useAccount();
  const userAddress = data?.address;
  // Get graph address if ENS name is passed
  const { data: resolvedGraphAddress } = useEnsAddress({ name: graphAddressOrENS });
  const graphAddress = resolvedGraphAddress ?? graphAddressOrENS;

  const mintImage = async () => {
    if (userAddress != graphAddress) {
      window.alert('Mint your own')
      return
    }

    svgToCanvas(async (canvas: HTMLCanvasElement) => {
      const image = canvas.toDataURL()
      const timestamp = Math.floor(new Date().getTime() / 1000)
      const signature = await signer.signMessage(`Minting my Hive.\n\nTimestamp: ${timestamp}`)
      const result: SignedTokenURI = await createTokenMetadata(image, address, timestamp, signature)
      await contract.mint(result.tokenURI, result.signature, {
        value: ethers.utils.parseEther('0.01')
      })
    })
  }

  return (
    <div>
      <div className={show ? '' : 'invisible'} id="d3-chart-wrapper" />
      <div style={{ display: 'none' }} id="d3-chart-wrapper-shadow" />
      {show ? (
        <div className="flex justify-center align-middle">
          <button
            className="shadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            onClick={copyImage}
          >
            Copy Image
          </button>
          &nbsp;
          <button
            className="hadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            onClick={() => mintImage()}
          >
            Mint Ξ0.01
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default D3Chart
