var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent'); // Permet de bloquer les caractères HTML
var fs = require('fs');



//Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 8080);

io.sockets.on('connection', function (socket, pseudo) {

    //Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe mes autres personnes
    socket.on('nouveau_client', function (pseudo) {
        pseudo = ent.encode(pseudo); //ent.encode()pour encoder la pseudo par sécurité = impossible pour l'utilisateur de mettre du javascript dans son pseudo!!!
        socket.pseudo = pseudo; // variable de session
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    //Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message); //encode le message par sécurité, pour retirer le JavaScript malicieux !
        socket.broadcast.emit('message', {
            pseudo: socket.pseudo,
            message: message
        }); //Pour envoyer plusieurs données dans un seul paramètre, on les encapsule dans un objet JavaScript
    });

});


