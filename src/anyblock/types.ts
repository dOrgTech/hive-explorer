export type ChainBlockRecord = {
  id: string
  number: string
  hash: string
  parent_hash: string
  nonce: string
  step: string | null
  signature: string | null
  sha3_uncles: string
  logs_bloom: string
  transaction_root: string
  state_root: string
  receipts_root: string
  miner: string
  difficulty: string
  total_difficulty: string
  extra_data: string
  size: string
  gas_limit: string
  gas_used: string
  timestamp: Date
  uncles: string[]
  seal_fields: string[] | null
  mix_hash: string
  base_fee_per_gas: string
}

export type ChainEventRecord = {
  nft_name: string
  contract_hash: string
  txn_hash: string
  txn_type: string
  gas: string
  value: string
  from_hash: string
  to_hash: string
  token_id: string
  block_number: string
  timestamp: Date
}
