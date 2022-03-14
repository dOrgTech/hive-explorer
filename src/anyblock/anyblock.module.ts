import { Module } from '@nestjs/common'
import { AnyblockService } from 'src/anyblock/anyblock.service'
import { AnyblockDatabaseModule } from 'src/anyblock/anyblock-database.module'

@Module({
  imports: [AnyblockDatabaseModule],
  providers: [AnyblockService]
})
export class AnyblockModule {}
