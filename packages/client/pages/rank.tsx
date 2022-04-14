import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import classnames from 'classnames'
import React, { useState } from 'react'
import styles from '@/styles/home.module.scss'
import { getRankByAddress, isAxiosError, RankData } from 'utils/api'

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

const width = 500;
const height = 500;

const drawImage = (data) => {
  const diameter = width;
  const format = Math.floor;

  const pack = d3.layout.pack()
    .size([diameter - 4, diameter - 4])
    .sort((a, b) => -(a.value - b.value))
    .value(d => d.size);

  const svg = d3.select('#svg-wrapper').append('svg')
    .attr('width', diameter)
    .attr('height', diameter);

  const vis = svg.datum(data).selectAll('.node')
    .data(pack.nodes)
    .enter()
    .append('g');

  const titles = vis.append('title')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .text(d => (d.children ? '' : `${d.name}: ${format(d.value)}`));

  const circles = vis.append('circle')
    .style('fill', (d) => {
      if (d.children) {
        return 'transparent';
      }
      return '#' + d.name.substr(2, 6);
    })
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r);
}

const copyImage = () => {
  const svg = d3.select('#svg-wrapper')[0][0].children[0];
  const img = new Image();
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const data = 'data:image/svg+xml;base64,' + window.btoa(svgStr);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  img.src = data;
  img.onload = function() {
    context.drawImage(img, 0, 0, width, height);
      canvas.toBlob(function(blob) {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
    });
  };
};

const shortAddr: string = (address: string) => address.substr(0, 8);

const Rank: NextPage = () => {
  const [loading, setLoading] = useState<InitialState['loading']>(initialState.loading)
  const [address, setAddress] = useState<InitialState['address']>(initialState.address)
  const [rankData, setRankData] = useState<InitialState['rankData']>(initialState.rankData)
  const [error, setError] = useState<InitialState['error']>(initialState.error)

  const resetStateForRequest = () => {
    document.getElementById('svg-wrapper').innerHTML = '';
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

      const floor = data.rank.length ? parseFloat(data.rank[data.rank.length - 1].score) : 0;
      drawImage({
        name: '',
        children: data.rank.map(r => ({
          name: shortAddr(r.address),
          size: (1000 * (parseFloat(r.score) - floor)) + 10
        }))
      });
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
    <div className={classnames(styles.container)}>
      <Head>
        <script src="https://d3js.org/d3.v3.min.js"></script>
      </Head>
      <button>
        <Link href="/">/index</Link>
      </button>
      <h1>Rank Page</h1>
      <form onSubmit={handleGetRank}>
        <label>
          Eth Address
          <input type="text" value={address} onChange={handleSetAddress} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div id="svg-wrapper" />
      <div>
        {loading ? <h5>Loading...</h5> : null}
        {error ? <h5>{error}</h5> : null}
        {rankData ? (
          <>
            <div><button onClick={copyImage}>copy image</button></div>
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

export default Rank
