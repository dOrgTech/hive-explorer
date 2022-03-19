import { Module } from '@nestjs/common'
import { anyblockDatabaseProvider } from 'src/anyblock-database/anyblock-database.provider'

@Module({
  providers: anyblockDatabaseProvider,
  exports: anyblockDatabaseProvider
})
export class AnyblockDatabaseModule {}
