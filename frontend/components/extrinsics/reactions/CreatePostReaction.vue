<template>
  <div class="text-left">
    React to
    <a :href="`https://app.subsocial.network/post/${postId}`" target="_blank"
      >post #{{ postId }}</a
    >
    with
    <span v-if="args[1] === 'Upvote'">Upvote</span>
    <span v-else>Downvote</span>
  </div>
</template>

<script>
import { BigNumber } from 'bignumber.js'
export default {
  props: {
    args: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    postId() {
      return new BigNumber(this.args[0]).toString(10)
    },
  },
}
</script>
