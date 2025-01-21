<template>
  <div
    ref="carouselContainer"
    class="carousel-3d-container"
    :style="{ height: slideHeight + 'px' }"
  >
    <div
      class="carousel-3d-sliders"
      :style="{ width: slideWidth + 'px', height: slideHeight + 'px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useTemplateRef, watch } from "vue"

/** 定义 props 的类型 */
interface Props {
  /**
   * 轮播图总数（不过好像不用这个，内部会自己计算）
   * @default 0
   */
  count?: number | string
  /**
   * 透视效果的角度
   * @default 35
   */
  perspective?: number | string
  /**
   * 显示的轮播图数量
   * @default 5
   */
  display?: number | string
  /**
   * 是否开启无缝轮播
   * @default true
   */
  loop?: boolean
  /**
   * 动画速度，单位为毫秒
   * @default 500
   */
  animationSpeed?: number | string
  /**
   * 轮播图切换的方向(右边的图切换到左边)
   * @default "rtl"
   */
  dir?: "rtl" | "ltr"
  /**
   * 轮播图的宽度
   * @default 360
   */
  width?: number | string
  /**
   * 轮播的高度
   * @default 270
   */
  height?: number | string
  /**
   * 边框宽度
   * @default 1
   */
  border?: number | string
  /**
   * 轮播项之间的间距，可以是数字或字符串。
   * @default "auto"
   */
  space?: number | string
  /**
   * 初始化展示的轮播图索引
   * @default 0
   */
  startIndex?: number | string
  /**
   * 是否开启轮播图点击跳转功能
   * @default true
   */
  clickable?: boolean
  /**
   * 是否禁用 3D 效果。
   * @default false
   */
  disable3d?: boolean
  /**
   * 最小移动距离，小于这个距离则不触发滑动事件，单位为像素
   * @default 10
   */
  minSwipeDistance?: number
  /**
   * 未知
   * @default 300
   */
  inverseScaling?: number | string
  /**
   * 是否显示左右切换按钮
   * @default false
   */
  controlsVisible?: boolean
  /**
   * 上一个控制按钮的 HTML 内容
   * @default "&lsaquo;"
   */
  controlsPrevHtml?: string
  /**
   * 下一个控制按钮的 HTML 内容
   * @default "&rsaquo;"
   */
  controlsNextHtml?: string
  /**
   * 控制按钮的宽度
   * @default 50
   */
  controlsWidth?: string | number
  /**
   * 控制按钮的高度
   * @default 50
   */
  controlsHeight?: string | number
  /**
   * 偏置(当左右轮播图数量不同时，多出的轮播图放左边或右边)
   */
  bias?: string
}

interface Emits {
  /**
   * 轮播图切换前回调
   */
  (e: "beforeSlideChange", index: number): void
  /**
   * 轮播图切换后回调
   */
  (e: "afterSlideChange", index: number): void
  /**
   * 在最后一张轮播图时调用的回调函数
   */
  (e: "lastSlide"): void
  /**
   * 主轮播图被点击时调用的回调函数
   */
  (e: "mainSlideClick", index: number): void
}

/** 模板引用 */
const carouselRef = useTemplateRef("carouselContainer")

/** props */
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  perspective: 35,
  display: 5,
  loop: true,
  animationSpeed: 500,
  dir: "rtl",
  width: 360,
  height: 270,
  border: 1,
  space: "auto",
  startIndex: 0,
  clickable: true,
  disable3d: false,
  minSwipeDistance: 10,
  inverseScaling: 300,
  controlsVisible: false,
  controlsPrevHtml: "&lsaquo;",
  controlsNextHtml: "&rsaquo;",
  controlsWidth: 50,
  controlsHeight: 50,
  bias: "left"
})

/** emits */
const emit = defineEmits<Emits>()

/** slots */
const slots = defineSlots<{
  default: () => any
}>()

/** viewport 的宽度(slider container 的宽度) */
const viewport = ref(0)
/** 当前显示的轮播图索引 */
const currentIndex = ref(0)
/** 轮播图总数(计算得来) */
const total = ref(0)
/** 事件起始点的 X 坐标 */
const dragStartX = ref(0)
/** 事件起始点的 Y 坐标 */
const dragStartY = ref(0)
/** 水平拖动的距离 */
const dragOffsetX = ref(0)
/** 垂直拖动的距离 */
const dragOffsetY = ref(0)
/** 鼠标是否按下(屏幕是否被点击) */
const mousedown = ref(false)

/** 是否为最后一张轮播图 */
const isLastSlide = computed(() => currentIndex.value === total.value - 1)
/** 是否为第一张轮播图 */
const isFirstSlide = computed(() => currentIndex.value === 0)
/** 是否可以跳转到下一张轮播图（满足条件：不是最后一张或开启了循环滚动） */
const isNextPossible = computed(() => !(props.loop === false && isLastSlide.value))
/** 是否可以跳转到上一张轮播图（满足条件：不是第一张或开启了循环滚动） */
const isPrevPossible = computed(() => !(props.loop === false && isFirstSlide.value))
/** 单张轮播图宽度(加上了 2px 的边框) */
const slideWidth = computed(() => {
  const vw = viewport.value
  const sw = +props.width + +props.border * 2
  // NOTE 为什么要判断环境 return vw < sw && process.browser ? vw : sw
  return vw < sw ? vw : sw
})
/** 单张轮播图高度(加上了 2px 的边框) */
const slideHeight = computed(() => {
  const sw = +props.width + +props.border * 2
  const sh = +props.height + +props.border * 2
  const aspectRatio = sw / sh
  return slideWidth.value / aspectRatio
})
/** 首页可见的轮播图数量 */
const visibleNum = computed(() => (+props.display > total.value ? total.value : +props.display))
/** 是否有隐藏的轮播图 */
const hasHiddenSlides = computed(() => total.value > visibleNum.value)
/** 左侧轮播图索引数组(从中心往左边数) */
const leftIndices = computed(() => {
  // n 表示左侧轮播图数量
  let n = (visibleNum.value - 1) / 2
  n = props.bias.toLowerCase() === "left" ? Math.ceil(n) : Math.floor(n)

  const indices = []

  for (let i = 1; i <= n; i++) {
    indices.push(
      props.dir === "ltr"
        ? (currentIndex.value + i) % total.value
        : (currentIndex.value + total.value - i) % total.value
    )
  }

  return indices // [9, 8]
})
/** 右侧轮播图索引数组(从中心往右边数) */
const rightIndices = computed(() => {
  // n 表示左侧轮播图数量
  let n = (visibleNum.value - 1) / 2
  n = props.bias.toLowerCase() === "right" ? Math.ceil(n) : Math.floor(n)

  const indices = []

  for (let i = 1; i <= n; i++) {
    indices.push(
      props.dir === "ltr"
        ? (currentIndex.value + total.value - i) % total.value
        : (currentIndex.value + i) % total.value
    )
  }

  return indices // [1, 2]
})
/** 最左侧多隐藏一张轮播图的索引 */
const leftOutIndex = computed(() => {
  let n = (visibleNum.value - 1) / 2
  n = props.bias.toLowerCase() === "left" ? Math.ceil(n) : Math.floor(n)
  n++

  return props.dir === "ltr"
    ? (currentIndex.value + n) % total.value
    : (currentIndex.value + total.value - n) % total.value
})
/** 最右侧多隐藏一张轮播图的索引 */
const rightOutIndex = computed(() => {
  let n = (visibleNum.value - 1) / 2
  n = props.bias.toLowerCase() === "left" ? Math.ceil(n) : Math.floor(n)
  n++

  return props.dir === "ltr"
    ? (currentIndex.value + total.value - n) % total.value
    : (currentIndex.value + n) % total.value
})

/** 下一张 */
const goNext = () => {
  if (isNextPossible.value) {
    isLastSlide.value ? goSlide(0) : goSlide(currentIndex.value + 1)
  }
}
/** 上一张 */
const goPrev = () => {
  if (isPrevPossible.value) {
    isFirstSlide.value ? goSlide(total.value - 1) : goSlide(currentIndex.value - 1)
  }
}
/** 跳转到指定 index 的轮播图 */
const goSlide = (index: number) => {
  currentIndex.value = index < 0 || index > total.value - 1 ? 0 : index
  // 最后一张轮播图
  if (isLastSlide.value) {
    emit("lastSlide")
  }
  // 轮播图切换前
  emit("beforeSlideChange", currentIndex.value)
  // 轮播图切换后
  setTimeout(() => {
    emit("afterSlideChange", currentIndex.value)
  }, +props.animationSpeed)
}
/** 点击轮播图跳转(可一次跳多个) */
const goFar = (index: number) => {
  let diff = index - currentIndex.value

  if (diff > visibleNum.value / 2) {
    diff = index - total.value - currentIndex.value
  }

  if (diff < -visibleNum.value / 2) {
    diff = index + total.value - currentIndex.value
  }

  const absDiff = Math.abs(diff)
  let timeBuff = 0
  let i = 0

  // 使用 setTimeout 逐步跳转
  while (i < absDiff) {
    i += 1
    const timeout = timeBuff

    setTimeout(() => {
      diff < 0 ? goPrev() : goNext()
    }, timeout)

    // 每次跳转的时间间隔依次增加
    timeBuff += +props.animationSpeed / absDiff
  }
}
/** 获取轮播图数量 */
const getSlideCount = () => {
  if (slots.default()[0].children) {
    // NOTE 计算插槽中的元素数量
    return slots.default()[0].children.length
    // return slots.default()[0].children.filter((value: any) => value.tag !== void 0).length
  }
  return 0
}
/** 计算轮播图总数，设置 currentIndex，计算 viewport 为轮播图 container 的宽度 */
const computeData = (firstRun = false) => {
  total.value = getSlideCount()
  // 如果是第一次运行或运行超过最后一张图，则重置 currentIndex
  if (firstRun || currentIndex.value >= total.value) {
    currentIndex.value = +props.startIndex > total.value - 1 ? total.value - 1 : +props.startIndex
  }
  // 将 viewport 设为当前元素的宽度，也就是整个轮播图 container 的宽度
  viewport.value = carouselRef.value?.clientWidth || 0 // 相当于 this.$el.clientWidth
}
/** 页面窗口大小变化时修改轮播图大小 */
const setSize = () => {
  if (carouselRef.value) {
    // 修改 carousel 容器的样式
    carouselRef.value.style.cssText += `height: ${slideHeight.value}px;`

    // 修改子元素的样式
    const firstChild = carouselRef.value.childNodes[0] as HTMLElement
    if (firstChild) {
      firstChild.style.cssText += `width: ${slideWidth.value}px; height: ${slideHeight.value}px;`
    }
  }
}
/** 鼠标按下事件(触摸开始事件) */
const handleMousedown = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    e.preventDefault()
    dragStartX.value = e.clientX
    dragStartY.value = e.clientY
  } else if (e instanceof TouchEvent) {
    // 如果是触摸事件 (TouchEvent)
    dragStartX.value = e.touches[0].clientX
    dragStartY.value = e.touches[0].clientY
  } else {
    return // 如果不是有效的事件类型，则返回
  }

  // 设置 mousedown 状态为 true
  mousedown.value = true
}
/** 鼠标按下并移动(触摸移动事件) */
const handleMousemove = (e: MouseEvent | TouchEvent) => {
  if (!mousedown.value) return

  let eventPosX: number
  let eventPosY: number

  if (e instanceof MouseEvent) {
    // 处理鼠标事件
    eventPosX = e.clientX
    eventPosY = e.clientY
  } else if (e instanceof TouchEvent) {
    // 处理触摸事件
    eventPosX = e.touches[0].clientX
    eventPosY = e.touches[0].clientY
  } else {
    return
  }

  // 计算鼠标移动的距离或触摸移动的距离
  dragOffsetX.value = dragStartX.value - eventPosX
  dragOffsetY.value = dragStartY.value - eventPosY

  // 如果滑动在 Y 轴上更显著，则不移动轮播图，因为这是一个滚动手势
  if (Math.abs(dragOffsetY.value) > Math.abs(dragOffsetX.value)) return

  if (dragOffsetX.value > props.minSwipeDistance) {
    handleMouseup()
    goNext()
  } else if (dragOffsetX.value < -props.minSwipeDistance) {
    handleMouseup()
    goPrev()
  }
}
/** 鼠标抬起事件(触摸抬起事件) */
const handleMouseup = () => {
  mousedown.value = false
  dragOffsetX.value = 0
  dragOffsetY.value = 0
}

/** 向子组件提供数据 */
provide("Carousel3DContext", {
  // TODO 类型标注
  border: props.border,
  animationSpeed: props.animationSpeed,
  disable3d: props.disable3d,
  inverseScaling: props.inverseScaling,
  perspective: props.perspective,
  width: props.width,
  space: props.space,
  clickable: props.clickable,
  currentIndex,
  total,
  leftIndices,
  rightIndices,
  leftOutIndex,
  rightOutIndex,
  hasHiddenSlides,
  slideWidth,
  slideHeight,
  goFar,
  emit
})

/** 监视属性 */
watch(
  () => props.count,
  () => {
    computeData()
  }
)

/** 组件挂载时添加事件监听器 */
onMounted(() => {
  if (!import.meta.env.SSR) {
    computeData(true)
    window.addEventListener("resize", setSize)

    if ("ontouchstart" in window) {
      carouselRef.value?.addEventListener("touchstart", handleMousedown)
      carouselRef.value?.addEventListener("touchend", handleMouseup)
      carouselRef.value?.addEventListener("touchmove", handleMousemove)
    } else {
      carouselRef.value?.addEventListener("mousedown", handleMousedown)
      carouselRef.value?.addEventListener("mouseup", handleMouseup)
      carouselRef.value?.addEventListener("mousemove", handleMousemove)
    }
  }
})
/** 组件卸载时移除事件监听器 */
onBeforeUnmount(() => {
  if (!import.meta.env.SSR) {
    window.removeEventListener("resize", setSize)

    if ("ontouchstart" in window) {
      carouselRef.value?.removeEventListener("touchstart", handleMousedown)
      carouselRef.value?.removeEventListener("touchend", handleMouseup)
      carouselRef.value?.removeEventListener("touchmove", handleMousemove)
    } else {
      carouselRef.value?.removeEventListener("mousedown", handleMousedown)
      carouselRef.value?.removeEventListener("mouseup", handleMouseup)
      carouselRef.value?.removeEventListener("mousemove", handleMousemove)
    }
  }
})
</script>

<style lang="scss" scoped>
/* 轮播图 container */
.carousel-3d-container {
  min-height: 1px;
  width: 100%;
  position: relative;
  z-index: 0;
  overflow: hidden;
  margin: 20px auto;
  box-sizing: border-box;
}

/* slider 重叠聚合在最中间的位置的容器 */
.carousel-3d-sliders {
  position: relative;
  margin: 0 auto;
  transform-style: preserve-3d; /* 子元素在 3D 空间中呈现 */
  -webkit-perspective: 1000px;
  -moz-perspective: 1000px;
  perspective: 1000px;
}
</style>
