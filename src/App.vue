<template>
  <div class="workflow-main">
    <TopPanel />
    <VueFlow
      :nodes="finalizedNodes"
      :edges="finalizedEdges"
      class="basic-flow"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
    >
      <Background pattern-color="#aaa" :gap="16" />
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
import { onMounted, ref } from 'vue';
import { VueFlow, Position } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import {
  ADDING_NODE_DIMENSIONS,
  GAP_BETWEEN_NODES_IN_X,
  GAP_BETWEEN_NODES_IN_Y,
  INITIAL_NODES,
  WORKFLOW_NODE_DIMENSIONS,
} from './constants';
import dagre from '@dagrejs/dagre';
import WorkflowNode from './components/workflow-node.vue';
import AddingNode from './components/adding-node.vue';
import TopPanel from './components/top-panel.vue';
import { nanoid } from 'nanoid';

const currentNodes = ref([]);

const finalizedNodes = ref([]);
const finalizedEdges = ref([]);

/* ************************* REBUILDING NEW GRAPH ON NODE ADDITION ************************* */

const getEdgeColor = (g, id) => {
  const edgesColors = ['#ffa500', '#00cc00', '#ed6a5e'];

  const _node = g.node(id);

  let stroke;
  if (_node?.order === 1) stroke = edgesColors[0];
  else if (_node?.order === 2) stroke = edgesColors[1];
  else stroke = edgesColors[2];

  return stroke;
};

const updateClickedNode = (clickedNodeId, newWorkflowNode) => {
  const index = currentNodes.value.findIndex((n) => n.id === clickedNodeId);

  currentNodes.value[index] = {
    ...currentNodes.value[index],
    ...newWorkflowNode,
    data: {
      ...currentNodes.value[index].data,
      ...newWorkflowNode.data,
      ...WORKFLOW_NODE_DIMENSIONS,
      type: 'workflow',
    },
  };
};

const generateNewRightAddingNode = (parent) => {
  const newRightAddingNode = {
    id: nanoid(10),
    data: {
      ...ADDING_NODE_DIMENSIONS,
      parent,
      label: '4',
      type: 'adding',
      order: 3,
      draggable: false,
    },
  };

  return newRightAddingNode;
};

const generateNewMiddleAddingNode = (parent) => {
  const newMiddleAddingNode = {
    id: nanoid(10),
    data: {
      ...ADDING_NODE_DIMENSIONS,
      parent,
      label: '4',
      type: 'adding',
      order: 2,
      draggable: false,
    },
  };
  return newMiddleAddingNode;
};

const generateNewLeftAddingNode = (parent) => {
  const newLeftAddingNode = {
    id: nanoid(10),
    data: {
      ...ADDING_NODE_DIMENSIONS,
      parent,
      label: '4',
      type: 'adding',
      order: 1,
      draggable: false,
    },
  };

  return newLeftAddingNode;
};

const generateNewWorkflowNode = (clickedNode) => {
  const newWorkflowNode = {
    id: clickedNode.id,
    data: {
      ...WORKFLOW_NODE_DIMENSIONS,
      label: '1qqqq',
      type: 'workflow',
      parent: clickedNode.data.parent,
      order: clickedNode.data.order,
      draggable: false,
    },
  };

  return newWorkflowNode;
};

const generateAndSetNewNodes = (clickedNode) => {
  const newWorkflowNode = generateNewWorkflowNode(clickedNode);

  const newLeftAddingNode = generateNewLeftAddingNode(clickedNode.id);

  const newMiddleAddingNode = generateNewMiddleAddingNode(clickedNode.id);

  const newRightAddingNode = generateNewRightAddingNode(clickedNode.id);

  // update the state
  currentNodes.value.push(
    newLeftAddingNode,
    newMiddleAddingNode,
    newRightAddingNode,
  );

  return newWorkflowNode;
};

const handleAddingNodeClick = (clickedNode) => {
  const newWorkflowNode = generateAndSetNewNodes(clickedNode);

  updateClickedNode(clickedNode.id, newWorkflowNode);

  buildWorkflowGraph();
};

/* ******************************* WORKFLOW GRAPH BUILDER ******************************* */

// Vue Flow code for building the graph

const setFinalizedData = (vueFlowParsedNodes, vueFlowParsedEdges) => {
  finalizedNodes.value = vueFlowParsedNodes;
  finalizedEdges.value = vueFlowParsedEdges;
};

const getVueFlowParsedEdges = (g, dagreParsedEdges) => {
  const vueFlowParsedEdges = dagreParsedEdges.map((node) => ({
    id: `${node.source}->${node.target}`,
    source: node.source,
    target: node.target,
    selectable: node.selectable,
    style: node.style,
  }));

  return vueFlowParsedEdges;
};

const getVueFlowParsedNodes = (g, dagreParsedNodes) => {
  if (!dagreParsedNodes) return;

  const vueFlowParsedNodes = dagreParsedNodes.map((node) => {
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
    };
  });

  return vueFlowParsedNodes;
};

// Dagre code for building the graph

const getDagreParsedEdges = (g) => {
  let dagreParsedEdges = g.edges().map((e) => {
    return {
      source: e.v,
      target: e.w,
      data: g.edge(e),
      selectable: false,
      style: {
        stroke: getEdgeColor(g, e.w),
      },
    };
  });

  // remove empty edges if dagre has added it by itself
  dagreParsedEdges = dagreParsedEdges.filter(
    (edge) => edge.source && edge.target,
  );

  return dagreParsedEdges;
};

const getDagreParsedNodes = (g) => {
  const allDagreNodeIds = g.nodes();

  let dagreParsedNodes = allDagreNodeIds.map((id) => ({
    id: id,
    data: g.node(id),
  }));

  // remove empty nodes if dagre has added it by itself
  dagreParsedNodes = dagreParsedNodes.filter((node) => node.id && node.data);

  return dagreParsedNodes;
};

const setDagreGraphEdges = (g) => {
  if (!currentNodes.value || currentNodes.value.length === 0) return;

  currentNodes.value.forEach((node) => {
    if (!node.data.parent || !node.id) return;

    g.setEdge(node.data.parent, node.id);
  });
};

const setDagreGraphNodes = (g) => {
  if (!currentNodes.value || currentNodes.value.length === 0) return;

  currentNodes.value.forEach((node) => {
    if (!node.id || !node.data) return;

    g.setNode(node.id, node.data);
  });
};

const setDataInDagreGraph = (g) => {
  setDagreGraphNodes(g);
  setDagreGraphEdges(g);

  dagre.layout(g, { disableOptimalOrderHeuristic: true });
};

const createNewEmptyDagreGraph = () => {
  // it is important to create new instance for every rerender otherwise dagre won't detect the changes
  // read more here: https://github.com/dagrejs/dagre/wiki

  const g = new dagre.graphlib.Graph();

  if (!g) throw new Error('Error in creating new instance of dagre graph');

  g.setGraph({
    nodesep: GAP_BETWEEN_NODES_IN_X || 50,
    ranksep: GAP_BETWEEN_NODES_IN_Y || 50,
  });

  g.setDefaultEdgeLabel(function () {
    return {};
  });

  return g;
};

const buildWorkflowGraph = () => {
  // main function to build the workflow graph

  const g = createNewEmptyDagreGraph();
  setDataInDagreGraph(g);

  const dagreParsedNodes = getDagreParsedNodes(g);
  const dagreParsedEdges = getDagreParsedEdges(g);

  const vueFlowParsedNodes = getVueFlowParsedNodes(g, dagreParsedNodes);
  const vueFlowParsedEdges = getVueFlowParsedEdges(g, dagreParsedEdges);

  setFinalizedData(vueFlowParsedNodes, vueFlowParsedEdges);
};

onMounted(() => {
  currentNodes.value = INITIAL_NODES;
  buildWorkflowGraph();
});
</script>
