<template>
  <div class="flex justify-between bg-red-90 0">
    <div
      v-for="(child, index) in children"
      :key="index"
      class="flex flex-col items-center min-w-full"
      :style="{
        width: `${child.width}px`,
        order: child.order,
        backgroundColor: '',
      }"
    >
      <!-- opacity:0.5 -->
      <!-- child.type === 'left' ? 'bg-orange-900' : 'mr-10', -->
      <!-- child.type === 'right' ? 'bg-green-900' : '', -->
      <div
        :class="[
          'w-4 h-10 p-10 flex justify-center items-center border border-black mt-10',
        ]"
        :style="{
          backgroundColor: child.color,
        }"
      >
        {{ child.width }}
        {{ child.text }}
      </div>
      <div class="flex justify-between w-40">
        <button
          @click="addChild([...path, index], 1)"
          class="outline-none focus:outline-none bg-gray-600"
        >
          Left
        </button>
        <button
          @click="addChild([...path, index], 2)"
          class="outline-none focus:outline-none bg-gray-600"
        >
          Right
        </button>
      </div>
      <div class="flex">
        <Flow
          :children="child.children"
          :path="[...path, index]"
          class=""
          @add-child="handleAddChild"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Flow',
  props: {
    children: {
      type: Array,
      default: () => [],
    },
    path: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    addChild(path, order) {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`

      // console.log('randomColor ----------------- ', randomColor)
      const newChild = {
        path,
        payload: {
          // text: 'new new new',
          text: randomColor,
          order,
          width: 300,
          color: randomColor,
          children: [],
        },
      }
      // console.log(
      //   'Emitting add-child with data: ',
      //   JSON.stringify(newChild, null, 2)
      // )
      this.$emit('add-child', newChild)
    },
    handleAddChild(data) {
      // this.addChild(path, order)
      // console.log(
      //   'data ----------------- 66666666666 ',
      //   JSON.stringify(data, null, 2)
      // )
      this.$emit('add-child', data)
    },
  },
}
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
