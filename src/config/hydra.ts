import { AdminApi, Configuration } from '@ory/hydra-client';

const baseOptions: any = {};

if (process.env.MOCK_TLS_TERMINATION) {
  baseOptions.headers = { 'X-Forwarded-Proto': 'https' };
}

export const hydraAdmin = () => {
  return new AdminApi(
    new Configuration({
      basePath: process.env.OAUTH_ADMIN_URL_INTERNAL,
      baseOptions,
    }),
  );
};
