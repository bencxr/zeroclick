
function trStr(url, desc, amount) {
  var trStr = '<tr><td>'+url+'</td><td>'+desc+'</td><td>'+amount+'</td></tr>';
  console.log('trStr: ', trStr);
  return trStr;
}

var str = trStr('url', 'desc', 13);
console.log('last tr: ', $('#ht tr:last'))
console.log('str: ', str);
$('#ht tr:last').after(str);
