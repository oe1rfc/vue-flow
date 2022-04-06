# Composables

## [useVueFlow](https://types.vueflow.dev/modules.html#useVueFlow)

If you're using the options API of Vue you will soon notice that your access to the state of Vue Flow is limited.

This is where the composition API comes in.

The composition API and the power of provide/inject allows us to act more flexible with the way we provide states inside a component tree.
Thus accessing the internal state of Vue Flow becomes super easy when using composition.

```vue:no-line-numbers
<script setup>
import { useVueFlow, VueFlow } from '@braks/vue-flow'

const { nodes, edges } = useVueFlow({
  nodes: [
    {
      id: '1',
      label: 'Node 1',
      position: { x: 0, y: 0 },
    }
  ]
})

onMounted(() => {
  console.log(nodes.value) // will log a single node
  console.log(edges.value) // will log an empty array
})
</script>
<template>
  <VueFlow />
</template>
```

`useVueFlow` exposes basically the whole internal state.
The values are reactive, meaning changing the state values returned from `useVueFlow` will trigger changes in the graph.

## [useZoomPanHelper](https://types.vueflow.dev/modules.html#useZoomPanHelper)

Similar to the Vue Flow instance the zoom pan helper composable can be used to modify the viewport of the Vue Flow graph.
It requires a valid Vue Flow store in its context.

```vue:no-line-numbers
<script setup>
import { useZoomPanHelper } from '@braks/vue-flow'

const { fitView } = useZoomPanHelper()
</script>
<template>
  <button @click="fitView({ padding: 0.2, includeHiddenNodes: true })"></button>
</template>
```

## [useHandle](https://types.vueflow.dev/modules.html#useHandle)

Instead of using the Handle component you can use the useHandle composable to create your own custom nodes. `useHandle`
provides you with a mouseDown- and click-handler functions that you can apply to the element you want to use as a node-handle.

This is how the default handle component is built:

```vue
<script lang="ts" setup>
import { useHandle, useVueFlow, Position, NodeId } from '@braks/vue-flow'
import type { HandleProps } from '@braks/vue-flow'

const { id, hooks, connectionStartHandle } = useVueFlow()
const props = withDefaults(defineProps<HandleProps>(), {
  type: 'source',
  position: 'top' as Position,
  connectable: true,
})

const nodeId = inject(NodeId, '')

const { onMouseDown, onClick } = useHandle()
const onMouseDownHandler = (event: MouseEvent) =>
  onMouseDown(event, props.id ?? null, nodeId, props.type === 'target', props.isValidConnection, undefined, (connection) =>
    hooks.value.connect.trigger(connection),
  )
const onClickHandler = (event: MouseEvent) => onClick(event, props.id ?? null, nodeId, props.type, props.isValidConnection)
</script>
<script lang="ts">
export default {
  name: 'Handle',
}
</script>
<template>
  <div
    :data-handleid="props.id"
    :data-nodeid="nodeId"
    :data-handlepos="props.position"
    :class="[
      'vue-flow__handle',
      `vue-flow__handle-${props.position}`,
      `vue-flow__handle-${id}`,
      'nodrag',
      {
        source: props.type !== 'target',
        target: props.type === 'target',
        connectable: props.connectable,
        connecting:
          connectionStartHandle?.nodeId === nodeId &&
          connectionStartHandle?.handleId === props.id &&
          connectionStartHandle?.type === props.type,
      },
    ]"
    @mousedown="onMouseDownHandler"
    @click="onClickHandler"
  >
    <slot :node-id="nodeId" v-bind="props"></slot>
  </div>
</template>
```