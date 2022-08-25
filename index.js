var sf = require('node-salesforce');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
const fs = require('fs');
const path = require('path');
const config = require(__dirname + '/config/config.json');
const PORT = process.env.PORT || 8080;
// get config data 

const developement = false;

var connection_config = developement ? config.dev.oauth_details : config.prod.oauth_details;
username = developement ? config.dev.auth_info.username : config.prod.auth_info.username;
password = developement ? config.dev.auth_info.password : config.prod.auth_info.password;

var connection = new sf.Connection(connection_config);


login = () => {
    connection.login(username, password, (err, userInfo) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(userInfo);
        return userInfo;
    }); 
}

logout = () => {
    connection.logout(err => {
        if (err) {
            console.error(err);
            return err;
        }
        console.log('logged out');
        return 'logged out';
    }
    );
}


updateLead = (leadId) => {
    connection.sobject('Lead').update({
        Id: leadId,
        HasOptedOutOfEmail : true
    }, (err, ret) => {
        if (err || !ret.success) {
            console.error(err, ret);
            return err;
        }
        console.log('updated lead: ' + leadId);
        return 'updated lead: ' + leadId;
    }
    );
}

// link to unsubscribe a user from a campaign with parameter userId
app.get('/unsubscribe/:leadId', (req, res) => {
    var leadId = req.params.leadId;
    console.log(leadId);
    updateLead(leadId);
    res.sendFile(path.join(__dirname + '/public/unsubscribe.html'));
});

app.get('/login', (req, res) => {
    var userInfo = login();
    res.send(userInfo);
})

app.get('/logout', (req, res) => {
    var userInfo = logout();
    res.send(userInfo);
})

server.listen(PORT, function () {
    console.log('Server listening at port %d', PORT);
}).on('error', function (err) {
    console.log(err);
})

