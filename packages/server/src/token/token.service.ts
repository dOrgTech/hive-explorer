import axios from 'axios'
import * as Base64 from 'js-base64'
import * as FormData from 'form-data'
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

  async uploadToIPFS(image: string) {
    const pinataKey = this.configService.get(Env.PinataKey)
    const pinataSecret = this.configService.get(Env.PinataSecret)
    console.log(pinataKey, pinataSecret)
    const wallet = new ethers.Wallet(this.configService.get(Env.EthereumKey))

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
      name: 'Hive',
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
    const signature = await wallet.signMessage(tokenURI)
    return {
      tokenURI,
      signature
    }
  }
}
