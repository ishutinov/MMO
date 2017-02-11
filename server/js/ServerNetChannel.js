//imports
require("./Client.js");
require("./NetChannelMessage.js");
require("./lib/SortedLookupTable.js");

(function () {

    var config = require("../config_local.json");
    var nextClientID = 0;
    
    ServerNetChannel = function (aDelegate) {
        //init
        this._clients = new SortedLookupTable();
        //this._config = config;
        this.setDelegate(aDelegate);
        this.setupSocketIO(config.socket_domain, config.socket_port);
        console.log(config.socket_protocol+"://"+config.socket_domain+":"+ config.socket_port);
    };

    ServerNetChannel.prototype = {

        //fields
        _socketio: null,                 // Socket.IO server
        _clients:null,                   // SortedLookupTable
        _delegate:null,                  // Should conform to ServerNetChannel _delegate
        _outgoingSequenceNumber:0,                   // A unique ID for each message

        setupSocketIO: function (host, port) {
            //init server
            var express = require('express');
            var app = express();
            var http = require('http').Server(app);
            var path = require('path');
            this._socketio = require('socket.io')(http);

            //routing
            app.get('/', function (req, res) {
                res.sendFile(path.join(__dirname, '../../public/index.html'));
            });
            app.use('/', express.static(path.join(__dirname, '../../public')));

            //setup
            var self = this;
            this._socketio.on('connection', function (socket) {
                //console.log(socket);
                self.onSocketConnection(socket);

                //---------------------------commands-------------
                socket.on('message', function (data) {
                    self.onSocketMessage(data, socket);
                });
                socket.on('disconnect', function () {
                    self.onSocketClosed(socket);
                });
                socket.on('player_input', function (data) {
                    self.onSocketPlayerInput(data, socket);
                });
                socket.on('player_joined',function (data) {
                    self.onPlayerJoined(socket,data);
                });

                //-------------------------------------------------
            });

            //error handle
            this._socketio.on('error', function (err) {
                console.error(err.stack);
            });

            //server listen
            http.listen(port);
        }
        ,

        tick: function (gameClock, worldDescription) {
            
            var worldEntityDescriptionString = worldDescription.getEntityDescriptionAsString();
            var entityDescriptionObject = {
                entities: worldEntityDescriptionString,
                gameClock: worldDescription.gameClock,
                gameTick: worldDescription.gameTick
            };

            // Send _clients the current world info
            this._clients.forEach(function (key, client) {
                // Collapse delta - store the world state
                client.entityDescriptionBuffer.push(entityDescriptionObject);

                // Ask if enough time passed, and send a new world update
                if (client.canSendMessage(gameClock)) {
                    client.sendQueuedCommands(gameClock);
                }

            }, this);

        }
        ,


        /*
            当socket连接时， 创建一个 Client 对象，并且加入到this.clients集合里。
            同时发送一条NetChannelMessage，包括了游戏服务器的时钟
        */
        onSocketConnection: function (clientConnection) {

            var aClient = new Client(clientConnection, this.getNextClientID());
            // Send the first message back to the client, which gives them a clientid
            var connectMessage = new NetChannelMessage(++this._outgoingSequenceNumber, aClient.getClientid(), true, {gameClock: this._delegate.getGameClock()});
            connectMessage.messageTime = this._delegate.getGameClock();
            aClient.getConnection().emit('server_connected', connectMessage);

            // Add to our list of connected users
            this._clients.setObjectForKey(aClient, aClient.getSessionId());
            console.log(this._clients.count() + " Clients connected: " + aClient.getSessionId());

        }
        ,

        onSocketClosed: function (clientConnection) {

            var client = this._clients.objectForKey(clientConnection.id);
            if (!client) {
                console.warn("(ServerNetChannel)::onSocketClosed - ERROR - Attempting to remove client that was not found in our list! ");
                return;
            }
            //this._delegate.shouldRemovePlayer(client.getClientid());
            this._clients.remove(clientConnection.id);
            client.dealloc();
            console.log("a Client disconnected");

        }
        ,

        onSocketMessage: function (data, connection) {
            var client = this._clients.objectForKey(connection.id);
            console.log(data);

            // Allow the client to track that data was received
            if (client) {
                client.onMessage(data);
            } else {
                console.log("(NetChannel)::onSocketMessage - no such client!");
                return;
            }
            // function

        }
        ,

        onSocketPlayerInput: function (data, connection) {
            var client = this._clients.objectForKey(connection.id);

            // Allow the client to track that data was received
            if (client) {
                client.onMessage(data);
            } else {
                console.log("(NetChannel)::onSocketMessage - no such client!");
                return;
            }


        }
        ,

        onPlayerJoined: function (client, data) {
            console.log(client.getClientid() + " has joined the game!");
            this._delegate.shouldAddPlayer(client.getClientid(), data);
            client.getConnection().emit('message', data);

        }
        ,

        /*************
         * ACCESSORS *
         *************/
        getNextClientID: function () {
            return ++nextClientID
        }
        ,

        setDelegate: function (aDelegate) {
            var theInterface = this.ServerNetChannelDelegateProtocol;
            for (var member in theInterface) {
                if ((typeof aDelegate[member] != typeof theInterface[member])) {
                    console.error("object failed to implement interface member " + member);
                    return false;
                }
            }

            // Checks passed
            this._delegate = aDelegate;
        }
        ,

        //Example Protocol
        ServerNetChannelDelegateProtocol: {
            shouldUpdatePlayer: function (clientID, data) {},
            shouldAddPlayer: function (clientID, data) {},
            shouldRemovePlayer: function (clientID) {},
            getNextEntityID: function () {},
            getGameClock: function () {},
            log: function () {}
        }

    }



})();

