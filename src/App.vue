<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      color: 'white',
    }"
  >
    <VueFlow
      :nodes="finalizedNodes"
      :edges="finalizedEdges"
      class="basic-flow"
      :default-viewport="{ zoom: 1.5 }"
      :min-zoom="0.2"
      :max-zoom="4"
    >
      <Background
        pattern-color="#aaa"
        :gap="16"
      />
      <template #node-workflow="props">
        <WorkflowNode
          :node="props"
          :source-position="props.sourcePosition"
          :target-position="props.targetPosition"
        />
      </template>
      <template #node-adding="props">
        <AddingNode
          :node="props"
          :source-position="props.sourcePosition"
          :target-position="props.targetPosition"
          @on-node-click="handleAddingNodeClick"
        />
      </template>
    </VueFlow>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import {
  ADDING_NODE_DIMENSIONS,
  INITIAL_NODES,
  WORKFLOW_NODE_DIMENSIONS,
} from './constants.js'
import dagre from '@dagrejs/dagre'
import WorkflowNode from './components/WorkflowNode.vue'
import AddingNode from './components/AddingNode.vue'
import { nanoid } from 'nanoid'

const nodes = ref([])
const edges = ref([])

const finalizedNodes = ref([])
const finalizedEdges = ref([])

const setAllNodes = (g) => {
  if (!nodes.value || nodes.value.length === 0) return

  nodes.value.forEach((node) => {
    if (!node.id || !node.data) return

    g.setNode(node.id, node.data)
  })
}

const setAllEdges = (g) => {
  if (!nodes.value || nodes.value.length === 0) return

  nodes.value.forEach((node) => {
    if (!node.data.parent || !node.id) return

    g.setEdge(node.data.parent, node.id)
  })
}

const setDagreGraph = () => {
  const g = new dagre.graphlib.Graph()

  g.setGraph({
    // align: 'DL',
  })

  g.setDefaultEdgeLabel(function () {
    return {}
  })

  setAllNodes(g)
  setAllEdges(g)

  dagre.layout(g)
  const nodeIds = g.nodes()

  let dagreParsedNodes = nodeIds.map((id) => ({
    id: id,
    data: g.node(id),
  }))

  let dagreParsedEdges = g.edges().map((e) => ({
    source: e.v,
    target: e.w,
    data: g.edge(e),
  }))

  dagreParsedNodes = dagreParsedNodes.filter((node) => node.id && node.data)
  dagreParsedEdges = dagreParsedEdges.filter(
    (edge) => edge.source && edge.target
  )

  dagreParsedNodes = adjustPositions(dagreParsedNodes)

  return {
    dagreParsedNodes,
    dagreParsedEdges,
  }
}

const adjustPositions = (dagreParsedNodes) => {
  const  _dagreParsedNodes = dagreParsedNodes.map((node)=>{

    console.log("node ___________ *********** ",node)


    return node

  })

  return _dagreParsedNodes
}



const getVueFlowReadyData = (dagreParsedNodes, dagreParsedEdges) => {
  if (!dagreParsedNodes || !dagreParsedEdges) return

  const vueFlowReadyNodes = dagreParsedNodes.map((node) => {
    return {
      id: node.id,
      type: node.data.type || 'default',
      data: {
        label: node.data.label,
        parent: node.data.parent,
        order: node.data.order,
      },
      position: {
        x: node.data.x,
        y: node.data.y,
      },
      draggable: node.data.draggable,
    }
  })

  const vueFlowReadyEdges = dagreParsedEdges.map((node) => ({
    id: `${node.source}->${node.target}`,
    source: node.source,
    target: node.target,
  }))

  return {
    vueFlowReadyNodes,
    vueFlowReadyEdges,
  }
}

const runProcess = () => {
  // console.log("nodes: ______top ", nodes.value)

  const { dagreParsedNodes, dagreParsedEdges } = setDagreGraph()

  const { vueFlowReadyNodes, vueFlowReadyEdges } = getVueFlowReadyData(
    dagreParsedNodes,
    dagreParsedEdges
  )

  finalizedNodes.value = vueFlowReadyNodes
  finalizedEdges.value = vueFlowReadyEdges
}

onMounted(() => {
  nodes.value = INITIAL_NODES
  runProcess()
})

const generateNewNodes = (node) => {
  const newWorkflowNode = {
    id: nanoid(10),
    data: {
      ...WORKFLOW_NODE_DIMENSIONS,
      label: '1qqqq',
      type: 'workflow',
      parent: node.data.parent,
      order: node.data.order,
      draggable: false,
    },
  }
  const newLeftAddingNode = {
    id: nanoid(10),
    data: {
      ...ADDING_NODE_DIMENSIONS,
      parent: newWorkflowNode.id,
      label: '4',
      type: 'adding',
      order: 1,
      draggable: false,
    },
  }
  const newMiddleAddingNode = {
    id: nanoid(10),
    data: {
      ...ADDING_NODE_DIMENSIONS,
      parent: newWorkflowNode.id,
      label: '4',
      type: 'adding',
      order: 2,
      draggable: false,
    },
  }

  const newRightAddingNode = {
    id: nanoid(10),
    data: {
      ...ADDING_NODE_DIMENSIONS,
      parent: newWorkflowNode.id,
      label: '4',
      type: 'adding',
      order: 3,
      draggable: false,
    },
  }

  return {
    newWorkflowNode,
    newLeftAddingNode,
    newMiddleAddingNode,
    newRightAddingNode,
  }
}

const handleAddingNodeClick = (node) => {
  const index = nodes.value.findIndex((n) => n.id === node.id)

  const {
    newWorkflowNode,
    newLeftAddingNode,
    newMiddleAddingNode,
    newRightAddingNode,
  } = generateNewNodes(node)

  nodes.value[index] = {
    ...nodes.value[index],
    ...newWorkflowNode,
    data: {
      ...nodes.value[index].data,
      ...newWorkflowNode.data,
      ...WORKFLOW_NODE_DIMENSIONS,
      type: 'workflow',
    },
  }

  nodes.value.push(newLeftAddingNode, newMiddleAddingNode, newRightAddingNode)

  runProcess()
}
</script>

<style></style>
