// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
var cors = require('cors');
// var utilsurl = require('url');
// var VK = require('vk-io');
// var proxy = require('http-proxy-middleware');

// var vk = new VK({
//     app: 6079803,
//     // login: VK_LOGIN, //string
//     // pass: VK_PASSWORD, //string
// });
// app.use('/*', cors(), bodyParser.json(), proxy({
//     target: target,
//     changeOrigin: true,
//     logLevel: logLevel,
//     router: appRouter
// }));

// var userObject = {
//     gltoken: '',
//     app: 6079803,
//     // login: VK_LOGIN,
//     // pass: VK_PASSWORD,
//     userid: '',
//     dialogUserId: '',
//     friends: {}
// };

// function vkAuth(params) {
//     console.log('vkAuth');
//     console.log(params.login);
//     console.log(params.password);
//     vk.setOptions({
//         app: 6079803,
//         login: params.login,
//         pass: params.password
//     });
//     var auth = vk.auth.standalone();
//     auth.run().then(function(token) {
//         console.log('User token:', token);
//         setUserObject('gltoken', token);
//         setUserObject('login', params.login);
//         setUserObject('pass', params.password);
//         vk.setOptions({ token: userObject.gltoken });
//         startLongPoll();
//     }).catch(function(error) {
//         console.error(error);
//     });
// }

// function sendMessage(res, params) {

//     vk.api.messages.send({
//         // user_id: params.userid || VK_ID, //string
//         'message': params.message
//     });
//     res.send('Сообщение отправлено');
// }

// function getFriends() {
//     vk.api.friends.get({
//         user_id: userObject.userid,
//         fields: 'nickname',
//         count: 10
//     }).then(function(res) {
//         return res;
//     });
// }

// function setUserObject(name, value) {
//     userObject[name] = value;
// }

// function startLongPoll() {
//     vk.api.messages.getLongPollServer({
//         need_pts1: 1,
//         lp_version: 2
//     }).then(function(res) {
//         // console.log(res);
//         vk.longpoll.start().then(function() {
//             console.log('Long Poll запущен');
//             vk.longpoll.on('message', incomingMessageHandler);
//         }).catch(function(error) {
//             console.error(error);
//         });
//     });
// }

// function incomingMessageHandler(res) {
//     console.log(res);
// }

// app.post('/', function(req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     var params = req.body;
//     console.log(params.type);
//     switch (params.type) {
//         case 'message':
//             sendMessage(res, params);
//             res.send('auth');
//             break;
//         case 'getFriends':
//             console.log(userObject.userid);
//             res.send(getFriends());
//             break;
//         default:
//             // vkAuth(params);
//             res.redirect('https://oauth.vk.com/authorize?client_id=6079803&display=popup&redirect_uri=https://multychat.000webhostapp.com/&scope=friends&response_type=code&v=5.67');
//     }

//     // res.send(typeof params);
// });

// app.listen(3000);



// // vk.longpoll.start().then(function() {
// //     console.log('Long Poll запущен');
// // }).catch(function(error) {
// //     console.error(error);
// // });

var express = require('express');
var app = express();
var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;

// User session support middlewares. Your exact suite might vary depending on your app's needs.
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    next();
});

passport.use(new VKontakteStrategy({
        clientID: 6079803, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: "FjBDVir4sjuTVKtHXmVF",
        callbackURL: "https://multychat.000webhostapp.com/"
    },
    function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {

        // Now that we have user's `profile` as seen by VK, we can
        // use it to find corresponding database records on our side.
        // Also we have user's `params` that contains email address (if set in 
        // scope), token lifetime, etc.
        // Here, we have a hypothetical `User` class which does what it says.
        User.findOrCreate({ vkontakteId: profile.id })
            .then(function(user) { done(null, user); })
            .catch(done);
    }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function(user) { done(null, user); })
        .catch(done);
});

//This function will pass callback, scope and request new token
app.get('/auth/vkontakte', passport.authenticate('vkontakte'));
// app.get('/', passport.authenticate('vkontakte'));

app.get('/auth/vkontakte/callback', function(req, res) {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    passport.authenticate('vkontakte', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
    passport.authenticate('vkontakte')
});

app.get('/', function(req, res) {
    //Here you have an access to req.user
    // res.addHeader("Access-Control-Allow-Origin", "*");
    res.json(req.user);
});

app.listen(3000);