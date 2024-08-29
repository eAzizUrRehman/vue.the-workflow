<template>
  <div class="flex justify-center items- center text-white bg-black h-dvh">
    <div class="overflow-x-auto overflow-y-auto max-w-[99%]">
      <button @click="print">print</button>
      <Flow :children="initialChildren" @add-child="addChild" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Flow from "@/components/Flow.vue";

export default {
  name: "IndexPage",
  components: {
    Flow,
  },
  data() {
    return {
      initialChildren: [
        {
          parent: null,
          text: "aaaaaaaaaaa",
          type: null,
          width: 300,
          color: "#89631b",
          children: [],
        },
      ],
    };
  },
  methods: {
    print() {
      console.log("initialChildren", this.initialChildren);
    },
    findParentNode(node, root) {},
    calculateWidth(leafNode) {
      if (!leafNode) return;
      console.log("leafNode ***** ", leafNode);

      let width = 0;
      while (leafNode !== null) {
        if (leafNode.children.length > 1) {
          width = leafNode.children.reduce((acc, child) => {
            return acc + (child.width || 0);
          }, 0);
        }

        console.log("width ***** ", width);
        console.log("leafNode.width ***** ", leafNode.width);

        leafNode.width += width;

        leafNode = leafNode.parent;
      }
    },
    addChild(data) {
      const path = data.path;

      // const { parent } = data.parent;

      // console.log("parent ----------- ", data.parent);

      // console.log("data -------- *** ", data);
      let leafNode = this.initialChildren[0];
      for (let i = 1; i < path.length; i++) {
        leafNode = leafNode.children[path[i]];
      }

      if (!leafNode) return;

      if (!leafNode.children) leafNode.children = [];

      const hasLeft = leafNode.children.some((child) => child.order === 1);
      const hasRight = leafNode.children.some((child) => child.order === 2);

      if (hasLeft && data.payload.order === 1) return;
      if (hasRight && data.payload.order === 2) return;

      // console.log("parent ----------- ", data.parent);

      // leafNode.children.push({ ...data.payload, parent: data.parent });
      leafNode.children.push({ ...data.payload });

      this.calculateWidth(leafNode);
    },
  },
};
</script>
