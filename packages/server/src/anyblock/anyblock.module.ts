import { Module } from '@nestjs/common'
import { AnyblockService } from 'src/anyblock/anyblock.service'
import { AnyblockDatabaseModule } from 'src/anyblock-database/anyblock-database.module'

@Module({
  imports: [AnyblockDatabaseModule],
  providers: [AnyblockService],
  exports: [AnyblockService]
})
export class AnyblockModule {}
