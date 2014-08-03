//rollover for images
function roll(img_name, img_src)
   {
   document[img_name].src = img_src;
   }

//hide & show content for plus & minus signs
function setDisplay(objectID,state) {
	var object = document.getElementById(objectID);
	object.style.display = state;
}
function show (id) {
	setDisplay('plus'+id, 'none')
	setDisplay('minus'+id, 'block')
}
function hide (id) {
	setDisplay('minus'+id, 'none')
	setDisplay('plus'+id, 'block')
}


// from /docs/common/scripts/ugh_g_search.js and utils.js 

function gPopUp(url, w, h, title, features, target) {
	
	var newWin=null;
	target = target ? target : "_blank";
	//calculate the x, and y position of the popup to center it
	var left = (screen.width - w)/2;
	var top = (screen.height - h)/2;
	var settings = 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left + ', ' + features;	
	newWin = window.open(url, target, settings);
	newWin.focus();
	
}


var winCTR = 0 ;
var childWindow = new Array(20); 

function ugh_validSearch(keywords){

	if (keywords.match(/[A-Z]+/g) ||
		keywords.match(/[a-z]+/g) ||
		keywords.match(/[0-9]+/g)) {
		return true;
	}

	if (keywords.match(/^ *$/g)) {
		alert('Please provide keywords for your search.');
		return false;
	}
	alert('Your search is too general.  Please provide keywords for your search.');
	return false;
}

function ugh_submitSearch(searchKey, formObj, element) {
	
	var objSearchForm = (formObj) ? document[formObj] : document.frmSearch;  
	var elementValue = (element) ? objSearchForm.elements[element.name].value : objSearchForm.txtSearch.value;
    
//	if (ugh_validSearch(elementValue)) {
	
		if(searchKey) {
			mystrng = elementValue + searchKey;
		} else {
        	mystrng = elementValue;
		}
		
		mystrng = mystrng.replace(/\%/g,"%25");
		mystrng = mystrng.replace(/\"/g,"%22");
		mystrng = mystrng.replace(/\#/g,"%23");
		mystrng = mystrng.replace(/\&/g,"%26");
		mystrng = mystrng.replace(/\+/g,"%2B");
		mystrng = mystrng.replace(/\,/g,"%2C");
		mystrng = mystrng.replace(/\./g,"%2E");
		mystrng = mystrng.replace(/\//g,"%2F");
		mystrng = mystrng.replace(/\:/g,"%3A");
		mystrng = mystrng.replace(/\;/g,"%3B");
		mystrng = mystrng.replace(/\</g,"%3C");
		mystrng = mystrng.replace(/\=/g,"%3D");
		mystrng = mystrng.replace(/\>/g,"%3E");
		mystrng = mystrng.replace(/\?/g,"%3F");
		mystrng = mystrng.replace(/\@/g,"%40");
		mystrng = mystrng.replace(/\[/g,"%5B");
		mystrng = mystrng.replace(/\]/g,"%5D");
		mystrng = mystrng.replace(/\^/g,"%5E");
		mystrng = mystrng.replace(/\'/g,"%60");
		mystrng = mystrng.replace(/\{/g,"%7B");
		mystrng = mystrng.replace(/\|/g,"%7C");
		mystrng = mystrng.replace(/\}/g,"%7D");
		mystrng = mystrng.replace(/\~/g,"%7E");		

        for (x = 0; x < mystrng.length; x++) {
            d = mystrng.charCodeAt(x);
            if (d == 8216 || d == 8217 || d == 8220 || d == 8221) {
                if (x == 0) {
                    if (d == 8216 || d == 8217) {
                        mystrng = "%27"
                            + mystrng.substring(1, mystrng.length);
                    } else {
                        mystrng = "%22"
                            + mystrng.substring(1, mystrng.length);
                    }
                } else if (x == mystrng.length) {
                    if (d == 8216 || d == 8217) {
                        mystrng = mystrng.substring(0, x) + "%27";
                    } else {
                        mystrng = mystrng.substring(0, x) + "%22";
                    }
                } else {
                    if (d == 8216 || d == 8217) {
                        mystrng = mystrng.substring(0, x)
                            + "%27"
                            + mystrng.substring(x + 1, mystrng.length);
                    } else {
                        mystrng = mystrng.substring(0, x)
                            + "%22"
                            + mystrng.substring(x + 1, mystrng.length);
                    }
                }
            }
        }
        ugh_g_openSearch('/SimpleSearch/keywords='+ mystrng);
//    }
}

function ugh_g_openSearch(url){
	var w=990;
	var h=650;

      	var versionBrz = parseInt(BrowserDetect.version);

   	if(BrowserDetect.browser.toUpperCase()=="EXPLORER" && (versionBrz==7 || versionBrz==8) ){
	var features="location=yes,scrollbars=yes,status=no,toolbar=yes,resizable=yes";
	gPopUp(url, w, h, '', features, null);
	}else {
	var features="location=no,scrollbars=yes,status=no,toolbar=yes,resizable=yes";
	gPopUp(url, w, h, '', features, null);

	}
}

function openAlertsWindow(href) {
	// opens Site Search, which isn't released yet
      	var versionBrz = parseInt(BrowserDetect.version);

   	if(BrowserDetect.browser.toUpperCase()=="EXPLORER" && (versionBrz==7 || versionBrz==8) ){

		gPopUp(href, '990', '650', '', 'scrollbars=yes,menubar=no,resizable=no,status=no,toolbar=yes,location=yes','alertswin');

	} else {
	
		gPopUp(href, '990', '650', '', 'scrollbars=yes,menubar=no,resizable=no,status=no,toolbar=yes,location=no','alertswin');	
	
	}
	return false;
}

function openWindow(url,width,height){
	window.open (url,"mywindow","menubar=0,resizable=1,scrollbars=1,width="+width+",height="+height); 
}



//BROWSER DETECTION

 

var BrowserDetect = {

      init: function () {

            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";

            this.version = this.searchVersion(navigator.userAgent)

                  || this.searchVersion(navigator.appVersion)

                  || "an unknown version";

            this.OS = this.searchString(this.dataOS) || "an unknown OS";

      },

      searchString: function (data) {

            for (var i=0;i<data.length;i++)     {

                  var dataString = data[i].string;

                  var dataProp = data[i].prop;

                  this.versionSearchString = data[i].versionSearch || data[i].identity;

                  if (dataString) {

                        if (dataString.indexOf(data[i].subString) != -1)

                              return data[i].identity;

                  }

                  else if (dataProp)

                        return data[i].identity;

            }

      },

      searchVersion: function (dataString) {

            var index = dataString.indexOf(this.versionSearchString);

            if (index == -1) return;

            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));

      },

      dataBrowser: [

            {

                  string: navigator.userAgent,

                  subString: "Chrome",

                  identity: "Chrome"

            },

            {     string: navigator.userAgent,

                  subString: "OmniWeb",

                  versionSearch: "OmniWeb/",

                  identity: "OmniWeb"

            },

            {

                  string: navigator.vendor,

                  subString: "Apple",

                  identity: "Safari",

                  versionSearch: "Version"

            },

            {

                  prop: window.opera,

                  identity: "Opera"

            },

            {

                  string: navigator.vendor,

                  subString: "iCab",

                  identity: "iCab"

            },

            {

                  string: navigator.vendor,

                  subString: "KDE",

                  identity: "Konqueror"

            },

            {

                  string: navigator.userAgent,

                  subString: "Firefox",

                  identity: "Firefox"

            },

            {

                  string: navigator.vendor,

                  subString: "Camino",

                  identity: "Camino"

            },

            {           // for newer Netscapes (6+)

                  string: navigator.userAgent,

                  subString: "Netscape",

                  identity: "Netscape"

            },

            {

                  string: navigator.userAgent,

                  subString: "MSIE",

                  identity: "Explorer",

                  versionSearch: "MSIE"

            },

            {

                  string: navigator.userAgent,

                  subString: "Gecko",

                  identity: "Mozilla",

                  versionSearch: "rv"

            },

            {           // for older Netscapes (4-)

                  string: navigator.userAgent,

                  subString: "Mozilla",

                  identity: "Netscape",

                  versionSearch: "Mozilla"

            }

      ],

      dataOS : [

            {

                  string: navigator.platform,

                  subString: "Win",

                  identity: "Windows"

            },

            {

                  string: navigator.platform,

                  subString: "Mac",

                  identity: "Mac"

            },

            {

                     string: navigator.userAgent,

                     subString: "iPhone",

                     identity: "iPhone/iPod"

          },

            {

                  string: navigator.platform,

                  subString: "Linux",

                  identity: "Linux"

            }

      ]

 

      };

      BrowserDetect.init();

 

 

 

      //BrowserDetect.browser

      //BrowserDetect.version

      //BrowserDetect.OS

 

 

// END BROWSER DETECTION

