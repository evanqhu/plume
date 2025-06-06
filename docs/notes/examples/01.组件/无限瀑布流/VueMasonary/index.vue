<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

interface Image {
  /** 图片宽度 */
  imageWidth: number;
  /** 图片高度 */
  imageHeight?: number;
  /** 图片是否加载 */
  loaded: boolean;
  /** 图片宽高比例 */
  ratio?: number;
  /** 图片地址 */
  src: string;
  top: number;
  left: number;
  [key: string]: any;
}

interface Props {
  /** 最小列宽度 */
  minColumnWidth?: number;
  /** 图片之间间隔 */
  gap?: number;
  /** 加载更多文字 */
  moreText?: string;
  /** 图片随机高度范围 */
  heightRange?: [number, number];
  /** 圆角 */
  borderRadius?: number;
  /** 加载图片的函数 */
  fetchImages?: () => Promise<Array<{ src: string; width?: number; height?: number }>>;
  /** 是否自动加载 */
  autoLoad?: boolean;
  /** 图片列表 */
  dataList?: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {
  minColumnWidth: 200,
  gap: 20,
  moreText: "",
  heightRange: () => [200, 400],
  borderRadius: 16,
  autoLoad: false,
});

/** 瀑布流容器元素 */
const feedsContainerRef = ref<HTMLDivElement>();
/** 加载更多元素 */
const moreRef = ref<HTMLDivElement>();
/** 图片列表数组 */
const images = ref<Image[]>([]);

/** 随机高度函数 */
const randomHeight = () => {
  return Math.floor(Math.random() * (props.heightRange[1] - props.heightRange[0] + 1)) + props.heightRange[0];
};

/** 获取图片数据 */
const fetchData = async () => {
  // 父组件没有通过 props 传递请求数据的函数，而是直接传递数据
  if (!props.fetchImages) {
    if (!props.dataList) {
      throw new Error("fetchImages 函数和 dataList 数组未定义；请提供 fetchImages 函数或 dataList 数组！");
    } else {
      images.value = props.dataList.map((item) => {
        const { src, width, height } = item;
        return {
          ...item,
          src,
          ratio: width && height ? width / height : null,
          loaded: false,
        };
      }) as Image[];
      return Promise.resolve();
    }
  }
  try {
    const res = await props.fetchImages();
    if (Array.isArray(res) && res.every((item) => typeof item === "object" && item !== null && "src" in item)) {
      const newRes = res.map((item) => {
        const { src, width, height } = item;
        return {
          ...item,
          src,
          ratio: width && height ? width / height : null,
          loaded: false,
        };
      }) as Image[];
      images.value.push(...newRes);
    } else {
      throw new Error("返回的数据必须是一个数组，并且数组中的每个项都应该是包含 'src' 属性的对象！");
    }
  } catch (error) {
    console.error("获取数据时出错: ", error);
  }
};

// 暴露 fetchData 方法供父组件调用
defineExpose({
  fetchData,
});

/**
 * 动态计算列宽度和列数
 * @param containerWidth 容器的宽度
 * @param gap 列之间的间隔
 * @param minColumnWidth 最小列宽
 * @returns 包含列宽和列数的对象
 */
const calculateColumns = (
  containerWidth: number,
  gap: number,
  minColumnWidth: number
): { columnWidth: number; columnCount: number } => {
  if (containerWidth <= minColumnWidth) {
    return { columnWidth: containerWidth, columnCount: 1 };
  }

  // 初步计算列数（向下取整）
  const columnCount = Math.floor((containerWidth + gap) / (minColumnWidth + gap));

  // 根据列数计算实际列宽
  const columnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;

  return { columnWidth, columnCount };
};

/** 动态设置图片的位置 */
const setImagesPosition = () => {
  if (!feedsContainerRef.value) return;

  // 获取容器的宽度
  const containerWidth = feedsContainerRef.value?.clientWidth;

  let minColumnWidth = props.minColumnWidth;
  let gap = props.gap;
  if (containerWidth < 450) {
    minColumnWidth = 150;
    gap = 16;
  }
  // 计算列宽和列数
  const { columnWidth, columnCount } = calculateColumns(containerWidth!, gap, minColumnWidth);
  // 初始化列高度数组
  const columnHeights = new Array(columnCount).fill(0);

  // 遍历图片数组
  images.value.forEach((image) => {
    // 计算图片高度
    if (image.ratio) {
      image.imageHeight = columnWidth / image.ratio;
    } else {
      image.imageHeight = randomHeight();
    }
    // 找到当前图片应该放置的列
    const minColumnHeight = Math.min(...columnHeights);
    // 获取当前图片应该放置的列索引
    const columnIndex = columnHeights.indexOf(minColumnHeight);
    // 更新当前列高度数组
    columnHeights[columnIndex] += image.imageHeight + gap;

    // 设置图片的位置
    image.imageWidth = columnWidth;
    image.top = minColumnHeight;
    image.left = columnIndex * (columnWidth + gap);
  });

  // 设置容器的高度
  feedsContainerRef.value.style.height = `${Math.max(...columnHeights)}px`;
};

/** 计算图片样式 */
const getImageStyle = (image: Image) => {
  return {
    width: `${image.imageWidth}px`,
    height: `${image.imageHeight}px`,
    top: `${image.top}px`,
    left: `${image.left}px`,
    borderRadius: `${props.borderRadius}px`,
  };
};

/** 定义一个交叉观察器 */
let intersectionOb: IntersectionObserver;

/** 定义一个尺寸观察器 */
let resizeOb: ResizeObserver;

/** 当图片数组长度发生变化时重新布局 */
watch(() => images.value.length, setImagesPosition);

/** 当 props 中的 dataList 发生变化时重新布局 */
watch(
  () => props.dataList,
  () => {
    images.value = props.dataList?.map((item) => {
      const { src, width, height } = item;
      return {
        ...item,
        src,
        ratio: width && height ? width / height : null,
        loaded: false,
      };
    }) as Image[];
  },
  { deep: true }
);

onMounted(async () => {
  // 基于 SSR 的考虑，在 onBeforeMount 钩子中定义观察器
  // 交叉观察器
  if (props.autoLoad) {
    intersectionOb = new IntersectionObserver((entries) => {
      // 如果目标元素进入视口，则获取数据
      if (entries[0].isIntersecting) {
        fetchData();
      }
    });
    // 观察瀑布流底部的「加载更多」元素
    intersectionOb.observe(moreRef.value!);
  }
  // 尺寸观察器
  resizeOb = new ResizeObserver(setImagesPosition);

  // 请求数据
  await fetchData();
  // 观察窗口尺寸变化
  resizeOb.observe(moreRef.value!);
});

onBeforeUnmount(() => {
  // 销毁交叉观察器
  intersectionOb?.disconnect();
  // 销毁尺寸观察器
  resizeOb?.disconnect();
});
</script>

<template>
  <div ref="feedsContainerRef" class="feeds-container">
    <section v-for="(image, index) in images" :key="index" class="feeds-item" :style="getImageStyle(image)">
      <slot :image="image" :index="index" />
    </section>
  </div>
  <div ref="moreRef" class="more">
    {{ moreText }}
  </div>
</template>

<style lang="scss">
.feeds-container {
  position: relative;
  width: 100%;
  height: 100%;

  .feeds-item {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    transition: all 0.5s;

    .placeholder {
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .placeholder::before {
      content: "";
      display: block;
      width: 25px;
      height: 25px;
      border: 2px solid #ccc;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    /* 旋转动画 */
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}

.more {
  width: 100%;
  text-align: center;
}
</style>
