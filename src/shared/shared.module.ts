import { Global, Module } from '@nestjs/common';
import { FileService } from './file/file.service';
import { FilterDataService } from './file/filterData.service';

@Global()
@Module({
  providers: [FileService, FilterDataService],
  exports: [FileService, FilterDataService], // Make it available for other modules
})
export class SharedModule {}
