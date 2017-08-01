(function() {
    document.getElementById('sendAuth').addEventListener('click', function(e) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/auth/vkontakte/callback', true);
        // xhr.open('POST', 'https://cryptic-ridge-44734.herokuapp.com/', true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.withCredentials = true;
        var params = {
            type: 'auth',
            login: document.getElementById('login').value,
            password: document.getElementById('password').value
        };
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            console.log(this.responseText);
        };
        // xhr.send(JSON.stringify(params));
        xhr.send(null);
    });
    document.getElementById('sendMess').addEventListener('click', function(e) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/auth/vkontakte/', true);
        // xhr.open('POST', 'https://cryptic-ridge-44734.herokuapp.com/', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var params = {
            type: 'message',
            userid: document.getElementById('userID').value,
            message: document.getElementById('message').value
        };
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            console.log(this.responseText);
        };
        xhr.send(JSON.stringify(params));
    });
    document.getElementById('getFriends').addEventListener('click', function(e) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/auth/vkontakte', true);
        // xhr.open('POST', 'https://cryptic-ridge-44734.herokuapp.com/', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var params = {
            type: 'getFriends'
        };
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            console.log(this.responseText);
        };
        xhr.send(JSON.stringify(params));
    });
})();