"use strict";

var presumptiveEligibility = {
    getData: function () {
        var parent = this;
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: "/resources/data/enrollment-strategies-presumptive-eligibility.json",
            success: function (data) {
                parent.display(data);
            },
            error: function () {
                alert('Error in presumptiveEligibility.getData(). Unable to get data from ' + this.url);
            }
        });
    },
    display: function (data) {
        var index;
        var record;
        for (index = 0; index < data.length; index++) {
            record = data[index];
            $("#presumptive_eligibility").append(
                "<tr class='enrollment_strategies' ><td>" + record.state + " </td>" +
                    "<td>" + this.formatField(record.chip) + "</td>" +
                    "<td>" + this.formatField(record.medicaid) + "</td>" +
                "</tr>"
            );
        }
        $("#presumptive_eligibility").css({"width": "400"});
        //$('#presumptive_eligibility td:contains("No")').css({"background-color": "#bfd6d6"});
    },
    formatField: function (field) {
        if (field === true) {
            return "Yes";
        } else {
            return "No";
        }
    }
};
