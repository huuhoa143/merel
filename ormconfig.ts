/**
 * this file will configure the setting of orm migration
 */
let pathSrc = '.'; //run nest start
if (!process.env.DB_CONNECTION) {
  pathSrc = 'src';
}
const ormconfig = {
  type: process.env.DB_CONNECTION || 'mongodb',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 27017,
  username: process.env.DB_USER_NAME || 'root',
  password: encodeURIComponent(process.env.DB_USER_PASSWORD) || 'root',
  database: process.env.DB_NAME || 'merel',
  authSource: 'admin',
  autoLoadEntities: true,
  entities: [__dirname + '/**/*.entity{ .ts,.js}'],
  subscribers: [__dirname + '/**/*.subscriber{ .ts,.js}'],
  synchronize: false,
  poolSize: 100,
  useUnifiedTopology: true,
  // migrations: [pathSrc + '/database/migrations/*{.ts,.js}'],
  // factories: [pathSrc + '/database/factories/*.factory{.ts,.js}'],
  // seeds: [pathSrc + '/database/seeders/*.seed{.ts,.js}'],
  cli: {
    entitiesDir: pathSrc + '/',
    subscribersDir: pathSrc + '/',
    migrationsDir: pathSrc + '/database/migrations',
  },
};
module.exports = ormconfig;
