<template>
  <div v-if="lastBlock">
    <div class="row">
      <div class="col-6 col-md-6 col-lg-3 mb-4"></div>
      <div class="col-6 col-md-6 col-lg-3 mb-4"></div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h4 class="mb-3">{{ $t('components.network.last_block') }}</h4>
            <nuxt-link
              v-b-tooltip.hover
              :to="`/block?blockNumber=${lastBlock.block_number}`"
              title="Click to see block info!"
            >
              <h6 class="d-inline-block">
                #{{ formatNumber(lastBlock.block_number) }}
              </h6>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h4 class="mb-3">
              {{ $t('components.network.last_block_finalized') }}
            </h4>
            <nuxt-link
              v-b-tooltip.hover
              :to="`/block?blockNumber=${lastFinalizedBlock}`"
              title="Click to see block info!"
            >
              <h6 class="d-inline-block">
                #{{ formatNumber(lastFinalizedBlock) }}
              </h6>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import commonMixin from '../mixins/commonMixin.js'
import { network } from '../polkastats.config.js'

export default {
  mixins: [commonMixin],
  data() {
    return {
      network,
      lastBlock: 0,
      lastFinalizedBlock: 0,
    }
  },
  apollo: {
    $subscribe: {
      block: {
        query: gql`
          subscription blocks {
            block(order_by: { block_number: desc }, where: {}, limit: 1) {
              block_number
              finalized
            }
          }
        `,
        result({ data }) {
          this.lastBlock = data.block[0]
        },
      },
      finalized: {
        query: gql`
          subscription blocks {
            block(
              limit: 1
              order_by: { block_number: desc }
              where: { finalized: { _eq: true } }
            ) {
              block_number
            }
          }
        `,
        result({ data }) {
          this.lastFinalizedBlock = data.block[0].block_number
        },
      },
    },
  },
}
</script>

<style scoped>
.network .card h5 {
  color: #670d35;
}
.network .card .card-body {
  padding: 1rem 0.5rem;
}
.network .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
  height: 25px;
}
</style>
