//libs/modules
var fs = require('fs');
var path = require('path');
var Log = require('log');
require("./js/ServerGame");

//---------------------------------------------------------------------------
// Main
//----------------------------------------------------------------------------
function main(config) {
    //create server game
    var serverGame = new ServerGame();
    serverGame.startGameClock();

    //set log debug level
    var log;
    switch(config.debug_level) {
        case "error":
            log = new Log(Log.ERROR); break;
        case "debug":
            log = new Log(Log.DEBUG); break;
        case "info":
            log = new Log(Log.INFO); break;
    }
    log.info("Starting MMO game server...");


}
//---------------------------------------------------------------------------
//config file settings
//----------------------------------------------------------------------------
function getConfigFile(path, callback) {
    fs.readFile(path, 'utf8', function(err, json_string) {
        if(err) {
            console.error("Could not open config file:", err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}
var defaultConfigPath = path.join(__dirname,'./config.json'),
    customConfigPath = path.join(__dirname,'./config_local.json');
process.argv.forEach(function (val, index, array) {
    if(index === 2)
        customConfigPath = val;
});
//process
getConfigFile(defaultConfigPath, function(defaultConfig) {
    getConfigFile(customConfigPath, function(localConfig) {
        if(localConfig) {
            console.log("loading localConfig..");
            main(localConfig);
        } else if(defaultConfig) {
            console.log("loading defaultConfig..");
            main(defaultConfig);
        } else {
            console.error("Server cannot start without any configuration file.");
            process.exit(1);
        }
    });

//-------------------------------------The End ----------------------------------------------------------
});