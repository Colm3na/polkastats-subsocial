<template>
  <div>
    <section>
      <b-container class="extrinsic-page main py-5">
        <div v-if="loading" class="text-center py-4">
          <Loading />
        </div>
        <template v-else-if="!parsedExtrinsic">
          <h1 class="text-center">Extrinsic not found!</h1>
        </template>
        <template v-else>
          <div class="card mt-4 mb-3">
            <div class="card-body">
              <h4 class="text-center mb-4">
                Extrinsic {{ blockNumber }}-{{ extrinsicIndex }}
              </h4>
              <div class="table-responsive pb-4">
                <table class="table table-striped extrinsic-table">
                  <tbody>
                    <tr>
                      <td>Block number</td>
                      <td>
                        <nuxt-link
                          v-b-tooltip.hover
                          :to="`/block?blockNumber=${blockNumber}`"
                          title="Check block information"
                        >
                          #{{ formatNumber(blockNumber) }}
                        </nuxt-link>
                      </td>
                    </tr>
                    <tr>
                      <td>Extrinsic index</td>
                      <td>
                        {{ parsedExtrinsic.extrinsic_index }}
                      </td>
                    </tr>
                    <tr>
                      <td>Hash</td>
                      <td>
                        {{ parsedExtrinsic.hash }}
                      </td>
                    </tr>
                    <tr>
                      <td>Signed?</td>
                      <td>
                        {{ parsedExtrinsic.is_signed }}
                      </td>
                    </tr>
                    <tr>
                      <td>Signer</td>
                      <td>
                        <p v-if="parsedExtrinsic.signer" class="mb-0">
                          <Identicon
                            :key="parsedExtrinsic.signer"
                            :address="parsedExtrinsic.signer"
                            :size="20"
                          />
                          <nuxt-link
                            v-b-tooltip.hover
                            :to="`/account/${parsedExtrinsic.signer}`"
                            :title="$t('pages.accounts.account_details')"
                          >
                            {{ shortAddress(parsedExtrinsic.signer) }}
                          </nuxt-link>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Extrinsic</td>
                      <td>
                        {{ parsedExtrinsic.section }} ➡
                        {{ parsedExtrinsic.method }}
                      </td>
                    </tr>
                    <tr>
                      <td>Activity</td>
                      <td>
                        <component
                          :is="extrinsicComponent"
                          :signer="parsedExtrinsic.signer"
                          :args="JSON.parse(parsedExtrinsic.args)"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Args</td>
                      <td>
                        <pre class="mb-0">{{
                          JSON.stringify(
                            JSON.parse(parsedExtrinsic.args),
                            null,
                            2
                          )
                        }}</pre>
                      </td>
                    </tr>
                    <tr>
                      <td>Success</td>
                      <td>
                        <font-awesome-icon
                          v-if="parsedExtrinsic.success"
                          icon="check"
                          class="text-success"
                        />
                        <font-awesome-icon
                          v-else
                          icon="times"
                          class="text-danger"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
import Loading from '@/components/Loading.vue'
import {
  CreatePost,
  UpdatePost,
  CreatePostReaction,
  CreateProfile,
  Drip,
  CreateSpace,
  UpdateSpace,
  FollowSpace,
  FollowAccount,
} from '@/components/extrinsics/index.js'
import commonMixin from '@/mixins/commonMixin.js'
import gql from 'graphql-tag'

export default {
  components: {
    Loading,
    CreatePost,
    UpdatePost,
    CreatePostReaction,
    CreateProfile,
    Drip,
    CreateSpace,
    UpdateSpace,
    FollowSpace,
    FollowAccount,
  },
  mixins: [commonMixin],
  data() {
    return {
      loading: true,
      blockNumber: this.$route.params.block,
      extrinsicIndex: this.$route.params.index,
      parsedExtrinsic: undefined,
    }
  },
  computed: {
    extrinsicComponent() {
      if (
        this.parsedExtrinsic.section === 'posts' &&
        this.parsedExtrinsic.method === 'createPost'
      ) {
        return 'CreatePost'
      } else if (
        this.parsedExtrinsic.section === 'posts' &&
        this.parsedExtrinsic.method === 'updatePost'
      ) {
        return 'UpdatePost'
      } else if (
        this.parsedExtrinsic.section === 'reactions' &&
        this.parsedExtrinsic.method === 'createPostReaction'
      ) {
        return 'CreatePostReaction'
      } else if (
        this.parsedExtrinsic.section === 'profiles' &&
        this.parsedExtrinsic.method === 'createProfile'
      ) {
        return 'CreateProfile'
      } else if (
        this.parsedExtrinsic.section === 'faucets' &&
        this.parsedExtrinsic.method === 'drip'
      ) {
        return 'Drip'
      } else if (
        this.parsedExtrinsic.section === 'spaceFollows' &&
        this.parsedExtrinsic.method === 'followSpace'
      ) {
        return 'FollowSpace'
      } else if (
        this.parsedExtrinsic.section === 'profileFollows' &&
        this.parsedExtrinsic.method === 'followAccount'
      ) {
        return 'FollowAccount'
      } else if (
        this.parsedExtrinsic.section === 'spaces' &&
        this.parsedExtrinsic.method === 'createSpace'
      ) {
        return 'CreateSpace'
      } else if (
        this.parsedExtrinsic.section === 'spaces' &&
        this.parsedExtrinsic.method === 'updateSpace'
      ) {
        return 'UpdateSpace'
      }
      return undefined
    },
  },
  watch: {
    $route() {
      this.blockNumber = this.$route.params.block
      this.extrinsicIndex = this.$route.params.index
    },
  },
  methods: {
    getDateFromTimestamp(timestamp) {
      if (timestamp === 0) {
        return `--`
      }
      const newDate = new Date()
      newDate.setTime(timestamp * 1000)
      return newDate.toUTCString()
    },
  },
  apollo: {
    extrinsic: {
      query: gql`
        query extrinsic($block_number: bigint!, $extrinsic_index: Int!) {
          extrinsic(
            where: {
              block_number: { _eq: $block_number }
              extrinsic_index: { _eq: $extrinsic_index }
            }
          ) {
            block_number
            extrinsic_index
            is_signed
            signer
            section
            method
            args
            hash
            doc
            success
          }
        }
      `,
      skip() {
        return !this.blockNumber || !this.extrinsicIndex
      },
      variables() {
        return {
          block_number: this.blockNumber,
          extrinsic_index: this.extrinsicIndex,
        }
      },
      result({ data }) {
        this.parsedExtrinsic = data.extrinsic[0]
        this.loading = false
      },
    },
  },
}
</script>
