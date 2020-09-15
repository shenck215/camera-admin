<template>
  <div class="set-red-light">
    <div class="switch-buttons">
      <el-button size="small" :type="openDrawRed ? 'primary' : ''" @click="switchopenDrawRed">画红灯位置</el-button>
      <el-button size="small" :type="openDrawLeft ? 'primary' : ''" @click="switchopenDrawLeft">画左边线</el-button>
      <el-button
        size="small"
        :type="openDrawRight ? 'primary' : ''"
        @click="switchopenDrawRight"
      >画右边线</el-button>
      <el-button size="small" :type="openDrawStop ? 'primary' : ''" @click="switchopenDrawStop">画停车线</el-button>
      <el-button size="small" :type="openDrawRedStop ? 'primary' : ''" @click="switchopenDrawRedStop">画红灯线</el-button>
      <el-button size="small" type="danger" @click="reset">重置</el-button>
    </div>
    <div class="box" :style="{width:`${imgInitialWidth}px`,height: `${imgInitialHeight}px`}">
      <canvas id="bg-img" :width="width" :height="height" />
      <canvas id="left-img" :width="width" :height="height" />
      <canvas id="right-img" :width="width" :height="height" />
      <canvas id="stop-img" :width="width" :height="height" />
      <canvas id="redStop-img" :width="width" :height="height" />
      <canvas
        id="red-img"
        :width="width"
        :height="height"
        :style="{ cursor: cursorStyleVal }"
        @mousedown.stop.prevent="handleMousedown"
        @mouseup.stop.prevent="handleMouseup"
        @mousemove.stop.prevent="handleMousemove"
        @mouseleave.stop.prevent="handleMouseleave"
        @click.stop.prevent="handleSwitchScale"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetRedLight',
  props: {
    imgUrl: {
      // 图片地址
      type: String,
      default: ''
    }
  },
  data() {
    return {
      /** 画布实例 */
      bgCtx: null, // 背景
      leftCtx: null, // 左边线
      rightCtx: null, // 右边线
      stopCtx: null, // 停车线
      redStopCtx: null, // 红灯线
      redCtx: null, // 红灯
      width: 0, // 画布宽度
      height: 0, // 画布高度
      imgInitialWidth: 1000, // 图片初始宽度
      imgInitialHeight: 0, // 图片初始高度
      imgOriginWidth: 0, // 图片原始宽度
      imgOriginHeight: 0, // 图片原始高度
      top: 0, // 画布定位 top
      left: 0, // 画布定位 left
      zoomVal: 1, // 画布缩放比例
      enableMouseDown: false, // 鼠标按下状态
      /** 画图起始点X */
      leftStartX: 0,
      rightStartX: 0,
      stopStartX: 0,
      redStopStartX: 0,
      redStartX: 0,
      /** 画图起始点Y */
      leftStartY: 0,
      rightStartY: 0,
      stopStartY: 0,
      redStopStartY: 0,
      redStartY: 0,
      /** 画图截止点X */
      leftEndX: 0,
      rightEndX: 0,
      stopEndX: 0,
      redStopEndX: 0,
      redEndX: 0,
      /** 画图截止点Y */
      leftEndY: 0,
      rightEndY: 0,
      stopEndY: 0,
      redStopEndY: 0,
      redEndY: 0,
      isDrawLeftInTransform: false, // 是否在放大时绘制左边线
      isDrawRightInTransform: false, // 是否在放大时绘制右边线
      isDrawStopInTransform: false, // 是否在放大时绘制停车线
      isDrawRedStopInTransform: false, // 是否在放大时绘制红灯线
      isDrawRedInTransform: false, // 是否在放大时绘制红灯
      isOriginImg: false, // 是否为原图
      openDrawLeft: false, // 开启画左边线
      openDrawRight: false, // 开启画右边线
      openDrawStop: false, // 开启画停车线
      openDrawRedStop: false, // 开启画红灯线
      openDrawRed: false, // 开启画红灯
      leftLintPoint: {}, // 左边线坐标点
      rightLintPoint: {}, // 右边线坐标点
      stopLintPoint: {}, // 停车线坐标点
      redStopLintPoint: {}, // 红灯线坐标点
      redPoint: {} // 左边线坐标点
    }
  },
  computed: {
    cursorStyleVal() {
      if (
        this.openDrawLeft ||
        this.openDrawRight ||
        this.openDrawStop ||
        this.openDrawRedStop ||
        this.openDrawRed
      ) {
        return 'crosshair'
      }
      if (this.isOriginImg) {
        return 'zoom-out'
      }
      return 'zoom-in'
    },
    result() {
      let left = {} // 抛出去的左边线坐标
      let right = {} // 抛出去的右边线坐标
      let stop = {} // 抛出去的停车线坐标
      let redStop = {} // 抛出去的红灯线坐标
      let red = {} // 抛出去的红灯坐标
      if (Object.keys(this.leftLintPoint).length > 0) {
        const { start: leftStart, end: leftEnd } = this.leftLintPoint
        const leftStartCoord = leftStart.split(',')
        const leftEndCoord = leftEnd.split(',')

        if (!this.isOriginImg) {
          left = {
            // 左边线坐标
            start: [
              this.realX(leftStartCoord[0]),
              this.realY(leftStartCoord[1])
            ],
            end: [this.realX(leftEndCoord[0]), this.realY(leftEndCoord[1])]
          }
        } else {
          left = {
            // 左边线坐标
            start: [
              this.realX(leftStartCoord[0]),
              this.realY(leftStartCoord[1])
            ],
            end: [this.realX(leftEndCoord[0]), this.realY(leftEndCoord[1])]
          }
        }
      }
      if (Object.keys(this.rightLintPoint).length > 0) {
        const { start: rightStart, end: rightEnd } = this.rightLintPoint
        const rightStartCoord = rightStart.split(',')
        const rightEndCoord = rightEnd.split(',')
        if (!this.isOriginImg) {
          right = {
            // 右边线坐标
            start: [
              this.realX(rightStartCoord[0]),
              this.realY(rightStartCoord[1])
            ],
            end: [this.realX(rightEndCoord[0]), this.realY(rightEndCoord[1])]
          }
        } else {
          right = {
            // 右边线坐标
            start: rightStartCoord,
            end: rightEndCoord
          }
        }
      }
      if (Object.keys(this.stopLintPoint).length > 0) {
        const { start: stopStart, end: stopEnd } = this.stopLintPoint
        const stopStartCoord = stopStart.split(',')
        const stopEndCoord = stopEnd.split(',')
        if (!this.isOriginImg) {
          stop = {
            // 停车线坐标
            start: [
              this.realX(stopStartCoord[0]),
              this.realY(stopStartCoord[1])
            ],
            end: [this.realX(stopEndCoord[0]), this.realY(stopEndCoord[1])]
          }
        } else {
          stop = {
            // 停车线坐标
            start: stopStartCoord,
            end: stopEndCoord
          }
        }
      }
      if (Object.keys(this.redStopLintPoint).length > 0) {
        const { start: redStopStart, end: redStopEnd } = this.redStopLintPoint
        const redStopStartCoord = redStopStart.split(',')
        const redStopEndCoord = redStopEnd.split(',')
        if (!this.isOriginImg) {
          redStop = {
            // 停车线坐标
            start: [
              this.realX(redStopStartCoord[0]),
              this.realY(redStopStartCoord[1])
            ],
            end: [this.realX(redStopEndCoord[0]), this.realY(redStopEndCoord[1])]
          }
        } else {
          redStop = {
            // 停车线坐标
            start: redStopStartCoord,
            end: redStopEndCoord
          }
        }
      }
      if (Object.keys(this.redPoint).length > 0) {
        const { leftTop, rightBottom } = this.redPoint
        const leftTopCoord = leftTop.split(',')
        const rightBottomCoord = rightBottom.split(',')
        if (!this.isOriginImg) {
          red = {
            // 红灯坐标
            leftTop: [this.realX(leftTopCoord[0]), this.realY(leftTopCoord[1])],
            rightBottom: [
              this.realX(rightBottomCoord[0]),
              this.realY(rightBottomCoord[1])
            ]
          }
        } else {
          red = {
            // 红灯坐标
            leftTop: leftTopCoord,
            rightBottom: rightBottomCoord
          }
        }
      }
      return {
        left,
        right,
        stop,
        redStop,
        red
      }
    }
  },
  mounted() {
    this.initDraw(true)
  },
  methods: {
    scaleX(currentX) {
      // X轴计算，防止浮点数影响
      const proportion = this.imgInitialWidth / this.imgOriginWidth
      const proportionStr = proportion.toString()
      let index = 1
      if (proportionStr.includes('.')) {
        index = proportionStr.split('.')[1].length + 1
      }
      return (
        (currentX * 10 ** index * (proportion * 10 ** index)) /
        (10 ** index * 10 ** index)
      )
    },
    realX(currentX) {
      // X轴计算，防止浮点数影响
      const proportion = this.imgOriginWidth / this.imgInitialWidth
      const proportionStr = proportion.toString()
      let index = 1
      if (proportionStr.includes('.')) {
        index = proportionStr.split('.')[1].length + 1
      }
      return (proportion * 10 ** index * currentX) / 10 ** index
    },
    scaleY(currentY) {
      // X轴计算，防止浮点数影响
      const proportion = this.imgInitialHeight / this.imgOriginHeight
      const proportionStr = proportion.toString()
      let index = 1
      if (proportionStr.includes('.')) {
        index = proportionStr.split('.')[1].length + 1
      }
      return (
        (currentY * 10 ** index * (proportion * 10 ** index)) /
        (10 ** index * 10 ** index)
      )
    },
    realY(currentY) {
      // Y轴计算，防止浮点数影响
      const proportion = this.imgOriginHeight / this.imgInitialHeight
      const proportionStr = proportion.toString()
      let index = 1
      if (proportionStr.includes('.')) {
        index = proportionStr.split('.')[1].length + 1
      }
      return (proportion * 10 ** index * currentY) / 10 ** index
    },
    initDraw(isInitial) {
      if (isInitial) {
        /** 初始化获取画布实例，画布比例 */
        this.bgCtx = document.getElementById('bg-img').getContext('2d')
        this.leftCtx = document.getElementById('left-img').getContext('2d')
        this.rightCtx = document.getElementById('right-img').getContext('2d')
        this.stopCtx = document.getElementById('stop-img').getContext('2d')
        this.redStopCtx = document.getElementById('redStop-img').getContext('2d')
        this.redCtx = document.getElementById('red-img').getContext('2d')
      }
      // 初始绘制
      const img = new Image()
      img.src = this.imgUrl
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        if (this.isOriginImg) {
          this.width = img.width
          this.height = img.height
        } else {
          const currentHeight = (this.imgInitialWidth / img.width) * img.height
          this.width = this.imgInitialWidth
          this.height = currentHeight
          if (isInitial) {
            this.imgInitialHeight = currentHeight
          }
        }
        this.imgOriginWidth = img.width
        this.imgOriginHeight = img.height
        setTimeout(() => {
          this.bgCtx.drawImage(img, 0, 0, this.width, this.height)
          if (Object.keys(this.leftLintPoint).length > 0) {
            // 绘制已有的左边线
            const { start, end } = this.leftLintPoint
            const startCoord = start.split(',')
            const endCoord = end.split(',')
            this.drawLine(
              this.leftCtx,
              startCoord[0],
              startCoord[1],
              endCoord[0],
              endCoord[1],
              'Left'
            )
          }
          if (Object.keys(this.rightLintPoint).length > 0) {
            // 绘制已有的右边线
            const { start, end } = this.rightLintPoint
            const startCoord = start.split(',')
            const endCoord = end.split(',')
            this.drawLine(
              this.rightCtx,
              startCoord[0],
              startCoord[1],
              endCoord[0],
              endCoord[1],
              'Right'
            )
          }
          if (Object.keys(this.stopLintPoint).length > 0) {
            // 绘制已有的停车线
            const { start, end } = this.stopLintPoint
            const startCoord = start.split(',')
            const endCoord = end.split(',')
            this.drawLine(
              this.stopCtx,
              startCoord[0],
              startCoord[1],
              endCoord[0],
              endCoord[1],
              'Stop'
            )
          }
          if (Object.keys(this.redStopLintPoint).length > 0) {
            // 绘制已有的红灯线
            const { start, end } = this.redStopLintPoint
            const startCoord = start.split(',')
            const endCoord = end.split(',')
            this.drawLine(
              this.redStopCtx,
              startCoord[0],
              startCoord[1],
              endCoord[0],
              endCoord[1],
              'RedStop'
            )
          }
          if (Object.keys(this.redPoint).length > 0) {
            // 绘制已有的红灯
            const { leftTop, rightTop, leftBottom } = this.redPoint
            const leftTopCoord = leftTop.split(',')
            const rightTopCoord = rightTop.split(',')
            const leftBottomCoord = leftBottom.split(',')
            const redWidth = rightTopCoord[0] - leftTopCoord[0]
            const redHeight = leftBottomCoord[1] - leftTopCoord[1]
            this.redCtx.clearRect(0, 0, this.width, this.height)
            this.redCtx.strokeStyle = '#f00'
            this.redCtx.lineWidth = 2
            this.redCtx.beginPath()
            if (this.isOriginImg && !this.isDrawRedInTransform) {
              // 切换成原图，但绘制时为缩略图
              this.redCtx.moveTo(
                this.realX(leftTopCoord[0]),
                this.realY(leftTopCoord[1])
              )
              this.redCtx.rect(
                this.realX(leftTopCoord[0]),
                this.realY(leftTopCoord[1]),
                this.realX(redWidth),
                this.realY(redHeight)
              )
            } else if (!this.isOriginImg && this.isDrawRedInTransform) {
              //
              this.redCtx.moveTo(
                this.scaleX(leftTopCoord[0]),
                this.scaleY(leftTopCoord[1])
              )
              this.redCtx.rect(
                this.scaleX(leftTopCoord[0]),
                this.scaleY(leftTopCoord[1]),
                this.scaleX(redWidth),
                this.scaleY(redHeight)
              )
            } else {
              this.redCtx.moveTo(leftTopCoord[0], leftTopCoord[1])
              this.redCtx.rect(
                leftTopCoord[0],
                leftTopCoord[1],
                redWidth,
                redHeight
              )
            }
            this.redCtx.closePath()
            this.redCtx.stroke()
          }
        }, 0)
      }
    },
    drawLine(ctx, startX, startY, endX, endY, type) {
      // 画线
      ctx.clearRect(0, 0, this.width, this.height)
      ctx.strokeStyle = '#f00'
      ctx.lineWidth = 2
      ctx.beginPath()
      if (this.isOriginImg && !this[`isDraw${type}InTransform`]) {
        // 切换成原图，但绘制时为缩略图
        ctx.moveTo(this.realX(startX), this.realY(startY))
        ctx.lineTo(this.realX(endX), this.realY(endY))
      } else if (!this.isOriginImg && this[`isDraw${type}InTransform`]) {
        //
        ctx.moveTo(this.scaleX(startX), this.scaleY(startY))
        ctx.lineTo(this.scaleX(endX), this.scaleY(endY))
      } else {
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
      }
      ctx.closePath()
      ctx.stroke()
    },
    handleSwitchScale() {
      // 切换缩放
      if (
        !(
          this.openDrawLeft ||
          this.openDrawRight ||
          this.openDrawStop ||
          this.openDrawRedStop ||
          this.openDrawRed
        )
      ) {
        this.isOriginImg = !this.isOriginImg
        this.initDraw()
      }
    },
    switchopenDrawLeft() {
      // 开关画左边线
      this.openDrawLeft = !this.openDrawLeft
      this.openDrawRight = false
      this.openDrawStop = false
      this.openDrawRedStop = false
      this.openDrawRed = false
    },
    switchopenDrawRight() {
      // 开关画右边线
      this.openDrawRight = !this.openDrawRight
      this.openDrawLeft = false
      this.openDrawStop = false
      this.openDrawRedStop = false
      this.openDrawRed = false
    },
    switchopenDrawStop() {
      // 开关画停车线
      this.openDrawStop = !this.openDrawStop
      this.openDrawRight = false
      this.openDrawLeft = false
      this.openDrawRedStop = false
      this.openDrawRed = false
    },
    switchopenDrawRedStop() {
      // 开关画红灯线
      this.openDrawRedStop = !this.openDrawRedStop
      this.openDrawRight = false
      this.openDrawLeft = false
      this.openDrawStop = false
      this.openDrawRed = false
    },
    switchopenDrawRed() {
      // 开关画红灯
      this.openDrawRed = !this.openDrawRed
      this.openDrawRight = false
      this.openDrawStop = false
      this.openDrawRedStop = false
      this.openDrawLeft = false
    },
    save() {
      // 保存绘制结果
      if (
        this.leftStartX ||
        this.leftStartY ||
        this.leftEndX ||
        this.leftEndY
      ) {
        this.leftLintPoint = {
          start: `${this.leftStartX},${this.leftStartY}`,
          end: `${this.leftEndX},${this.leftEndY}`
        }
      }
      if (
        this.rightStartX ||
        this.rightStartY ||
        this.rightEndX ||
        this.rightEndY
      ) {
        this.rightLintPoint = {
          start: `${this.rightStartX},${this.rightStartY}`,
          end: `${this.rightEndX},${this.rightEndY}`
        }
      }
      if (
        this.stopStartX ||
        this.stopStartY ||
        this.stopEndX ||
        this.stopEndY
      ) {
        this.stopLintPoint = {
          start: `${this.stopStartX},${this.stopStartY}`,
          end: `${this.stopEndX},${this.stopEndY}`
        }
      }
      if (
        this.redStopStartX ||
        this.redStopStartY ||
        this.redStopEndX ||
        this.redStopEndY
      ) {
        this.redStopLintPoint = {
          start: `${this.redStopStartX},${this.redStopStartY}`,
          end: `${this.redStopEndX},${this.redStopEndY}`
        }
      }
      if (this.redStartX || this.redStartY || this.redEndX || this.redEndY) {
        if (this.redEndX > this.redStartX && this.redEndY > this.redStartY) {
          // 往右下角拖拉
          this.redPoint = {
            leftTop: `${this.redStartX},${this.redStartY}`,
            rightTop: `${this.redEndX},${this.redStartY}`,
            leftBottom: `${this.redStartX},${this.redEndY}`,
            rightBottom: `${this.redEndX},${this.redEndY}`
          }
        } else if (
          this.redEndX > this.redStartX &&
          this.redEndY < this.redStartY
        ) {
          // 往右上角拖拉
          this.redPoint = {
            leftTop: `${this.redStartX},${this.redEndY}`,
            rightTop: `${this.redEndX},${this.redEndY}`,
            leftBottom: `${this.redStartX},${this.redStartY}`,
            rightBottom: `${this.redEndX},${this.redStartY}`
          }
        } else if (
          this.redEndX < this.redStartX &&
          this.redEndY < this.redStartY
        ) {
          // 往左上角拖拉
          this.redPoint = {
            leftTop: `${this.redEndX},${this.redEndY}`,
            rightTop: `${this.redStartX},${this.redEndY}`,
            leftBottom: `${this.redEndX},${this.redStartY}`,
            rightBottom: `${this.redStartX},${this.redEndY}`
          }
        } else {
          // 往左下角拖拉
          this.redPoint = {
            leftTop: `${this.redEndX},${this.redStartY}`,
            rightTop: `${this.redStartX},${this.redStartY}`,
            leftBottom: `${this.redEndX},${this.redEndY}`,
            rightBottom: `${this.redStartX},${this.redEndY}`
          }
        }
      }
    },
    reset() {
      // 清空画布
      this.leftCtx.clearRect(0, 0, this.width, this.height)
      this.rightCtx.clearRect(0, 0, this.width, this.height)
      this.stopCtx.clearRect(0, 0, this.width, this.height)
      this.redStopCtx.clearRect(0, 0, this.width, this.height)
      this.redCtx.clearRect(0, 0, this.width, this.height)
      Object.assign(this.$data, this.$options.data())
      this.initDraw(true)
    },
    handleMousedown(e) {
      // 鼠标按下
      this.enableMouseDown = true
      if (this.openDrawLeft) {
        this.leftStartX = e.offsetX
        this.leftStartY = e.offsetY
      } else if (this.openDrawRight) {
        this.rightStartX = e.offsetX
        this.rightStartY = e.offsetY
      } else if (this.openDrawStop) {
        this.stopStartX = e.offsetX
        this.stopStartY = e.offsetY
      } else if (this.openDrawRedStop) {
        this.redStopStartX = e.offsetX
        this.redStopStartY = e.offsetY
      } else if (this.openDrawRed) {
        this.redStartX = e.offsetX
        this.redStartY = e.offsetY
      } else {
        this.wheelStartX = e.offsetX
        this.wheelStartY = e.offsetY
      }
    },
    handleMouseup(e) {
      // 鼠标放开
      this.enableMouseDown = false
      if (this.openDrawLeft) {
        this.leftEndX = e.offsetX
        this.leftEndY = e.offsetY
      } else if (this.openDrawRight) {
        this.rightEndX = e.offsetX
        this.rightEndY = e.offsetY
      } else if (this.openDrawStop) {
        this.stopEndX = e.offsetX
        this.stopEndY = e.offsetY
      } else if (this.openDrawRedStop) {
        this.redStopEndX = e.offsetX
        this.redStopEndY = e.offsetY
      } else if (this.openDrawRed) {
        this.redEndX = e.offsetX
        this.redEndY = e.offsetY
      } else {
        this.wheelEndX = e.offsetX
        this.wheelEndY = e.offsetY
      }
      this.save()
    },
    handleMouseleave() {
      // 鼠标离开画布
      this.enableMouseDown = false
    },
    handleMousemove(e) {
      // 鼠标移动
      if (this.enableMouseDown) {
        if (this.openDrawLeft || this.openDrawRight || this.openDrawStop || this.openDrawRedStop) {
          // 画线
          if (this.openDrawLeft) {
            this.isDrawLeftInTransform = this.isOriginImg
            this.drawLine(
              this.leftCtx,
              this.leftStartX,
              this.leftStartY,
              e.offsetX,
              e.offsetY,
              'Left'
            )
          } else if (this.openDrawRight) {
            this.isDrawRightInTransform = this.isOriginImg
            this.drawLine(
              this.rightCtx,
              this.rightStartX,
              this.rightStartY,
              e.offsetX,
              e.offsetY,
              'Right'
            )
          } else if (this.openDrawStop) {
            this.isDrawStopInTransform = this.isOriginImg
            this.drawLine(
              this.stopCtx,
              this.stopStartX,
              this.stopStartY,
              e.offsetX,
              e.offsetY,
              'Stop'
            )
          } else if (this.openDrawRedStop) {
            this.isDrawRedStopInTransform = this.isOriginImg
            this.drawLine(
              this.redStopCtx,
              this.redStopStartX,
              this.redStopStartY,
              e.offsetX,
              e.offsetY,
              'RedStop'
            )
          }
        } else if (this.openDrawRed) {
          // 画框
          this.isDrawRedInTransform = this.isOriginImg
          this.redCtx.clearRect(0, 0, this.width, this.height)
          this.redCtx.strokeStyle = '#f00'
          this.redCtx.lineWidth = 2
          this.redCtx.beginPath()
          this.redCtx.moveTo(this.redStartX, this.redStartY)
          const redWidth = Math.abs(e.offsetX - this.redStartX)
          const redHeight = Math.abs(e.offsetY - this.redStartY)
          if (e.offsetX > this.redStartX && e.offsetY > this.redStartY) {
            // 往右下角拖拉
            this.redCtx.rect(
              this.redStartX,
              this.redStartY,
              redWidth,
              redHeight
            )
          } else if (e.offsetX > this.redStartX && e.offsetY < this.redStartY) {
            // 往右上角拖拉
            this.redCtx.rect(this.redStartX, e.offsetY, redWidth, redHeight)
          } else if (e.offsetX < this.redStartX && e.offsetY < this.redStartY) {
            // 往左上角拖拉
            this.redCtx.rect(e.offsetX, e.offsetY, redWidth, redHeight)
          } else {
            // 往左下角拖拉
            this.redCtx.rect(e.offsetX, this.redStartY, redWidth, redHeight)
          }
          this.redCtx.closePath()
          this.redCtx.stroke()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.set-red-light {
  position: relative;
  .switch-buttons {
    position: absolute;
    top: -38px;
    left: 96px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .el-switch {
      margin: 0 12px 0 2px;
    }
  }
  .box {
    position: relative;
    overflow: auto;
    #bg-img,
    #left-img,
    #right-img,
    #stop-img,
    #redStop-img,
    #red-img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
