import { forwardRef, Module } from '@nestjs/common';
import { FetchSheetsService } from './services/sheets.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [FetchSheetsService],
  exports: [FetchSheetsService],
})
export class SheetsModule {}
