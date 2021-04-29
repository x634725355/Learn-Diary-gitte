/**
 * 获取option 的map值
 * @param {Array} options
 */
 export const getOptionMap = (options = []) => {
  const obj = {};
  options.map((item) => {
    obj[String(item.value)] = item;
  });
  return obj;
};
/**
 * 获取值对应的option
 * @param {String} value  值
 * @param {Array} options 需要筛选数据
 * @param {String} labelValue 值映射
 */
 export function getLableOption(value, options = [], labelValue) {
  for (let i = 0; i < options.length; i++) {
    const item = options[i]
    if (value === item.value || (labelValue && value === item[labelValue])) {
      return item
    }
  }
  return {}
}
/**
 *精准fixed
 */
export function toFixed(number, m) {
  if (typeof number !== "number") {
    throw new Error("number不是数字");
  }
  let result = Math.round(Math.pow(10, m) * number) / Math.pow(10, m);
  result = String(result);
  if (result.indexOf(".") === -1) {
    if (m !== 0) {
      result += ".";
      result += new Array(m + 1).join("0");
    }
  } else {
    const arr = result.split(".");
    if (arr[1].length < m) {
      arr[1] += new Array(m - arr[1].length + 1).join("0");
    }
    result = arr.join(".");
  }
  return result;
}

/**
 *
 * @param {Number} num1
 * @param {Number} num2
 * @param {String} type
 * @returns 精准计算
 */

export function calculate(num1 = 0, num2 = 0, type = "add") {
  let num = 0;
  let index = 1;
  let i1 = num1.toString().split(".")[1]
    ? num1.toString().split(".")[1].length
    : 0;
  let i2 = num2.toString().split(".")[1]
    ? num2.toString().split(".")[1].length
    : 0;
  index = Math.pow(10, Math.max(i1, i2));
  const r1 = Number(num1.toString().replace(".", ""));
  const r2 = Number(num2.toString().replace(".", ""));
  switch (type) {
    case "add":
      num = (num1 * index + num2 * index) / index;
      break;
    case "subtraction":
      num = (num1 * index - num2 * index) / index;
      break;
    case "multiplication":
      num = (r1 * r2) / Math.pow(10, i1 + i2);
      break;
    case "division":
      return calculate(r1 / r2, Math.pow(10, i2 - i1), "multiplication");
  }
  return num;
}

/**
 *
 * @param {Number} num
 * @returns 链式计算
 */
export function mathCalculate(num) {
  let total = num;
  function fn() {
    return total;
  }
  fn.add = function(num2) {
    total = calculate(total, num2, "add");
    return fn;
  };
  fn.subtraction = function(num2) {
    total = calculate(total, num2, "subtraction");
    return fn;
  };
  fn.multiplication = function(num2) {
    total = calculate(total, num2, "multiplication");
    return fn;
  };
  fn.division = function(num2) {
    total = calculate(total, num2, "division");
    return fn;
  };

  return fn;
}

/**
 *
 * @param {转换格式} formater
 * @param {时间} t
 * @returns
 */
export function dateFormater(formater, t) {
  let date = t ? new Date(t) : new Date(),
    Y = date.getFullYear() + "",
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  return formater
    .replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/g, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? "0" : "") + M)
    .replace(/DD/g, (D < 10 ? "0" : "") + D)
    .replace(/HH|hh/g, (H < 10 ? "0" : "") + H)
    .replace(/mm/g, (m < 10 ? "0" : "") + m)
    .replace(/ss/g, (s < 10 ? "0" : "") + s);
}

// 返回当前的日期 格式 2020-02-12
export function currentDate() {
  return new Date().toISOString().substr(0, 10);
}
