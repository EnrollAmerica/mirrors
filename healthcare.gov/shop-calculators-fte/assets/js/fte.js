$(document).ready(function () {

    $($('#wrapper .pull-left .nav-btn:first')).addClass('active1');

    ///////////////////////////////////////////

    var calc_template = $("#fte-calc").html();
    $("#fte-calc-target").html(_.template(calc_template, lang.phrases));

    var worksheet_template = $("#fte-worksheet").html();
    $("#fte-worksheet-target").html(_.template(worksheet_template, lang.phrases));


    var learn_fte_template = $("#learn-fte-content").html();
    $("#learn-fte-content-target").html(_.template(learn_fte_template, lang.phrases));

    var popover_template = $("#popover-content").html();
    $("#popover-content-target").html(_.template(popover_template, lang.phrases));

    $("#learn-fte-content-target").hide();
    $("#popover-content-target").hide();
    //////////////////////////////////////////

    // Add an employee row to the container that it is called on.
    // Example: $('#rows').appendRow(3);
    $.fn.appendRow = function (id) {
        this.append(
            "<tr class='employee'>" +
            "<td>" + id + ".</td><td><input type='text' class='form-control' style='width: 100%' placeholder=" + lang.t('worksheet_emp') + "></td>" +
            "<td><div class='form-group has-feedback'>" +
            "<input type='text' class='employee-hours form-control' />" +
            "<span class='hours-info glyphicon form-control-feedback'></span>" +
            "</td><td>" +
            "<a href='javascript:;' onclick='removeLine(this); return false;' title='" + lang.t('worksheet_remove') + "' alt='"+lang.t('worksheet_remove')+"' class='removeEmployee action-link'>" + lang.t('worksheet_remove') + "</a>" +
            "</td></tr>"
        );

        $(this).find('tr.employee:last input:first').focus();

        $(this).find('.employee-hours').unbind().keyup(function () {
            $('#total-hours').val(sumPtHours());
            validateEmployeeHours(this);
        });

        return this;
    };

    // Resets the form and worksheet
    $('#clear').on('click', function () {
        $('#fte, #pte').val('');
        $('#num-employees').val('1');
        $('#result').text('');
        $('#employees .employee').remove();
        $('#employees').appendRow(1);
        $("#entry-method-1, #entry-method-2").prop("checked", false);
        $("#entry-method-0").prop("checked", true);
        $("#entry-method-1-lbl, #entry-method-2-lbl").removeClass("active");
        $("#entry-method-0-lbl").addClass("active");
        $("#total-hours").val('');
        $('.clear-btn').addClass('hidden');
        calcMethod = calcMethods.WEEKLY;
        updatePteLabel();
        $('#calc').valid();
        validateNumEmployees($('#num-employees'));
    });

    $('#pte').on('click', function() {
        $('#worksheet-modal').modal('show');
    });

    $.validator.setDefaults({
        highlight: function (element) {
            $(element).closest('.question').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.question').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-append').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    $("#calc").validate({
        rules: {
            fte: {
                integer: true,
                min: 0
            },
            pte: {
                integer: true,
                min: 0
            }
        },
        messages: {
            fte: {
                min: lang.t('worksheet_fulltime_non_negative'),
                integer: lang.t('worksheet_fulltime_whole')
            },
            pte: {
                min: lang.t('worksheet_parttime_non_negative'),
                integer: lang.t('worksheet_parttime_whole')
            }
        }
    });

    $("#worksheet-form").validate({
        rules: {
            numemployees: {
                min: 0,
                integer: true
            }
        },
        messages: {
            numemployees: {
                min: lang.t('worksheet_pt_emp_non_negative'),
                integer: lang.t('worksheet_pt_emp_non_negative')
            }
        }
    });

    // Call doCalc() at page load in case someone has visited,
    // entered values, clicked back and then forward in the browser
    // This has to happen after validation is set up
    doCalc();

    $('#fte, #pte').keyup(function () { doCalc() });

    $('#entry-method').click(function (event) {
        calcMethod = $(event.target).find('input').val();
        $('#employees .employee-hours').each(function (idx, el) {
            validateEmployeeHours(el);
        });
        $('#total-hours').val(sumPtHours());
    });

    $('#copy-worksheet').click(function () {
        calcMethod = Number($('input[name=entry-method]:checked').val());

        // Find the first .employee-hours with an error
        var err = $('#employees .error').first();
        if (err.length > 0) {
            err[0].scrollIntoView(true);
            return false;
        }

        $('#pte').val(sumPtHours());

        updatePteLabel();

        doCalc();

        $('#worksheet-modal').modal('hide');
    });

    $("#fill").click(function () {
        var employees = Number($("#num-employees").val());

        if (employees > MAX_ROWS) employees = MAX_ROWS;
        if (employees < 1) employees = 1;

        $("#num-employees").val(employees);

        var rows = $("#employees .employee").length;
        for (var i = rows + 1; i <= employees; i++) {
            $("#employees tbody").appendRow(i);
        }

        if (employees < rows) {
            $("#employees tbody").find("tr:nth-last-child(-n+" + (rows - employees) + ")").remove();
        }

        renumberRows();

        this.scrollIntoView(false);

        return false;
    });

    // Validate part-time employee count
    $("#num-employees").keyup(function () {
        validateNumEmployees(this);
    });

    $('#show-include').popover({
        'animation': true, 'placement': 'left', 'html': true, 'content': $('#popover-content-target').html(),
        'title': lang.t('fte_fulltime_include'),
        'trigger': 'hover'
    });

    $('#learn-fte').popover({
        'animation': true, 'placement': 'bottom', 'html': true, 'content': $('#learn-fte-content-target').html(),
        'title': lang.t('fte_fulltime_equi'),
        'trigger': 'hover'
    });

    $('#employees').appendRow(1);
});

var calcMethods = {
    WEEKLY: 0,
    MONTHLY: 1,
    YEARLY: 2
};

var calcMethod = calcMethods.WEEKLY;

var MAX_ROWS = 250;

var MAX_FTE = 50;

function calcMethodMax() {
    if (calcMethod == calcMethods.YEARLY) return 1560;
    if (calcMethod == calcMethods.MONTHLY) return 120;
    if (calcMethod == calcMethods.WEEKLY) return 30;

    return 1560;
}

function validateNumEmployees(el) {
    $("#worksheet-form").valid();
}

function validateEmployeeHours(el) {
    var v = el.value;
    var p = $(el).parent();
    var max = calcMethodMax();

    if ((/^\d+$/.test(v) && v <= max) || v === '') {
        p.removeClass('has-error has-warning');
        p.find('.hours-info').removeClass('glyphicon-warning-sign glyphicon-remove').html('').tooltip('destroy');
    } else if (v > max) {
        p.removeClass('has-error').addClass('has-warning');
        p.find('.hours-info').removeClass('glyphicon-remove').addClass('glyphicon-warning-sign').tooltip('destroy').tooltip({ 'title': lang.t('fte_parttime_limited') + ' ' + max });
    } else {
        p.removeClass('has-warning').addClass('has-error');
        p.find('.hours-info').removeClass('glyphicon-warning-sign').addClass('glyphicon-remove').tooltip('destroy').tooltip({ 'title': lang.t('fte_postive_int') });
    }
}

function sumPtHours() {
    var total = 0;
    $('#employees .employee').each(function (idx) {
        var row = Number($(this).find('input.employee-hours').val());
        var max = calcMethodMax();
        if (isNaN(row)) row = 0;
        row = Math.min(max, row);
        total += row;
    });
    return total;
}

function doCalc() {
    $('#calc').validate();
    var r = 0;
    var t = '';
    if ($('#calc').valid()) {
        r = calcFte();
        if (r > 0 && r <= MAX_FTE) {
            t = '<p class="fte-result">' + lang.t('fte_eligible_1') + r + lang.t('fte_eligible_2')
              + ' <a href="/small-businesses/provide-shop-coverage/qualify-for-shop-marketplace/">'
              + lang.t('fte_eligible_3') + '</a> '
              + lang.t('fte_eligible_4') + ' <a href="/marketplace/shop/">'
              + lang.t('fte_eligible_5') + '</a> ' + lang.t('fte_eligible_6') + '</p>';
            $('.clear-btn').removeClass('hidden');
        } else if (r > MAX_FTE) {
            t = '<p class="fte-result">' + lang.t('fte_not_eligible_1') + MAX_FTE + lang.t('fte_not_eligible_2')
              + MAX_FTE + lang.t('fte_not_eligible_3') + ' <a href="/what-is-the-shop-marketplace/">'
              + lang.t('fte_not_eligible_4') + '</a>' + lang.t('fte_not_eligible_5') + '</p>';
            $('.clear-btn').removeClass('hidden');
        } else {
            t = '';
            $('.clear-btn').addClass('hidden');
        }
    }

    $('#result').html(t);
}

function calcFte() {
    var fte = 0;
    var pte = 0;
    var result = 0;

    fte = Number($('#fte').val());
    pte = Number($('#pte').val());
    if (!($.isNumeric(fte) && $.isNumeric(pte)) || fte + pte == 0) {
        return 0;
    }

    switch (calcMethod) {
        case calcMethods.WEEKLY:
            result = Math.max(Math.floor(fte + pte / 30), 1);
            break;
        case calcMethods.MONTHLY:
            result = Math.max(Math.floor(fte + pte / 120), 1);
            break;
        case calcMethods.YEARLY:
            result = Math.max(Math.floor(fte + pte / 1560), 1);
            break;
        default:
            break;
    }

    return result;
};

function updatePteLabel() {
    switch (calcMethod) {
        case calcMethods.WEEKLY:
            $("label[for=pte]").text(lang.t('fte_parttime_hrs_week'));
            break;
        case calcMethods.MONTHLY:
            $("label[for=pte]").text(lang.t('fte_parttime_hrs_month'));
            break;
        case calcMethods.YEARLY:
            $("label[for=pte]").text(lang.t('fte_parttime_hrs_year'));
            break;
        default:
            break;
    }
}

function renumberRows() {
    var employees = $('#employees .employee');
    rowCount = employees.length;
    for (var i = 0; i < rowCount; i++) {
        $(employees[i]).children('td:first').text((i + 1) + '.');
    }
}

function addLine() {
    var rowCount = $("#employees .employee").length;

    if (rowCount >= MAX_ROWS) return false;

    $("#num-employees").val(rowCount + 1);
    $("#employees tbody").appendRow(rowCount + 1);

    renumberRows();

    var modal = document.getElementById("worksheet-modal");
    modal.scrollTop = modal.scrollHeight;
}

function removeLine(element) {
    var rowCount = $('#employees .employee').length;

    if (rowCount < 2) {
        $(element).parent().parent().find('input').val('');
    } else {
        $(element).parent().parent().remove();
    }

    $('#total-hours').val(sumPtHours());

    $("#num-employees").val(rowCount - 1);

    renumberRows();
}

/*
* Get and set polyglot object for performing language translation throughout the app
*/

function language(lang) {
    var polyglot = new Polyglot();
    var lang_content = {};
    var url = 'assets/js/lang/' + lang + '.json';

    $.ajax({
        url: url,
        async: false,
        dataType: 'json',
        success: function (data) {
            lang_content = data;
        }
    });

    polyglot.locale(lang);
    polyglot.extend(lang_content);

    return polyglot;
}
