<template>
  <div class="bg-black w-screen h-dvh">
    <button @click="PRINT" class="text-white">PRINT</button>
    <div class="w-fit mx-auto">
      <canvas ref="canvas" style="background-color: gray"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workflow: [
        {
          text: "aaaaaaaaaaa",
          type: null,
          width: 300,
          color: "#89631b",
          children: [],
          parent: null,
        },
      ],
    };
  },
  methods: {
    PRINT() {
      console.log("workflow", this.workflow);
    },
    setCanvas() {
      const canvas = this.$refs.canvas;
      const maxHeight = window.innerHeight - 100;

      canvas.width = this.workflow[0].width + 2000;
      canvas.height = maxHeight;
      const ctx = canvas.getContext("2d");

      this.drawElements(ctx, this.workflow, canvas.width / 2, 50);

      canvas.addEventListener("click", this.handleCanvasClick);
    },
    drawElements(ctx, elements, x, y) {
      elements.forEach((element) => {
        this.drawElement(ctx, element, x, y);
        if (element.children.length > 0) {
          element.children.forEach((child, index) => {
            const { childX, childY } = this.calculateChildPosition(x, y, index, element.children.length);
            this.drawElements(ctx, [child], childX, childY);
          });
        }
      });
    },
    drawElement(ctx, element, x, y) {
      console.log("element ----", element);
      const containerWidth = element.width;
      const containerHeight = 70;
      ctx.fillStyle = element.color;
      ctx.fillRect(x - 10, y - 10, containerWidth, containerHeight);
      this.drawText(ctx, element, x, y);
      this.drawButtons(ctx, element, x, y);
    },
    drawRectangle(ctx, element, x, y) {
      const rectWidth = element.width;
      const rectHeight = 50;
      const radius = 20;

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x + 10, y);
      ctx.lineTo(x + 20, y);
      ctx.arcTo(x + 30, y, x + 30, y + 10, 10);
      ctx.lineTo(x + 30, y + 10);
      ctx.arcTo(x + 30, y + 10, x + 20, y + 10, 10);
      ctx.lineTo(x + 10, y + 10);
      ctx.arcTo(x, y + 10, x, y, 10);
      ctx.lineTo(x, y);
      ctx.arcTo(x, y, x + 10, y, 10);
      ctx.closePath();
      ctx.fill();
    },
    drawText(ctx, element, x, y) {
      const rectWidth = element.width;
      const rectHeight = 50;

      ctx.font = "16px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(element.text, x + rectWidth / 2, y + rectHeight / 2);
      ctx.fillText(element.width, x + 10, y);
    },
    drawButtons(ctx, element, x, y) {
      const rectWidth = 100;
      const rectHeight = 50;

      this.drawButton(ctx, "Left", x, y + rectHeight + 10, element, "left");
      this.drawButton(
        ctx,
        "Right",
        x + rectWidth - 50,
        y + rectHeight + 10,
        element,
        "right"
      );
    },
    drawButton(ctx, text, x, y, parentElement, type) {
      const buttonWidth = 50;
      const buttonHeight = 20;

      const buttonRef = `${type}-button-${parentElement.text}`;
      ctx.fillStyle = type === "left" ? "green" : "blue";
      ctx.fillRect(x, y, buttonWidth, buttonHeight);

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + buttonWidth / 2, y + buttonHeight / 2);

      parentElement[type + "ButtonRef"] = {
        x,
        y,
        width: buttonWidth,
        height: buttonHeight,
        ref: buttonRef,
      };
    },
    handleCanvasClick(event) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.checkClick(this.workflow, x, y);
    },
    checkClick(elements, x, y) {
      elements.forEach((element) => {
        ["left", "right"].forEach((type) => {
          const buttonRef = element[type + "ButtonRef"];
          if (
            buttonRef &&
            x >= buttonRef.x &&
            x <= buttonRef.x + buttonRef.width &&
            y >= buttonRef.y &&
            y <= buttonRef.y + buttonRef.height
          ) {
            this.addChild(element, type);
          }
        });
        if (element.children.length > 0) {
          this.checkClick(element.children, x, y);
        }
      });
    },
    addChild(parentElement, type) {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;

      const newChild = {
        text: randomColor,
        type: type,
        width: 300,
        color: randomColor,
        children: [],
        parent: parentElement,
      };
      parentElement.children.push(newChild);
      this.setCanvas();
    },
    calculateChildPosition(parentX, parentY, index, totalChildren) {
      const offsetX = 300; // Horizontal offset for each child
      const offsetY = 100; // Vertical offset for each child
      const childX = parentX + (index % 2 === 0 ? -offsetX : offsetX);
      const childY = parentY + offsetY;
      return { childX, childY };
    },
  },
  mounted() {
    this.setCanvas();
  },
};
</script>