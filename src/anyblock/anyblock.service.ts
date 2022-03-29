import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Provider } from 'src/_constants/providers'
import { QueryTypes } from 'sequelize'
import { ChainBlockRecord, ChainEventRecord } from 'src/anyblock/types'

@Injectable()
export class AnyblockService {
  constructor(@Inject(Provider.AnyBlockDatabase) private db: Sequelize) {}

  async findBlockByNumber(blockNumber: number): Promise<ChainBlockRecord | null> {
    const query = `SELECT * FROM block WHERE block.number = :number`
    const records = await this.db.query<ChainBlockRecord>(query, {
      type: QueryTypes.SELECT,
      replacements: { number: blockNumber }
    })
    return records[0] || null
  }

  async findLastBlock(): Promise<ChainBlockRecord | null> {
    const query = `SELECT * FROM block ORDER BY number DESC LIMIT 1`
    const records = await this.db.query<ChainBlockRecord>(query, { type: QueryTypes.SELECT })
    return records[0] || null
  }

  findEventsByBlockRange(blockRange: { from: number; to: number }): Promise<ChainEventRecord[]> {
    const query = `
    WITH erc721_addresses(address, name) AS (
        SELECT address, name
        FROM token
        WHERE
          (type = 'ERC721' OR type = 'ERC1155') AND
          total_supply > 0
    )
    , erc721_events(nft_name, contract_hash, txn_hash, txn_type, from_hash, to_hash, token_id, block_number, timestamp) AS (
        SELECT
            erc721_addresses.name as nft_name,
            erc721_addresses.address as contract_hash,
            event.transaction_hash as txn_hash,
            CASE
            WHEN event.args::json#>>'{0, hex}' = '0x0000000000000000000000000000000000000000' THEN 'mint'
            ELSE 'transfer'
            END as txn_type,
            event.args::json#>>'{0, hex}' as from_hash,
            event.args::json#>>'{1, hex}' as to_hash,
            ('x' || lpad(replace(event.args::json#>>'{2, hex}', '0x', ''), 16, '0'))::bit(64)::bigint::numeric as token_id,
            event.block_number as block_number,
            event.timestamp as timestamp
        FROM event
            INNER JOIN erc721_addresses
            ON event.address = erc721_addresses.address
        WHERE
            event.event = 'Transfer' AND
            event.probability = 1 AND
            event.block_number >= :from AND
            event.block_number <= :to
    )
    SELECT
        erc721_events.nft_name,
        erc721_events.contract_hash,
        erc721_events.txn_hash,
        erc721_events.txn_type,
        tx.gas_price as gas,
        tx.value as value,
        erc721_events.from_hash,
        erc721_events.to_hash,
        erc721_events.token_id,
        erc721_events.block_number,
        erc721_events.timestamp
    FROM tx
        INNER JOIN erc721_events
        ON tx.id = erc721_events.txn_hash
    `
    return this.db.query<ChainEventRecord>(query, {
      type: QueryTypes.SELECT,
      replacements: { from: blockRange.from, to: blockRange.to }
    })
  }
}
