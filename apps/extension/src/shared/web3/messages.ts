export enum WalletWindowMessages {
  GET_WALLET = 'GET_WALLET',
  GET_WALLET_RESPONSE = 'GET_WALLET_RESPONSE',
  CLEAR_WALLET = 'CLEAR_WALLET',
  SAVE_WALLET = 'SAVE_WALLET',
}

export enum SolanaWalletWindowMessages {
  GET_SOLANA_WALLET = 'GET_SOLANA_WALLET',
  GET_SOLANA_WALLET_RESPONSE = 'GET_SOLANA_WALLET_RESPONSE',
  CLEAR_SOLANA_WALLET = 'CLEAR_SOLANA_WALLET',
  SAVE_SOLANA_WALLET = 'SAVE_SOLANA_WALLET',
}

export enum AuthTokenWindowMessages {
  GET_AUTH_TOKEN = 'GET_AUTH_TOKEN',
  GET_AUTH_TOKEN_RESPONSE = 'GET_AUTH_TOKEN_RESPONSE',
  CLEAR_AUTH_TOKEN = 'CLEAR_AUTH_TOKEN',
  SAVE_AUTH_TOKEN = 'SAVE_AUTH_TOKEN',
}

export enum TradingCopilotWindowMessages {
  // Auth token messages are already covered in AuthTokenWindowMessages
  GET_TOAST_SOUND_STATE = 'GET_TOAST_SOUND_STATE',
  GET_TOAST_SOUND_STATE_RESPONSE = 'GET_TOAST_SOUND_STATE_RESPONSE',
  CLEAR_TOAST_SOUND_STATE = 'CLEAR_TOAST_SOUND_STATE',
  SAVE_TOAST_SOUND_STATE = 'SAVE_TOAST_SOUND_STATE',
  CLEAR_SUBSCRIPTIONS_AMOUNT = 'CLEAR_SUBSCRIPTIONS_AMOUNT',
  SAVE_SUBSCRIPTIONS_AMOUNT = 'SAVE_SUBSCRIPTIONS_AMOUNT',
  SAVE_SUBSCRIPTIONS = 'SAVE_SUBSCRIPTIONS',
  GET_SUBSCRIPTIONS = 'GET_SUBSCRIPTIONS',
  GET_SUBSCRIPTIONS_RESPONSE = 'GET_SUBSCRIPTIONS_RESPONSE',
}

export enum DeviceIdWindowMessages {
  GET_DEVICE_ID = 'GET_DEVICE_ID',
  GET_DEVICE_ID_RESPONSE = 'GET_DEVICE_ID_RESPONSE',
  SET_DEVICE_ID = 'SET_DEVICE_ID',
}
