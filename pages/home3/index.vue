<template>
  <div class="bg-black w-screen h-dvh">
    <button
      @click="drawWorkflow"
      class="text-white"
      >PRINT</button
    >
    <div class="w-fit mx-auto">
      <canvas
        ref="canvas"
        width="2000"
        height="2000"
        style="background-color: gray"
      ></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      FIXED_MARGIN: 1000,
      FIXED_WIDTH: 300,
      LEVEL_OFFSET: 300,
      workflow: {
        text: 'OOO',
        type: null,
        width: 300,
        color: '#89631b',
        parent: null,
        level: 0,
        margin: 0,
        childrenCount: 2,
        children: [
          {
            text: '111AAA',
            type: null,
            width: 300,
            color: '#ff0000',
            parent: null,
            level: 1,
            margin: 0,
            childrenCount: 2,
            children: [
              {
                text: '222AAA',
                type: null,
                width: 300,
                color: '#00ff00',
                parent: null,
                level: 2,
                margin: 0,
                childrenCount: 0,
              },
              {
                text: 'fff',
                type: null,
                width: 300,
                color: '#0000ff',
                parent: null,
                level: 2,
                margin: 0,
                childrenCount: 0,
              },
              {
                text: 'hhh',
                type: null,
                width: 300,
                color: '#0000ff',
                parent: null,
                level: 2,
                margin: 0,
                childrenCount: 0,
              },
              {
                text: 'jjj',
                type: null,
                width: 300,
                color: '#0000ff',
                parent: null,
                level: 2,
                margin: 0,
                childrenCount: 0,
              },
              {
                text: 'kkk',
                type: null,
                width: 300,
                color: '#0000ff',
                parent: null,
                level: 2,
                margin: 0,
                childrenCount: 0,
              },
            ],
          },
          {
            text: '111BBB',
            type: null,
            width: 300,
            color: '#ffff00',
            parent: null,
            level: 1,
            margin: 0,
            childrenCount: 2,
            children: [
              {
                text: '222CCC',
                type: null,
                width: 300,
                color: '#ff00ff',
                parent: null,
                level: 2,
                margin: 0,
                childrenCount: 0,
              },
              {
                text: '222DDD',
                type: null,
                width: 300,
                color: '#00ffff',
                parent: null,
                level: 2,
                margin: 0,
                childrenCount: 0,
              },
            ],
          },
        ],
      },
    }
  },
  mounted() {
    this.setCanvas()
  },
  methods: {
    print() {
      console.log(JSON.stringify(this.workflow, null, 2))
    },
    setCanvas() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.drawWorkflow()
    },
    setChildrenCount(node) {
      node.childrenCount = node.children.length
    },
    setParent(node) {
      if (!node.children) return

      node.children.forEach((child) => {
        child.parent = node
        this.setParent(child)
      })
    },
    setMargin(node) {
      const rightSiblingsLength = this.findRightSiblingsLength(node)
      console.log('rightSiblingsLength ************* ', rightSiblingsLength)

      const leftSiblingsLength = this.findLeftSiblingsLength(node)
      console.log('leftSiblingsLength ************* ', leftSiblingsLength)

      // if (node.level === 2) {
      //   if (index === 0) {
      //     console.log('99999999999 ----------- ', node.text)
      //     this.findRightSiblingsLength()
      //     node.margin = this.FIXED_MARGIN
      //   }
      // }
    },
    drawWorkflow() {
      const processNode = (node, index = 0) => {
        console.log('node ************* ', node)
        // console.log('parent ************* ',node.parent)
        if (!node.children) node.children = []

        this.setChildrenCount(node)
        this.setParent(node)
        this.setMargin(node)

        node.children.forEach((child, i) => processNode(child, i))
      }

      processNode(this.workflow, 0)

      // this.print()
    },
    findRightSiblingsLength(node) {
      if (!node.parent) return 0

      const parent = node.parent
      const index = parent.children.indexOf(node)
      const rightSiblings = parent.children.slice(index + 1)

      return rightSiblings.length
    },
    findLeftSiblingsLength(node) {
      if (!node.parent) return 0

      const parent = node.parent
      const index = parent.children.indexOf(node)
      const leftSiblings = parent.children.slice(0, index)

      return leftSiblings.length
    },
  },
}
</script>
