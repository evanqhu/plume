const arr = [
  { a: 1, b: 2 },
  { a: 1, b: 2 },
  { a: 1, b: 2, c: { a: 1, b: 2 } },
  { a: 1, b: 2, c: { b: 2, a: 1 } },
];

const result = []

/** 判断是否为对象 */
function isObject(val) {
  return typeof val === 'object' && val !== null
}

/** 判断两个对象是否相同 */
function isEqual(val1, val2) {
  // 如果有一个不是对象，则直接比较值
  if (!isObject(val1) || !isObject(val2)) {
    return Object.is(val1, val2)
  }

  // 如果两个都是对象
  const keys1 = Object.keys(val1)
  const keys2 = Object.keys(val2)
  // 如果键的数量不同，则对象一定不相等
  if (keys1.length !== keys2.length) {
    return false
  }
  // 如果键的数量相同，则递归比较每个键的值
  for (const key of keys1) {
    if (!isEqual(val1[key], val2[key])) {
      return false
    }
  }
  return true
}


/** 双层循环去重 */
for (const item of arr) {
  let isExist = false
  for (const r of result) {
    // 需要定义什么是“相同”
    if (isEqual(item, r)) {
      isExist = true
      break
    }
  }
  if (!isExist) {
    result.push(item)
  }
}

console.log('🚀🚀🚀 result: ', result)