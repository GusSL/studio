<template>

  <VLayout row wrap>
    <VFlex
      v-if="node && !root"
      tag="v-flex"
      xs12
      class="node-item pa-1"
      style="width: 100%;"
      data-test="item"
      :style="{backgroundColor: selected? $vuetify.theme.greyBackground : 'transparent' }"
      @click="onNodeClick(node.id)"
    >
      <ContextMenu :disabled="!allowEditing">
        <VLayout row align-center>
          <VFlex shrink style="min-width: 40px;">
            <VBtn
              v-if="showExpansion"
              icon
              small
              data-test="expansionToggle"
              :style="{transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)'}"
              @click.stop="toggle"
            >
              <Icon>keyboard_arrow_right</Icon>
            </VBtn>
          </VFlex>
          <VFlex shrink>
            <Icon class="ma-1">
              {{ hasContent ? "folder" : "folder_open" }}
            </Icon>
          </VFlex>
          <VFlex
            xs9
            class="notranslate text-truncate px-1"
            :style="{color: $vuetify.theme.darkGrey}"
          >
            <VTooltip bottom open-delay="750">
              <template #activator="{ on }">
                <span v-on="on">{{ node.title }}</span>
              </template>
              <span>{{ node.title }}</span>
            </VTooltip>
          </VFlex>
          <VFlex shrink style="min-width: 20px;">
            <VProgressCircular
              v-if="loading"
              indeterminate
              size="15"
              width="2"
            />
            <VMenu
              v-if="allowEditing && !loading"
              offset-y
              right
              data-test="editMenu"
            >
              <template #activator="{ on }">
                <VBtn
                  class="topic-menu ma-0 mr-2"
                  small
                  icon
                  flat
                  v-on="on"
                  @click.stop
                >
                  <Icon>more_horiz</Icon>
                </VBtn>
              </template>
              <ContentNodeOptions :nodeId="nodeId" />
            </VMenu>
          </VFlex>
        </VLayout>
        <template #menu>
          <div class="caption grey--text notranslate px-3 pt-2">
            {{ node.title }}
          </div>
          <ContentNodeOptions :nodeId="nodeId" />
        </template>
      </ContextMenu>
    </VFlex>
    <VFlex v-if="node && (root || hasContent) && !loading" xs12>
      <VSlideYTransition>
        <div v-show="expanded" class="ml-4">
          <StudioTree
            v-for="child in subtopics"
            :key="child.id"
            :treeId="treeId"
            :nodeId="child.id"
            :selectedNodeId="selectedNodeId"
            :allowEditing="allowEditing"
            :onNodeClick="onNodeClick"
          />
        </div>
      </VSlideYTransition>
    </VFlex>
  </VLayout>

</template>

<script>

  import { mapActions, mapGetters, mapMutations } from 'vuex';

  import ContentNodeOptions from '../ContentNodeOptions';
  import { ContentKindsNames } from 'shared/leUtils/ContentKinds';
  import ContextMenu from 'shared/views/ContextMenu';

  export default {
    name: 'StudioTree',
    components: {
      ContextMenu,
      ContentNodeOptions,
    },
    props: {
      treeId: {
        type: String,
        required: true,
      },
      nodeId: {
        type: String,
        required: true,
      },
      onNodeClick: {
        type: Function,
        required: true,
      },
      selectedNodeId: {
        type: String,
        required: false,
      },
      allowEditing: {
        type: Boolean,
        required: false,
        default: false,
      },
      root: {
        type: Boolean,
        default: false,
      },
    },
    data: () => {
      return {
        ContentKindsNames,
        loading: false,
        loaded: false,
      };
    },
    computed: {
      ...mapGetters('contentNode', ['getContentNode', 'getContentNodeChildren', 'nodeExpanded']),
      node() {
        return this.getContentNode(this.nodeId);
      },
      subtopics() {
        const children = this.getContentNodeChildren(this.nodeId);
        if (!children) {
          return [];
        }
        return children.filter(child => child.kind === this.ContentKindsNames.TOPIC);
      },
      showExpansion() {
        return this.node && this.node.total_count > this.node.resource_count;
      },
      hasContent() {
        return this.node && this.node.total_count;
      },
      expanded() {
        return this.root || this.nodeExpanded(this.nodeId);
      },
      selected() {
        return this.nodeId === this.selectedNodeId;
      },
    },
    created() {
      if (this.selected) {
        // Always expand the selected node
        this.setExpansion({ id: this.nodeId, expanded: true });
      }

      if (this.expanded) {
        if (!this.node) {
          this.loadContentNode(this.nodeId).then(this.getChildren);
        } else {
          this.getChildren();
        }
      }
    },
    methods: {
      ...mapActions('contentNode', ['loadChildren', 'loadContentNode']),
      ...mapMutations('contentNode', {
        toggleExpansion: 'TOGGLE_EXPANSION',
        setExpansion: 'SET_EXPANSION',
      }),
      getChildren() {
        if (this.hasContent && !this.loaded && this.expanded) {
          this.loading = true;
          return this.loadChildren({
            parent: this.nodeId,
            tree_id: this.treeId,
          }).then(() => {
            this.loading = false;
            this.loaded = true;
          });
        }
        return Promise.resolve();
      },
      toggle() {
        this.toggleExpansion(this.nodeId);
        if (this.expanded) {
          this.getChildren();
        }
      },
    },
    $trs: {},
  };

</script>

<style scoped lang="less">

  .topic-menu {
    display: none;
  }

  .node-item {
    cursor: pointer;
    &:hover .topic-menu {
      display: block;
    }
  }

  .slide-y-transition-enter-active,
  .slide-y-transition-leave-active {
    transition-duration: 0.25s;
  }

</style>
