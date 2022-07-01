export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
  expired: process.env.JWT_EXPIRED_TOKEN,
};

export const googleScopes = ['email', 'profile'];

export const authenticationFailMessage = 'ACCESS_DENIED';

export const facebookScopes = {
  scope: 'email',
  profileFields: ['emails', 'name'],
};
