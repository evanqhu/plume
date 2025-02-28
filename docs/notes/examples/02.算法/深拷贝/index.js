/** 一般递归 */
const deepClone = (obj) => {
  // 1. 判断是否是对象或者数组
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 2. 创建一个新的对象或数组
  const clone = Array.isArray(obj) ? [] : {};

  // 5. 设置对象的原型
  Object.setPrototypeOf(clone, Object.getPrototypeOf(obj));

  // 3. 遍历对象或数组的每一个属性
  /**
   * for (const key of Object.keys(obj)) 只遍历对象自身的可枚举属性（不包括继承的属性）
   * for (let key in obj) 遍历对象的所有可枚举属性，包括对象原型链上的可枚举属性
   * 根据实际需求选择不同的遍历方式
   */
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key]); // 递归拷贝属性
  }

  // 4. 返回新的对象或数组
  return clone;
};

/** 防止循环引用 */
const deepCloneHash = (obj, hash = new WeakMap()) => {
  // 1. 判断是否是对象或者数组 (递归出口)
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 2. 检查该对象是否已经存在于哈希表中，如果存在，直接从哈希表中取出结果
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 3. 创建一个新的对象或数组
  const clone = Array.isArray(obj) ? [] : {};

  // 4. 将新创建的对象添加到哈希表中
  hash.set(obj, clone);

  // 5. 遍历对象或数组的每一个属性
  for (const key of Object.keys(obj)) {
    clone[key] = deepCloneHash(obj[key], hash); // 递归拷贝属性
  }

  // 6. 返回新的对象或数组
  return clone;
};

/* ------------------------- 示例 ------------------------- */
const original = {
  name: 'John',
  age: 30,
  skills: ['JavaScript', 'React'],
  address: {
    city: 'New York',
    zip: '10001',
  },
};

// const copy = deepClone(original);
const copy = deepCloneHash(original);
console.log(copy);
