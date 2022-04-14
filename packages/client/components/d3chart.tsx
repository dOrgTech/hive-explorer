import React from 'react'
import * as d3 from 'd3'
import { RankData } from 'utils/api'

const width = 500
const height = 500

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

      return '#' + d.name.substr(2, 6)
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

const shortAddress = (address: string) => address.substr(0, 8)

const D3Chart = () => {
  return (
    <div>
      <div id="d3-chart-wrapper" />
      <div>
        <button onClick={copyImage}>Copy image</button>
      </div>
    </div>
  )
}

export default D3Chart
