<template>
  <div class="text-left">
    Drip {{ formatAmount(args[1]) }}
    from faucet to
    <a
      :href="`https://app.subsocial.network/accounts/${args[0]}`"
      target="_blank"
      >account {{ shortAddress(args[0]) }}</a
    >
  </div>
</template>

<script>
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
  props: {
    args: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
