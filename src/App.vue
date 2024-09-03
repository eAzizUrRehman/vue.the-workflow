<template>
  <div
    :style="{
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }"
  >
   <TopPanel />
    <VueFlow
      :nodes="finalizedNodes"
      :edges="finalizedEdges"
      class="basic-flow"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
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
import { VueFlow, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import {
  ADDING_NODE_DIMENSIONS,
  GAP_BETWEEN_NODES_IN_X,
  GAP_BETWEEN_NODES_IN_Y,
  INITIAL_NODES,
  WORKFLOW_NODE_DIMENSIONS,
} from './constants'
import dagre from '@dagrejs/dagre'
import WorkflowNode from './components/workflow-node.vue'
import AddingNode from './components/adding-node.vue'
import TopPanel from './components/top-panel.vue'
import { nanoid } from 'nanoid'

const nodes = ref([])

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

const getStrokeColor = (g, id) => {
  const edgesColors = ['#ffa500', '#00cc00', '#ed6a5e']

  const _node = g.node(id)

  let stroke
  if (_node?.order === 1) stroke = edgesColors[0]
  else if (_node?.order === 2) stroke = edgesColors[1]
  else stroke = edgesColors[2]

  return stroke
}

const setDagreGraph = () => {
  // it is important to create new instance otherwise dagre won't detect the changes
  const g = new dagre.graphlib.Graph()

  g.setGraph({
    nodesep: GAP_BETWEEN_NODES_IN_X,
    ranksep: GAP_BETWEEN_NODES_IN_Y,
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

  let dagreParsedEdges = g.edges().map((e) => {
    return {
      source: e.v,
      target: e.w,
      data: g.edge(e),
      selectable: false,
      style: {
        stroke: getStrokeColor(g, e.w),
      },
    }
  })
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
  return dagreParsedNodes
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
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    }
  })

  const vueFlowReadyEdges = dagreParsedEdges.map((node) => ({
    id: `${node.source}->${node.target}`,
    source: node.source,
    target: node.target,
    selectable: node.selectable,
    style: node.style,
  }))

  return {
    vueFlowReadyNodes,
    vueFlowReadyEdges,
  }
}

const runProcess = () => {
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
