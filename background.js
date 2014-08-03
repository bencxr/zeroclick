paymentTxes = {};
limit = 0.000001;

var walletId;  // = '299df2a7-b0e7-4134-b911-802cd398bb0c';
var mainPass;  // = 'testtesttest';
setTimeout(function() {
  chrome.storage.sync.get(['walletId', 'mainPass'], function(data) {
    console.log('get from storage: ', data);
    walletId = data.walletId;
    mainPass = data.mainPass;
  });
}, 3000);

chrome.webRequest.onHeadersReceived.addListener(function(details){

  	var paymentUri = null;
  	var paidUri = null;

    if (details.statusLine.indexOf("402") > -1) {
      	for (i = 0; i < details['responseHeaders'].length; i++) {
      		header = details['responseHeaders'][i];
      		if (header['name'] == 'Bitcoin-Payment-URI') {
      			paymentUri = header['value'];
      		} else if (header['name'] == 'Bitcoin-Paid-URI') {
      			paidUri = header['value'];
      		}
      	}
    }

    if (paymentUri != null) {

  		parsed = parseBitcoinURL(paymentUri);
  		console.log("bitcoin address: "  + parsed.address);
  		console.log("amount: " + parsed.amount);
  		console.log("label: " + parsed.label);
  		console.log("message: " + parsed.message);
  		console.log("after paying reload to uri: " + paidUri);

        if (parsed.amount <= limit) {

          // do the transaction here
      	  var amount = parsed.amount * 100000000;

          // no 2nd password
          var bciUrl = 'https://blockchain.info/merchant/'+walletId+ '/payment?password='+mainPass+'&to='+parsed.address+'&amount='+amount;
          console.log('bciUril: ', bciUrl);

          $.ajax(
          {
              type: "GET",
              url: bciUrl,
              async: false,
              data:
              {},
              success: function(res) {
                console.log('ajax success res: ', res)
                if (res.error) {
                  chrome.runtime.sendMessage(
                    { status: "insufficient_funds" },
                    function(response) {}
                  );
                  chrome.browserAction.setIcon({path:"icon_alert.png"});
                }

                var transactionID = res.tx_hash;

                if (transactionID) {
                  var parser = document.createElement('a');
                  parser.href = details.url;
                  paymentTxes[parser.host] = transactionID

                    if (paidUri != null && validateURL(paidUri)) {

                      chrome.tabs.getSelected(null, function (tab) {
                        chrome.tabs.update(tab.id, {url: paidUri});
                        var jsRunner = {'code': 'window.stop()'};
                        chrome.tabs.executeScript(tab.id, jsRunner);
                    });
                  }
                }
              },
              error: function(err) {
                console.log('ajax err: ', err)
              }
            });
        } else {

            console.log("limit exceeded, requested " + parsed.amount + " but limit was " + limit);
            chrome.runtime.sendMessage(
              {
                status: "limit_exceeded",
                paymentInfo: parsed,
                paymentUri: paymentUri
              },
              function(response) {}
            );
            chrome.browserAction.setIcon({path:"icon_alert.png"});
        }
	 }

  return {responseHeaders:details.responseHeaders};
}, {urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

/* Parse bitcoin URL query keys. */
function parseBitcoinURL(url) {
  var r = /^bitcoin:([a-zA-Z0-9]{27,34})(?:\?(.*))?$/;
  var match = r.exec(url);
  if (!match) return null;

  var parsed = { url: url }

  if (match[2]) {
    var queries = match[2].split('&');
    for (var i = 0; i < queries.length; i++) {
      var query = queries[i].split('=');
      if (query.length == 2) {
        parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
      }
    }
  }

  parsed.address = match[1];
  return parsed;
}

 function validateURL(textval) {
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(textval);
    }

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {

  if (request.setLimit) limit = request.setLimit;
  if (request.resetIcon) chrome.browserAction.setIcon({path:"icon.png"});

	console.log(request)
});

chrome.webRequest.onBeforeSendHeaders.addListener(

  function(details) {

    var parser = document.createElement('a');
  	parser.href = details.url;

  	if (parser.host in paymentTxes && paymentTxes[parser.host] != undefined) {

    		details.requestHeaders.push({name:"Bitcoin-Payment-Transaction-ID", value: paymentTxes[parser.host]});
  	}

    return {requestHeaders: details.requestHeaders};
  },
{urls: ['<all_urls>']}, ['blocking', 'requestHeaders']);

// load payment txes from storage
chrome.storage.sync.get("paymentTxes", function(data){
		paymentTxes = data.paymentTxes;
		if (paymentTxes == undefined) {
			paymentTxes = {};
		}
});

// load limit from storage
chrome.storage.sync.get("limit", function(data){
		if (data.limit != undefined) {
			limit = data.limit;
		}
});
