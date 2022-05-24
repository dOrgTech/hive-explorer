import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Provider } from 'src/_constants/providers'
import { QueryTypes } from 'sequelize'
import { TransferEventRecord } from 'src/ethereum/types'
import { ethers } from 'ethers'

const transferEvents = new ethers.utils.Interface([
  'event Transfer(address indexed _from, address indexed _to, uint256 _tokenId)',
  'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
  'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)'
]);

// ERC20 & ERC721 (721 has last topic indexed, but signature is the same)
const ERC20_721 = transferEvents.getEventTopic('Transfer(address indexed, address indexed, uint256 indexed)');

// ERC1155
const ERC1155_SINGLE = transferEvents.getEventTopic('TransferSingle(address indexed, address indexed, address indexed, uint256, uint256)');
const ERC1155_BATCH = transferEvents.getEventTopic('TransferBatch(address indexed, address indexed, address indexed, uint256[], uint256[])');

@Injectable()
export class EthereumService {
  constructor(@Inject(Provider.EthersProvider) private provider: ethers.providers.JsonRpcProvider) {}

  async getLatestBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async findEventsByBlockRange(startBlock: number, endBlock: number): Promise<TransferEventRecord[]> {
    const logs = await this.provider.getLogs({
      topics: [
        [
          ERC20_721,
          ERC1155_BATCH,
          ERC1155_SINGLE
        ],
        null,
        null,
        null // The presence of this last topic (as null) filters out erc20 events in some geth versions
      ],
      fromBlock: startBlock,
      toBlock: endBlock
    })
    const transfers: TransferEventRecord[] = []
    logs.forEach(l => {
      const sig = l.topics[0];
      if (sig == ERC20_721 && l.topics.length == 4) {
        transfers.push({
          id: `1.${l.blockNumber}.${l.logIndex}.0`,
          chain_id: 1,
          contract_address: l.address,
          from_address: '0x' + l.topics[1].slice(-40),
          to_address: '0x' + l.topics[2].slice(-40),
          token_id: ethers.BigNumber.from(l.topics[3]).toString(),
          quantity: '1',
          txn_id: l.transactionHash,
          block_number: l.blockNumber,
        })
      }
      else if (sig == ERC1155_BATCH) {
        const [ids, quantities] = ethers.utils.defaultAbiCoder.decode([ 'uint256[]', 'uint256[]' ], l.data)
        ids.forEach((id, i) => {
          transfers.push({
            id: `1.${l.blockNumber}.${l.logIndex}.${i}`,
            chain_id: 1,
            contract_address: l.address,
            from_address: '0x' + l.topics[2].slice(-40),
            to_address: '0x' + l.topics[3].slice(-40),
            token_id: ethers.BigNumber.from(id.toString()).toString(),
            quantity: ethers.BigNumber.from(quantities[i].toString()).toString(),
            txn_id: l.transactionHash,
            block_number: l.blockNumber,
          })
        })
      }
      else if (sig == ERC1155_SINGLE) {
        const [id, quantity] = ethers.utils.defaultAbiCoder.decode([ 'uint256', 'uint256' ], l.data)
        transfers.push({
          id: `1.${l.blockNumber}.${l.logIndex}.0`,
          chain_id: 1,
          contract_address: l.address,
          from_address: '0x' + l.topics[2].slice(-40),
          to_address: '0x' + l.topics[3].slice(-40),
          token_id: ethers.BigNumber.from(id.toString()).toString(),
          quantity: ethers.BigNumber.from(quantity.toString()).toString(),
          txn_id: l.transactionHash,
          block_number: l.blockNumber,
        })
      }
    })
    return transfers
  }
}
