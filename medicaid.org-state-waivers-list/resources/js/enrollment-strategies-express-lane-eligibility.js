"use strict";

var expressLaneEligibility = {
    getData: function () {
        var parent = this;
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: "/resources/data/enrollment-strategies-express-lane-eligibility.json",
            success: function (data) {
                parent.display(data);
            },
            error: function () {
                alert('Error in expressLaneEligibility.getData(). Unable to get data from ' + this.url);
            }
        });
    },
    display: function (data) {
        var index;
        var record;
        data.sort(function (a, b) {
            if (a.state > b.state) {
                return 1;
            }
            if (a.state < b.state) {
                return -1;
            }
            return 0;
        });
        for (index = 0; index < data.length; index++) {
            record = data[index];
            $("#express_lane_eligibility").append(
                "<tr class='enrollment_strategies'><td>" + record.state + " </td>" +
                    "<td>" + this.formatField(record.chip) + "</td>" +
                    "<td>" + this.formatField(record.medicaid) + "</td>" +
                    //"<td>" + this.formatDate(record.approved) + "</td>" +
                    //"<td>" + this.formatDate(record.effective) + "</td>" +
                    "<td>" + record.agency + "</td>" +
                    //"<td>" + this.formatField(record.initial_determination) + "</td>" +
                    //"<td>" + this.formatField(record.redetermination) + "</td>" +
                    //"<td>" + record.ele_findings + "</td>" +
                    //"<td>" + record.enrollment_process + "</td>" +
                "</tr>"
            );
        }
        $("#express_lane_eligibility").css({"width": "%100"});
        //$('#express_lane_eligibility td:contains("Yes")').css({"background-color": "#76BAB2"});
    },
    formatField: function (field) {
        if (field === true) {
            return "Yes";
        } else {
            return "No";
        }
    },
    formatString: function (field) {
        if (field && field.length > 0) {
            return field;
        } else {
            return "";
        }
    },
    formatDate: function (field) {
        if (field && field.length > 10) {
            return field.substring(5, 7) + "-" + field.substring(8, 10) + "-" + field.substring(2, 4);
        } else {
            return "";
        }
    }
};
