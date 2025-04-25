/** 
 * 递归
 * 不能用箭头函数
 */
Array.prototype.customFlatten = function () {
  return this.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? cur.customFlatten() : cur);
  }, []);
};


