
function trStr(url, desc, amount) {
  var trStr = '<tr><td>'+url+'</td><td>'+desc+'</td><td>'+amount+'</td></tr>';
  console.log('trStr: ', trStr);
  return trStr;
}


$(document).ready(function () {
  var str = trStr('url', 'desc', 13);
//  console.log('last tr: ', $('#ht tr:last'))
//  console.log('str: ', str);

  chrome.storage.sync.get(['txHistory'], function(data) {
    console.log('txHistory data: ', data);

    for (var d in data) {
      var host = data[d].host;
      var msg = data[d].message;
      var amount = data[d].amount;
      
      console.log(data[d].host, data[d].message, data[d].amount);

      var str = trStr(host, msg, amount);
      $('#ht tr:last').after(str);
    }
  });
});
