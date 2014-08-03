
function trStr(url, desc, amount) {
  var trStr = '<tr><td>'+url+'</td><td>'+desc+'</td><td>'+amount+'</td></tr>';
  console.log('trStr: ', trStr);
  return trStr;
}

chrome.storage.sync.get(['txHistory'], function(data) {
  console.log('txHistory data: ', data);

  for (var d in data) {
    console.log(data[d].host, data[d].message, data[d].amount);
  }
});

var str = trStr('url', 'desc', 13);
console.log('last tr: ', $('#ht tr:last'))
console.log('str: ', str);
$('#ht tr:last').after(str);
