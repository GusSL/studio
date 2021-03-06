<template>

  <VContainer class="list-items">
    <VLayout row wrap justify-center>
      <VFlex>
        <VBtn flat color="primary" class="ma-0" @click="infoDialog=true">
          <Icon>info</Icon>
          <span class="mx-2">{{ $tr('aboutChannelSets') }}</span>
        </VBtn>
        <MessageDialog v-model="infoDialog" :header="$tr('aboutChannelSets')">
          <p>
            {{ $tr('channelSetsDescriptionText') }}
          </p>
          <p>
            {{ $tr('channelSetsInstructionsText') }}
          </p>
          <p class="red--text">
            {{ $tr('channelSetsDisclaimer') }}
          </p>
          <template #buttons>
            <VSpacer />
            <VBtn color="primary" @click="infoDialog=false">
              {{ $tr('cancelButtonLabel') }}
            </VBtn>
          </template>
        </MessageDialog>
      </VFlex>
      <VSpacer />
      <VFlex class="text-xs-right">
        <VBtn
          v-if="!loading"
          color="primary"
          data-test="add-channelset"
          @click="newChannelSet"
        >
          {{ $tr('addChannelSetTitle') }}
        </VBtn>
      </VFlex>
    </VLayout>
    <VLayout row justify-center class="pt-4">
      <VFlex xs12>
        <template v-if="loading">
          <VProgressLinear
            indeterminate
            color="primary"
          />
          <p class="headline mb-0">
            {{ $tr('loading') }}
          </p>
        </template>
        <p v-else-if="channelSets && !channelSets.length" class="text-xs-center mb-0">
          {{ $tr('noChannelSetsFound') }}
        </p>
        <template v-else>
          <VDataTable
            :headers="headers"
            :items="sortedChannelSets"
            hide-actions
          >
            <template #items="{item}">
              <ChannelSetItem
                :channelSetId="item.id"
              />
            </template>
          </VDataTable>
        </template>
      </VFlex>
    </VLayout>
  </VContainer>

</template>

<script>

  import sortBy from 'lodash/sortBy';
  import { mapGetters, mapActions } from 'vuex';
  import { RouterNames } from '../../constants';
  import ChannelSetItem from './ChannelSetItem.vue';
  import MessageDialog from 'shared/views/MessageDialog';

  export default {
    name: 'ChannelSetList',
    components: {
      ChannelSetItem,
      MessageDialog,
    },
    data() {
      return {
        loading: true,
        infoDialog: false,
      };
    },
    computed: {
      ...mapGetters('channelSet', ['channelSets']),
      headers() {
        return [
          { text: this.$tr('title'), sortable: false, value: 'name' },
          { text: this.$tr('token'), sortable: false, value: 'secret_token', width: '224px' },
          { text: this.$tr('channelNumber'), sortable: false, align: 'right', width: '50px' },
          { text: this.$tr('options'), sortable: false, align: 'center', width: '100px' },
        ];
      },
      sortedChannelSets() {
        return sortBy(this.channelSets, s => s.name.toLowerCase()) || [];
      },
    },
    mounted() {
      this.loadChannelSetList().then(() => {
        this.loading = false;
      });
    },
    methods: {
      ...mapActions('channelSet', ['loadChannelSetList', 'createChannelSet']),
      newChannelSet() {
        this.createChannelSet().then(id => {
          this.$router.push({
            name: RouterNames.CHANNEL_SET_DETAILS,
            params: { channelSetId: id },
          });
        });
      },
    },
    $trs: {
      loading: 'Loading collections...',
      cancelButtonLabel: 'Close',
      noChannelSetsFound:
        'You can package together multiple channels to create a collection. The entire collection can then be imported to Kolibri at once by using a collection token.',
      addChannelSetTitle: 'New collection',
      aboutChannelSets: 'About Collections',
      channelSetsDescriptionText:
        'A collection contains multiple Kolibri Studio channels that can be imported at one time to Kolibri with a single collection token.',
      channelSetsInstructionsText:
        'You can make a collection by selecting the channels you want to be imported together.',
      channelSetsDisclaimer:
        'You will need Kolibri version 0.12.0 or higher to import channel collections',
      title: 'Collection title',
      token: 'Token ID',
      channelNumber: 'Number of channels',
      options: 'Options',
    },
  };

</script>


<style lang="less" scoped>

  .list-items {
    margin: 0 auto;
  }

  /deep/ .v-datatable {
    background-color: transparent !important;
  }

</style>
