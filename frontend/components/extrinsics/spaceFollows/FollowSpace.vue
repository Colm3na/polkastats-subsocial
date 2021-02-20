<template>
  <div class="text-left">
    Follow
    <a :href="`https://app.subsocial.network/${spaceId}`" target="_blank"
      >space #{{ spaceId }}</a
    >
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
    spaceId() {
      return new BigNumber(this.args[0]).toString(10)
    },
  },
}
</script>
