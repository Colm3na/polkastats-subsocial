<template>
  <div class="text-left">
    <div v-if="activityOnly">
      Created space with
      <a
        :href="`https://ipfs.io/api/v0/dag/get?arg=${args[2].ipfs}`"
        target="_blank"
        >content</a
      >
    </div>
    <div v-else>
      Created space with content:<br />
      <pre class="mb-0">{{ JSON.stringify(content, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { BigNumber } from 'bignumber.js'
export default {
  props: {
    args: {
      type: Array,
      default: () => [],
    },
    activityOnly: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      content: undefined,
    }
  },
  computed: {
    spaceId() {
      return new BigNumber(this.args[0]).toString(10)
    },
  },
  async created() {
    await axios
      .get(`https://ipfs.io/api/v0/dag/get?arg=${this.args[2].ipfs}`)
      .then(({ data }) => {
        this.content = data
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetching IPFS content: ', error)
      })
  },
}
</script>
