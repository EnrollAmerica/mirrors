"use strict";

//Needed because IE does not support startsWith()
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return !this.indexOf(str);
    }
}

// Note: I was not able to figure out how to get data directly in the displayTable function with an Ajax call. 
// So I do a two-step operation instead of a one-step operation. Step 1: The get function queries the Socrata catalog and populates dataSet (an array of records). 
// Step 2: The displayTable function reads dataSet and displays the table.
var nadacData = {
    dataSet: [],
    get: function () {
        var url = "//api.us.socrata.com/api/catalog/v1?search_context=data.medicaid.gov&tags=nadac&only=filters&limit=1000";		           
        $.getJSON(url, function (result) {
            //console.log(result.resultSetSize);
            //console.log(result.results[0]);
            //console.log(result.results[0].resource.parent_fxf);
            $.each(result.results, function (i, record) {
                if (record.resource.parent_fxf.indexOf("a4y5-998d") >= 0 && record.resource.name.startsWith("NADAC as of ")) {
                    var newRecord = {
                        //name: record.resource.name,
                        name: "NADAC",
                        Link: record.link,
                        year: nadacData.getYear(record.resource.name),
                        date: nadacData.getDate(record.resource.name),
                        month: dateUtility.getMonthString(nadacData.getMonth(record.resource.name))
                    };
                    //console.log(newRecord);
                    nadacData.dataSet.push(newRecord);
                }
            });
            //console.log("data load complete " + nadacData.dataSet.length + " records");
            nadacData.displayTable();
        });
    },
    getYear: function (name) {
        if (name.length >= 16) {
            return name.slice(12, 16);
        }
    },
    getMonth: function (name) {
        if (name.length >= 19) {
            return name.slice(17, 19);
        }
    },
    getDate: function (name) {
        if (name.length >= 22) {
            return name.slice(12, 22);
        }
    },
    //display for debugging
    display: function () {
        var index;
        for (index = 0; index < nadacData.dataSet.length; index++) {
            console.log(nadacData.dataSet[index]);
        }
        console.log(nadacData.dataSet.length + " records");
    },
    displayTable: function () {
        //console.log(nadacData.dataSet.length + " records");
        var tablePrice = $("#nadacdatatable").DataTable({
            data: nadacData.dataSet,
            columns: [
                {data: "name", title: "Name"},
                //{ title: "Link" },
                {data: "year", title: "Year"},
                {data: "month", title: "Month"},
                {data: "date", title: "Date"}
            ],
            "columnDefs": [{
                //make col 0 text a link
                "render": function (data, type, row) {
                    return '<a href="' + row.Link + '"  target="_blank">' + data + '</a>';
                },
                "targets": 0
            }],
            "order": [[3, "desc"]],
            "pageLength": 10,
            initComplete: function () {
                this.api().columns().every(function () {
                    var column = this;
                    var selectText = '<select class="dropdown"><option value="">All</option></select>';
                    var select = $(selectText)
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });
                    // add values to dropdown filters
                    column.data().unique().sort().each(function (data) {
                        select.append('<option value="' + data + '">' + data + '</option>');
                    });
                });
                var row = $('#nadacdatatable tfoot tr');
                row.find('th').each(function () {
                    $(this).css('padding', 8);
                });
                $('#nadacdatatable thead').append(row);
            }
        });
        //Filter data, just show one type of record
        //tablePrice.column(0).search('NADAC').draw();
    }
};

var nadacComparison = {
    dataSet: [],
    get: function () {
        var url = "//api.us.socrata.com/api/catalog/v1?search_context=data.medicaid.gov&tags=nadac&only=filters&limit=1000";
        $.getJSON(url, function (result) {
            $.each(result.results, function (i, record) {
                if (record.resource.parent_fxf.indexOf("6gk3-9bxc") >= 0 && record.resource.name.startsWith("NADAC Comparison as of ")) {
                    var newRecord = {
                        name: "NADAC Comparison",
                        Link: record.link,
                        year: nadacComparison.getYear(record.resource.name),
                        date: nadacComparison.getDate(record.resource.name),
                        month: dateUtility.getMonthString(nadacComparison.getMonth(record.resource.name))
                    };
                    nadacComparison.dataSet.push(newRecord);
                }
            });
            nadacComparison.displayTable();
        });
    },
    getYear: function (name) {
        if (name.length >= 27) {
            return name.slice(23, 27);
        }
    },
    getMonth: function (name) {
        if (name.length >= 30) {
            return name.slice(28, 30);
        }
    },
    getMonthString: function (name) {
        var monthNumber = this.getMonth(name);
        if (monthNumber >= 1 && monthNumber <= 12) {
            return this.months[monthNumber];
        }
    },
    getDate: function (name) {
        if (name.length >= 33) {
            return name.slice(23, 33);
        }
    },
    display: function () {
        var index;
        for (index = 0; index < nadacComparison.dataSet.length; index++) {
            console.log(nadacComparison.dataSet[index]);
        }
    },
    displayTable: function () {
        var tablePrice = $("#nadac-comparison-table").DataTable({
            data: nadacComparison.dataSet,
            columns: [
                {data: "name", title: "Name"},
                //{ title: "Link" },
                {data: "year", title: "Year"},
                {data: "month", title: "Month"},
                {data: "date", title: "Date"}
            ],
            "columnDefs": [{
                //make col 0 text a link
                "render": function (data, type, row) {
                    return '<a href="' + row.Link + '"  target="_blank">' + data + '</a>';
                },
                "targets": 0
            }],
            "order": [[3, "desc"]],
            "pageLength": 10,
            initComplete: function () {
                this.api().columns().every(function () {
                    var column = this;
                    var selectText = '<select class="dropdown"><option value="">All</option></select>';
                    var select = $(selectText)
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });
                    // add values to dropdown filters
                    column.data().unique().sort().each(function (data) {
                        select.append('<option value="' + data + '">' + data + '</option>');
                    });
                });
                var row = $('#nadac-comparison-table tfoot tr');
                row.find('th').each(function () {
                    $(this).css('padding', 8);
                });
                $('#nadac-comparison-table thead').append(row);
            }
        });
        //Filter data, just show one type of record
        //tablePrice.column(0).search('NADAC').draw();
    }
};

jQuery(document).ready(function ($) {
    
    // initialize DataTable #
    var tableUpperLimits = $("#federal-upper-limits-table").DataTable({
        "ajax": {"url": "/resources/data/federal-upper-limits.json", "dataSrc": "aaData"},
        "columns": [
            { "data": "Type" },
            { "data": "Year" },
            { "data": "Month" },
            { "data": "Date" }
        ],
        "columnDefs": [{
            //make col 0 text a link
            "render": function (data, type, row) {
                return '<a href="' + row.Link + '"  target="_blank">' + data + '</a>';
            },
            "targets": 0
        }],
        "order": [[ 3, "desc" ]],
        "pageLength": 10,
        initComplete: function () {
            this.api().columns().every(function () {
                var column = this;
                var selectText = '<select class="dropdown"><option value="">All</option></select>';
                var select = $(selectText)
                    .appendTo($(column.footer()).empty())
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });
                // add values to dropdown filters
                column.data().unique().sort().each(function (data) {
                    select.append('<option value="' + data + '">' + data + '</option>');
                });
            });
            var row = $('#federal-upper-limits-table tfoot tr');
            row.find('th').each(function () {
                $(this).css('padding', 8);
            });
            $('#federal-upper-limits-table thead').append(row);
        }
    });

    //Filter data, just show one type of record
    tableUpperLimits.column(0).search('Federal Upper Limits').draw();

    nadacData.get();
    nadacComparison.get();
});

var dateUtility = {
    months: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    getMonthString: function (monthNumber) {
        var monthInt = parseInt(monthNumber);
        if (monthInt >= 1 && monthInt <= 12) {
            return this.months[monthInt];
        } else {
          //console.error("Error in getMonthString: " + monthInt);
        }
    }
};
