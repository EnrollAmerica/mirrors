jQuery(document).ready(function ($) {

    // initialize DataTable #
    var table = $("#excludedDrugCoverageTable").DataTable({
        "ajax": {"url": "/resources/data/pharmacy-downloads.json", "dataSrc": "aaData"},
        "columns": [
            { "data": "Year" },
            { "data": "State Full Name" },
            { "data": "Data Report" },
            { "data": "Title" }
        ],
        "order": [[ 1, "asc" ]],
        "pageLength": 25,
        "columnDefs": [
            { "visible": false,  "targets": [ 2 ] }
        ],
        initComplete: function () {
            this.api().columns([0, 1]).every(function () {
                var column = this;
                var select = $('<select class="dropdown"><option value="">All</option></select>')
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
                if (column.index() === 0) {
                    // reverse sort unique years
                    column.data().unique().sort().reverse().each(function (data) {
                        select.append('<option value="' + data + '">' + data + '</option>');
                    });
                }
                if (column.index() === 1) {
                    // sort unique state names 
                    column.data().unique().sort().each(function (data) {
                        if (data !== 'National Summary') {
                            select.append('<option value="' + data + '">' + data + '</option>');
						}
                    });
                }
				
            });
            var row = $('#excludedDrugCoverageTable tfoot tr');
            row.find('th').each(function () {
                $(this).css('padding', 8);
            });
            $('#excludedDrugCoverageTable thead').append(row);
            // hide duplicate header text for column without filters
            $("tr:nth-of-type(2) th:nth-of-type(3)").css('font-size', '0');
            // hide text: "(filtered from X total entries)"
            $('div#excludedDrugCoverageTable_info').html($('div#excludedDrugCoverageTable_info').html().replace(/\(filtered from (.*?) total entries\)/, ""));
        }
    });

    //Filter data, just show one type of record
    table.column(2).search('Excluded Drug Coverage').draw();
});