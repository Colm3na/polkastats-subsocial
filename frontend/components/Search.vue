<template>
  <!-- Filter -->
  <b-row class="mb-4">
    <b-col cols="12">
      <b-form-input
        id="searchInput"
        v-model="searchInput"
        type="search"
        placeholder="Search by block number, block hash, extrinsic hash or account address"
        @keydown.native="doSearch"
      />
    </b-col>
  </b-row>
</template>

<script>
import gql from 'graphql-tag'
export default {
  data() {
    return {
      searchInput: '',
    }
  },
  methods: {
    async doSearch(event) {
      if (event.keyCode === 13) {
        if (await this.isExtrinsicHash(this.searchInput)) {
          this.$router.push({
            path: `/extrinsic/${this.searchInput}`,
          })
        } else if (await this.isBlockHash(this.searchInput)) {
          this.$router.push({
            path: `/block/${this.searchInput}`,
          })
        } else if (this.isAddress(this.searchInput)) {
          this.$router.push({
            path: `/account/${this.searchInput}`,
          })
        } else if (this.isBlockNumber(this.searchInput)) {
          this.$router.push({
            path: `/block?blockNumber=${this.searchInput}`,
          })
        }
      }
    },
    isBlockNumber(input) {
      return Number.isInteger(Number(input))
    },
    async isBlockHash(input) {
      // 0xadb2179b1666fef3b56a5762c3db0152b2a0a7f3d4b47737a355262609d867b9
      if (input.length === 66 && input.startsWith('0x')) {
        const client = this.$apollo.provider.defaultClient
        const query = gql`
          query block {
            block(limit: 1, where: {block_hash: {_eq: "${input}"}}) {
              block_number
            }
          }
        `
        const response = await client.query({ query })
        return response.data.block.length > 0
      }
      return false
    },
    async isExtrinsicHash(input) {
      // 0x3eab8af8321eb77e425396d029486739b7563965a4052211d5076a9e80f6010e
      if (input.length === 66 && input.startsWith('0x')) {
        const client = this.$apollo.provider.defaultClient
        const query = gql`
          query extrinsic {
            extrinsic(limit: 1, where: {hash: {_eq: "${input}"}}) {
              block_number
            }
          }
        `
        const response = await client.query({ query })
        return response.data.extrinsic.length > 0
      }
      return false
    },
    isAddress(input) {
      const polkadotRegexp = /^(([0-9a-zA-Z]{47})|([0-9a-zA-Z]{48}))$/
      return polkadotRegexp.test(input)
    },
  },
}
</script>
