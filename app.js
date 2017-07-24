var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var utilsurl = require('url');
var VK = require('vk-io');

var vk = new VK({
    app: 6079803,
    login: VK_LOGIN, //string
    pass: VK_PASSWORD, //string
});
app.use(cors());
app.use(bodyParser.json());

var userObject = {
    gltoken: '',
    app: 6079803,
    login: VK_LOGIN,
    pass: VK_PASSWORD,
    userid: '',
    dialogUserId: '',
    friends: {}
};

function vkAuth(params) {
    console.log('vkAuth');
    console.log(params.login);
    console.log(params.password);
    vk.setOptions({
        app: 6079803,
        login: params.login,
        pass: params.password
    });
    var auth = vk.auth.standalone();
    auth.run().then(function(token) {
        console.log('User token:', token);
        setUserObject('gltoken', token);
        setUserObject('login', params.login);
        setUserObject('pass', params.password);
        vk.setOptions({ token: userObject.gltoken });
        startLongPoll();
    }).catch(function(error) {
        console.error(error);
    });
}

function sendMessage(res, params) {

    vk.api.messages.send({
        user_id: params.userid || VK_ID, //string
        'message': params.message
    });
    res.send('Сообщение отправлено');
}

function getFriends() {
    vk.api.friends.get({
        user_id: userObject.userid,
        fields: 'nickname',
        count: 10
    }).then(function(res) {
        return res;
    });
}

function setUserObject(name, value) {
    userObject[name] = value;
}

function startLongPoll() {
    vk.api.messages.getLongPollServer({
        need_pts1: 1,
        lp_version: 2
    }).then(function(res) {
        // console.log(res);
        vk.longpoll.start().then(function() {
            console.log('Long Poll запущен');
            vk.longpoll.on('message', incomingMessageHandler);
        }).catch(function(error) {
            console.error(error);
        });
    });
}

function incomingMessageHandler(res) {
    console.log(res);
}

app.post('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var params = req.body;
    console.log(params.type);
    switch (params.type) {
        case 'message':
            sendMessage(res, params);
            res.send('auth');
            break;
        case 'getFriends':
            console.log(userObject.userid);
            res.send(getFriends());
            break;
        default:
            vkAuth(params);
    }

    // res.send(typeof params);
});

app.listen(3000);



// vk.longpoll.start().then(function() {
//     console.log('Long Poll запущен');
// }).catch(function(error) {
//     console.error(error);
// });