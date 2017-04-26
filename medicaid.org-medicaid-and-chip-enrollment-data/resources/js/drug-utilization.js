jQuery(document).ready(function ($) {
    // initialize DataTable #
    $("#drugUtilizationDataTable").DataTable({
        "ajax": {"url": "/resources/data/drug-utilization.json", "dataSrc": "aaData"},
        "columns": [
            { "data": "Name" },
            { "data": "Year" },
            { "data": "View" }
        ],
        "columnDefs": [{
            //make col 0 text a link
            "render": function (data, type, row) {
                return '<a href="' + row.Link + '"  target="_blank">' + data + '</a>';
            },
            "targets": 0
        }],
        "order": [[ 1, "desc" ]],
        "pageLength": 25,
        initComplete: function () {
            this.api().columns().every(function () {
                var column = this;
                var selectText;
                if (column.index() === 2) {
                    selectText = '<select class="dropdown"><option value="">All</option><option value="Entire Dataset">Entire Dataset</option><option value="National Totals">National Totals</option></select>';
                } else {
                    selectText = '<select class="dropdown"><option value="">All</option></select>';
                }
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
                if (column.index() === 1) {
                    // don't sort, keep as is: reverse sort
                    column.data().unique().each(function (data) {
                        select.append('<option value="' + data + '">' + data + '</option>');
                    });
                }
                if (column.index() === 2) {
                    // sort unique state names but don't add view/state types
                    column.data().unique().sort().each(function (data) {
                        if (!(data === 'Entire Dataset' || data === 'National Totals')) {
                            select.append('<option value="' + data + '">' + data + '</option>');
                        }
                    });
                }
            });
            var row = $('#drugUtilizationDataTable tfoot tr');
            row.find('th').each(function () {
                $(this).css('padding', 8);
            });
            $('#drugUtilizationDataTable thead').append(row);
            $("th select:first").css('display', 'none');
        }
    });
});


