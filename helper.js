/*
@param min {Number} minimum value of range
@param max {Number} maximum value of range
@param n {Integer} number of elements in array

returns an array with first value = min, last value = max, and number of items = n
*/
function arrayFromRange(min, max, n) {
  let arr = [];
  let difference = (max - min) / n;

  for (let i = 0; i <= n; i++) {
    arr.push(Number((min + difference * i).toFixed(4)));
  }

  return arr;
}

function getMonthName(month) {
  const months = getMonths();

  return months[month - 1];
}

function getMonths() {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
}

module.exports = arrayFromRange;
module.exports = getMonthName;
module.exports = getMonths;
