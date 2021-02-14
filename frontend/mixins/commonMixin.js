import { isHex } from '@polkadot/util'
import { BigNumber } from 'bignumber.js'
import { network } from '@/frontend.config.js'

export default {
  methods: {
    shortAddress(address) {
      return (
        address.substring(0, 5) + '…' + address.substring(address.length - 5)
      )
    },
    shortHash(hash) {
      return `${hash.substr(0, 6)}…${hash.substr(hash.length - 4, 4)}`
    },
    formatNumber(number) {
      if (isHex(number)) {
        return parseInt(number, 16)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      } else {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
    },
    formatAmount(amount) {
      return `${new BigNumber(amount)
        .div(new BigNumber(10).pow(network.tokenDecimals))
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ${network.tokenSymbol}`
    },
    capitalize(s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
  },
}
