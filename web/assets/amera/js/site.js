var Amera = function () {};

Amera.storeSession = function (session) {
    window.sessionStorage.setItem('ameraSession', JSON.stringify(session));
};

Amera.getSession = function () {
    var session = window.sessionStorage.getItem('ameraSession');
    try {
        session = JSON.parse(session);
    } catch (e) {
        Amera.redirectToLogin();
    }
    return session;
};

Amera.clearSession = function () {
    window.sessionStorage.removeItem('ameraSession');
};

Amera.redirectToLogin = function () {
    window.location = '/login';
};

Amera.getFormValues = function (form) {
    if (!form || !form.elements.length) {
        return false;
    }

    var formElementLength = form.elements.length;
    var elementIndex = 0, element;
    var returnValue = {};
    for(elementIndex = 0; elementIndex < formElementLength; elementIndex+=1) {
        element = form.elements[elementIndex];
        if (element.type !== "button" && element.nodeName.toLowerCase() !== "button") {
            returnValue[element.name] = element.value;
        }
    }
    return returnValue;
}

Amera.getJSONFormValues = function (form) {
    return JSON.stringify(Amera.getFormValues(form));
};


// Language state
$(document).ready(function () {
    var loadLanguage = function (languageObject) {
        replaceText(languageObject['layout']);
        replaceText(languageObject[page]);

        document.title = languageObject[page][page + '000'];
    };

    var replaceText = function (pageLanguage) {
        for (var key in pageLanguage) {
            try {
                document.getElementById(key).innerHTML = pageLanguage[key];
            } catch (e) {
                console.log('Error setting textContent on Key: ' + key);
                console.log('Element:');
                console.log(document.getElementById(key));
                console.log('Current Page Language: ');
                console.log(pageLanguage);
                console.log('Continuing with next key');
                continue;
            }
        }
    };

    var path = window.location.pathname;
    var page = path.split("/").pop();


    if (page === '') {
        page = 'index';
    }

    

    var language = 'en';
    localLanguage = window.localStorage.getItem('amera-language');
    if (localLanguage !== null) {
        language = localLanguage;
    }
    if (document.location.hash) {
        language = document.location.hash.replace('#', '');
        window.localStorage.setItem('amera-language', language);
    }

    // Load language
    // $.ajax({
    //     type: 'GET',
    //     url: '/assets/amera/languages/' + language + '.json',
    //     cache: false,
    //     processData: false,
    //     dataType: 'json',
    //     success: loadLanguage
    // });

    // var dataReload = document.querySelectorAll("[data-reload]");

    // for (i = 0; i<dataReload.length; i++){
    //     dataReload[i].onclick = function(event) {
    //         window.location = event.target.href;
    //         location.reload();
    //     };
    // }

});


// Session state
$(document).ready(function() {
    var validateSessionURL = '/api/valid-session';

    var setSessionData = function (session) {
        var name = session['first_name'];
        $('.account-btn span').text(name);
        $('.login-btn').addClass('d-none');
        $('.account-btn').removeClass('d-none');
    };

    var checkSession = function (session) {
        var expireDate = new Date(session['expiration_date']);
        if (expireDate > (new Date())) {
            Amera.storeSession(session);
            return setSessionData(session);
        }
        Amera.redirectToLogin();
    };

    if (window.location.href.indexOf('/login') > 0 ||
        window.location.href.indexOf('/register') > 0) {
        $('.login-btn').removeClass('d-none');
        $('.account-btn').addClass('d-none');
        return;
    }

    $.ajax({
        type: 'GET',
        url: validateSessionURL,
        cache: false,
        processData: false,
        success: checkSession,
        error: Amera.redirectToLogin
    });
});
