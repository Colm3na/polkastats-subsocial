const selectedNetwork = 'Subsocial'
export const networks = [
  {
    id: 'subsocial',
    name: 'Subsocial',
    tokenSymbol: 'SMN',
    tokenDecimals: 12,
    ss58Format: 28,
    coinGeckoDenom: undefined,
    nodeWs: 'wss://subsocial.polkastats.io/rpc',
    backendWs: 'wss://subsocial.polkastats.io/api/v3',
    backendHttp: 'http://subsocial.polkastats.io/api/v3',
    googleAnalytics: '',
    theme: '@/assets/scss/themes/subsocial.scss',
  },
]
export const network = networks.find(({ name }) => name === selectedNetwork)
export const paginationOptions = [10, 20, 50, 100]
