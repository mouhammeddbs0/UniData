$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});



let socket = null;
let user = null;
let lis = document.getElementById("ul-users").getElementsByTagName("li");

function setTitle(title) {
    document.querySelector("h4").innerHTML = title;
}

function printMessage(_name, mess) {
    let li = document.createElement("li");
    li.innerText = _name.concat(" : ", mess);
    document.querySelector("#ul-chat").appendChild(li);
}

function updateMyUserColor(user) {
    for (let i = 0; i < 4; i++) {
        if (lis[i].innerText == user)
            lis[i].style.color = "#3F7F5FFF";
    }
}

function updateUsers(users) {
    if (users[0] != null)
        lis[0].innerText = users[0];
    if (users[1] != null)
        lis[1].innerText = users[1];
    if (users[2] != null)
        lis[2].innerText = users[2];
    if (users[3] != null)
        lis[3].innerText = users[3];
}

document.getElementById("join").onclick = function () {
    let input = document.getElementById("user");

    socket = io("http://localhost:3000");
    socket.on("disconnect", function () {
        setTitle("Disconnected");

    });

    socket.on("connect", function () {
        setTitle("Connected");
    });

    socket.on("message", function (user, message) {
        printMessage(user, message);
    });

    socket.on("user", function (users) {
        updateUsers(users);
        updateMyUserColor(user);
    });

    socket.emit("users", input.value);
    user = input.value;
    input.value = "";
}
document.getElementById("send").onclick = function () {
    let input = document.getElementById("message");
    printMessage(user, input.value);
    socket.emit("chat", user, input.value);
    input.value = "";
};