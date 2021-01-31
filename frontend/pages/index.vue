<template>
  <div>
    <section>
      <b-container class="main py-5 dashboard">
        <div class="row">
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/blocks`"
                title="Click to see last blocks"
              >
                Last blocks
              </nuxt-link>
            </h3>
            <LastBlocks />
          </div>
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/accounts`"
                title="Click to see all active accounts"
              >
                Top rich
              </nuxt-link>
            </h3>
            <Top10Rich />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/transfers`"
                title="Click to see last transfers"
              >
                Recent extrinsics
              </nuxt-link>
            </h3>
            <LastTransfers />
          </div>
          <div class="col-md-6 mb-4">
            <h3>
              <nuxt-link
                v-b-tooltip.hover
                :to="`/events`"
                title="Click to see last events"
              >
                Recent events
              </nuxt-link>
            </h3>
            <LastEvents />
          </div>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import LastBlocks from '../components/LastBlocks.vue'
import LastEvents from '../components/LastEvents.vue'
import LastTransfers from '../components/LastTransfers.vue'
import Top10Rich from '../components/Top10Rich.vue'
import { network } from '../polkastats.config.js'

export default {
  components: {
    LastBlocks,
    LastEvents,
    LastTransfers,
    Top10Rich,
  },
  data: () => {
    return {
      network,
    }
  },
  head() {
    return {
      title: 'title',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'description',
        },
      ],
    }
  },
}
</script>
<style>
.dashboard .clipboard {
  display: inline-block;
}
.dashboard .identicon {
  margin-right: 0.2rem;
  cursor: copy;
}
</style>
