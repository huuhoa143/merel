export const isDevEnv = () => process.env.APP_ENV === 'development';

export const isTestEnv = () => process.env.APP_ENV === 'test';

export const isSandboxEnv = () => process.env.APP_ENV === 'sandbox';

export const isLocalEnv = () =>
  process.env.APP_ENV === 'local' || !process.env.APP_ENV;

export const isProdEnv = () => process.env.APP_ENV === 'production';

const configuration = {
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'mongodb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 27017,
    database: process.env.DB_NAME,
  },
  authOptions: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      graphURL: process.env.FACEBOOK_GRAPH_URL,
    },
  },
  blockchain: {
    operator: {
      publicKey: process.env.OPERATOR_PUBLIC_KEY,
      privateKey: process.env.OPERATOR_PRIVATE_KEY,
    },
    event: {
      eventTopicTokenRaw: process.env.EVENT_TOPIC_RAW,
      eventTopicNativeRaw: process.env.EVENT_TOPIC_NATIVE_RAW,
    },
    noBlockConfirmation: parseInt(process.env.NO_BLOCK_CONFIRMATION),
    encryptSecretKey: process.env.ENCRYPT_SECRET,
  },
  cronjob: {
    defaultTimeout:
      parseInt(process.env.CRONJOB_DEFAULT_TIMEOUT) || 3 * 60 * 1000, // 3 minutes
  },
  coinMarketCap: {
    apiKey: process.env.COINMARKETCAP_API_KEY,
    apiUrl: process.env.COINMARKETCAP_API_URL,
  },
  // aws: {
  //   region: process.env.AWS_REGION,
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   publicBucket: process.env.AWS_PUBLIC_BUCKET_NAME,
  // },
};
export default () => configuration;
