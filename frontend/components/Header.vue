<template>
  <b-navbar type="dark" variant="dark" toggleable="xl" sticky>
    <b-container class="px-sm-3">
      <b-navbar-brand>
        <nuxt-link to="/" class="navbar-brand" title="PolkaStats for Subsocial">
          <img class="logo" src="/img/PolkaStats_logo_red-white.png" />
          <small>for</small>
          <img class="logo" src="/img/subsocial-logo.svg" />
        </nuxt-link>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item right to="/blocks">Blocks</b-nav-item>
          <b-nav-item right to="/accounts">Accounts</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { network } from '@/polkastats.config.js'
export default {
  data() {
    return {
      network,
    }
  },
}
</script>
