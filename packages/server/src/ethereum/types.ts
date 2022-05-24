export type TransferEventRecord = {
  id: string
  chain_id: number
  contract_address: string
  from_address: string
  to_address: string
  token_id: string
  quantity: string
  txn_id: string
  block_number: number
}

export type TokenBalanceRecord = {
  id: string
  chain_id: number
  contract_address: string
  owner_address: string
  token_id: string
  quantity: string
}
