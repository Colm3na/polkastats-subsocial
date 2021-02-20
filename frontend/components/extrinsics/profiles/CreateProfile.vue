<template>
  <div class="text-left">
    Created profile for
    <a
      :href="`https://app.subsocial.network/accounts/${signer}`"
      target="_blank"
      >account {{ shortAddress(signer) }}</a
    >
    with content:<br />
    <pre class="mb-0">{{ JSON.stringify(content, null, 2) }}</pre>
  </div>
</template>

<script>
import axios from 'axios'
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
  props: {
    signer: {
      type: String,
      default: () => '',
    },
    args: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      content: undefined,
    }
  },
  async created() {
    await axios
      .get(`https://ipfs.io/api/v0/dag/get?arg=${this.args[0].IPFS}`)
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
