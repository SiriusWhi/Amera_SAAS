var parseQueryString = function (queryString) {
    var params = {},
        queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split("&");

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};

var loginResponse = function(response) {
    var url = window.location.protocol + "//" + window.location.host;
    var params = window.location.search.substring(1);
    if(params.indexOf('url') !== -1) {        
        params = parseQueryString(params);
        url = decodeURIComponent(params.url);
    }
    window.location = url;
};

var errorResponse = function(xhr, desc, response) {
    $("#login-error-alert")
        .removeAttr("hidden")
        .show();

    var description = xhr.statusText;
    if (xhr.responseJSON && xhr.responseJSON.description) {
        description = xhr.responseJSON.description;
    }

    $("#login-error-description")
        .text(description[0].toUpperCase() + description.slice(1))
        .removeAttr("hidden");
    enable();
};

var reset = function () {
    $("#login-error-alert")
        .attr("hidden", true)
        .hide();
    $("#login-error-description")
        .empty()
        .attr("hidden", true);
};

var disable = function () {
    $('#login-submit').prop('disabled', true);
};

var enable = function () {
    $('#login-submit').prop('disabled', false);
};

$(document).ready(function() {
    $("form#login").on("submit", function(e) {
        e.preventDefault(e);
        reset();
        disable();

        var form = Amera.getJSONFormValues(this);

        $.ajax({
            type: "POST",
            url: "/api/member/login",
            data: form,
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            cache: false,
            success: loginResponse,
            error: errorResponse
        });
    });
});
