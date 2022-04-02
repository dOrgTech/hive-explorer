import { Provider } from 'src/_constants/providers'
import { DumpedBlock } from 'src/dumped-blocks/dumped-block.entity'

export const dumpedBlocksProviders = [
  {
    provide: Provider.DumpedBlocksRepository,
    useValue: DumpedBlock
  }
]
