if (jQuery === undefined) { // This ensures that jQuery is loaded before running document ready code:
  getScript('/imagesrv/apps/common/js/jq/jquery-1.8.3.min.js', function() {
    if (jQuery === undefined) { // Super failsafe - still somehow failed...
      bindAllHandlers();
    } else {
      jQuery(document).ready(function(){
        gpUtilsDocReady();
      });
    }
  });
} else { // jQuery was already loaded
  $(document).ready(function(){
    gpUtilsDocReady();
  });
}

function gpUtilsDocReady() {
  $('div.headingarea').off('click').on('click', function() {
    $(this).closest('div.analystgroup').find('div.expandblock').toggle('normal');
    $(this).closest('div.headingarea').toggleClass('boldText');
    $(this).closest('div.headingarea').find('div.arrowdown').toggleClass('arrowright','arrowdown');
  });
  $("div.expandblock:first").show();	
  $("div.arrowdown:first").toggleClass('arrowright','arrowdown');
  $("div.headingarea:first").toggleClass('boldText');
}

function getScript(url, success) {
  var script = document.createElement('script');
  script.src = url;
  var head = document.getElementsByTagName('head')[0], done = false;

  script.onload = script.onreadystatechange = function() { // Attach handlers for all browsers
    if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
      done = true;
      success();
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    };
  };
  head.appendChild(script);
}

function PTHTTPGETRequest_Replacement(url, functionOrDiv) {
if (arguments.length == 1) {
         $.ajax(url);
      }
      else if (eval("typeof " + functionOrDiv + " == 'function'")) {
         $.ajax(url).complete(window[functionOrDiv] );
      }
      else {
         $("#" + functionOrDiv).load(url, helpCallback(functionOrDiv));
      }
   }

//popup window functions
function rawPopUp(url, width, height, features, target) {
// attempt to clean up all random js popups
var u = url;
var t = target;
var w = width;
var h = height;
var f = features;

// return if there is no URL
if (u == null) {
return false;
}

// set up default values if none passed
t = t ? t : "_blank";
w = w ? w : 990;
h = h ? h : 650;
f = f ? f : "resizable=yes,scrollbars=yes,toolbar=yes";

// find middle x and y position of the screen
var left = (window.screen.width - w)/2;
var top  = (window.screen.height - h)/2;
var newWin=null;
var settings = 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left + ', ' + f;
newWin = window.open(u, t, settings);
newWin.focus();
return(newWin);
}

function openBio(href) {
// opens Analysts Bio
rawPopUp(href, '579', '450', 'scrollbars=yes,resizable=yes','_0');
return false;
}

var contentPopupInProgressMap = {};

/*
 * containerId - The unique id of the popup container div.  It must also
 *               contain a div with the id of <containerId>_content where
 *               the html content will be loaded.  The entire container will
 *               be shown/hidden. 
 * uniqueId - An id that is unique to the page for identifying the popup.
 * html - The html to display.
 * url - The query url for the html to display.
 * minDelayMs - The minimum delay until the popup is shown (hovering)
 *
 * Positioning is handled by the following pairs (if not supplied, 
 * the popup will not be positioned):
 *    absLeft/absCenter: Either the absolute left or center for the popup.
 *    absTop/absMiddle: Either the absolute top or middle for the popup.
 */
function showContentPopup(args) {
   args = args || {};
   var uniqueId = args.uniqueId;
   // Clear the popup delay for this source from the map.
   delete contentPopupInProgressMap[uniqueId];
   var container = $('#' + args.containerId);      
   if (container) {
      var popupInfo = jQuery.extend(true, {}, args);
      delete popupInfo["html"];
      delete popupInfo["url" ];
      popupInfo.startTime = new Date().getTime();
      // Add it to the inProgress map.
      contentPopupInProgressMap[uniqueId]=popupInfo;

      if ('html' in args && args.html) {
         $('#' + popupInfo.containerId + '_content').html(args.html);
         var minDelayMs = ('minDelayMs' in args && args.minDelayMs) ? args.minDelayMs : 0; 
         setTimeout("eval(" + "showContentPopup_callback('" + uniqueId + "')" + ")", minDelayMs);
      }
      else if ('url' in args && args.url) {
         $.ajax({
            url: args.url,
            success: function(html) {
               if(html) {
                  $('#' + popupInfo.containerId + '_content').html(html);
                  var minDelayMs = ('minDelayMs' in args && args.minDelayMs) ? args.minDelayMs : 0;
                  minDelayMs = Math.max((minDelayMs - (new Date().getTime() -  popupInfo.startTime)), 0);
                  setTimeout("eval(" + "showContentPopup_callback('" + uniqueId + "')" + ")", minDelayMs);
               }
            }
         });
      }
   }
}

function hideContentPopup(uniqueId) {
   // Clear the delay.
   var popupInfo = contentPopupInProgressMap[uniqueId];
   if (popupInfo) {
      $('#' + popupInfo.containerId).css('visibility', 'hidden');
   }
   delete contentPopupInProgressMap[uniqueId];
}

function showContentPopup_callback(uniqueId) {
   // Show the popup if in progress.
   var popupInfo = contentPopupInProgressMap[uniqueId];
   if (popupInfo && !popupInfo.visibile) {
      var container = $('#' + popupInfo.containerId);      
      if ('absCenter' in popupInfo && popupInfo.absCenter> 0) {
         // Always keep the top edge of the container in view. 
         container.offset({ left: Math.max(popupInfo.absCenter - (container.width()/2), 2) });
      }         
      else if ('absLeft' in popupInfo && popupInfo.absLeft >= 0) {
         container.offset({ left: popupInfo.absLeft });
      }

      if ('absMiddle' in popupInfo && popupInfo.absMiddle > 0) {
         // Always keep the left edge of the container in view. 
         container.offset({ top: Math.max(popupInfo.absMiddle - (container.height()/2), $(window).scrollTop()  + 2) });
      }         
      else if ('absTop' in popupInfo && popupInfo.absTop >= 0) {
         container.offset({ top: popupInfo.absTop });
      }
      container.css('visibility', 'visible');
      popupInfo.visibile = true;
   }
}

function submitSearch(formName, location) {
	  rForm = eval('document.' + formName);
	  typeaheadTermType = document.getElementById("typeaheadTermType").value;
	  typeaheadTermId = document.getElementById("typeaheadTermId").value;
	  rForm.keywords.value = document.getElementById("keywords").value;
	  
	  if (typeaheadTermType) {
		if (typeaheadTermType.toLowerCase() == 'title') {
		   document.getElementById("typeaheadTermType").value = '';
		   document.getElementById("typeaheadTermId").value = '';
		   rForm.keywords.value = escape(document.getElementById("keywords").value);
		   window.location = documentdisplayurl + typeaheadTermId;
		   return false;
		 }
	  }
	  
	  if (isValidKeyword(rForm.keywords.value)) {
		  rForm.submit();
		  return false;
	  }else if (isEmptyKeyword(rForm.keywords.value)) {
		  alert("Please provide keywords for your search");
		  return false;
	  } else {
		  alert("Your search is too general. Please provide keywords for your search.");
		  return false;
	  }
	}

function isValidKeyword(keywords) {
	if (keywords.match(/[A-Z]+/g) ||
		keywords.match(/[a-z]+/g) ||
		keywords.match(/[0-9]+/g)) {
		return true;
	}
	if(keywords == "" || keywords == null)
	{
		return true;
	}
	return false;
}


function isEmpty(control) {
	var s = control.value;
	// Trim leading whitespace.
	s = s.replace(/^\s+/g, '');
	return (s.length == 0);
}


function isEmptyKeyword(keywords) {
	if (keywords.match(/^ *$/)) {
		return true;
	}
	if(keywords == "" || keywords == null)
	{
		return true;
	}
	return false;
}
<!-- Searchbox autocomplete-related functionality -->
function getkey(e) {
	if (window.event)
	   return window.event.keyCode;
	else if (e)
	   return e.which;
	else
	   return null;
}
<!-- The submitSearch function must be implemented in the containing page. -->
function searchboxKeyPress(e, formName, location){
	if (getkey(e)==13){
		submitSearch(formName, location);
		return false;
	}
	else {
		return true;
	}
}

if (window.hdrSearchBox_InitTypeAheadSearch2) {
	   function autocompleteCallbackSearchResults(searchboxName) {
			var location = searchboxName.replace('/keywords/',''); 
			submitSearch('gSearchForm', location)	
		}
		
		//typeaheadsugurl is defined in header.ftl for search
		dojo.addOnLoad(function() { hdrSearchBox_InitTypeAheadSearch(typeaheadsugurl,'gSearchForm', 'keywords', 'divSearchSuggestionsSearchResults', 'autocompleteCallbackSearchResults', 10); });
}
	
function hdrSearchBox_InitTypeAheadSearch(typeaheadLink, formName, searchboxName, suggestionsDivName, callbackFunctionName, numResults) {
   //alert("personalized search:"+personalizedSearch);
   var minChars = 3;
   // Define an event handler to populate a hidden form field 
   // when an item gets selected 
   var typeaheadTermType = YAHOO.util.Dom.get("typeaheadTermType"); 
   var typeaheadTermId = YAHOO.util.Dom.get("typeaheadTermId"); 
   
   initTypeAheadSearch(
	  { formName: formName, 
		searchboxName: searchboxName, 
		suggestionsDivName: suggestionsDivName,
		minQueryLength : minChars,

		url:  typeaheadLink + '?num=' + numResults + '&minChars=' + minChars + '&keywords=',
		requestSchema: {
						 resultsList : "suggestions", 
						 fields : [
							 { key: "term" },
							 { key: "count" },
							 { key: "separator" },
							 { key: "id" },
							 { key: "type" }
						 ]
		}, 
		formatResultFunction : function(oResultData, sQuery, sResultMatch) {
			document.getElementById("divSearchHistoryResults").innerHTML = '';
		   // Cast to Strings. 
		   sQuery = String(sQuery);
		   // Preserve only alphanumerics, spaces, and the - symbol.
			sQuery = sQuery.replace(/[^a-zA-Z0-9 -]|^\s+|\s+$/g, '');
		   // Collapse all duplicate spaces.
		   sQuery = sQuery.replace(/\s+/g, ' ');
		   
		   var displayItem = String(oResultData.term);
		   var type = String(oResultData.type);
		   var idx = displayItem.toLowerCase().indexOf(sQuery.toLowerCase());
		   var pre = (idx> -1) ? displayItem.substr(0, idx) : '';
		   var sel = (idx> -1) ? displayItem.substr(idx, sQuery.length) : '';
		   var post = (idx> -1) ? displayItem.substr(idx + sQuery.length): displayItem;
		   var aMarkup = [''];
			if( oResultData.separator && type != 'term') {
			   var header = "";
			   if (type == 'title') {
				  header = "Titles";
			   }
			   else if (type == 'analyst') {
				  header = "Analysts";
			   }
			   else if (type == 'vendor') {
				  header = "Vendors";
			   }
			   else if (type == 'term') {
				  header = "Keywords";
			   }
			   aMarkup = ['<div class=\"clusterTitle\"> <span class="TypeAheadBold">' + header + '</span></div><ul class=\"smartClusters\"><div class=\"TypeAheadWitdh\">',
							  pre,
							  '<span class="TypeAheadBold">',
							  sel,
							  '</span>',
							  post,
						   '</div></ul>'];
			}
			else {
				aMarkup = ['<div class="TypeAheadWitdh">',
							   pre,
							   '<span class="TypeAheadBold">',
							   sel,
							   '</span>',
							   post,
							   '</div>'];
			}
		   return (aMarkup.join(''));
		},
		itemSelectEventFunction:function(sType, aArgs ) {   
			var myAC = aArgs[0]; // reference back to the AC instance 
			var elLI = aArgs[1]; // reference to the selected LI element 
			var oData = aArgs[2]; // object literal of selected item's result data 
			// update hidden form fields with the selected item's id and type 
			typeaheadTermId.value = oData.id;
			typeaheadTermType.value = oData.type;
		 // Disable autocomplete.
		 eval(searchboxName + 'Enabled' + '=false;');
		 // Set a timeout to re-enable the typeahead. 
		 setTimeout(searchboxName + "Enabled=true", 3000);
		 // Execute the callback.
			eval(callbackFunctionName + "('" + searchboxName + "')");
	  },
		callbackFunction : callbackFunctionName,
		// Turn off local cache.
		queryMatchSubset : false,
		maxResults: numResults });
}
	
	// Basic type ahead configuration.
function initTypeAheadSearch(oArgs) {
	// Create a var to track autocomplete enabled/disabled. 
	eval(oArgs.searchboxName + 'Enabled' + '=true');
	
	function autocompleteIsDisbabled() {
		return eval(oArgs.searchboxName + 'Enabled' + '==false');
	}
	
	// Trap form submit for the form containing the autocomplete.
	YAHOO.util.Event.addListener(
		YAHOO.util.Dom.get(oArgs.formName), 
		"submit",
	   function(e, myForm) {
			YAHOO.util.Event.stopEvent(e);
			// Disable autocomplete.
			eval(oArgs.searchboxName + 'Enabled' + '=false;');
			// Set a timeout to re-enable the typeahead. 
			setTimeout(oArgs.searchboxName + "Enabled=true", 3000);
	   } 
	);

	// Datasource.
	var ds = new YAHOO.util.XHRDataSource(oArgs.url);
	ds.connTimeout=5000;
	ds.responseType = YAHOO.util.XHRDataSource.TYPE_JSON; 
	ds.responseSchema = oArgs.requestSchema;
	ds.connXhrMode = 'cancelStaleRequests';
	ds.maxCacheEntries =  oArgs.maxCacheEntries ? oArgs.maxCacheEntries : 10; 
	ds.queryMatchSubset = oArgs.queryMatchSubset ? oArgs.queryMatchSubset : false;

			
	// Create and configure the control.
	var autocomplete = new YAHOO.widget.AutoComplete(oArgs.searchboxName, oArgs.suggestionsDivName, ds);
	
	
	// Only the item of interest should be returned 
	// (and thus appended to the url).
	autocomplete.generateRequest = function(sQuery) {
		return sQuery; 
	};
 
 	autocomplete.forceSelection =  oArgs.forceSelection ? true : false; 
	autocomplete.maxResultsDisplayed = oArgs.maxResults ? oArgs.maxResults : 5;
	autocomplete.minQueryLength = oArgs.minQueryLength ? oArgs.minQueryLength : 2;
	autocomplete.queryDelay = oArgs.queryDelay ? oArgs.queryDelay :0.2;
	autocomplete.typeAheadDelay = autocomplete.queryDelay + 0.1;
	autocomplete.typeAhead=true;
	if (oArgs.header) {
		autocomplete.setHeader(oArgs.header);
	}
	if (oArgs.body) {
		autocomplete.setBody(oArgs.body);
	}
	if (oArgs.footer) {
		autocomplete.setFooter(oArgs.footer);
	}

	autocomplete.animVert = oArgs.animVert ? oArgs.animVert : true;
	autocomplete.animHoriz = oArgs.animHoriz ? oArgs.animHoriz :false;
	autocomplete.animSpeed = oArgs.animSpeed ? oArgs.animSpeed : 0.05;
	autocomplete.autoHighlight = oArgs.autoHighlight ? oArgs.autoHighlight : false;
	// Disable the browser's built-in autocomplete caching mechanism
	autocomplete.allowBrowserAutocomplete = false;
	autocomplete.prehighlightClassName = "yui-ac-prehighlight";	

	autocomplete.resultTypeList = false; 
	autocomplete.formatResult = oArgs.formatResultFunction;

    // Block suggestion expansion of any in-progress requests.	
	autocomplete.doBeforeLoadData = function(oResultData, sQuery, sResultMatch) {
		return !autocompleteIsDisbabled();		
	};
	
	if (!autocomplete.forceSelection) {
		// Hook the ENTER key to disable the autocomplete and execute the callback.	
		function checkReturn(e) {
		   var keyno = YAHOO.util.Event.getCharCode(e);
		   if (!autocompleteIsDisbabled() && keyno == 13) {
				// Disable autocomplete.
				eval(oArgs.searchboxName + 'Enabled' + '=false;');
				// Set a timeout to reenable the typeahead. 
				setTimeout(oArgs.searchboxName + "Enabled=true", 3000);
				return eval(oArgs.callbackFunction + "('" + oArgs.searchboxName + "')");
		   }
		}
		YAHOO.util.Event.addListener(autocomplete.getInputEl(), "keypress", checkReturn);
	}

	// Hook item selection to populate hidden fields and disable the autocomplete and execute the callback.	
	if (oArgs.itemSelectEventFunction) {
    try {
      autocomplete.itemSelectEvent.subscribe(oArgs.itemSelectEventFunction);
    } catch (excep) { }
	}else{
	// Hook item selection to disable the autocomplete and execute the callback.	
    try {
      autocomplete.itemSelectEvent.subscribe(function( oSelf , elItem , oData ) {  
        // Disable autocomplete.
        eval(oArgs.searchboxName + 'Enabled' + '=false;');

        // Set a timeout to re-enable the typeahead. 
        setTimeout(oArgs.searchboxName + "Enabled=true", 3000);

        // Execute the callback.
        eval(oArgs.callbackFunction + "('" + oArgs.searchboxName + "')");
      });
    } catch (excep) { }
	}
}

	function changeSearchView(viewId,isTabChange) {
         	//var arr = viewIdbaseUrl.split("|");
         	//var viewId = arr[0];
         	//var baseUrl = arr[1];
		    //TODO: Handle Browse URL redirection here based on the viewId

			//Based on the viewId - determine the baseUrl - This is defined in main-nav.ftl
			if(viewId == 2){
				baseUrl = researchUrl;
			}else if(viewId == 12){
				baseUrl = analystUrl;
			}
         	var keywords = document.getElementById("keywords").value
            //Allow null keywords
            var url = baseUrl + '?keywords=' + encodeURIComponent(keywords);            
            if(isTabChange) {
               url += '&tabChg=true';
            }
            window.location = url;  
	}
	
	function showSearchHistory() {
		var keywords = document.getElementById("keywords").value
		if(isEmptyKeyword(keywords)){
			$.ajax({
			    type: 'GET',
			    url: searchhistoryurl,
			    success: function(htmlVal) {
				    document.getElementById("divSearchHistoryResults").innerHTML = htmlVal;
			    }
			});
		}
   }
   
   function submitSearchHistory(searchterm) {
		document.getElementById("keywords").value = searchterm;
		submitSearch('gSearchForm','');
		return false;
   }
	