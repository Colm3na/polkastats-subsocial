<template>
  <div class="text-left">
    <div v-if="activityOnly">
      Updated
      <a :href="`https://app.subsocial.network/post/${postId}`" target="_blank"
        >post #{{ postId }}</a
      >
      with
      <a
        :href="`https://ipfs.io/api/v0/dag/get?arg=${args[1].content.ipfs}`"
        target="_blank"
        >content</a
      >
    </div>
    <div v-else>
      Updated
      <a :href="`https://app.subsocial.network/post/${postId}`" target="_blank"
        >post #{{ postId }}</a
      >
      with content:<br />
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
    postId() {
      return new BigNumber(this.args[0]).toString(10)
    },
  },
  async created() {
    await axios
      .get(`https://ipfs.io/api/v0/dag/get?arg=${this.args[1].content.ipfs}`)
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
