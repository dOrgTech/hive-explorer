export type ChainBlockRecord = {
  id: string
  number: string
  hash: string
  parent_hash: string
  nonce: string
  step: string
  signature: string
  sha3_uncles: string
  logs_bloom: string
  transaction_root: string
  state_root: string
  receipts_root: string
  miner: string
  difficulty: number
  total_difficulty: number
  extra_data: string
  size: number
  gas_limit: number
  gas_used: number
  timestamp: string
  uncles: string[]
  seal_fields: string[]
  mix_hash: string
  base_fee_per_gas: number
}

export type ChainEventRecord = {
  nft_name: string
  contract_hash: string
  txn_hash: string
  txn_type: string
  gas: number
  value: number
  from_hash: string
  to_hash: string
  token_id: number
  block_number: number
  timestamp: string
}
