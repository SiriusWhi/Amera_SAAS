var parseQueryString = function (queryString) {
    var params = {},
        queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split('&');

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};

var inviteRegisterResponse = function() {
    window.location = '/';
};

var errorResponse = function(xhr, desc, response) {
    $('#invite-register-error-alert')
        .removeAttr('hidden')
        .show();

    var description = xhr.statusText;
    if (xhr.responseJSON && xhr.responseJSON.description) {
        description = xhr.responseJSON.description;
    }

    $('#invite-register-error-description')
        .text(description[0].toUpperCase() + description.slice(1))
        .removeAttr('hidden');
    enable();
};

var reset = function () {
    $('#invite-register-error-alert')
        .attr('hidden', true)
        .hide();
    $('#invite-register-error-description')
        .empty()
        .attr('hidden', true);
};

var disable = function () {
    $('#invite-register-submit').prop('disabled', true);
};

var enable = function () {
    $('#invite-register-submit').prop('disabled', false);
};

$(document).ready(function() {
    
    $('form#invite-register').on('submit', function(e) {
        e.preventDefault(e);
        reset();
        disable();

        var invite_key = $('input[name="invite_key"]').val();
        var form = Amera.getFormValues(this);
        
        form['username'] = form['email'];

        $.ajax({
            type: 'POST',
            url: '/api/member/register/' + invite_key,
            data: JSON.stringify(form),
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            cache: false,
            success: inviteRegisterResponse,
            error: errorResponse
        });
    });
});
