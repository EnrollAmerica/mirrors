$(document).ready(function() {
	
	// Add even listeners for the SHOW More/SHOW Less buttons
	// Faceted Search feature added 05/14
	document.getElementById("results-box").addEventListener("click", function(e){
					
		//e.target was the clicked element
		var el = e.target;
					
		if(el && el.nodeName == "P") {						
			// Get the CSS classes
			var classes = el.className.split(" ");
			// Search for the CSS class!
			if(classes) {
				// For every CSS class the element has...
				for(var x = 0; x < classes.length; x++) {
					// If it has the CSS class we want...
					if(classes[x] == "showmore-btn" || classes[x] == "showless-btn") {
						// Navigate to the Parent element
						while (el && el.nodeName != "TR") {
							el = el.parentNode;
						}
						// 
						$(el).nextUntil('show-more-less').slideToggle(100);
						$(el).toggleClass("clicked");
									
						if (classes[x] == "showmore-btn") {
							$(e.target).toggle();
							$(e.target.nextSibling).toggle();
							$(e.target.nextSibling).toggleClass("clicked");
							var totalSize = isWaiver ? jQuery("#results-box").height() : jQuery("#demo").height();
							var containerHeight = jQuery(".page-title-inner").height();
							var tmpContentSize = totalSize + containerHeight + "px";
							jQuery(".main-body-content").css("height", tmpContentSize);
							jQuery(".main-body").css("padding","10px;");						
						}
						else {
							$(e.target).toggle();
							$(e.target.previousSibling).toggle();
							$(e.target.previousSibling).toggleClass("clicked");
							var totalSize = isWaiver ? jQuery("#results-box").height() : jQuery("#demo").height();
							var containerHeight = jQuery(".page-title-inner").height();
							var morePaneHeight = jQuery(".more").height();
							var tmpContentSize = totalSize + containerHeight - morePaneHeight + "px";
        	
							jQuery(".main-body-content").css("height", tmpContentSize);
							jQuery(".main-body").css("padding","10px;");						
						}
					}
				}
			}
		} 
	});	
 }); 

