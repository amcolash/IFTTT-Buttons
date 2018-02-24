var events = [];

window.addEventListener('load', function () {
    getEvents();
    updateButtons();
    updateOffline();
});

window.addEventListener('online', updateOffline);
window.addEventListener('offline', updateOffline);

function updateOffline() {
    var offline = document.getElementById("offline");
    offline.style.opacity = navigator.onLine ? "0" : "1";

    // Yuck, this makes the maxHeight reflective of the current device width (probably a better way out there)
    var maxHeight = "1em";
    if (window.innerWidth < 706) maxHeight = "2em";
    if (window.innerWidth < 482) maxHeight = "3em";

    offline.style.maxHeight = maxHeight;
    offline.style.maxHeight = navigator.onLine ? "0" : maxHeight;
}

function getEvents() {
    var eventsString = getCookie("events");
    if (eventsString.length > 0) {
        events = JSON.parse(eventsString);
    }
}

function saveEvents() {
    setCookie("events", JSON.stringify(events));
}

function updateButtons() {
    var buttons = document.getElementById("buttons")
    buttons.innerHTML = "";

    for (var i = 0; i < events.length; i++) {
        var e = events[i];

        var container = document.createElement("div");
        container.classList = "buttonContainer";

        var button = document.createElement("button");
        button.setAttribute("onclick", "trigger('" + e.event + "')");
        button.className = "icon-switch icon pointer";
        container.appendChild(button);

        var br = document.createElement("br");
        container.appendChild(br);

        var label = document.createElement("span");
        label.innerText = e.name;
        container.appendChild(label);

        var remove = document.createElement("button");
        remove.setAttribute("onclick", "promptRemove('" + e.name + "', '" + e.event + "')");
        remove.className = "icon-bin remove pointer";
        container.appendChild(remove);

        buttons.appendChild(container);
    }
}

function promptEvent() {
    var name = prompt("Name for the button?");
    if (name != null && name.length > 0) {
        var event = prompt("Event trigger id?");
        if (event != null && event.length > 0) {
            addEvent(name, event);
        }
    }
}

function promptRemove(name, event) {
    var remove = confirm("Are you sure you want to remove " + name + "?");

    if (remove) removeEvent(name, event);
}

function addEvent(name, event) {
    events.push({name: name, event: event});
    saveEvents();
    updateButtons();
}

/* Will only remove the first found button */
function removeEvent(name, event) {
    for (var i = 0; i < events.length; i++) {
        var e = events[i];
        if (e.name === name && e.event === event) {
            events.splice(i, 1);
            break;
        }
    }

    saveEvents();
    updateButtons();
}

function trigger(event) {
    var key = getKey();
    if (key.length == 0) {
        alert("You need to set up your IFTTT key first!");
    } else if (navigator.onLine) {
        var url = "https://maker.ifttt.com/trigger/" + event + "/with/key/" + getKey();

        var httpRequest = new XMLHttpRequest()
        httpRequest.open('GET', url)
        httpRequest.send()
    } else {
        alert("You are offline, this button did not fire.")
    }
}

function promptKey() {
    var key = prompt("Please enter your IFTTT webhook key", getKey());

    if (key != null && key.length > 0) {
        setKey(key);
    }
}

function setKey(key) {
    setCookie("key", key);
}

function getKey() {
    return getCookie("key");
}

/* From https://www.w3schools.com/js/js_cookies.asp */

function setCookie(cname, cvalue, exdays) {
    if (exdays === undefined) exdays = 365;
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
