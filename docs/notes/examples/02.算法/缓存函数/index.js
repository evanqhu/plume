/**
 * MemoryMap 类 - 一个自定义的缓存存储实现
 * 使用 Map 和 WeakMap 分别存储普通类型和对象类型的键值对
 * 主要目的是优化内存使用和垃圾回收
 */
class MemoryMap {
  constructor() {
    // 使用 Map 存储普通类型的键值对（如字符串、数字等）
    this._map = new Map();
    // 使用 WeakMap 存储对象类型的键值对，便于垃圾回收
    this._weakMap = new WeakMap();
  }

  /**
   * 判断键是否为对象类型
   * @param {any} key - 需要判断的键
   * @returns {boolean} - 是否为对象类型
   */
  _isObject(key) {
    return typeof key === 'object' && key !== null;
  }

  /**
   * 根据键获取对应的值
   * @param {any} key - 要查找的键
   * @returns {any} - 对应的值
   */
  get(key) {
    if (this._isObject(key)) {
      return this._weakMap.get(key);
    }
    return this._map.get(key);
  }

  /**
   * 设置键值对
   * @param {any} key - 要设置的键
   * @param {any} value - 要设置的值
   */
  set(key, value) {
    if (this._isObject(key)) {
      this._weakMap.set(key, value);
    } else {
      this._map.set(key, value);
    }
  }

  /**
   * 检查是否存在指定的键
   * @param {any} key - 要检查的键
   * @returns {boolean} - 是否存在
   */
  has(key) {
    if (this._isObject(key)) {
      return this._weakMap.has(key);
    }
    return this._map.has(key);
  }
}

/**
 * 记忆化函数 - 用于缓存函数计算结果
 * @param {Function} fn - 需要被记忆化的函数
 * @param {Function} [resolver] - 可选的键生成函数，用于生成缓存键
 * @returns {Function} - 返回记忆化后的函数
 */
const memorize = (fn, resolver) => {
  // 如果没有提供 resolver 函数，使用默认的键生成函数
  if (typeof resolver !== 'function') {
    resolver = (key) => key;
  }

  // 创建记忆化函数
  const memorizedFn = (...args) => {
    // 使用 resolver 生成缓存键
    const key = resolver(...args);

    // 如果缓存中存在结果，直接返回
    if (memorizedFn.cache.has(key)) {
      return memorizedFn.cache.get(key);
    }

    // 计算新结果
    const result = fn.apply(this, args);
    // 将结果存入缓存
    memorizedFn.cache.set(key, result);
    return result;
  };

  // 为记忆化函数添加缓存存储
  memorizedFn.cache = new MemoryMap();

  return memorizedFn;
};