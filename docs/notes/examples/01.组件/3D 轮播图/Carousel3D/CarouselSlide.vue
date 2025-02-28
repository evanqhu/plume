<template>
  <div class="carousel-3d-slider" :style="slideStyle" :class="computedClasses" @click="goTo">
    <slot :index="index" :isCurrent="isCurrent" :leftIndex="leftIndex" :rightIndex="rightIndex" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue"

interface Props {
  /**
   * 当前轮播图的索引
   * @default 0
   */
  index: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0
})

/** 获取父组件提供的数据 */
const parent = inject<any>("Carousel3DContext") // TODO 类型标注
const zIndex = ref(999)

/* ------------------------- 计算属性 ------------------------- */
/** 是否为当前轮播图 */
const isCurrent = computed(() => props.index === parent.currentIndex.value)
/** 当前轮播图为从从中心到左边的第几张轮播图（0 表示从中间往左第 1 张，-1 表示隐藏幻灯片） */
const leftIndex = computed(() => {
  return getSideIndex(parent.leftIndices.value)
})
/** 当前轮播图为从从中心到右边的第几张轮播图（0 表示从中间往右第 1 张，-1 表示隐藏幻灯片） */
const rightIndex = computed(() => {
  return getSideIndex(parent.rightIndices.value)
})
/** 轮播图类名 */
const computedClasses = computed(() => ({
  [`left-${leftIndex.value + 1}`]: leftIndex.value >= 0,
  [`right-${rightIndex.value + 1}`]: rightIndex.value >= 0,
  current: isCurrent.value
}))
/** 轮播图样式(重点) */
const slideStyle = computed(() => {
  let tempStyles: Record<string, string | number> = {}

  if (!isCurrent.value) {
    const lIndex = leftIndex.value
    const rIndex = rightIndex.value
    if (rIndex >= 0 || lIndex >= 0) {
      tempStyles = rIndex >= 0 ? calculatePosition(rIndex, true) : calculatePosition(lIndex, false)
      tempStyles.opacity = 1
      tempStyles.visibility = "visible"
    }

    // 左右两侧多留出一张轮播图，用于动画过渡
    if (parent.hasHiddenSlides.value) {
      if (matchIndex(parent.leftOutIndex.value)) {
        tempStyles = calculatePosition(parent.leftIndices.value.length - 1, false)
      } else if (matchIndex(parent.rightOutIndex.value)) {
        tempStyles = calculatePosition(parent.rightIndices.value.length - 1, true)
      }
    }
  }

  return {
    ...tempStyles,
    "border-width": `${parent.border}px`, // 边框宽度
    width: `${parent.slideWidth.value}px`, // 轮播图宽度
    height: `${parent.slideHeight.value}px`, // 轮播图高度
    // 轮播图动画时间
    transition: `transform ${parent.animationSpeed}ms, opacity ${parent.animationSpeed}ms, visibility ${parent.animationSpeed}ms`
  }
})

/* ------------------------- 方法 ------------------------- */
/** 计算当前轮播图是中心往两边的第几张图，分正负 */
const getSideIndex = (array: number[]) => {
  let sideIndex = -1 // 表示不显示当前轮播图
  array.forEach((pos, i) => {
    if (matchIndex(pos)) {
      sideIndex = i
    }
  })
  return sideIndex
}
/** 根据传入的 index 匹配到对应的轮播图，传入的 index 为负数时，表示从右往左数 */
const matchIndex = (index: number) => {
  return props.index === index
}
/** 计算轮播图的偏移位置 */
const calculatePosition = (i: number, positive: boolean) => {
  const z = !parent.disable3d ? +parent.inverseScaling + (i + 1) * 100 : 0
  const y = !parent.disable3d ? +parent.perspective : 0
  const leftRemain =
    parent.space === "auto"
      ? parseInt(((i + 1) * (parent.width / 1.5)).toString())
      : parseInt(((i + 1) * parent.space).toString())
  const transform = positive
    ? `translateX(${leftRemain}px) translateZ(-${z}px) rotateY(-${y}deg)`
    : `translateX(-${leftRemain}px) translateZ(-${z}px) rotateY(${y}deg)`
  const top = parent.space === "auto" ? 0 : parseInt(((i + 1) * parent.space).toString())

  return {
    transform,
    top,
    zIndex: zIndex.value - (Math.abs(i) + 1)
  }
}
/** 轮播图点击事件 */
const goTo = () => {
  if (!isCurrent.value) {
    if (parent.clickable) {
      // 跳转到指定轮播图
      parent.goFar(props.index)
    }
  } else {
    // 点击当前轮播图
    parent.emit("mainSlideClick", props.index)
  }
}
</script>

<style lang="scss" scoped>
.carousel-3d-slider {
  position: absolute;
  opacity: 0; // 默认隐藏幻灯片
  visibility: hidden; // 默认隐藏幻灯片
  overflow: hidden;
  top: 0;
  border-radius: 1px;
  border-color: #000;
  border-color: rgba(0, 0, 0, 0.4);
  border-style: solid;
  background-size: cover;
  background-color: #ccc;
  display: block;
  margin: 0;
  box-sizing: border-box;

  img {
    width: 100%;
  }

  &.current {
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    z-index: 999;
  }
}

.carousel-3d-slider {
  text-align: left;
}
</style>
