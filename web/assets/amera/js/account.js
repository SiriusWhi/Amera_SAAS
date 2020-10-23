var inviteResponse = function (invite) {
    if (invite.success === true) {
        var values = Amera.getFormValues(this);
        var form = this;
        var successMsg = 
            "<strong>" +  values['first_name'] + ' ' + values['last_name'] + "</strong>" +
            " has been successfully invited, they will receive an email soon at " + values['email'] + ".";
        $("#invite-success-alert")
            .removeAttr("hidden")
            .show();
        $("#invite-success-description")
            .html(successMsg)
            .removeAttr('hidden');
        setTimeout(function () {
            resetForm(form);
        }, 1);        
    }
    else {
        $("#invite-error-alert")
            .removeAttr("hidden")
            .show();

        $("#invite-error-description")
            .text("Invite could not be processed")
            .removeAttr("hidden");
    }
    enable();
};

var errorResponse = function (xhr, desc, response) {
    $("#invite-error-alert")
        .removeAttr("hidden")
        .show();

    var description = xhr.statusText;
    if (xhr.responseJSON && xhr.responseJSON.description) {
        description = xhr.responseJSON.description;
    }

    $("#invite-error-description")
        .text(description[0].toUpperCase() + description.slice(1))
        .removeAttr("hidden");
    enable();
};

var resetForm = function (form) {
    form.reset();
    $('[name="username"]').focus();
    enable();
};
var reset = function () {
    $("#invite-error-alert")
        .attr("hidden", true)
        .hide();
    $("#invite-error-description")
        .empty()
        .attr("hidden", true);
    $("#invite-success-alert")
        .attr("hidden", true)
        .hide();
    $("#invite-success-description")
        .empty()
        .attr("hidden", true);
};



var disable = function () {
    $('#invite-submit').prop('disabled', true);
};

var enable = function () {
    $('#invite-submit').prop('disabled', false);
};

$(document).ready(function () {
    reset();
    $("form#invite").on("submit", function (e) {
        e.preventDefault(e);
        reset();
        disable();
        
        var form = Amera.getFormValues(this);
        form['inviter_member_id'] = Amera.getSession()['member_id'];
        
        $.ajax({
            type: "POST",
            url: "/api/member/invite",
            data: JSON.stringify(form),
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            cache: false,
            success: inviteResponse.bind(this),
            error: errorResponse
        });
    });
});
