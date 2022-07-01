import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Runner } from './runner/runner';
import { CronjobRepository } from './cronjobs.repository';
import { Cronjob } from './entities/cronjob.entity';
import { PurseService } from '@/modules/purse/purse.service';
import { SettingsService } from '@/modules/settings/settings.service';
import { PurseCheckingTxCountRunner } from '@/modules/cronjobs/runner/purse.checking-tx-count.runner';
import { PurseAutoFundRunner } from '@/modules/cronjobs/runner/purse.auto-fund.runner';

@Injectable()
export class CronjobService implements OnModuleInit {
  private readonly logger = new Logger(CronjobService.name);
  private runners10secs: Runner[] = [];
  private runners30secs: Runner[] = [];

  constructor(
    private readonly cronjobRepository: CronjobRepository,
    private readonly purseService: PurseService,
    private readonly settingsService: SettingsService,
  ) {
    // Add all runners for cronjob
    this.runners10secs.push(
      new PurseCheckingTxCountRunner(
        this,
        this.purseService,
        this.settingsService,
      ),
    );
    this.runners30secs.push(
      new PurseAutoFundRunner(this, this.purseService, this.settingsService),
    );
  }

  async onModuleInit() {
    const taskName = [
      PurseCheckingTxCountRunner.name,
      PurseAutoFundRunner.name,
    ];
    await this.cronjobRepository.updateRunning(taskName, false);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron10s() {
    for (const r of this.runners10secs) {
      await r.execute();
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron30s() {
    for (const r of this.runners30secs) {
      await r.execute();
    }
  }

  async isRunning(taskName: string): Promise<boolean> {
    const cronjob = await this.cronjobRepository.findOne({ taskName });
    return cronjob ? cronjob.isRunning : false;
  }

  async getTask(taskName: string): Promise<Cronjob> {
    return await this.cronjobRepository.findOne({ taskName });
  }

  async saveRunning(taskName: string, isRunning: boolean): Promise<void> {
    const task = await this.getTask(taskName);
    if (task) {
      task.isRunning = isRunning;
      task.lastRun = new Date();
      await this.cronjobRepository.save(task);
    } else {
      await this.cronjobRepository.insert({
        taskName,
        isRunning,
        lastRun: new Date(),
      });
    }
  }

  async saveMetadata(taskName: string, metadata: any): Promise<void> {
    const cron = await this.cronjobRepository.findOne({ taskName });
    if (!cron) return;
    cron.metadata = metadata;
    await this.cronjobRepository.save(cron);
  }

  async getMetadata(taskName: string): Promise<any> {
    return (await this.cronjobRepository.findOne({ taskName }))?.metadata;
  }

  async getLastRun(taskName: string): Promise<Date> {
    const cron = await this.cronjobRepository.findOne({ taskName });
    return cron?.lastRun;
  }
}
