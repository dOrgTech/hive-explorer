import { Module } from '@nestjs/common'
import { appDatabaseProvider } from 'src/app-database/app-database.provider'

@Module({
  providers: appDatabaseProvider,
  exports: appDatabaseProvider
})
export class AppDatabaseModule {}
