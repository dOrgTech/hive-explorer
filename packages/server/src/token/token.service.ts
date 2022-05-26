import axios from 'axios'
import FormData from 'form-data'
import * as Base64 from 'js-base64'
import * as Jaccard from 'jaccard-index'
import { Injectable } from '@nestjs/common'
import { Contract, ethers } from 'ethers'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/_constants/env'

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async uploadToIPFS(image: string, address: string) {
    const infuraKey = this.configService.get(Env.InfuraKey)
    const pinataKey = this.configService.get(Env.PinataKey)
    const pinataSecret = this.configService.get(Env.PinataSecret)
    const wallet = new ethers.Wallet(this.configService.get(Env.EthereumKey))

    if (!infuraKey) {
      throw new Error('INFURA_KEY not present')
    }

    const provider = new ethers.providers.InfuraProvider(1, infuraKey)

    let name = address
    try {
      name = (await provider.lookupAddress(address)) || name
    } catch (error) { }

    const imageForm = new FormData() as any
    imageForm.append('file', Buffer.from(Base64.toUint8Array(image.replace('data:image/png;base64,', ''))), {
        filename: `token.png`,
        contentType: 'image/png'
    })
    const imageUpload = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imageForm, {
      withCredentials: true,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary=${imageForm.getBoundary()}`,
        'pinata_api_key': pinataKey,
      'pinata_secret_api_key': pinataSecret,
      }
    })
    const imageURI = `ipfs://${imageUpload.data.IpfsHash}`;

    const metadataUpload = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      name: name,
      image: imageURI,
      description: 'A graph of NFT holders grouped by Jaccard similarity scores',
      external_url: 'https://hive.cent.co'
    }, {
      withCredentials: true,
      headers: {
        'pinata_api_key': pinataKey,
        'pinata_secret_api_key': pinataSecret,
      }
    });
    const tokenURI = `ipfs://${metadataUpload.data.IpfsHash}`
    const message = ethers.utils.defaultAbiCoder.encode(['string'], [tokenURI]);
    const hash = ethers.utils.keccak256(message);
    const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

    return {
      tokenURI,
      signature
    }
  }
}
