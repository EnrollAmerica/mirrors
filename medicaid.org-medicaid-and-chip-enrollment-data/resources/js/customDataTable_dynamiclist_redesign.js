$(document).ready(function() {
    // Global Variables

    var oTable = null;
    var oTableTools = null;
	var fieldName = null;
    var qFilter = $.getParam("filterBy");
	var regex = null;
    var qSort = $.getParam("sortBy");
	var linkCol = $('#dynamic-list').attr("linkcolumn");
	var statusCol = $('#dynamic-list').attr("statusCol");
	var numCol = $('#dynamic-list').attr("numberofcolumns");
    var detailedColumn = $('#dynamic-list').attr("detailcol"); // This indicates which column is a detailed column
    var stateColumn = $('#dynamic-list').attr(0); // This indicates which column is the State Name
    var programNameColumn = $('#dynamic-list').attr(1); // This indicates which column is the Official Program Name
	var titleColumn = $('#dynamic-list').attr(1); // This indicates which column is the Title
	var typeColumn = $('#dynamic-list').attr(2); // This indicates which column is the Type field
    var waiverAuthorityColumn = $('#dynamic-list').attr(2); // This indicates which column is a Waiver Authority
    var statusColumn = $('#dynamic-list').attr(3); // This indicates which column is a Status
    var filterField = $('#dynamic-list').attr("filterOn"); // This indicates which column is a Status
	var isWaiver = $('#dynamic-list').attr("isWaiver"); 
	var isCHIPSPA = $('#dynamic-list').attr("isCHIPSPA");
	var isMEDSPA = $('#dynamic-list').attr("ismedspa");
	var isPharmacy = $('#dynamic-list').attr("isPharmacy");
	var isEventsAnnounce = $('#dynamic-list').attr("isEventsAnnounce");
	var isFAQs= $('#dynamic-list').attr("isFAQs");
	var stateCHIPSPAColumn = $('#dynamic-list').attr(2); // This indicates which column is the State column for CHIP SPAs
	var statePlanInformationColumn = $('#dynamic-list').attr(4); // This indicates which column is the State Plan Information for CHIP SPAs
	var approvalDateCHIPSPAColumn = $('#dynamic-list').attr(0); // This indicates which column is the State Plan Information for CHIP SPAs
	var effectiveDateCHIPSPAColumn = $('#dynamic-list').attr(1); // This indicates which column is the State Plan Information for CHIP SPAs
	var statusCHIPSPAColumn = $('#dynamic-list').attr(6); // This indicates which column is the State Plan Information for CHIP SPAs
    var detailedRowInfo = null;
    var stateCHIPSPAInfo = null;
	var statusCHIPSPAInfo = null;
    var programNameInfo = null;
	var approvalDateCHIPSPAInfo = null;
	var effectiveDateCHIPSPAInfo = null;
    var waiverAuthorityInfo = null;
	var titleInfo = null;
    var statusInfo = null;
	var typeInfo = null;
	var statePlanInfo = null;
	var summaryPlanInfo = null;
	var approvalDateInfo = null;
	var effectiveDateInfo = null;
	var expirationDateInfo = null;
	var downloadNameOneInfo = null;
	var downloadPathOneInfo = null;
	var downloadNameTwoInfo = null;
	var downloadPathTwoInfo = null;
	var downloadNameThreeInfo = null;
	var downloadPathThreeInfo = null;
	var downloadNameFourInfo = null;
	var downloadPathFourInfo = null;
	var downloadNameFiveInfo = null;
	var downloadPathFiveInfo = null;
    var dataSource = $('#dynamic-list').attr("dataSource"); // the location of the data source for the table
    var colCount = $("#dynamic-list thead tr > th").size();
    var defaultSortCol = $('#dynamic-list').attr("defaultsortcol");
    var defaultSortOrder = $('#dynamic-list').attr("defaultsortorder");
    var defaultSortCol2 = $('#dynamic-list').attr("defaultsortcol2");
    var defaultSortOrder2 = $('#dynamic-list').attr("defaultsortorder2");
    var defaultFilter = $('#dynamic-list').attr("defaultFilter");
    var customAOColumns = new Array();
    var hiddenColumns = $('#dynamic-list').attr("hiddencols");
    var aTargets = new Array();
    var hiddenColumnsArray;
    var tempDetailedRowInfo = null;
    var preInitOTable = null;
    var lastVisibleCol;
    var totalSize = isWaiver ? jQuery("#results-box").height() : jQuery("#demo").height();
    var containerHeight = jQuery(".page-title-inner").height();
    var tmpContentSize = totalSize + containerHeight + "px";
    var htmlCode;
	var bUrlFilter = false;  // Flag - true if a "filterBy" argument containing a state name is passed in the URL




    try {
        hiddenColumnsArray = hiddenColumns.split(',');
        lastVisibleCol = hiddenColumnsArray[0] - 1;
    }
    catch (err) {
        //Handle errors here
    }

	/* Set the flag if the waivers faceted search was passed a state name to filter by in the URL */
	if (qFilter != null) {
		bUrlFilter = true;
	}	
	
	/* Determine if multi-filtering */
	if (qFilter != null && qFilter.indexOf(",") != -1)
	{
		var loc = qFilter.indexOf(",");
		var first = qFilter.substring(0,loc);
		var second = qFilter.substring(loc+1, qFilter.length);
		regex = "(\\b" + first + "\\b.*\\b" + second + "\\b)" + "|(\\b" + second + "\\b.*\\b" + first + "\\b)";
	}

    /* Style the first and last table header */

    $("#dynamic-list thead th").first().addClass("rounded-top-left");
    $("#dynamic-list thead th:eq(" + lastVisibleCol + ")").addClass("rounded-top-right"); 

	var iii=0;
	while(iii <= numCol)
	{
		$("#dynamic-list tfoot th:eq(" + iii + ")").addClass("none"); 
		iii = iii+1;
	}

	if(typeof hiddenColumnsArray !== undefined){
    $.each(hiddenColumnsArray, function(index, value) {
        var temp = parseInt(value);

        aTargets.push(temp);
    });
	}




    var ii=0;
    $("#dynamic-list thead tr > th").each(function(index) {
		var mDataProp = null;
	    
		if (ii == linkCol)
			mDataProp = { "mDataProp": $(this).text(),
                          "sClass": "linkCol",
						  "bFooter": false };
		else if (ii == statusCol)
          mDataProp = { "mDataProp": $(this).text(),
						"bFooter": false, "iDataSort": 5};
		else
          mDataProp = { "mDataProp": $(this).text(),
						"bFooter": false };

        customAOColumns.push(mDataProp);
		ii=ii+1;


    });



    rowHandler = function() {

        preInitOTable = this; // FOR IE, I NEED TO USE THIS RATHER THAN OTABLE
        jQuery.fn.exists = function() { return jQuery(this).length > 0; }

        $("#dynamic-list tbody tr").each(function(index) {
            tempDetailedRowInfo = preInitOTable.fnGetData(this, detailedColumn);

        });

		if (isWaiver != "true")
		{
			jQuery(".main-body-content").css("height", tmpContentSize);        
			jQuery(".main-body").css("padding","10px;");
			jQuery(".main-body-content").addClass("iefooterfix");
		}
		var t=1;
    } 

    drawCallbackHandler = function() {
		
		var totalSize = isWaiver ? jQuery(".results-container").height() : jQuery("#demo").height();
        var containerHeight = jQuery(".page-title-inner").height();
        var cntContentSize = totalSize + containerHeight + "px";
		
		if(oTable !=null & isWaiver == "true" ){
		        var oSettings = oTable.fnSettings();
				
				// Grab the set of filtered items from the Datatable
				var nfiltered = oTable.fnGetFilteredNodes(oSettings);
								
				// Construct the results section from the filtered nodes
				var newHTML = displayWaiverData(nfiltered,oSettings._iDisplayStart, oSettings._iDisplayEnd);
				
				// Replace the results pane in the document
				$('div.results-container').replaceWith(newHTML);
				
				totalSize = jQuery("#results-box").height();
				cntContentSize = totalSize + containerHeight + 100+ "px";
		}
		
		if (oTable == null & isWaiver == "true") {
					
			cntContentSize = "2047px";
		}
        	
        jQuery(".main-body-content").css("height", cntContentSize);        
		jQuery(".main-body").css("padding","10px;");
        jQuery(".main-body-content").addClass("iefooterfix");
		
		var t = 1;
    }

    
    /* If there is a specific filterBy option in the table definition, filter by only that status. 
	   Otherwise, add the bindings to
       filter based on the search field and/or the dropdown status 
	   (NOTE: does not apply to Waivers Faceted Search)
	*/ 
    if (filterField != null)
    {
        oTable = $('#dynamic-list').dataTable({
            "sDom": '<"test"><"clear">irt<"clear">lp<"clear">',
            "bProcessing": true,
            "sAjaxSource": dataSource,
            "bDeferRender": true,
            "bAutoWidth": false,
            "aoColumns": customAOColumns,
            "aoColumnDefs": [
            { "bVisible": false, "aTargets": aTargets }
            ],
            "oSearch": { "sSearch": filterField },
            "aaSorting": [[defaultSortCol, defaultSortOrder]],
            "bSortClasses": false,
            "bRetrieve": true,
            "sPaginationType": "full_numbers",
            "fnInitComplete": rowHandler,
            "fnDrawCallback": drawCallbackHandler
        });


    }
    else {


	// Bind the filter buttons in th
    $('.filterButton').bind('click', function() { 
        oTable.fnFilter($(this).attr("name"), $(this).attr("filterCol")); 
	 jQuery(".main-body-content").css("height", tmpContentSize);
    }); 
	
	//Set up the binding to the drop downs.
    $('.filter_dropdown').change(function() { 
	    var value = "";
		var col = $(this).attr("filterCol");
		var nme = $(this).attr("name");
		
		if (nme == "topic")
		{
			if ($(this).val() != "") {
              value = $(this).val();
            }

			oTable.fnFilter(value, $(this).attr("filterCol"), true, false);
		}
		else {
			if ($(this).val() != "") {
				value = "^" + $(this).val() + "$";
			}
			
			value = value.replace(/\(/g, '\\(');
			value = value.replace(/\)/g, '\\)');
			value = value.replace(/ /g, '.');
			oTable.fnFilter(value, $(this).attr("filterCol"), true, false); 
		}
		
		jQuery(".main-body-content").css("height", tmpContentSize);
    });
	
	//Set up the binding to the Status Sort By drop down.
	// Faceted Search feature added 05/14
    $('.waiver_filter_dropdown').change(function() { 
	    var value = parseInt($(this).val());

		oTable.fnSort([[value,'asc']] );
		jQuery(".main-body-content").css("height", tmpContentSize);
   });
	
	// Set up the binding to the Waiver Authority check boxes
	// Faceted Search feature added 05/14
    $('.filter_authority').change(function() { 
	    var value = "";
		var col = $(this).attr("filterCol");
		var nme = $(this).attr("name");
		var clicked = $(this).attr("value");
		var column = document.querySelectorAll("input[class=filter_authority]");
		
		if (clicked == "All" && column[0].checked) {
			for (var ii=1; ii<column.length; ii++)
			{
				if (column[ii].className == "filter_authority") {
					column[ii].checked = true;
				}
			}
		}
		else if (clicked == "All" && !(column[0].checked)) {
			for (var ii=1; ii<column.length; ii++)
			{
				if (column[ii].className == "filter_authority") {
					column[ii].checked = false;
				}
			}
		}	
	
		// Handle checking the 1915 b entries when the 1915(b) option is selected
		else if (clicked == "1915 (b)" && column[2].checked) {
			for (var ii=1; ii<column.length; ii++) {
				if (column[ii].className == "filter_authority" && (column[ii].value == "1915 (b1)" || column[ii].value == "1915 (b2)" || column[ii].value == "1915 (b3)" || column[ii].value == "1915 (b4)")) {
					column[ii].checked = true;
				}
			}
		}
		
		// Handle unchecking the 1915 b entries when the 1915(b) option is unselected
		else if (clicked == "1915 (b)" && !(column[2].checked)) {
				for (var ii=1; ii<column.length; ii++) {
					if (column[ii].className == "filter_authority" && (column[ii].value == "1915 (b1)" || column[ii].value == "1915 (b2)" || column[ii].value == "1915 (b3)" || column[ii].value == "1915 (b4)")) {
						column[ii].checked = false;
					}
				}
		}
		// IE 8 and others support querySelectorAll()
		for(var i=0; i<column.length; i++ )
		{
		    var colData = column[i];
			
			if(colData.checked && colData.className == "filter_authority" && colData.value != "All") {
				if(colData.checked) {
					if (value !=""){
						value += "|";
					}
					value += colData.value;
				}
			}
		}
			
		value = value.replace(/\(/g, '\\(');
		value = value.replace(/\)/g, '\\)');
		value = value.replace(/ /g, '.');
		if (value ==""){
			value = "  ";
		}
		var val = oTable.fnSettings().fnRecordsTotal();
		oTable.fnFilter(value, $(this).attr("filterCol"), true, false);
		
		jQuery(".main-body-content").css("height", tmpContentSize);
    });
	
	//Set up the binding to the State check boxes
	// Faceted Search feature added 05/14
    $('.filter_state').change(function() { 
	    var value = "";
		var col = $(this).attr("filterCol");
		var nme = $(this).attr("name");
		var clicked = $(this).attr("value");
		var column = document.querySelectorAll("input[class=filter_state]");
		
		if (bUrlFilter == true) {
			var oSettings = oTable.fnSettings();
			oSettings.oPreviousSearch.sSearch = '';
			bUrlFilter = false;
		}
		
		if (clicked == "All" && column[0].checked) {
				for (var ii=1; ii<column.length; ii++)
				{
					if (column[ii].className == "filter_state") {
						column[ii].checked = true;
					}
				}

		}
		else if (clicked == "All" && !(column[0].checked)) {
				for (var ii=1; ii<column.length; ii++)
				{
					if (column[ii].className == "filter_state") {
						column[ii].checked = false;
					}
				}
		}	
		
		// IE 8 and others support querySelectorAll()
		for(var i=0; i<column.length; i++ )
		{
		    var colData = column[i];
					
			if(colData.checked && colData.className == "filter_state" && colData.value != "All") {
				if (value !=""){
					value += "|";
				}
				value += "^" + colData.value + "$";
			}
		}	
			
		value = value.replace(/\(/g, '\\(');
		value = value.replace(/\)/g, '\\)');
		value = value.replace(/ /g, '.');
		if (value ==""){
			value = "^ $";
		}
		oTable.fnFilter(value, $(this).attr("filterCol"), true, false); 
		jQuery(".main-body-content").css("height", tmpContentSize);
    });

	// Set up the binding to the Status check boxes
	// Faceted Search feature added 05/14
    $('.filter_status').change(function() { 
	    var value = "";
		var col = $(this).attr("filterCol");
		var nme = $(this).attr("name");
		var clicked = $(this).attr("value");
		var column = document.querySelectorAll("input[class=filter_status]");
		
		// Handle checking all options when the all button is selected.
		if (clicked == "All" && column[0].checked) {
				for (var ii=1; ii<column.length; ii++) {
					if (column[ii].className == "filter_status") {
						column[ii].checked = true;
					}
				}

		}
		
		// Handle unchecking all options when the ALL button is unselected
		else if (clicked == "All" && !(column[0].checked)) {
				for (var ii=1; ii<column.length; ii++) {
					if (column[ii].className == "filter_status") {
						column[ii].checked = false;
					}
				}
		}

		// Handle checking the Inactive Waiver statuses when the Inactive option is selected
		else if (clicked == "Inactive" && column[3].checked) {
			for (var ii=1; ii<column.length; ii++) {
				if (column[ii].className == "filter_status" && (column[ii].value == "Disapproved" || column[ii].value == "Withdrawn" || column[ii].value == "Expired")) {
					column[ii].checked = true;
				}
			}
		}
		
		// Handle unchecking the Inactive Waiver Statuses options when the Inactive button is unselected
		else if (clicked == "Inactive" && !(column[3].checked)) {
				for (var ii=1; ii<column.length; ii++) {
					if (column[ii].className == "filter_status" && (column[ii].value == "Disapproved" || column[ii].value == "Withdrawn" || column[ii].value == "Expired")) {
						column[ii].checked = false;
					}
				}
		}
		
		// IE 8 and others support querySelectorAll()
		for(var i=0; i<column.length; i++ )
		{
		    var colData = column[i];
			
					
			if(colData.checked && colData.className == "filter_status" && colData.value != "All") {
				if (value !=""){
					value += "|";
				}
				value += "^" + colData.value + "$";
			}
		}	
			
		value = value.replace(/\(/g, '\\(');
		value = value.replace(/\)/g, '\\)');
		value = value.replace(/ /g, '.');
		if (value ==""){
			value = " ";
		}
		oTable.fnFilter(value, $(this).attr("filterCol"), true, false); 
		jQuery(".main-body-content").css("height", tmpContentSize);
    });
	
	// If a State filter was passed into the page using filterBy,
	// update the State checkboxes to reflect this.
	function initStateFilterFromUrl(state) {
	
		var column = document.querySelectorAll("input[class=filter_state]");
		var value="";

		// Clear all checkBoxes except for the chosen state
		for (var ii=1; ii<column.length; ii++)
		{
			if (column[ii].className == "filter_state") {
				// Uncheck all checkboxes that aren't the passed State
				if (column[ii].value != state) {
					column[ii].checked = false;
				} else {
					// Check the box if it's the passed State
					column[ii].checked = true;
					
					// Position the scrollbar for the checkbox container
					// so the state is positioned roughly in the middle of the scrollable area.
					// Each row of the container is about 16 pixels
					$("div.scrollboxcontainer").scrollTop(ii*16-32);
				}
			}
		}
		column[0].checked = false;
		
		// IE 8 and others support querySelectorAll()
		for(var i=0; i<column.length; i++ )
		{
		    var colData = column[i];
					
			if(colData.checked && colData.className == "filter_state" && colData.value != "All") {
				if (value !=""){
					value += "|";
				}
				value += "^" + colData.value + "$";
			}
		}	
			
		value = value.replace(/\(/g, '\\(');
		value = value.replace(/\)/g, '\\)');
		value = value.replace(/ /g, '.');
		if (value ==""){
			value = "^ $";
		}
		oTable.fnFilter(value, $(".filter_state").attr("filterCol"), true, false); 
		jQuery(".main-body-content").css("height", tmpContentSize);
    }
	
		
	$('.filter_search').keyup(function() { 
        oTable.fnFilter($(this).val());	
	 jQuery(".main-body-content").css("height", tmpContentSize);
	 
    }).change(); 
	
	}
	
	// Add even listeners for the SHOW More/SHOW Less buttons
	// Faceted Search feature added 05/14
//	document.getElementById("results-box").addEventListener("click", function(e){
					
		//e.target was the clicked element
//		var el = e.target;
					
//		if(el && el.nodeName == "P") {						
			// Get the CSS classes
//			var classes = el.className.split(" ");
			// Search for the CSS class!
//			if(classes) {
				// For every CSS class the element has...
//				for(var x = 0; x < classes.length; x++) {
					// If it has the CSS class we want...
//					if(classes[x] == "showmore-btn" || classes[x] == "showless-btn") {
						// Navigate to the Parent element
//						while (el && el.nodeName != "TR") {
//							el = el.parentNode;
//						}
						// 
//						$(el).nextUntil('show-more-less').slideToggle(100);
//						$(el).toggleClass("clicked");
//									
//						if (classes[x] == "showmore-btn") {
//							$(e.target).toggle();
//							$(e.target.nextSibling).toggle();
//							$(e.target.nextSibling).toggleClass("clicked");
//							var totalSize = isWaiver ? jQuery("#results-box").height() : jQuery("#demo").height();
//							var containerHeight = jQuery(".page-title-inner").height();
//							var tmpContentSize = totalSize + containerHeight + "px";
//							jQuery(".main-body-content").css("height", tmpContentSize);
//							jQuery(".main-body").css("padding","10px;");
//							jQuery(".main-body-content").addClass("iefooterfix")							
//						}
//						else {
//							$(e.target).toggle();
//							$(e.target.previousSibling).toggle();
//							$(e.target.previousSibling).toggleClass("clicked");
//							var totalSize = isWaiver ? jQuery("#results-box").height() : jQuery("#demo").height();
//							var containerHeight = jQuery(".page-title-inner").height();
//							var morePaneHeight = jQuery(".more").height();
//							var tmpContentSize = totalSize + containerHeight - morePaneHeight + "px";
        	
//							jQuery(".main-body-content").css("height", tmpContentSize);
//							jQuery(".main-body").css("padding","10px;");
//							jQuery(".main-body-content").addClass("iefooterfix")							
//						}
//					}
//				}
//			}
//		} 
//	});
	
	function fnResetAllFilters(oTable) {
    var oSettings = oTable.fnSettings();
    for(iCol = 0; iCol < oSettings.aoPreSearchCols.length; iCol++) {
        oSettings.aoPreSearchCols[ iCol ].sSearch = '';
    }
	if (isWaiver == "true"){
		resetCheckBoxes();
	}

    oSettings.oPreviousSearch.sSearch = '';
    oTable.fnDraw();
}
	
	// Configure the reset button
	$('.reset_button').bind('click', function() { 
		$('.filter_search').val(""); 
		$('.filter_dropdown').attr('value','');
		fnResetAllFilters(oTable);
		jQuery(".main-body-content").css("height", tmpContentSize);
		}).change(); 
	
	$(window).bind('beforeunload', function () {
        $(".reset_button").click();
    }); 
	
	
    if (regex != null ) {

        oTable = $('#dynamic-list').dataTable({
            "sDom": '<"test"><"clear">irt<"clear">lp<"clear">',
            "bProcessing": true,
            "sAjaxSource": dataSource,
            "bDeferRender": true,
            "bAutoWidth": false,
            "aoColumns": customAOColumns,
            "aoColumnDefs": [
            { "bVisible": false, "aTargets": aTargets }
            ],
            "oSearch": { "sSearch": regex, "bRegex": true },
            "aaSorting": [[defaultSortCol, defaultSortOrder]],
            "bSortClasses": false,
            "bRetrieve": true,
            "sPaginationType": "full_numbers",
            "fnInitComplete": rowHandler,
            "fnDrawCallback": drawCallbackHandler
        });
		
    }
	
    // Sort and Filter Handling for Table
    if (qFilter != null && qSort != null) {

        oTable = $('#dynamic-list').dataTable({
            "sDom": '<"test"><"clear">irt<"clear">lp<"clear">',
            "bProcessing": true,
            "sAjaxSource": dataSource,
            "bDeferRender": true,
            "bAutoWidth": false,
            "aoColumns": customAOColumns,
            "aoColumnDefs": [
            { "bVisible": false, "aTargets": aTargets }
            ],
            "oSearch": { "sSearch": qFilter },
            "aaSorting": [[qSort, defaultSortOrder]],
            "bSortClasses": false,
            "bRetrieve": true,
            "sPaginationType": "full_numbers",
            "fnInitComplete": rowHandler,
            "fnDrawCallback": drawCallbackHandler
        });
    }

    if (qFilter != null && qSort == null) {

	
		if (isWaiver == "true") {
		

			oTable = $('#dynamic-list').dataTable({
				"sDom": '<"test"><"clear">ipr<t<"clear"><"results-container"><lp>>',
				"bProcessing": true,
				"sAjaxSource": dataSource,
				"bDeferRender": true,
				"bAutoWidth": false,
				"aoColumns": customAOColumns,
				"columnDefs": [
				{"targets": 5, "type": "statusSort"}
				],
				"iDisplayLength": 10,
				"aoColumnDefs": [
				{ "bVisible": false, "aTargets": aTargets }
				],
				"oSearch": { "sSearch": qFilter },
				"aaSorting": [[defaultSortCol, defaultSortOrder], [defaultSortCol2, defaultSortOrder2]], 
				"bSortClasses": false,
				"bRetrieve": true,
				"sPaginationType": "full_numbers",
				"oLanguage": { "oPaginate": {  "sPrevious": "&#60;Previous", "sNext": "Next>", "sInfoFiltered": "" }   },
				"fnInitComplete": rowHandler,
				"fnDrawCallback": drawCallbackHandler

			});
			initStateFilterFromUrl(qFilter);
			var i=1;
			
			
		} else {
		
			oTable = $('#dynamic-list').dataTable({
				"sDom": '<"test"><"clear">irt<"clear">lp<"clear">',
				"bProcessing": true,
				"sAjaxSource": dataSource,
				"bDeferRender": true,
				"bAutoWidth": false,
				"aoColumns": customAOColumns,
				"aoColumnDefs": [
				{ "bVisible": false, "aTargets": aTargets }
				],
				"oSearch": { "sSearch": qFilter },
				"aaSorting": [[defaultSortCol, defaultSortOrder]],
				"bSortClasses": false,
				"bRetrieve": true,
				"sPaginationType": "full_numbers",
				"fnInitComplete": rowHandler,
				"fnDrawCallback": drawCallbackHandler
			});
		}
    }

    if (qFilter == null && qSort != null) {

        oTable = $('#dynamic-list').dataTable({
            "sDom": '<"test"><"clear">irt<"clear">lp<"clear">',
            "bProcessing": true,
            "sAjaxSource": dataSource,
            "bDeferRender": true,
            "bAutoWidth": false,
            "aoColumns": customAOColumns,
            "aoColumnDefs": [
            { "bVisible": false, "aTargets": aTargets }
            ],
            "aaSorting": [[qSort, defaultSortOrder]],
            "bSortClasses": false,
            "bRetrieve": true,
            "sPaginationType": "full_numbers",
            "fnInitComplete": rowHandler,
            "fnDrawCallback": drawCallbackHandler
        });
    }

    if (qFilter == null && qSort == null) {

	if (isMEDSPA == "true" || isPharmacy == "true") {
        oTable = $('#dynamic-list').dataTable({
            "sDom": '<"test"><"clear">irt<"clear">lp<"clear">',
            "bProcessing": true,
            "sAjaxSource": dataSource,
            "bDeferRender": true,
            "bAutoWidth": false,
            "aoColumns": customAOColumns,
            "aoColumnDefs": [
            { "bVisible": false, "aTargets": aTargets }
            ],
            "aaSorting": [[defaultSortCol, defaultSortOrder], [defaultSortCol2, defaultSortOrder2]],
            "bSortClasses": false,
            "bRetrieve": true,
            "sPaginationType": "full_numbers",
            "fnInitComplete": rowHandler,
            "fnDrawCallback": drawCallbackHandler

        });

	} else {
	    var domS = '<"test"><"clear">irt<"clear">p<"clear">';
		if (isWaiver == "true") {
			oTable = $('#dynamic-list').dataTable({
				"sDom": '<"test"><"clear">ipr<t<"clear"><"results-container"><lp>>',
				"bProcessing": true,
				"sAjaxSource": dataSource,
				"bDeferRender": true,
				"bAutoWidth": false,
				"aoColumns": customAOColumns,
				"columnDefs": [
				{"targets": 5, "type": "statusSort"}
				],
				"iDisplayLength": 10,
				"aoColumnDefs": [
				{ "bVisible": false, "aTargets": aTargets }
				],
				"aaSorting": [[defaultSortCol, defaultSortOrder], [defaultSortCol2, defaultSortOrder2]], 
				"bSortClasses": false,
				"bRetrieve": true,
				"sPaginationType": "full_numbers",
				"oLanguage": { "oPaginate": {  "sPrevious": "&#60;Previous", "sNext": "Next>", "sInfoFiltered": "" }   },
				"fnInitComplete": rowHandler,
				"fnDrawCallback": drawCallbackHandler

			});
			var i=1;
		}
		else {		
			oTable = $('#dynamic-list').dataTable({
				"sDom": domS,
				"bProcessing": true,
				"sAjaxSource": dataSource,
				"bDeferRender": true,
				"bAutoWidth": false,
				"aoColumns": customAOColumns,
				"iDisplayLength": 10,
				"aoColumnDefs": [
				{ "bVisible": false, "aTargets": aTargets }
				],
				"aaSorting": [[defaultSortCol, defaultSortOrder]], 
				"bSortClasses": false,
				"bRetrieve": true,
				"sPaginationType": "full_numbers",
				"fnInitComplete": rowHandler,
				"fnDrawCallback": drawCallbackHandler

			});
			var i=1;
		}
		}	
    }

    // TODO: fix so I don't need to hard code the class name odd and even with the details-close if statement //
    // TODO: figure out to handle multiple lists if they have nested stuff inside - make them details //
    // TODO: make sub array searchable //

    /* Formating function for row details */
    function fnFormatDetails(oTable, nTr) {


	var waiverNum = null;
	var propertyFound = 0;

	$.each(waiverAuthorityInfo, function(property, value) {

            if (value != "") {

  		if (property.indexOf("Waiver") >= 0) {
		    waiverNum = value;
		}

            }

        });

	var sOut = "";

        $.each(stateInfo, function(property, value) {
            if (value != "") {
               if (property.indexOf("State Full") >= 0) {
                    sOut += "\t\t<h2 align='center'>Waivers Full Record</h2>\n";
					sOut += "\t\t<table id='hor-minimalist-b' summary="+ value + ">\n";
					sOut += "\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th scope='col'>State:</th>\n\t\t\t\t\t<th scope='col'>" + value + "</th>";
                }
               if (property.indexOf("Waiver Authority") >= 0) {
					sOut += "\n\t\t\t\t\t<th scope='col'>Authority:</th>\n\t\t\t\t\t<th scope='col'>" + value + "</th>";
                }
               if (property.indexOf("Status Order") >= 0)  {
			sOut += "";
                }
               else if (property.indexOf("Status") >= 0)  {
					sOut += "\n\t\t\t\t\t<th scope='col'>Status:</th>\n\t\t\t\t\t<th scope='col'>" + value + "</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n";
					sOut += "\t\t\t<tbody>\n\t\t\t\t<tr>";
                }

            }

        });

        $.each(programNameInfo, function(property, value) {

            if (value != "") {
		if (property.indexOf("Program Name") >= 0) {
			sOut += "\n\t\t\t\t\t<td colspan='2'>Program Name and Number</td>";
			sOut += "\n\t\t\t\t\t<td colspan='4'>" + value + "</td>\n\t\t\t\t</tr>\n";
		}
            }
	});

        $.each(detailedRowInfo[0], function(property, value) {
           
	   if(property != "") {
		if (property.indexOf("Download One Name") >= 0) {
                    	sOut += "\t\t\t\t<tr>\n\t\t\t\t\t<td rowspan='2'>Proposal Documents</td>\n";
		}
		else if (property.indexOf("Download One Path") >= 0) {
                    	sOut += "\n\t\t\t\t\t<td colspan='5'><a href='" + value + "' target='_blank'>" + value + "</a></td>\n\t\t\t\t</tr>\n";
		}
		else if (property.indexOf("Download Two Name") >= 0) {
                    	sOut += "";
		}
		else if (property.indexOf("Download Two Path") >= 0) {
                    	sOut += "\n\t\t\t\t\t<td colspan='5'><a href='" + value + "' target='_blank'>" + value + "</a></td>\n\t\t\t\t</tr>\n";
		}
                else if (property.indexOf("Download") >= 0 && property.indexOf("Name") >= 0) {
		    if (value != "") {
                    	sOut += "\t\t\t\t<tr>\n\t\t\t\t\t<td>" + value + "</td>\n";
			propertyFound = 1;
		    }
                } else if (property.indexOf("Download") >= 0 && property.indexOf("Path") >= 0) {
		    if (value == "" && propertyFound == 1){
			sOut += "\t\t\t\t\t<td colspan='5'>" +"  " + "</td>\n\t\t\t\t</tr>\n";
		    } else if (propertyFound == 1 && value != "" ){
                    	sOut += "\t\t\t\t\t<td colspan='5'><a href='" + value + "' target='_blank'>" + value + "</a>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n";
		    }
		    propertyFound=0;
                } else {
		    if (value != "") {
                        sOut += "\t\t\t\t\<tr>\n\t\t\t\t\t<td>" + property + "</td>\n\t\t\t\t\t<td colspan='5'>" + value + "</td>\n\t\t\t\t</tr>\n";
			propertyFound=0;
                    }
		}
           }
        });


        sOut += "\t\t\t</tbody>\n\t\t</table>\n";

        jQuery(".main-body-content").css("height", tmpContentSize);

         jQuery(".main-body-content").css("height", tmpContentSize);        
	 jQuery(".main-body").css("padding","10px;");
         jQuery(".main-body-content").addClass("iefooterfix")

        return sOut;

    }
	
		/* Formating function for Events & Announcements row details */
    function fnFormatDetailsEventsAnnounce(oTable, nTr) {

		var propertyFound = 0;
		var sOut = "";
		var eventType = "";

		/* Grab the event type for use in detail window */
        $.each(typeInfo, function(property, value) {
            if (value != "") {
               if (property.indexOf("Type") >= 0) {
                    eventType = value;
                }
            }
        });
		
		/* Add the header for the Table and the information for the State */
        $.each(titleInfo, function(property, value) {

            if (value != "") {

               if (property.indexOf("Title") >= 0) {
                    sOut += "\t\t<h1 align='center'>" + eventType + " Details for " + value + "</h2>\n";
					sOut += "\t\t<table id='hor-minimalist-b' summary="+ value + ">\n";
					sOut += "\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th scope='col' nowrap>Item</th>\n\t\t\t\t\t<th scope='col' nowrap>Detail</th>\n\t\t\t\t\t<th scope='col' nowrap>Type</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n";
					sOut += "\t\t\t<tbody>\n\t\t\t\t<tr>\t\t\t\t\t<td colspan='1'>Event Title</td>\n\t\t\t\t\t<td colspan='1'>" + value + "</td>\n\t\t\t\t\t<td colspan='1'>" + eventType + "</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>";
                }
            }
        });
		
		/* Add the State Plan Information */
        $.each(detailedRowInfo[0], function(property, value) {

            if (value != "") {
				if (property.indexOf("Description") >= 0) {
					sOut += "\n\t\t\t\t\t<td colspan='1'>Summary</td>";
					sOut += "\n\t\t\t\t\t<td colspan='2'>" + value + "</td>\n\t\t\t\t</tr>";
				}
				if (property.indexOf("When") >= 0) {
					sOut += "\n\t\t\t\t\t<td colspan='1'>Date</td>";
					sOut += "\n\t\t\t\t\t<td colspan='2'>" + value + "</td>\n\t\t\t\t</tr>";
				}
            }
		});
		
		sOut += "\n\t\t\t\t\t<tr>";
		
		/* Process the Detail Rows */
        $.each(detailedRowInfo[0], function(property, value) {
			if(property != "") {
                if (property.indexOf("Download") >= 0 && property.indexOf("Name") >= 0) {
					if (value != "") {
					    fieldName = value;
						propertyFound = 1;
					}
                } 
				else if (property.indexOf("Download") >= 0 && property.indexOf("Path") >= 0) {
					if (value == "" && propertyFound == 1){
						sOut += "\n\t\t\t\t\t<td colspan='1'>" + fieldName + "</td>";
					} 
					else if (propertyFound == 1 && value != "" ){
						sOut += "\n\t\t\t\t\t<td colspan='1'>" + fieldName + "</td>";
						sOut += "\n\t\t\t\t\t<td colspan='2'> <a href='" + value + "' target='_blank'>" + value + "</a></td>\n\t\t\t\t</tr>";
					}
					propertyFound = 0;
					fieldName=null;
				} 
			}
        }); 

        sOut += "\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n";

        jQuery(".main-body-content").css("height", tmpContentSize);

        jQuery(".main-body-content").css("height", tmpContentSize);        
		jQuery(".main-body").css("padding","10px;");
        jQuery(".main-body-content").addClass("iefooterfix")

        return sOut;

    }
	
	/* Formating function for FAQs details */
    function fnFormatDetailsFAQs(oTable, nTr) {

		var propertyFound = 0;
		var sOut = "";
		var eventType = "";

		/* Grab the event type for use in detail window */
        $.each(typeInfo, function(property, value) {
            if (value != "") {
               if (property.indexOf("Type") >= 0) {
                    eventType = value;
                }
            }
        });
		
		/* Add the header for the Table and the information for the State */
        $.each(titleInfo, function(property, value) {

            if (value != "") {

               if (property.indexOf("Title") >= 0) {
                    sOut += "\t\t<h1 align='center'>" + eventType + " Details for " + value + "</h2>\n";
					sOut += "\t\t<table id='hor-minimalist-b' summary="+ value + ">\n";
					sOut += "\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th scope='col' nowrap>Item</th>\n\t\t\t\t\t<th scope='col' nowrap>Detail</th>\n\t\t\t\t\t<th scope='col' nowrap>Type</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n";
					sOut += "\t\t\t<tbody>\n\t\t\t\t<tr>\t\t\t\t\t<td colspan='1'>Questions</td>\n\t\t\t\t\t<td colspan='1'>" + value + "</td>\n\t\t\t\t\t<td colspan='1'>" + eventType + "</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>";
                }
            }
        });
		
		/* Add the State Plan Information */
        $.each(detailedRowInfo[0], function(property, value) {

            if (value != "") {
				if (property.indexOf("Description") >= 0) {
					sOut += "\n\t\t\t\t\t<td colspan='1'>Answers</td>";
					sOut += "\n\t\t\t\t\t<td colspan='2'>" + value + "</td>\n\t\t\t\t</tr>";
				}
            }
		});
		
		sOut += "\n\t\t\t\t\t<tr>";
		
		/* Process the Detail Rows */
        $.each(detailedRowInfo[0], function(property, value) {
			if(property != "") {
                if (property.indexOf("Download") >= 0 && property.indexOf("Name") >= 0) {
					if (value != "") {
					    fieldName = value;
						propertyFound = 1;
					}
                } 
				else if (property.indexOf("Download") >= 0 && property.indexOf("Path") >= 0) {
					if (value == "" && propertyFound == 1){
						sOut += "\n\t\t\t\t\t<td colspan='1'>" + fieldName + "</td>";
					} 
					else if (propertyFound == 1 && value != "" ){
						sOut += "\n\t\t\t\t\t<td colspan='1'>" + fieldName + "</td>";
						sOut += "\n\t\t\t\t\t<td colspan='2'> <a href='" + value + "' target='_blank'>" + value + "</a></td>\n\t\t\t\t</tr>";
					}
					propertyFound = 0;
					fieldName=null;
				} 
			}
        }); 

        sOut += "\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n";

        jQuery(".main-body-content").css("height", tmpContentSize);

        jQuery(".main-body-content").css("height", tmpContentSize);        
		jQuery(".main-body").css("padding","10px;");
        jQuery(".main-body-content").addClass("iefooterfix")

        return sOut;

    }
	
	// TODO: fix so I don't need to hard code the class name odd and even with the details-close if statement //
    // TODO: figure out to handle multiple lists if they have nested stuff inside - make them details //
    // TODO: make sub array searchable //

    /* Formating function for CHIP SPA row details */
    function fnFormatDetailsCHIPSPAS(oTable, nTr) {


	var waiverNum = null;
	var propertyFound = 0;

	var sOut = "";

	var winTitle= "";

	if (isCHIPSPA == "true") {
		winTitle= "CHIP SPA Documents";
	}
	else if (isMEDSPA == "true") {
		winTitle= "MED SPA Documents";
	}

		/* Add the header for the Table and the information for the State */
        $.each(stateInfo, function(property, value) {

            if (value != "") {

               if (property.indexOf("State Full") >= 0) {
                    sOut += "\t\t<h2 align='center'> " + winTitle + " </h2>\n";
					sOut += "\t\t<table id='hor-minimalist-b' summary="+ value + ">\n";
					sOut += "\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th scope='col'>State:</th>\n\t\t\t\t\t<th scope='col'>" + value + "</th>\n\t\t\t\t</tr>\n\t\t\t</thead>\n";
					sOut += "\t\t\t<tbody>\n\t\t\t\t<tr>";
                }

            }

        });

		/* Add the State Plan Information */
        $.each(statePlanInfo, function(property, value) {

            if (value != "") {
				if (property.indexOf("State Plan") >= 0) {
					sOut += "\n\t\t\t\t\t<td class='stateinfo'>State Plan Information</td>";
					sOut += "\n\t\t\t\t\t<td>" + value + "</td>";
				}
            }
		});

		sOut += "\n\t\t\t\t</tr>";

		/* Add the SPA Number & Summary*/
		$.each(statusCHIPSPAInfo, function(property, value) {


            if (value != "") {
				if (property.indexOf("SPA Number") >= 0) {
					sOut += "\n\t\t\t\t\t<td class='stateinfo'>SPA Number and Summary</td>";
					sOut += "\n\t\t\t\t\t<td>" + value + "</td>";
				}
            }
		});

		sOut += "\n\t\t\t\t</tr>";

		/* Add the Status */
		$.each(statusCHIPSPAInfo, function(property, value) {

            if (value != "") {
				if (property.indexOf("Status") >= 0) {
					sOut += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td class='stateinfo'>Status</td>";
					sOut += "\n\t\t\t\t\t\<td>" + value + "</td>";
				}
            }
		});
		
		sOut += "\n\t\t\t\t</tr>";
		
		/* Add the Approval Date: */
		$.each(approvalDateCHIPSPAInfo, function(property, value) {

            if (value != "") {
				if (property.indexOf("Approval Date") >= 0) {
					sOut += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td class='stateinfo'>Approval date:</td>";
					sOut += "\n\t\t\t\t\t<td>" + value + "</td>";
				}
            }
		});
		
		sOut += "\n\t\t\t\t</tr>";
		
		/* Add the Effective Date: */
		$.each(effectiveDateCHIPSPAInfo, function(property, value) {

            if (value != "") {
				if (property.indexOf("Effective Date") >= 0) {
					sOut += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td class='stateinfo'>Effective date:</td>";
					sOut += "\n\t\t\t\t\t<td>" + value + "</td>";
				}
            }
		});

		
		/* Close out the general information and start the row for the Supporting documents */
		sOut += "\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class='stateinfo'>Supporting documents:</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<ul>\n";

        $.each(detailedRowInfo[0], function(property, value) {
			if(property != "") {
                if (property.indexOf("Download") >= 0 && property.indexOf("Name") >= 0) {
					if (value != "") {
					    fieldName = value;
						propertyFound = 1;
					}
                } 
				else if (property.indexOf("Download") >= 0 && property.indexOf("Path") >= 0) {
					if (value == "" && propertyFound == 1){
						sOut += "\n\t\t\t\t\t\t\t<li>" +fieldName + "</li>";
					} 
					else if (propertyFound == 1 && value != "" ){
                    	sOut += "\n\t\t\t\t\t\t\t<li><a href='" + value + "' target='_blank'>" + fieldName + "</a></li>";
					}
					propertyFound = 0;
					fieldName=null;
				} 
			}
        });


        sOut += "\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n";

        jQuery(".main-body-content").css("height", tmpContentSize);

         jQuery(".main-body-content").css("height", tmpContentSize);        
	 jQuery(".main-body").css("padding","10px;");
         jQuery(".main-body-content").addClass("iefooterfix")

        return sOut;

    }

	
   /* Add event listener for popping up the detail window
    * Note that the indicator for showing which row is open is not controlled by DataTables,
    * rather it is done here
	*
	* Modified 5/15 to remove references to Waivers. Waivers are now handled by the Faceted search specific functions
    */
	$("#dynamic-list tbody tr").live('click', function() {

        var nTr = this;
        detailedRowInfo = oTable.fnGetData(this, detailedColumn);
		//console.log("detailedRowInfo: " + JSON.stringify(detailedRowInfo, null, 4));
        stateInfo = oTable.fnGetData(this, stateColumn);
		programNameInfo = oTable.fnGetData(this, programNameColumn);
		waiverAuthorityInfo = oTable.fnGetData(this, waiverAuthorityColumn);
		statusInfo = oTable.fnGetData(this, statusColumn);
		statePlanInfo = oTable.fnGetData(this, statePlanInformationColumn);
		stateCHIPSPAInfo = oTable.fnGetData(this, stateCHIPSPAColumn);
		approvalDateCHIPSPAInfo = oTable.fnGetData(this, approvalDateCHIPSPAColumn);
		effectiveDateCHIPSPAInfo = oTable.fnGetData(this, effectiveDateCHIPSPAColumn);
		statusCHIPSPAInfo = oTable.fnGetData(this, statusCHIPSPAColumn);
		titleInfo = oTable.fnGetData(this, titleColumn);
		typeInfo = oTable.fnGetData(this, typeColumn);
		if (isWaiver == "true") {
			summaryInfo = oTable.fnGetData(this, "7");
			approvalDateInfo = oTable.fnGetData(this, "8");
			effectiveDateInfo = oTable.fnGetData(this, "9");
			expirationDateInfo = oTable.fnGetData(this, "10");
			downloadNameOneInfo = oTable.fnGetData(this, "11");
			downloadPathOneInfo = oTable.fnGetData(this, "12");
			downloadNameTwoInfo = oTable.fnGetData(this, "13");
			downloadPathTwoInfo = oTable.fnGetData(this, "14");
			downloadNameThreeInfo = oTable.fnGetData(this, "15");
			downloadPathThreeInfo = oTable.fnGetData(this, "16");
			downloadNameFourInfo = oTable.fnGetData(this, "17");
			downloadPathFourInfo = oTable.fnGetData(this, "18");
			downloadNameFiveInfo = oTable.fnGetData(this, "19");
			downloadPathFiveInfo = oTable.fnGetData(this, "20");
		}
        jQuery.fn.exists = function() { return jQuery(this).length > 0; } 

        /* If detail exist popup row details in a new window */
	if (detailedRowInfo[0] || isWaiver == "true") {
		if (document.title != "Federal Policy Guidance | Medicaid.gov") {
			/* Open the detail information in a seperate window */
            var mywindow = window.open("","WaiverDetails","width=800,height=750, scrollbars=yes, resizable=yes");
		}
        htmlCode="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>\n" +
                      "<html xmlns='http://www.w3.org/1999/xhtml'>\n" + 
                      "\t<head>\n" +
                      "\t\t<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />\n";  
	    var links = document.getElementsByTagName("link");
	    for (var l = 0; l < links.length; l++){
	       if(links[l].href.indexOf("tablestyle") >= 0){ 
  	          htmlCode += "\t\t<link href='" + links[l].href + "' rel='" + links[l].rel + "' type='" + links[l].type + "'>\n";
	       } 
		   
	    } 
		htmlCode +="<script type='text/javascript'>\n var _gaq = _gaq || [];\n _gaq.push(['_setAccount', 'UA-48753020-1']);\n _gaq.push(['_trackPageview']);\n  (function() {\n    var ga = document.createElement('script');\n ga.type = 'text/javascript';\n ga.async = true;\n    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\n    var s = document.getElementsByTagName('script')[0];\n s.parentNode.insertBefore(ga, s);\n  })();\n</script>\n";
			var scripts = document.getElementsByTagName("script");
			for (var s = 0; s < scripts.length; s++){
				if(scripts[s].src.indexOf("ga-track-downloads") >= 0 || scripts[s].src.indexOf("jquery-") >= 0){ 
					htmlCode += "\t\t<script type='text/javascript' src='" + scripts[s].src + "'></script>\n";
					} 
			} 
            htmlCode += "\t</head>\n" + "\t<body>\n";
		if (isEventsAnnounce == "true")
		{
			htmlCode += "\t\t<title>Events & Announcements Details</title>\n";  
			htmlCode += fnFormatDetailsEventsAnnounce(oTable, nTr);
		}
		else if (isFAQs == "true")
		{
				htmlCode += "\t\t<title>FAQ Medicaid and CHIP Affordable Care Act (ACA) Implementation Details</title>\n";  
				htmlCode += fnFormatDetailsFAQs(oTable, nTr);
		}
		else if (isCHIPSPA == "true")
		{
			htmlCode += "\t\t<title>CHIP SPA Details</title>\n";  
			htmlCode += fnFormatDetailsCHIPSPAS(oTable, nTr);
		}
		else if (isMEDSPA == "true")
		{
			htmlCode += "\t\t<title>MED SPA Details</title>\n";  
			htmlCode += fnFormatDetailsCHIPSPAS(oTable, nTr);
		}
		else if (isWaiver == "true")
		{
			htmlCode += "\t\t<title>Waiver Details</title>\n";  
			htmlCode += fnFormatDetailsWaivers(oTable, nTr);
		}
//		else
//		{
//			htmlCode += "\t\t<title>Waiver Details</title>\n";  
//			htmlCode += fnFormatDetails(oTable, nTr);
//		}
		htmlCode += "<script>\n\t$(\"a[href$='pdf']\").each(function(index) {\n\t\tpdfLabel = $(this).attr('href');\n\t\tpdfOnClick = \"_gaq.push(['_trackEvent', 'PDF', 'Download', '\" + pdfLabel + \"']);\";\n\t\t$(this).attr(\"onClick\", pdfOnClick);\n});\n</script>";
		htmlCode += "\t</body>\n</html>";
	    mywindow.document.write(htmlCode);
	    mywindow.document.close(); 
	  } else { 
	        _gaq.push(['_trackEvent', 'PDF', 'Download', detailedRowInfo]); 
            window.open(detailedRowInfo);
        }

        jQuery(".main-body-content").css("height", tmpContentSize);

    }); 

}); 

// Construct the Waiver enties for the Faceted Search results.
// New Functionality add for faceted search - 5/14
function displayWaiverData(nFiltered, startRow, numRows)
{
    var htmlString ="";
	var nrows = (numRows <= nFiltered.length) ? numRows : nFiltered.length;
	
	// Add the first hald of the results pane.
	htmlString += "<div class='results-container' id='results-container'>\n\t";
	
	//Process each row of the results pane one at a time.
	var n = 1;
	for(var i=startRow; i < nrows; i++)
	{
		var waiverData 			= nFiltered[i].children[2].textContent;
		var statusData 			= nFiltered[i].children[4].textContent;
		var programData		 	= nFiltered[i].children[3].textContent;
		var stateData 			= nFiltered[i].children[0].textContent; 
		var approvalDateData 	= nFiltered[i].children[7].textContent;
		var effectiveDateData 	= nFiltered[i].children[8].textContent;
		var expirationDateData 	= nFiltered[i].children[9].textContent;
		var pendingDocsData 	= nFiltered[i].children[10].textContent;
		var currentDocsData 	= nFiltered[i].children[11].textContent;
		var adminDocsData 		= nFiltered[i].children[12].textContent;
		
		// Process the Waiver Authority
		htmlString += "<div class='dl-results'>\n\t<table class='dl-results'>\n\t\t<tbody>\n\t\t\t<tr>\n\t\t\t\t<td><strong>Waiver Authority:</strong>" +  waiverData + "</td>";
		
		// Process the Status
		htmlString += "\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t\t<td><strong>Status:</strong> <span class='status'>" + statusData + "</span></td>\n\t\t\t</tr>";
		
		//Process the Program Name
		htmlString += "\n\t\t\t<tr>\n\t\t\t\t<td>\n\t\t\t\t\t<span class='program-label'>\n\t\t\t\t\t\t<p>Program Name and Number:</p>\n\t\t\t\t\t</span>\n\t\t\t\t</td>";
		htmlString += "\n\t\t\t\t<td>\n\t\t\t\t\t<span class='program-name'>\n\t\t\t\t\t\t<p>" + programData + "</p>\n\t\t\t\t\t</span>\n\t\t\t\t</td>";
		htmlString += "\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t</tr>";
		
		// Process State and Show More button
		htmlString += "\n\t\t\t<tr class='show-more-less'>\n\t\t\t\t<td><strong>State:</strong> " + stateData + "</td>";
		htmlString += "\n\t\t\t\t<td>&nbsp;</td>";
		htmlString += "\n\t\t\t\t<td><p class='showmore-btn' id='showmorebtn"+n+"'>Show More</p><p class='showless-btn' style='display:none' id='showlessbtn"+n+"'>Show Less</p></td>\n\t\t\t</tr>";

		
		// Process the more pane	
		htmlString += "\n\t\t\t<tr class='more-pane'>\n\t\t\t\t<td colspan='3'>";
		htmlString += "\n\t\t\t\t\t<table width='100%'>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th colspan='2'>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<img src='/resources/images/dynamic-lists/calendar-icon.png' width='26' height='21' alt='calendar icon'>Waiver Dates</img>";
		htmlString += "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t</tr>";
		
		// Process the Approval Date
		htmlString += "\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td width='15%'><strong>Approval:</strong></td>\n\t\t\t\t\t\t\t<td width='85%'>" + approvalDateData + "</td>\n\t\t\t\t\t\t</tr>";

		// Process the Effective Date
		htmlString += "\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><strong>Effective:</strong></td>\n\t\t\t\t\t\t\t<td>" + effectiveDateData + "</td>\n\t\t\t\t\t\t\</tr>";
		
		//Process the Expiration Date	
		htmlString += "\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><strong>Expiration:</strong></td>\n\t\t\t\t\t\t\t<td>" + expirationDateData + "</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</table>";
						
		htmlString += "\n\t<br />";
		
		// Process the supporting documents section
		htmlString += "\n\t\t\t<table width='100%'>";
		
		// Supporting documents header
		htmlString += "\n\t\t\t\t<tr>\n\t\t\t\t\t<th>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\<img src='/resources/images/dynamic-lists/filebox-icon.png' width='25' height='23' alt='file box icon'>Supporting Document(s)</img>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</th>\n\t\t\t\t</tr>";

		// Process Pending Docs
		if (pendingDocsData !=""){
		
		    var strVals = pendingDocsData.split(", ");
			if (strVals[0] != "No Value")
			{
				htmlString += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<h3>Pending Application(s) &amp; Related Document(s)</h3>\n\t\t\t\t\t\t\t<div class='documents'>\n\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<th width='110'>Document Date</th>\n\t\t\t\t\t\t\t\t\t\t<th width='245'><span class='doc-title'>Title</span></th>\n\t\t\t\t\t\t\t\t\t\t<th width='159'>&nbsp;</th>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</table>";
				htmlString += "\n\t\t\t\t\t\t\t\t<div class='scroll'>\n\t\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t\t";
				for(var x=0; x < strVals.length; x += 4){
					var dateNoTime = strVals[x].split(" ");
					var newDate = "";
					if (dateNoTime[0] != "") {
						var dateVals = dateNoTime[0].split("-");
						newDate = dateVals[1] + "/" + dateVals[2] + "/" + dateVals[0];
					}
					htmlString += "<tr>\n\t\t\t\t\t\t\t\t\t\t<td width='110'>" + newDate + "</td>\n\t\t\t\t\t\t\t\t\t\t<td width='245'>\n\t\t\t\t\t\t\t\t\t\t<span class='doc-title'>";
					htmlString += "\n\t\t\t\t\t\t\t\t\t\t\t\t<a href='" + strVals[x+2] + "' target='_blank'>" + strVals[x+1] + "</a>";
					htmlString += "\n\t\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t</td>";
					if (strVals[x+3] != "") {
						htmlString += "\n\t\t\t\t\t\t\t\t\t\t<td width='159'><a class='comment-btn' href='" + strVals[x+3] + "' target='_blank'>View/Submit Comments</a></td>";
					}
					else {
						htmlString += "\n\t\t\t\t\t\t\t\t\t\t<td width='159'>&nbsp;</td>";
					}
				}
				htmlString += "\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t</div>";
				htmlString += "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<!--scroll doc table-->\n\t\t\t\t</tr>";
			}
		}
		
		// Process Current Docs
		if (currentDocsData != ""){
			var strVals = currentDocsData.split(", ");
			var validEntries = "false";
			for(var x = 0; x < strVals.length; x ++){
				if (strVals[x] != "No Value")
					validEntries = "true";
					
			}
			
			if(validEntries == "true")
			{
				htmlString += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<h3>Approved Application(s) &amp; Related Document(s)</h3>\n\t\t\t\t\t\t\t<div class='documents'>\n\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<th width='110'>Document Date</th>\n\t\t\t\t\t\t\t\t\t\t<th width='245'><span class='doc-title'>Title</span></th>\n\t\t\t\t\t\t\t\t\t\t<th width='159'>&nbsp;</th>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</table>";
				htmlString += "\n\t\t\t\t\t\t\t\t<div class='scroll'>\n\t\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t\t";
				for(var x = 0; x < strVals.length; x += 3){
					var dateNoTime = strVals[x].split(" ");
					var newDate = "";
					if (dateNoTime[0] != "") {
						var dateVals = dateNoTime[0].split("-");
						newDate = dateVals[1] + "/" + dateVals[2] + "/" + dateVals[0];
					}

					if (strVals[x+2] != "") { 
						htmlString += "<tr>\n\t\t\t\t\t\t\t\t\t\t<td width='110'>" + newDate + "</td>\n\t\t\t\t\t\t\t\t\t\t<td width='245'>\n\t\t\t\t\t\t\t\t\t\t<span class='doc-title'>";
						htmlString += "\n\t\t\t\t\t\t\t\t\t\t\t\t<a href='" + strVals[x+2] + "' target='_blank'>" + strVals[x+1] + "</a>";
						htmlString += "\n\t\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t<td width='159'>&nbsp;</td>\n\t\t\t\t\t\t\t\t\t</tr>";
					}
				}
				htmlString += "\n\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t</div>";
				htmlString += "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<!--scroll doc table-->\n\t\t\t\t</tr>";	
			}
		}
	
		// Process Admin Docs
		var adminDocs = new Array();
		if (adminDocsData !=""){
			var strVals = adminDocsData.split(", ");
			if (strVals[0] != "No Value")
			{
				htmlString += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<h3>Administrative Record</h3>\n\t\t\t\t\t\t\t<div class='documents'>\n\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<th width='110'>Document Date</th>\n\t\t\t\t\t\t\t\t\t\t<th width='245'><span class='doc-title'>Title</span></th>\n\t\t\t\t\t\t\t\t\t\t<th width='159'>&nbsp;</th>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</table>";
				htmlString += "\n\t\t\t\t\t\t\t\t<div class='scroll'>\n\t\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t\t";
				var adminCount = 0;
				for(var x=0; x < strVals.length; x += 3){
					var dateNoTime = strVals[x].split(" ");
					var newDate = "";
					var dateObj;
					if (dateNoTime[0] != "") {
						var dateVals = dateNoTime[0].split("-");
						newDate = dateVals[1] + "/" + dateVals[2] + "/" + dateVals[0];
						dateObj = new Date(dateVals[0],dateVals[1],dateVals[2]);
					} else {
						var dateVals = ["","",""];
						newDate = "";
						dateObj = null;
					}
					// Store each admin doc into an array. Each entry has:
					// (0):the original index into the string; 
					// (1):the date string to display, 
					// (2):the date object to sort on
					adminDocs[adminCount] = [x,newDate, dateObj];
					adminCount++;
					
					
				}
				// Sort the dates
				adminDocs.sort(function admin_doc_sort_desc(e1,e2) {
					if (e1[2]> e2[2]) return -1;
					if (e1[2] < e2[2]) return 1;
					return 0;
				});
				
				// Write out to the table now that the admin docs are ordered
				for (var y=0; y < adminDocs.length; y += 1) {
					htmlString += "<tr>\n\t\t\t\t\t\t\t\t\t\t<td width='110'>" + adminDocs[y][1] + "</td>\n\t\t\t\t\t\t\t\t\t\t<td width='245'>\n\t\t\t\t\t\t\t\t\t\t<span class='doc-title'>";
					htmlString += "\n\t\t\t\t\t\t\t\t\t\t\t\t<a href='" + strVals[adminDocs[y][0]+2] + "' target='_blank'>" + strVals[adminDocs[y][0]+1] + "</a>";
					htmlString += "\n\t\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t<td width='159'>&nbsp;</td>\n\t\t\t\t\t\t\t\t\t</tr>";
				}
				htmlString += "\n\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t</div>";
				htmlString += "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<!--scroll doc table-->\n\t\t\t\t</tr>";
			}
		}
		htmlString += "\n\t\t\t</table>\n\t\t\t<!--close details table-->\n\t\t</tr>\n\t</tbody>\n\t</table>\n\t</div>";	

		n++;
	}
	htmlString += "\n</div>\n<script>_gaq.push(['_trackEvent', 'PDF', 'Download', detailedRowInfo]);</script>";
	
	// Return the new HTML for the results pane
	return htmlString;
}


/* IE Browser Hack for dynamic table and footer issue */

 function contentHeight() {
    var tableHeight;
    if(typeof isWaiver !== undefined)
		tableHeight = jQuery("#results-box").height()
	else
		tableHeight = jQuery("#demo").height();
    var containerHeight = jQuery(".page-title-inner").height();
    var tobalHeight = tableHeight + containerHeight;
    var tmpContentSize = tobalHeight + "px";
    jQuery(".main-body-content").css("height", tmpContentSize);
}
jQuery("select").ready(function() { jQuery("select").change(function() { contentHeight(); }) }); 

/* Return the list of filtered nodes in the DataTable */
/* Added for faceted search - 5/15 */
$.fn.dataTableExt.oApi.fnGetFilteredNodes = function ( oSettings ) 
{
	var anRows = [];
 
	for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
	{
		var nRow = oSettings.aoData[ oSettings.aiDisplay[i] ].nTr;
		anRows.push( nRow );
	}
 
	return anRows;
}; 

// Custom sorting methods for the Status field. Allows status values to be sorted in the following order (Pending, Approved, Dissapproved, Expired, Withdrawn)
// Added for faceted search - 5/15 
jQuery.extend( jQuery.fn.dataTableExt.oSort, {	
	"statusSort-asc": function ( a, b ) {
		var retVal;
		
		if (a == "Pending" && b != "Pending")
			retVal = -1;
		else if (a == "Pending" && b == "Pending")
			retVal = 0;
		else if (a != "Pending" && b == "Pending")
			retVal = 1;
		else if (a != "Pending" && b != "Pending")
			retVal = (a < b) ? -1 : ((a > b) ? 1 : 0);
		return retVal;
	},	
	"statusSort-desc": function ( a, b ) {
		var retVal;
		
		if (a == "Pending" && b != "Pending")
			retVal = 1;
		else if (a == "Pending" && b == "Pending")
			retVal = 0;
		else if (a != "Pending" && b == "Pending")
			retVal = -1;
		else if (a != "Pending" && b != "Pending")
			retVal = (a < b) ? 1 : ((a > b) ? -1 : 0);
		return retVal;	
	}
});


function resetCheckBoxes() {
	var checkBoxes = document.querySelectorAll("input[type=checkbox]");
	
	for(var i =0; i < checkBoxes.length; i++) {
		checkBoxes[i].checked = "true";
	}

}