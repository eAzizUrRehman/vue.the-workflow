<template>
  <div class="flex justify-center items- center text-white bg-black h-dvh">
    <div class="overflow-x-auto overflow-y-auto max-w-[99%]">
      <Flow
        :children="initialChildren"
        @add-child="addChild"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Flow from '@/components/Flow.vue'

export default {
  name: 'IndexPage',
  components: {
    Flow,
  },
  data() {
    return {
      initialChildren: [
        {
          text: 'aaaaaaaaaaa',
          type: null,
          width: 300,
          color: '#89631b',
          children: [],
        },
      ],
    }
  },
  methods: {
    recalculateWidths(parent) {
        console.log('parent ***********&&&& ', JSON.stringify(parent, null, 2))
        console.log('parent.children ***********&&&& ', JSON.stringify(parent.children, null, 2))
      if (!parent.children || parent?.children?.length <= 1) return parent.width

      let totalWidth = parent.children.reduce((total, child) => {
        return total + child.width
      }, 0)

      totalWidth += parent.width

      return totalWidth
    },
    addChild(data) {
      console.log('data ***********&&&& ', JSON.stringify(data, null, 2))

      let parent = this.initialChildren[0]
      for (let i = 1; i < data.path.length; i++) {
        parent = parent.children[data.path[i]]
      }

      if (!parent) return

      if (!parent.children) parent.children = []

      const hasLeft = parent.children.some((child) => child.order === 1)
      const hasRight = parent.children.some((child) => child.order === 2)

      if (hasLeft && data.payload.order === 1) return
      if (hasRight && data.payload.order === 2) return

      console.log('hasLeft ************** ', hasLeft)
      console.log('hasRight ************** ', hasRight)

      parent.children.push(data.payload)
      console.log('after push ************** ')

      parent = this.initialChildren[0]
      console.log(
        'after push parent ************** ',

        JSON.stringify(parent, null, 2)
      )
      for (let i = 1; i < data.path.length; i++) {
        console.log('IN LOOPPPPP ***********&&&& ', i)
        parent = parent.children[data.path[i]]

        parent.width = this.recalculateWidths(parent)
        console.log(
          'parentparentparent ***********&&&& ',
          JSON.stringify(parent, null, 2)
        )
      }
    },
  },
}
</script>
