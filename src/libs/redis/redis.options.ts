import { RedisOptions, Transport } from '@nestjs/microservices';

const redisUrl = process.env.REDIS_URL;

export const redisOptions: RedisOptions = {
  transport: Transport.REDIS,
  options: {
    url: redisUrl,
  },
};
