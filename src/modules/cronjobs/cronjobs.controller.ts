import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CronjobService } from './cronjobs.service';

@ApiTags('cronjob')
@Controller('cronjob')
export class CronjobController {
  constructor(private readonly cronjobService: CronjobService) {}
}
