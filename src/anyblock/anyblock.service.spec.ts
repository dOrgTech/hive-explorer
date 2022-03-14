import { Test, TestingModule } from '@nestjs/testing'
import { AnyblockService } from './anyblock.service'

describe('AnyblockService', () => {
  let service: AnyblockService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnyblockService]
    }).compile()

    service = module.get<AnyblockService>(AnyblockService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
