module.exports = function hexString (arr) {
  var result = [];
  var i;

  for (i = 0; i < arr.byteLength; i++) {
    var str = arr[i].toString(16);

    if (str.length === 1) {
      str = '0' + str;
    }

    result.push(str.toUpperCase());
  }
  return result.join('-');
};
