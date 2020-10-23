String.prototype.humanize = function() {
    var i,
        frags = this.split("_");
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
};

Number.prototype.formatNumber = function() {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

var setCodeValue = function (id, value) {
    $(id).text(value).parent().removeAttr("hidden").show();
};

var hideCodeValue = function (id) {
    $(id).empty().parent().attr("hidden", true).hide();
}

var loadKeyBinary = function(filename) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "/api/demo/keygen?file=" + filename, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(oEvent) {
        var arrayBuffer = oReq.response;

        // if you want to access the bytes:
        var byteArray = new Uint8Array(arrayBuffer);

        var binaryString = "";
        var binaryTemplate = "00000000";
        var binaryTemp = "";
        for (var x = 0; x < byteArray.length; x++) {
            binaryTemp = byteArray[x].toString(2);
            binaryString += binaryTemplate.substr(binaryTemp.length) + binaryTemp;
        }
        // ...new TextDecoder("utf-8").decode(byteArray)
        setCodeValue("#key", binaryString);
    };

    oReq.send();
};

// var loadImageBinary = function(filename) {
//     var oReq = new XMLHttpRequest();
//     oReq.open("GET", "/api/demo/keygen?file=" + filename, true);
//     oReq.responseType = "arraybuffer";

//     oReq.onload = function(oEvent) {
//         var arrayBuffer = oReq.response;

//         var blob = new Blob([arrayBuffer], {
//             type: "image/jpg"
//         });
//         var url = URL.createObjectURL(blob);
//         $("#original-image")[0].src = url;
//     };

//     oReq.send();
// };

var keygenResponse = function (response) {
    loadKeyBinary(response.saved);
    setCodeValue("#output", response.output.join("\n"));
    $('#results').removeAttr('hidden').show();
    $('#key-results').removeAttr('hidden').show();
};

var imageResponse = function(response) {
    var codeValue = "";
    var value;
    for (x in response.secure) {
        value = response.secure[x];
        if (!isNaN(value) && value % 1 === 0) {
            value = new Number(response.secure[x]);
            value = value.formatNumber();
        }
        codeValue += x.humanize() + ": " + value + "\n";
    }

    $("#image-filename").val(response.filename);
    
    setCodeValue("#image-analysis", codeValue);
    $("#analysis-container").removeAttr('hidden').show();
    $("#keygen-form-container").removeAttr('hidden').show();
};

var errorResponse = function(key) {
    return function(xhr, desc, response) {
        $("#" + key + "-error-alert")
            .removeAttr("hidden")
            .show();
        $("#" + key + "-error-description")
            .text(xhr.responseJSON.description)
            .removeAttr("hidden");
    };
};

var hideError = function (key) {
    $("#" + key + "-error-alert")
        .attr("hidden", true)
        .hide();
    $("#" + key + "-error-description")
        .empty()
        .attr("hidden", true);
};

$(document).ready(function() {
    $("#image-placeholder").on("click", function(e) {
        $("#image-file-upload").click();
        hideCodeValue("#image-analysis");
        $("#analysis-container").attr('hidden', true).hide();
    });

    $("#image-file-upload").on("change", function (e) {
        $("form#image-upload-form").submit();
    });

    $("#image-file-upload").on("change", function(input) {
        if (input.currentTarget.files && input.currentTarget.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $("#image-placeholder").attr("src", e.target.result);
                $("#image-file-upload-figure .figure-caption").text("Click image again to choose a different image");
            };

            reader.readAsDataURL(input.currentTarget.files[0]);
        }
    });
    $("form#image-upload-form").on("submit", function(e) {
        e.preventDefault(e);
        var form = this;

        hideError("image");
        $("#keygen-form-container").attr('hidden', true).hide();
        
        setCodeValue("#image-analysis", "Uploading Image...");
        $("#analysis-container").removeAttr('hidden').show();
        
        var form = new FormData(this);
        form.append('pin', '000000');
        $.ajax({
            type: "POST",
            url: "/api/demo/image-upload",
            data: form,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: imageResponse,
            error: errorResponse("image")
        });
    });

    $("form#keygen-form").on("submit", function(e) {
        e.preventDefault(e);
        var form = this;

        hideError("image");

        $("#keygen-form-container").removeAttr('hidden').show();
        $('#results').attr('hidden', true).hide();
        $('#key-results').attr('hidden', true).hide();

        hideCodeValue('#output');
        hideCodeValue('#key');

        $.ajax({
            type: "POST",
            url: "/api/demo/keygen",
            data: new FormData(this),
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: keygenResponse,
            error: errorResponse("image")
        });
    });
});
