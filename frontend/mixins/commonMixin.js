import { formatBalance, isHex } from '@polkadot/util'
import BN from 'bn.js'
import { network } from '@/polkastats.config.js'
formatBalance.setDefaults({
  decimals: network.tokenDecimals,
  unit: network.tokenSymbol,
})

export default {
  methods: {
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
      let bn
      if (isHex(amount)) {
        bn = new BN(amount.substring(2, amount.length), 16)
      } else {
        bn = new BN(amount.toString())
      }
      return formatBalance(bn.toString(10))
    },
    shortAddress(address) {
      return (
        address.substring(0, 5) + '…' + address.substring(address.length - 5)
      )
    },
    shortHash(hash) {
      return `${hash.substr(0, 6)}…${hash.substr(hash.length - 4, 4)}`
    },
  },
}
