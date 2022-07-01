/* eslint-disable @typescript-eslint/naming-convention */
export const UNKNOWN_ERR_CODE = 'MEREL.INTERNAL_SERVER_ERROR';
export const VALIDATION_ERR_CODE = 'MEREL.VALIDATION_ERROR';
export const UNKNOWN_ERR_DESC = 'Something went wrong. Internal server error.';

export const CustomErrorMessage = {
  'MEREL.INTERNAL_SERVER_ERROR': {
    messageCode: UNKNOWN_ERR_CODE,
    description: UNKNOWN_ERR_DESC,
  },
  //module merchant
  'USER.USER.USER_NOT_FOUND': {
    messageCode: 'USER.USER.USER_NOT_FOUND',
    description: 'User not found',
  },

  'USER.WALLET_NOT_FOUND': {
    messageCode: 'USER.WALLET_NOT_FOUND',
    description: 'Wallet not found',
  },

  'USER.WALLET_BALANCE_IS_ZERO': {
    messageCode: 'USER.WALLET_BALANCE_IS_ZERO',
    description: 'Wallet balance is zero',
  },

  'USER.USER.WALLET_NOT_FOUND': {
    messageCode: 'USER.USER.WALLET_NOT_FOUND',
    description: 'Wallet not found',
  },

  'USER.NEW_PASSWORD_CAN_NOT_BE_THE_SAME_AS_OLD_PASSWORD': {
    messageCode: 'USER.NEW_PASSWORD_CAN_NOT_BE_THE_SAME_AS_OLD_PASSWORD',
    description: 'New password can not be same as old password',
  },
  'USER.OLD_PASSWORD_INCORRECT': {
    messageCode: 'USER.OLD_PASSWORD_INCORRECT',
    description: 'Wrong current password',
  },
  'USER.MERCHANT_DONT_HAVE_CURRENCY_SETTINGS': {
    messageCode: 'USER.MERCHANT_DONT_HAVE_CURRENCY_SETTINGS',
    description: 'Merchant do not have currency settings',
  },
  'USER.AT_LEAST_ONE_CRYPTO_IS_ENABLED': {
    messageCode: 'USER.AT_LEAST_ONE_CRYPTO_IS_ENABLED',
    description: 'Merchant must enable at least one crypto type in setting',
  },
  'USER.INVALID_BODY': {
    messageCode: 'USER.INVALID_BODY',
    description: 'Invalid body',
  },
  'USER.UNDER_PAYMENT_THRESHOLD_VALUE_MUST_GREATER_THAN_ZERO': {
    messageCode: 'USER.UNDER_PAYMENT_THRESHOLD_VALUE_MUST_GREATER_THAN_ZERO',
    description: 'Under payment threshold value must greater than zero',
  },
  'USER.OVER_PAYMENT_THRESHOLD_VALUE_MUST_GREATER_THAN_ZERO': {
    messageCode: 'USER.OVER_PAYMENT_THRESHOLD_VALUE_MUST_GREATER_THAN_ZERO',
    description: 'Over payment threshold value must greater than zero',
  },
  'USER.UNDER_PAYMENT_THRESHOLD_VALUE_MUST_GREATER_THAN_ZERO_AND_LESS_THAN_100':
    {
      messageCode:
        'USER.UNDER_PAYMENT_THRESHOLD_VALUE_MUST_GREATER_THAN_ZERO_AND_LESS_THAN_100',
      description:
        'Under payment threshold value must greater than zero and less than 100',
    },
  'USER.MERCHANT_SECRET_NOT_FOUND': {
    messageCode: 'USER.MERCHANT_SECRET_NOT_FOUND',
    description: 'Merchant secret not found',
  },
  'USER.INVALID_OTP': {
    messageCOde: 'USER.INVALID_OTP',
    description: 'Invalid 2FA code',
  },

  'USER.TOKEN_ADDRESS_NOT_FOUND': {
    messageCode: 'USER.TOKEN_ADDRESS_NOT_FOUND',
    description: 'Token address not found',
  },
  'USER.INSUFFICIENT_FUNDS_IN_YOUR_ACCOUNT': {
    messageCode: 'USER.INSUFFICIENT_FUNDS_IN_YOUR_ACCOUNT',
    description: 'Insufficient funds in your account',
  },
  'USER.NOT_SUPPORTED_CHAIN': {
    messageCode: 'USER.NOT_SUPPORTED_CHAIN',
    description: 'Chain is not supported',
  },
  'USER.NOT_FOUND_MERCHANT_CONTRACT': {
    messageCode: 'USER.NOT_FOUND_MERCHANT_CONTRACT',
    description: 'Not found merchant contract',
  },
  'USER.INSUFFICIENT_FUNDS_IN_YOUR_SMART_CONTRACT': {
    messageCode: 'USER.INSUFFICIENT_FUNDS_IN_YOUR_SMART_CONTRACT',
    description: 'Insufficient funds in your contract',
  },
  'USER.INSUFFICIENT_FUNDS_TO_UPDATE': {
    messageCode: 'USER.INSUFFICIENT_FUNDS_TO_UPDATE',
    description: 'Insufficient funds to update confirm balance',
  },
  'USER.CLAIM_MANUALLY_IS_TURN_OFF': {
    messageCode: 'USER.CLAIM_MANUALLY_IS_TURN_OFF',
    description: 'Claim manually is turn off',
  },
  'USER.UPDATE_BALANCE_ERROR': {
    messageCode: 'USER.UPDATE_BALANCE_ERROR',
    description: 'Update balance error',
  },
  'USER.NOT_APPROVED': {
    messageCode: 'USER.NOT_APPROVED',
    description: 'Merchant is not approved yet',
  },
  'USER.MERCHANT_ADDRESS_INVALID': {
    messageCode: 'USER.MERCHANT_ADDRESS_INVALID',
    description: 'Merchant wallet address is invalid',
  },
  'USER.ERROR_CREATE_NEW_FP_MERCHANT_CONTRACT': {
    messageCode: 'USER.ERROR_CREATE_NEW_FP_MERCHANT_CONTRACT',
    description: 'Create new merchant contract error',
  },
  'USER.YOU_NEED_SETUP_WALLET_FIRST': {
    messageCode: 'USER.YOU_NEED_SETUP_WALLET_FIRST',
    description: 'Must setup wallet first',
  },
  'USER.CURRENT_STEP_INVALID': {
    messageCode: 'USER.CURRENT_STEP_INVALID',
    description: 'Setup step is invalid',
  },
  'USER.WALLET_SETUP_PROGRESSING': {
    messageCode: 'USER.WALLET_SETUP_PROGRESSING',
    description: 'Wallet setup is progressing',
  },
  'USER.WALLET_SETUP_COMPLETED': {
    messageCode: 'USER.WALLET_SETUP_COMPLETED',
    description: 'Wallet setup is completed',
  },
  'USER.WALLET_SETUP_FAILED': {
    messageCode: 'USER.WALLET_SETUP_FAILED',
    description: 'Wallet setup is failed',
  },
  'USER.INVALID_WALLETS': {
    messageCode: 'USER.INVALID_WALLETS',
    description: 'Merchant wallet is invalid',
  },
  'USER.MISSING_WALLET_IS_EMPTY': {
    messageCode: 'USER.MISSING_WALLET_IS_EMPTY',
    description: 'Missing wallet is empty',
  },
  'USER.MERCHANT_ALREADY_ENABLED_2FA': {
    messageCode: 'USER.MERCHANT_ALREADY_ENABLED_2FA',
    description: 'Merchant already enabled 2FA',
  },
  'USER.MERCHANT_ALREADY_DISABLED_2FA': {
    messageCode: 'USER.MERCHANT_ALREADY_DISABLED_2FA',
    description: 'Merchant already disabled 2FA',
  },
  'USER.TOKEN_NOT_FOUND': {
    messageCode: 'USER.TOKEN_NOT_FOUND',
    description: 'Token not found',
  },
  'USER.NETWORK_NOT_FOUND': {
    messageCode: 'USER.NETWORK_NOT_FOUND',
    description: 'Network not found',
  },
  'USER.SUPPORTED_CURRENCY_NOT_FOUND': {
    messageCode: 'USER.SUPPORTED_CURRENCY_NOT_FOUND',
    description: 'Currency is not supported',
  },
  'USER.NOT_FOUND_LOCAL_CURRENCY_RATES': {
    messageCode: 'USER.NOT_FOUND_LOCAL_CURRENCY_RATES',
    description: 'Local currency rates not found',
  },
  'USER.MERCHANT_ALREADY_CLOSED': {
    messageCode: 'USER.MERCHANT_ALREADY_CLOSED',
    description: 'Merchant already closed',
  },
  'USER.AUTH_CODE_REQUIRED': {
    messageCode: 'USER.AUTH_CODE_REQUIRED',
    description: 'Auth code is required',
  },
  'USER.TOKEN_SERVICE_FEE_BALANCE_NOT_ENOUGH': {
    messageCode: 'USER.TOKEN_SERVICE_FEE_BALANCE_NOT_ENOUGH',
    description: 'Token service fee balance not enough',
  },
  'USER.FORGOT_PASSWORD_EMAIL_EXPIRED': {
    messageCode: 'USER.FORGOT_PASSWORD_EMAIL_EXPIRED',
    description: 'Forgot password email expired',
  },
  'USER.CAN_NOT_GENERATE_MORE_BACKUP_CODES': {
    messageCode: 'USER.CAN_NOT_GENERATE_MORE_BACKUP_CODES',
    description: 'Can not generate more backup codes',
  },
  'USER.RESEND_EMAIL_UNSUCCESSFULLY': {
    messageCode: 'USER.RESEND_EMAIL_UNSUCCESSFULLY',
    description: 'Resend email unsuccessfully',
  },
  'USER.RESEND_EMAIL_TOO_FAST': {
    messageCode: 'USER.RESEND_EMAIL_TOO_FAST',
    description: 'Keep calm, please wait for a while',
  },
  //Module auth
  'AUTH.MERCHANT_NOT_FOUND': {
    messageCode: 'AUTH.MERCHANT_NOT_FOUND',
    description: 'Merchant not found',
  },
  'AUTH.AUTH_ERROR': {
    messageCode: 'AUTH.AUTH_ERROR',
    description: 'Authentication failed',
  },
  'AUTH.INCORRECT_EMAIL_OR_PASSWORD': {
    messageCode: 'AUTH.INCORRECT_EMAIL_OR_PASSWORD',
    description: 'Incorrect email or password',
  },
  'AUTH.ACCOUNT_NOT_ACTIVATED': {
    messageCode: 'AUTH.ACCOUNT_NOT_ACTIVATED',
    description: 'Account is not activated',
  },
  'AUTH.SESSION_NOT_FOUND': {
    messageCode: 'AUTH.SESSION_NOT_FOUND',
    description: 'Authenticated session not found',
  },
  'AUTH.ACCOUNT_CLOSED': {
    messageCode: 'AUTH.ACCOUNT_CLOSED',
    description: 'Account is closed',
  },

  // Cryptos
  'CRYPTO.NOT_FOUND': {
    messageCode: 'CRYPTO.NOT_FOUND',
    description: 'Cryptocurrency is not found',
  },
  'CRYPTO.NOT_ACCEPTED': {
    messageCode: 'CRYPTO.NOT_ACCEPTED',
    description: 'Cryptocurrency is not accepted by our system',
  },
  'CRYPTO.NOT_ENABLE_DEFAULT_STATUS_FOR_INACTIVE_CRYPTO': {
    messageCode: 'CRYPTO.NOT_ENABLE_DEFAULT_STATUS_FOR_INACTIVE_CRYPTO',
    description: 'Can not enable default status for inactive cryptocurrency',
  },

  // API KEY
  'API_KEY.NOT_FOUND': {
    messageCode: 'API_KEY.NOT_FOUND',
    description: 'Api Key not exist in database',
  },
  'API_KEY.EXCEED_LIMIT': {
    messageCode: 'API_KEY.EXCEED_LIMIT',
    description: 'Exceed the limit created api key',
  },
  // Security
  'SECURITY.FORBIDDEN': {
    messageCode: 'SECURITY.FORBIDDEN',
    description: 'Refuses to authorize',
  },
  'SECURITY.INVALID_OTP': {
    messageCode: 'SECURITY.INVALID_OTP',
    description: 'Invalid OTP code',
  },
  'SECURITY.CAN_NOT_GET_IMAGE_2FA': {
    messageCode: 'SECURITY.CAN_NOT_GET_IMAGE_2FA',
    description: 'Can not get 2FA image',
  },
  // Blockchains
  'BLOCKCHAIN.ERROR_FIND_EVENT_LOGS': {
    messageCode: 'BLOCKCHAIN.ERROR_FIND_EVENT_LOGS',
    description: 'Error on finding blockchain event logs',
  },
  'BLOCKCHAIN.AMOUNT_INVALID': {
    messageCode: 'BLOCKCHAIN.AMOUNT_INVALID',
    description: 'Amount is invalid',
  },
  'BLOCKCHAIN.ERROR_FLUSH_TOKEN_TO_MERCHANT': {
    messageCode: 'BLOCKCHAIN.ERROR_FLUSH_TOKEN_TO_MERCHANT',
    description: 'Error on flushing token to merchant',
  },
  'BLOCKCHAIN.ADDRESS_INVALID': {
    messageCode: 'BLOCKCHAIN.ADDRESS_INVALID',
    description: 'Blockchain address is invalid',
  },
  'BLOCKCHAIN.ERROR_SEND_TRANSACTION': {
    messageCode: 'BLOCKCHAIN.ERROR_SEND_TRANSACTION',
    description: 'Error on sending blockchain transaction',
  },

  // Currency
  'CURRENCY.NOT_SUPPORTED': {
    messageCode: 'CURRENCY.NOT_SUPPORTED',
    description: 'Currency is not supported',
  },
  // OTHERS
  'EMAIL.EMAIL_NOT_EXISTS': {
    messageCode: 'EMAIL.EMAIL_NOT_EXISTS',
    description: 'Email not exists',
  },
  'EMAIL.EMAIL_EXISTED': {
    messageCode: 'EMAIL.EMAIL_EXISTED',
    description: 'Email is already existed',
  },
  'PASSWORD.FORGOT_PASSWORD_KEY_NOT_CORRECT': {
    messageCode: 'PASSWORD.FORGOT_PASSWORD_KEY_NOT_CORRECT',
    description: 'Forgot password key not correct',
  },
  'PASSWORD.CONFIRM_PASSWORD_NOT_MATCH': {
    messageCode: 'PASSWORD.CONFIRM_PASSWORD_NOT_MATCH',
    description: 'Confirm password not match',
  },
  'BLOCKCHAIN.TIMEOUT_PENDING_TRANSACTION': {
    messageCode: 'BLOCKCHAIN.TIMEOUT_PENDING_TRANSACTION',
    description: 'Timeout in waiting pending transaction',
  },
  'BLOCKCHAIN.ESTIMATE_TRANSACTION_FEE_GREATER_THAN_AMOUNT': {
    messageCode: 'BLOCKCHAIN.ESTIMATE_TRANSACTION_FEE_GREATER_THAN_AMOUNT',
    description: 'Estimate transaction fee greater than amount',
  },
  'USER.SUPPORT_EMAIL_EXISTED': {
    messageCode: 'USER.SUPPORT_EMAIL_EXISTED',
    description: 'Support email existed',
  },

  'USER.AUTH_CODE_INVALID': {
    messageCode: 'USER.AUTH_CODE_INVALID',
    description: 'Auth code invalid',
  },
  'USER.TEMP_SECRET_NOT_FOUND': {
    messageCode: 'USER.TEMP_SECRET_NOT_FOUND',
    description: 'Temp secret not found',
  },
  'USER.MERCHANT_ALREADY_DEACTIVATED': {
    messageCode: 'USER.MERCHANT_ALREADY_DEACTIVATED',
    description: 'Merchant already deactivated',
  },
  'USER.MERCHANT_ALREADY_ACTIVATED': {
    messageCode: 'USER.MERCHANT_ALREADY_ACTIVATED',
    description: 'Merchant already activated',
  },
  'USER.ERROR_UPDATE_MERCHANT_STATUS': {
    messageCode: 'USER.ERROR_UPDATE_MERCHANT_STATUS',
    description: 'Update merchant status error',
  },
  'USER.ERROR_UPDATE_DEFAULT_SERVICE_FEE': {
    messageCode: 'USER.ERROR_UPDATE_DEFAULT_SERVICE_FEE',
    description: 'Update default service fee error',
  },
  'USER.ERROR_SETUP_SERVICE_FEE': {
    messageCode: 'USER.ERROR_SETUP_SERVICE_FEE',
    description: 'Setup service fee error',
  },
  'USER.ENDTIME_LESS_THAN_NOW': {
    messageCode: 'USER.ENDTIME_LESS_THAN_NOW',
    description: 'End time less than now',
  },
  'USER.STARTTIME_LESS_THAN_NOW': {
    messageCode: 'USER.STARTTIME_LESS_THAN_NOW',
    description: 'Start time less than now',
  },
  'USER.INVALID_TIME_RANGE': {
    messageCode: 'USER.INVALID_TIME_RANGE',
    description: 'Invalid time range',
  },
  'USER.TOKEN_ALREADY_WITHDRAWN': {
    messageCode: 'USER.TOKEN_ALREADY_WITHDRAWN',
    description: 'Token already withdrawn',
  },
  'USER.NOT_FOUND_SUPPORTED_CHAIN': {
    messageCode: 'USER.NOT_FOUND_SUPPORTED_CHAIN',
    description: 'Not found supported chain',
  },

  //Settings
  'SETTINGS.CHAIN_EXISTED': {
    messageCode: 'SETTINGS.CHAIN_EXISTED',
    description: 'Chain is already added',
  },
  'SETTINGS.CHAIN_NOT_FOUND': {
    messageCode: 'SETTINGS.CHAIN_NOT_FOUND',
    description: 'Chain not found',
  },

  // Dapps
  'DAPP.DAPP_ALREADY_REGISTERED': {
    messageCode: 'DAPP.DAPP_ALREADY_REGISTERED',
    description: 'Dapp already registered',
  },

  'DAPP.DAPP_NOT_FOUND': {
    messageCode: 'DAPP.DAPP_NOT_FOUND',
    description: 'Dapp not found',
  },

  'DAPP.BASE_FUND_VALUE_TOO_HIGH': {
    messageCode: 'DAPP.BASE_FUND_VALUE_TOO_HIGH',
    description: 'Base fund value too high',
  },

  'DAPP.MIN_CHILD_BALANCE_TOO_HIGH': {
    messageCode: 'DAPP.MIN_CHILD_BALANCE_TOO_HIGH',
    description: 'Min child balance too high',
  },

  // Smart contract
  'SMART_CONTRACT.SMART_CONTRACT_ALREADY_EXISTED': {
    messageCode: 'SMART_CONTRACT.SMART_CONTRACT_ALREADY_EXISTED',
    description: 'Smart contract already existed',
  },
  'SMART_CONTRACT.SMART_CONTRACT_NOT_FOUND': {
    messageCode: 'SMART_CONTRACT.SMART_CONTRACT_NOT_FOUND',
    description: 'Smart contract not found',
  },

  'SMART_CONTRACT.METHOD_NOT_FOUND': {
    messageCode: 'SMART_CONTRACT.METHOD_NOT_FOUND',
    description: 'Method not found',
  },

  // Meta api
  'META_API.META_API_ALREADY_EXISTED': {
    messageCode: 'META_API.META_API_ALREADY_EXISTED',
    description: 'Meta api already existed',
  },
  'META_API.META_API_NOT_FOUND': {
    messageCode: 'META_API.META_API_NOT_FOUND',
    description: 'Meta api not found',
  },

  // Settings
  'SETTINGS.PROVIDER_NOT_FOUND': {
    messageCode: 'SETTINGS.PROVIDER_NOT_FOUND',
    description: 'Provider not found',
  },
};
