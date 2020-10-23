
function storeSignupField ( e ) {
    var key = e.target.name;
    var value = e.target.value;
    var signupSessionString = window.localStorage.getItem('signupSession');
    var signupSession;
    if ( signupSessionString !== ""){
        signupSession = JSON.parse(signupSessionString);
    }
    console.log('old storage => ', signupSession)
    if ( signupSession ) {
        signupSession[key] = value; 
    } else {
        signupSession = {};
        signupSession[key] = value
    }
    signupSession['fromTime'] = new Date();

    window.localStorage.setItem("signupSession", JSON.stringify(signupSession));
};

function getSignupSession ( ) {
    var signupSessionString = window.localStorage.getItem('signupSession');
    var signupSession = signupSessionString!=="" ? JSON.parse(signupSessionString) : "";
    return signupSession;
}

function clearSignupSession ( ) {
    window.localStorage.setItem("signupSession", "");
}

function isLessThanOneHour(date){
    var ONE_HOUR = 60 * 60 * 1000 ; /* ms */
    console.log((new Date) - new Date(date), 'date=>')
    return ((new Date) - new Date(date)) < ONE_HOUR;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateCellNumber(cellNumber) {
  var formattedNumber = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;;
  return cellNumber.match(formattedNumber)
}

function matchValues(val1, val2) {
    return val1===val2;
}

function validateForm() {
    const email = $("#email").val();
    const confirmEmail = $("#confirm_email").val();
    const cellNumber = $("#cell_number").val();
    const confirmCellNumber = $("#confirm_cell_number").val();
  
    if ( validateEmail(email) ) {
        $('#email').css('border-color', "#006400");
        $("#email_invalid_feedback").removeClass("d-block");
    } else {
        $('#email').css('border-color', "#c70000");
        $("#email_invalid_feedback").addClass("d-block");
        return false;
    }

    if ( matchValues( email, confirmEmail ) ) {
        $('#confirm_email').css('border-color', "#006400");
        $("#confirm_email_invalid_feedback").removeClass("d-block");
    } else {
        $('#confirm_email').css('border-color', "#c70000");
        $("#confirm_email_invalid_feedback").addClass("d-block");
        return false;
    }

    if ( validateCellNumber(cellNumber) ) {
        $('#cell_number').css('border-color', "#006400");
        $("#cell_number_invalid_feedback").removeClass("d-block");
    } else {
        $('#cell_number').css('border-color', "#c70000");
        $("#cell_number_invalid_feedback").addClass("d-block");
        return false;
    }

    if ( matchValues( cellNumber, confirmCellNumber ) ) {
        $('#confirm_cell_number').css('border-color', "#006400");
        $("#confirm_cell_number_invalid_feedback").removeClass("d-block");
    } else {
        $('#confirm_cell_number').css('border-color', "#c70000");
        $("#confirm_cell_number_invalid_feedback").addClass("d-block");
        return false;
    }
    return true;
}

function getMyPublicIp() {
    var clientIp = $('#client-ip').text();
    fetch("http://ip-api.com/json/"+clientIp).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data)
        $("#select_country").val(data.countryCode);
    }).catch(function() {
        console.log("something went wrong when getting country info.");
    });
}

$(document).ready(function() {
    var signupSession = getSignupSession();
    console.log('here=>', signupSession)
    if ( signupSession ) {
        var fieldNames = Object.keys(signupSession);
        var fromTime = signupSession['fromTime'];
        if ( isLessThanOneHour(fromTime) ) {
            fieldNames.forEach(name=>{
                if ( document.getElementsByName(name) && document.getElementsByName(name)[0] ) {
                    document.getElementsByName(name)[0].value = signupSession[name];
                }
            })
        } else {
            clearSignupSession()
        }
        
    }
    $("#image-input").change(function(){
        readURL(this);
        //other uploading proccess [server side by ajax and form-data ]
    });
    $("form#signup").on("submit", function(e) {
        e.preventDefault(e);

        if ( validateForm() ) {
            // reset();
            // disable();
            
            // $.ajax({
            //     type: "POST",
            //     url: "/api/member/login",
            //     data: form,
            //     dataType: 'json',
            //     contentType: 'application/json',
            //     processData: false,
            //     cache: false,
            //     success: loginResponse,
            //     error: errorResponse
            // });
        }
    });
    getMyPublicIp()
});



function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();   
        reader.onload = function (e) {
            $('#profile-picture').attr('src', e.target.result);
        }  
        reader.readAsDataURL(input.files[0]);
    }
}