import { Module } from '@nestjs/common';
import { WilayaService } from './wilaya.service';
import { WilayaController } from './wilaya.controller';

@Module({
  imports: [],
  controllers: [WilayaController],
  providers: [WilayaService],
})
export class WilayaModule {}
