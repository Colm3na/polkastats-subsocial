<template>
  <div>
    <section>
      <b-container class="main py-5">
        <h1 class="mb-4">
          {{ $t('pages.transfers.title') }}
        </h1>
        <div class="last-transfers">
          <div v-if="loading" class="text-center py-4">
            <Loading />
          </div>
          <template v-else>
            <!-- Filter -->
            <b-row style="margin-bottom: 1rem">
              <b-col cols="12">
                <b-form-input
                  id="filterInput"
                  v-model="filter"
                  type="search"
                  :placeholder="$t('components.transfers.search')"
                />
              </b-col>
            </b-row>
            <div class="table-responsive">
              <b-table
                striped
                hover
                :fields="fields"
                :per-page="perPage"
                :current-page="currentPage"
                :items="transfers"
                :filter="filter"
                @filtered="onFiltered"
              >
                <template #cell(block_number)="data">
                  <p class="mb-0">
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="`/block?blockNumber=${data.item.block_number}`"
                      title="Check block information"
                    >
                      #{{ formatNumber(data.item.block_number) }}
                    </nuxt-link>
                  </p>
                </template>
                <template #cell(hash)="data">
                  <p class="mb-0">
                    {{ shortHash(data.item.hash) }}
                  </p>
                </template>
                <template #cell(from)="data">
                  <p class="mb-0">
                    <Identicon
                      :key="data.item.from"
                      :address="data.item.from"
                      :size="20"
                    />
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="`/account/${data.item.from}`"
                      :title="$t('pages.accounts.account_details')"
                    >
                      {{ shortAddress(data.item.from) }}
                    </nuxt-link>
                  </p>
                </template>
                <template #cell(to)="data">
                  <p class="mb-0">
                    <Identicon
                      :key="data.item.to"
                      :address="data.item.to"
                      :size="20"
                    />
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="`/account/${data.item.to}`"
                      :title="$t('pages.accounts.account_details')"
                    >
                      {{ shortAddress(data.item.to) }}
                    </nuxt-link>
                  </p>
                </template>
                <template #cell(amount)="data">
                  <p class="mb-0">
                    {{ formatAmount(data.item.amount) }}
                  </p>
                </template>
                <template #cell(success)="data">
                  <p class="mb-0">
                    <font-awesome-icon
                      v-if="data.item.success"
                      icon="check"
                      class="text-success"
                    />
                    <font-awesome-icon
                      v-else
                      icon="times"
                      class="text-danger"
                    />
                  </p>
                </template>
              </b-table>
            </div>
            <!-- pagination -->
            <div class="row">
              <div class="col-6">
                <!-- desktop -->
                <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
                  <b-button-group>
                    <b-button
                      v-for="(option, index) in paginationOptions"
                      :key="index"
                      variant="outline-secondary"
                      :class="{ 'selected-per-page': perPage === option }"
                      @click="setPageSize(option)"
                    >
                      {{ option }}
                    </b-button>
                  </b-button-group>
                </div>
                <!-- mobile -->
                <div class="d-block d-sm-block d-md-block d-lg-none d-xl-none">
                  <b-dropdown
                    class="m-md-2"
                    text="Page size"
                    variant="outline-secondary"
                  >
                    <b-dropdown-item
                      v-for="(option, index) in paginationOptions"
                      :key="index"
                      @click="setPageSize(10)"
                    >
                      {{ option }}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
              <div class="col-6">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  aria-controls="my-table"
                  variant="dark"
                  align="right"
                ></b-pagination>
              </div>
            </div>
          </template>
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import commonMixin from '@/mixins/commonMixin.js'
import Loading from '@/components/Loading.vue'
import Identicon from '@/components/Identicon.vue'
import { paginationOptions } from '@/frontend.config.js'

export default {
  components: {
    Identicon,
    Loading,
  },
  mixins: [commonMixin],
  data() {
    return {
      loading: true,
      filter: null,
      filterOn: [],
      transfers: [],
      paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      currentPage: 1,
      totalRows: 1,
      fields: [
        {
          key: 'block_number',
          label: 'Block',
          sortable: true,
        },
        {
          key: 'hash',
          label: 'Hash',
          sortable: true,
        },
        {
          key: 'from',
          label: 'From',
          sortable: true,
        },
        {
          key: 'to',
          label: 'To',
          sortable: true,
        },
        {
          key: 'amount',
          label: 'Amount',
          sortable: true,
        },
        {
          key: 'success',
          label: 'Success',
          sortable: true,
        },
      ],
    }
  },
  methods: {
    setPageSize(num) {
      localStorage.paginationOptions = num
      this.perPage = parseInt(num)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
  apollo: {
    $subscribe: {
      extrinsic: {
        query: gql`
          subscription extrinsic($perPage: Int!, $offset: Int!) {
            extrinsic(
              limit: $perPage
              offset: $offset
              where: {
                section: { _eq: "balances" }
                method: { _like: "transfer%" }
              }
              order_by: { block_number: desc, extrinsic_index: desc }
            ) {
              block_number
              signer
              hash
              args
              success
            }
          }
        `,
        variables() {
          return {
            perPage: this.perPage,
            offset: (this.currentPage - 1) * this.perPage,
          }
        },
        result({ data }) {
          this.transfers = data.extrinsic.map((transfer) => {
            return {
              block_number: transfer.block_number,
              hash: transfer.hash,
              from: transfer.signer,
              to: JSON.parse(transfer.args)[0],
              amount: JSON.parse(transfer.args)[1],
              success: transfer.success,
            }
          })
          this.totalRows = this.transfers.length
          this.loading = false
        },
      },
    },
  },
}
</script>
