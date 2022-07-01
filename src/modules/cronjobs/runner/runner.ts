import { Logger } from '@nestjs/common';
import { CronjobService } from '../cronjobs.service';

export class Runner {
  constructor(cronjobService: CronjobService) {
    this.cronjobService = cronjobService;
  }

  private readonly log = new Logger(Runner.name);
  protected readonly cronjobService: CronjobService;

  async run(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getTaskName(): string {
    throw new Error('Method not implemented.');
  }

  getTimeout(): number {
    return 0;
  }

  async execute(): Promise<void> {
    const cron = await this.cronjobService.getTask(this.getTaskName());
    const isRunning = cron?.isRunning;
    if (!isRunning) {
      await this.cronjobService.saveRunning(this.getTaskName(), true);
      try {
        await this.run();
      } catch (err) {
        this.log.error(
          `Execution of ${this.getTaskName()} is error: ${err.message}`,
          err,
        );
        this.log.error(err);
      } finally {
        await this.cronjobService.saveRunning(this.getTaskName(), false);
      }
    } else if (
      this.getTimeout() > 0 &&
      cron &&
      cron.lastRun &&
      new Date().getTime() - this.getTimeout() > cron.lastRun.getTime()
    ) {
      await this.cronjobService.saveRunning(this.getTaskName(), false);
      this.log.log(`Task ${this.getTaskName()} is TIMED OUT... Reset`);
    } else {
      this.log.log(`Task ${this.getTaskName()} is RUNNING... Ignore execution`);
    }
  }
}
