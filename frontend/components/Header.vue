<template>
  <b-navbar toggleable="xl">
    <b-container class="px-sm-3">
      <b-navbar-brand>
        <nuxt-link to="/" class="navbar-brand" title="Subsocial block explorer">
          <img class="logo" src="/img/PolkaStats_logo_red-gray_500px.png" />
        </nuxt-link>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item right to="/blocks">Blocks</b-nav-item>
          <b-nav-item right to="/activity">Activity</b-nav-item>
          <!-- <b-nav-item right to="/transfers">Transfers</b-nav-item> -->
          <b-nav-item right to="/extrinsics">Extrinsics</b-nav-item>
          <b-nav-item right to="/events">Events</b-nav-item>
          <b-nav-item right to="/accounts">Accounts</b-nav-item>
        </b-navbar-nav>
        <a
          v-b-tooltip.hover
          title="Subsocial Network"
          href="https://subsocial.network/"
          target="_blank"
          class="d-none d-lg-block d-xl-block"
        >
          <span class="badge badge-pill network">
            <img src="/img/subsocial-logo.svg" style="max-height: 1rem" />
          </span>
        </a>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { network } from '@/frontend.config.js'
export default {
  data() {
    return {
      network,
    }
  },
}
</script>
