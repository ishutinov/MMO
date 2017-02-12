//=============================================================================
// ServerObjects.js v1.0.0
//=============================================================================


(function() {

    var $dataActors       = null;
    var $dataClasses      = null;
    var $dataSkills       = null;
    var $dataItems        = null;
    var $dataWeapons      = null;
    var $dataArmors       = null;
    var $dataEnemies      = null;
    var $dataTroops       = null;
    var $dataStates       = null;
    var $dataAnimations   = null;
    var $dataTilesets     = null;
    var $dataCommonEvents = null;
    var $dataSystem       = null;
    var $dataMapInfos     = null;
    var $dataMap          = null;

    var $gameTemp         = null;
    var $gameSystem       = null;
    var $gameActors       = null;
    var $gameParty        = null;
    var $gameMap          = null;
    var $gamePlayer       = null;
//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.

// function Game_Item() {
//     this.initialize.apply(this, arguments);
// }

// Game_Item.prototype.initialize = function(item) {
//     this._dataClass = '';
//     this._itemId = 0;
//     if (item) {
//         this.setObject(item);
//     }
// };

// Game_Item.prototype.isSkill = function() {
//     return this._dataClass === 'skill';
// };

// Game_Item.prototype.isItem = function() {
//     return this._dataClass === 'item';
// };

// Game_Item.prototype.isUsableItem = function() {
//     return this.isSkill() || this.isItem();
// };

// Game_Item.prototype.isWeapon = function() {
//     return this._dataClass === 'weapon';
// };

// Game_Item.prototype.isArmor = function() {
//     return this._dataClass === 'armor';
// };

// Game_Item.prototype.isEquipItem = function() {
//     return this.isWeapon() || this.isArmor();
// };

// Game_Item.prototype.isNull = function() {
//     return this._dataClass === '';
// };

// Game_Item.prototype.itemId = function() {
//     return this._itemId;
// };

// Game_Item.prototype.object = function() {
//     if (this.isSkill()) {
//         return $dataSkills[this._itemId];
//     } else if (this.isItem()) {
//         return $dataItems[this._itemId];
//     } else if (this.isWeapon()) {
//         return $dataWeapons[this._itemId];
//     } else if (this.isArmor()) {
//         return $dataArmors[this._itemId];
//     } else {
//         return null;
//     }
// };

// Game_Item.prototype.setObject = function(item) {
//     if (DataManager.isSkill(item)) {
//         this._dataClass = 'skill';
//     } else if (DataManager.isItem(item)) {
//         this._dataClass = 'item';
//     } else if (DataManager.isWeapon(item)) {
//         this._dataClass = 'weapon';
//     } else if (DataManager.isArmor(item)) {
//         this._dataClass = 'armor';
//     } else {
//         this._dataClass = '';
//     }
//     this._itemId = item ? item.id : 0;
// };

// Game_Item.prototype.setEquip = function(isWeapon, itemId) {
//     this._dataClass = isWeapon ? 'weapon' : 'armor';
//     this._itemId = itemId;
// };


// //-----------------------------------------------------------------------------
// // Game_Unit
// //	
// // The superclass of Game_Party and Game_Troop.

// function Game_Unit() {
//     this.initialize.apply(this, arguments);
// }

// Game_Unit.prototype.initialize = function() {
//     this._inBattle = false;
// };

// Game_Unit.prototype.inBattle = function() {
//     return this._inBattle;
// };

// Game_Unit.prototype.members = function() {
//     return [];
// };

// Game_Unit.prototype.aliveMembers = function() {
//     return this.members().filter(function(member) {
//         return member.isAlive();
//     });
// };

// Game_Unit.prototype.deadMembers = function() {
//     return this.members().filter(function(member) {
//         return member.isDead();
//     });
// };

// Game_Unit.prototype.movableMembers = function() {
//     return this.members().filter(function(member) {
//         return member.canMove();
//     });
// };

// Game_Unit.prototype.clearActions = function() {
//     return this.members().forEach(function(member) {
//         return member.clearActions();
//     });
// };


// Game_Unit.prototype.onBattleStart = function() {
//     this.members().forEach(function(member) {
//         member.onBattleStart();
//     });
//     this._inBattle = true;
// };

// Game_Unit.prototype.onBattleEnd = function() {
//     this._inBattle = false;
//     this.members().forEach(function(member) {
//         member.onBattleEnd();
//     });
// };



// //-----------------------------------------------------------------------------
// // Game_Party
// //
// // The game object class for the party. Information such as gold and items is
// // included.

// function Game_Party() {
//     this.initialize.apply(this, arguments);
// }

// Game_Party.prototype = Object.create(Game_Unit.prototype);
// Game_Party.prototype.constructor = Game_Party;

// Game_Party.ABILITY_ENCOUNTER_HALF    = 0;
// Game_Party.ABILITY_ENCOUNTER_NONE    = 1;
// Game_Party.ABILITY_CANCEL_SURPRISE   = 2;
// Game_Party.ABILITY_RAISE_PREEMPTIVE  = 3;
// Game_Party.ABILITY_GOLD_DOUBLE       = 4;
// Game_Party.ABILITY_DROP_ITEM_DOUBLE  = 5;

// Game_Party.prototype.initialize = function() {
//     Game_Unit.prototype.initialize.call(this);
//     this._gold = 0;
//     this._steps = 0;
//     this._lastItem = new Game_Item();
//     this._menuActorId = 0;
//     this._targetActorId = 0;
//     this._actors = [];
//     this.initAllItems();
// };

// Game_Party.prototype.initAllItems = function() {
//     this._items = {};
//     this._weapons = {};
//     this._armors = {};
// };

// Game_Party.prototype.exists = function() {
//     return this._actors.length > 0;
// };

// Game_Party.prototype.size = function() {
//     return this.members().length;
// };

// Game_Party.prototype.isEmpty = function() {
//     return this.size() === 0;
// };

// Game_Party.prototype.members = function() {
//     return this.allMembers();
// };

// Game_Party.prototype.allMembers = function() {
//     return this._actors.map(function(id) {
//         return $gameActors.actor(id);
//     });
// };

// Game_Party.prototype.maxBattleMembers = function() {
//     return 50;
// };

// Game_Party.prototype.leader = function() {
//     return this.allMembers()[0];
// };

// Game_Party.prototype.items = function() {
//     var list = [];
//     for (var id in this._items) {
//         list.push($dataItems[id]);
//     }
//     return list;
// };

// Game_Party.prototype.weapons = function() {
//     var list = [];
//     for (var id in this._weapons) {
//         list.push($dataWeapons[id]);
//     }
//     return list;
// };

// Game_Party.prototype.armors = function() {
//     var list = [];
//     for (var id in this._armors) {
//         list.push($dataArmors[id]);
//     }
//     return list;
// };

// Game_Party.prototype.equipItems = function() {
//     return this.weapons().concat(this.armors());
// };

// Game_Party.prototype.allItems = function() {
//     return this.items().concat(this.equipItems());
// };

// Game_Party.prototype.itemContainer = function(item) {
//     if (!item) {
//         return null;
//     } else if (DataManager.isItem(item)) {
//         return this._items;
//     } else if (DataManager.isWeapon(item)) {
//         return this._weapons;
//     } else if (DataManager.isArmor(item)) {
//         return this._armors;
//     } else {
//         return null;
//     }
// };

// Game_Party.prototype.setupStartingMembers = function() {
//     this._actors = [];
//     // $dataSystem.partyMembers.forEach(function(actorId) {
//     //     if ($gameActors.actor(actorId)) {
//     //         this._actors.push(actorId);
//     //     }
//     // }, this);
// };

// Game_Party.prototype.name = function() {
//     // var numBattleMembers = this.battleMembers().length;
//     // if (numBattleMembers === 0) {
//     //     return '';
//     // } else if (numBattleMembers === 1) {
//     //     return this.leader().name();
//     // } else {
//     //     return TextManager.partyName.format(this.leader().name());
//     // }
// };

// Game_Party.prototype.addActor = function(actorId) {
//     //if (!this._actors.contains(actorId)) {
//         this._actors.push(actorId);
//         //$gamePlayer.refresh();
//         //$gameMap.requestRefresh();
//     //}
// };

// Game_Party.prototype.removeActor = function(actorId) {
//     if (this._actors.contains(actorId)) {
//         this._actors.splice(this._actors.indexOf(actorId), 1);
//         //$gamePlayer.refresh();
//         //$gameMap.requestRefresh();
//     }
// };

// Game_Party.prototype.gold = function() {
//     return this._gold;
// };

// Game_Party.prototype.gainGold = function(amount) {
//     this._gold = (this._gold + amount).clamp(0, this.maxGold());
// };

// Game_Party.prototype.loseGold = function(amount) {
//     this.gainGold(-amount);
// };

// Game_Party.prototype.maxGold = function() {
//     return 99999999;
// };

// Game_Party.prototype.steps = function() {
//     return this._steps;
// };

// Game_Party.prototype.increaseSteps = function() {
//     this._steps++;
// };

// Game_Party.prototype.numItems = function(item) {
//     var container = this.itemContainer(item);
//     return container ? container[item.id] || 0 : 0;
// };

// Game_Party.prototype.maxItems = function(item) {
//     return 99;
// };

// Game_Party.prototype.hasMaxItems = function(item) {
//     return this.numItems(item) >= this.maxItems(item);
// };

// Game_Party.prototype.hasItem = function(item, includeEquip) {
//     if (includeEquip === undefined) {
//         includeEquip = false;
//     }
//     if (this.numItems(item) > 0) {
//         return true;
//     } else if (includeEquip && this.isAnyMemberEquipped(item)) {
//         return true;
//     } else {
//         return false;
//     }
// };

// Game_Party.prototype.isAnyMemberEquipped = function(item) {
//     return this.members().some(function(actor) {
//         return actor.equips().contains(item);
//     });
// };

// Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
//     var container = this.itemContainer(item);
//     if (container) {
//         var lastNumber = this.numItems(item);
//         var newNumber = lastNumber + amount;
//         container[item.id] = newNumber.clamp(0, this.maxItems(item));
//         if (container[item.id] === 0) {
//             delete container[item.id];
//         }
//         if (includeEquip && newNumber < 0) {
//             this.discardMembersEquip(item, -newNumber);
//         }
//         $gameMap.requestRefresh();
//     }
// };

// Game_Party.prototype.discardMembersEquip = function(item, amount) {
//     var n = amount;
//     this.members().forEach(function(actor) {
//         while (n > 0 && actor.isEquipped(item)) {
//             actor.discardEquip(item);
//             n--;
//         }
//     });
// };

// Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
//     this.gainItem(item, -amount, includeEquip);
// };

// Game_Party.prototype.consumeItem = function(item) {
//     if (DataManager.isItem(item) && item.consumable) {
//         this.loseItem(item, 1);
//     }
// };

// Game_Party.prototype.isAllDead = function() {
//     if (Game_Unit.prototype.isAllDead.call(this)) {
//         return this.inBattle() || !this.isEmpty();
//     } else {
//         return false;
//     }
// };

    /**
     *  Server Data Manager
     */

    DataManager = function() {
        throw new Error('This is a static class');
    }

    DataManager._globalId       = 'RPGMV';
    DataManager._lastAccessedId = 1;
    DataManager._errorUrl       = null;

    DataManager.loadDatabase = function() {
        $dataActors       = require('../data/Actors.json');
        $dataClasses      = require('../data/Classes.json');
        $dataSkills       = require('../data/Skills.json');
        $dataItems        = require('../data/Items.json');
        $dataWeapons      = require('../data/Weapons.json');
        $dataArmors       = require('../data/Armors.json');
        $dataEnemies      = require('../data/Enemies.json');
        $dataTroops       = require('../data/Troops.json');
        $dataStates       = require('../data/States.json');
        $dataAnimations   = require('../data/Animations.json');
        $dataTilesets     = require('../data/Tilesets.json');
        $dataCommonEvents = require('../data/CommonEvents.json');
        $dataSystem       = require('../data/System.json');
        $dataMapInfos     = require('../data/MapInfos.json');
        //console.log($dataActors);
    };

    DataManager.isSkill = function(item) {
        return item && $dataSkills.contains(item);
    };

    DataManager.isItem = function(item) {
        return item && $dataItems.contains(item);
    };

    DataManager.isWeapon = function(item) {
        return item && $dataWeapons.contains(item);
    };

    DataManager.isArmor = function(item) {
        return item && $dataArmors.contains(item);
    };

    DataManager.createGameObjects = function() {
        //$gameTemp          = new Game_Temp();
        //$gameSystem        = new Game_System();
        //$gameActors        = new Game_Actors();
        //$gameParty         = new Game_Party();
        $gameMap           = new Game_Map();
        //$gamePlayer        = new Game_Player();
    };

    DataManager.getGameMaps = function () {
        return $gameMap;
    };

    DataManager.loadMapData = function(mapId) {
        if (mapId > 0) {
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            $dataMap = require("../data/"+filename);
        } else {
            this.makeEmptyMap();
        }
    };

    /**
        call when you ready to start a new Server game
     */
    DataManager.setupNewGame = function() {
        this.createGameObjects();
        DataManager.loadMapData(2);
        //this.selectSavefileForNewGame();
        //$gameParty.setupStartingMembers();
        //$gamePlayer.reserveTransfer($dataSystem.startMapId,
        //   $dataSystem.startX, $dataSystem.startY);
        //Graphics.frameCount = 0;
    };



//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

    Game_Map = function () {
        this.initialize.apply(this, arguments);
        return this;
    }

    Game_Map.prototype.initialize = function() {
        this._mapId = 0;
        this._tilesetId = 0;
        this._events = [];

    };

    Game_Map.prototype.setup = function(mapId) {
        if (!$dataMap) {
            throw new Error('The map data is not available');
        }
        this._mapId = mapId;
        this._tilesetId = $dataMap.tilesetId;

        this.setupEvents();
        //console.log($dataMap.events);

    };

    Game_Map.prototype.tileWidth = function() {
        return 48;
    };

    Game_Map.prototype.tileHeight = function() {
        return 48;
    };

    Game_Map.prototype.mapId = function() {
        return this._mapId;
    };

    Game_Map.prototype.tilesetId = function() {
        return this._tilesetId;
    };

    Game_Map.prototype.setupEvents = function() {
        this._events = [];
        for (var i = 0; i < $dataMap.events.length; i++) {
            if ($dataMap.events[i]) {
                this._events[i] = new Game_Event(this._mapId, i);
            }
        }
        //console.log("Map set up: there are "+$dataMap.events.length+" events on the map");
    };

    Game_Map.prototype.events = function() {
        return this._events.filter(function(event) {
            return !!event;
        });
    };

    Game_Map.prototype.event = function(eventId) {
        return this._events[eventId];
    };

    Game_Map.prototype.eraseEvent = function(eventId) {
        this._events[eventId].erase();
    };

    Game_Map.prototype.tileset = function() {
        return $dataTilesets[this._tilesetId];
    };

    Game_Map.prototype.tilesetFlags = function() {
        var tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        } else {
            return [];
        }
    };

    Game_Map.prototype.displayName = function() {
        return $dataMap.displayName;
    };

    Game_Map.prototype.width = function() {
        return $dataMap.width;
    };

    Game_Map.prototype.height = function() {
        return $dataMap.height;
    };

    Game_Map.prototype.data = function() {
        return $dataMap.data;
    };

    Game_Map.prototype.isLoopHorizontal = function() {
        return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
    };

    Game_Map.prototype.isLoopVertical = function() {
        return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
    };

    Game_Map.prototype.isDashDisabled = function() {
        return $dataMap.disableDashing;
    };

    Game_Map.prototype.encounterList = function() {
        return $dataMap.encounterList;
    };

    Game_Map.prototype.encounterStep = function() {
        return $dataMap.encounterStep;
    };

    Game_Map.prototype.isOverworld = function() {
        return this.tileset() && this.tileset().mode === 0;
    };

    Game_Map.prototype.adjustX = function(x) {
        if (this.isLoopHorizontal() && x < this._displayX -
            (this.width() - this.screenTileX()) / 2) {
            return x - this._displayX + $dataMap.width;
        } else {
            return x - this._displayX;
        }
    };

    Game_Map.prototype.adjustY = function(y) {
        if (this.isLoopVertical() && y < this._displayY -
            (this.height() - this.screenTileY()) / 2) {
            return y - this._displayY + $dataMap.height;
        } else {
            return y - this._displayY;
        }
    };

    Game_Map.prototype.roundX = function(x) {
        return this.isLoopHorizontal() ? x.mod(this.width()) : x;
    };

    Game_Map.prototype.roundY = function(y) {
        return this.isLoopVertical() ? y.mod(this.height()) : y;
    };

    Game_Map.prototype.xWithDirection = function(x, d) {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    };

    Game_Map.prototype.yWithDirection = function(y, d) {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    };

    Game_Map.prototype.roundXWithDirection = function(x, d) {
        return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    };

    Game_Map.prototype.roundYWithDirection = function(y, d) {
        return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    };

    Game_Map.prototype.deltaX = function(x1, x2) {
        var result = x1 - x2;
        if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
            if (result < 0) {
                result += this.width();
            } else {
                result -= this.width();
            }
        }
        return result;
    };

    Game_Map.prototype.deltaY = function(y1, y2) {
        var result = y1 - y2;
        if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
            if (result < 0) {
                result += this.height();
            } else {
                result -= this.height();
            }
        }
        return result;
    };

    Game_Map.prototype.distance = function(x1, y1, x2, y2) {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    };

    Game_Map.prototype.eventsXy = function(x, y) {
        return this.events().filter(function(event) {
            return event.pos(x, y);
        });
    };

    Game_Map.prototype.eventsXyNt = function(x, y) {
        return this.events().filter(function(event) {
            return event.posNt(x, y);
        });
    };

    Game_Map.prototype.eventIdXy = function(x, y) {
        var list = this.eventsXy(x, y);
        return list.length === 0 ? 0 : list[0].eventId();
    };

    Game_Map.prototype.isValid = function(x, y) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    };

    Game_Map.prototype.checkPassage = function(x, y, bit) {
        var flags = this.tilesetFlags();
        var tiles = this.allTiles(x, y);
        for (var i = 0; i < tiles.length; i++) {
            var flag = flags[tiles[i]];
            if ((flag & 0x10) !== 0)  // [*] No effect on passage
                continue;
            if ((flag & bit) === 0)   // [o] Passable
                return true;
            if ((flag & bit) === bit) // [x] Impassable
                return false;
        }
        return false;
    };

    Game_Map.prototype.tileId = function(x, y, z) {
        var width = $dataMap.width;
        var height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    };

    Game_Map.prototype.layeredTiles = function(x, y) {
        var tiles = [];
        for (var i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    };

    Game_Map.prototype.allTiles = function(x, y) {
        return this.layeredTiles(x, y);
    };

    Game_Map.prototype.autotileType = function(x, y, z) {
        var tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    };

    Game_Map.prototype.isPassable = function(x, y, d) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    };

    Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
        var flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some(function(tileId) {
            return (flags[tileId] & bit) !== 0;
        });
    };

    Game_Map.prototype.isLadder = function(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    };

    Game_Map.prototype.isBush = function(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    };

    Game_Map.prototype.isCounter = function(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    };

    Game_Map.prototype.isDamageFloor = function(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    };

    Game_Map.prototype.terrainTag = function(x, y) {
        if (this.isValid(x, y)) {
            var flags = this.tilesetFlags();
            var tiles = this.layeredTiles(x, y);
            for (var i = 0; i < tiles.length; i++) {
                var tag = flags[tiles[i]] >> 12;
                if (tag > 0) {
                    return tag;
                }
            }
        }
        return 0;
    };

    Game_Map.prototype.regionId = function(x, y) {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    };

    Game_Map.prototype.update = function() {
        this.updateEvents();
    };

    Game_Map.prototype.updateEvents = function() {
        this.events().forEach(function(event) {
            event.update();
        });
    };

    Game_Map.prototype.changeTileset = function(tilesetId) {
        this._tilesetId = tilesetId;
        //this.refresh();
    };

    Game_Map.prototype.unlockEvent = function(eventId) {
        if (this._events[eventId]) {
            this._events[eventId].unlock();
        }
    };



//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.

    Game_CharacterBase = function () {
        this.initialize.apply(this, arguments);
        return this;
    };

    Object.defineProperties(Game_CharacterBase.prototype, {
        x: { get: function() { return this._x; }, configurable: true },
        y: { get: function() { return this._y; }, configurable: true }
    });

    Game_CharacterBase.prototype.initialize = function() {
        this.initMembers();
    };

    Game_CharacterBase.prototype.initMembers = function() {
        this._x = 0;
        this._y = 0;
        this._realX = 0;
        this._realY = 0;
        this._moveSpeed = 4;
        this._moveFrequency = 6;
        this._opacity = 255;
        this._blendMode = 0;
        this._direction = 2;
        this._pattern = 1;
        this._priorityType = 1;
        this._tileId = 0;
        this._characterName = '';
        this._characterIndex = 0;
        this._isObjectCharacter = false;
        this._walkAnime = true;
        this._stepAnime = false;
        this._directionFix = false;
        this._through = false;
        this._transparent = false;
        this._bushDepth = 0;
        this._animationId = 0;
        this._balloonId = 0;
        this._animationPlaying = false;
        this._balloonPlaying = false;
        this._animationCount = 0;
        this._stopCount = 0;
        this._jumpCount = 0;
        this._jumpPeak = 0;
        this._movementSuccess = true;
    };

    Game_CharacterBase.prototype.pos = function(x, y) {
        return this._x === x && this._y === y;
    };

    Game_CharacterBase.prototype.posNt = function(x, y) {
        // No through
        return this.pos(x, y) && !this.isThrough();
    };

    Game_CharacterBase.prototype.moveSpeed = function() {
        return this._moveSpeed;
    };

    Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
        this._moveSpeed = moveSpeed;
    };

    Game_CharacterBase.prototype.moveFrequency = function() {
        return this._moveFrequency;
    };

    Game_CharacterBase.prototype.setMoveFrequency = function(moveFrequency) {
        this._moveFrequency = moveFrequency;
    };

    Game_CharacterBase.prototype.opacity = function() {
        return this._opacity;
    };

    Game_CharacterBase.prototype.setOpacity = function(opacity) {
        this._opacity = opacity;
    };

    Game_CharacterBase.prototype.blendMode = function() {
        return this._blendMode;
    };

    Game_CharacterBase.prototype.setBlendMode = function(blendMode) {
        this._blendMode = blendMode;
    };

    Game_CharacterBase.prototype.isNormalPriority = function() {
        return this._priorityType === 1;
    };

    Game_CharacterBase.prototype.setPriorityType = function(priorityType) {
        this._priorityType = priorityType;
    };

    Game_CharacterBase.prototype.isMoving = function() {
        return this._realX !== this._x || this._realY !== this._y;
    };

    Game_CharacterBase.prototype.isJumping = function() {
        return this._jumpCount > 0;
    };

    Game_CharacterBase.prototype.jumpHeight = function() {
        return (this._jumpPeak * this._jumpPeak -
            Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
    };

    Game_CharacterBase.prototype.isStopping = function() {
        return !this.isMoving() && !this.isJumping();
    };

    Game_CharacterBase.prototype.checkStop = function(threshold) {
        return this._stopCount > threshold;
    };

    Game_CharacterBase.prototype.resetStopCount = function() {
        this._stopCount = 0;
    };

    Game_CharacterBase.prototype.realMoveSpeed = function() {
        return this._moveSpeed + (this.isDashing() ? 1 : 0);
    };

    Game_CharacterBase.prototype.distancePerFrame = function() {
        return Math.pow(2, this.realMoveSpeed()) / 256;
    };

    Game_CharacterBase.prototype.isDashing = function() {
        return false;
    };

    Game_CharacterBase.prototype.isDebugThrough = function() {
        return false;
    };

    Game_CharacterBase.prototype.straighten = function() {
        if (this.hasWalkAnime() || this.hasStepAnime()) {
            this._pattern = 1;
        }
        this._animationCount = 0;
    };

    Game_CharacterBase.prototype.reverseDir = function(d) {
        return 10 - d;
    };

    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (this.isThrough() || this.isDebugThrough()) {
            return true;
        }
        if (!this.isMapPassable(x, y, d)) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
        return true;
    };

    Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
        var x2 = $gameMap.roundXWithDirection(x, horz);
        var y2 = $gameMap.roundYWithDirection(y, vert);
        if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
            return true;
        }
        if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
            return true;
        }
        return false;
    };

    Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        var d2 = this.reverseDir(d);
        return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
    };

    Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
        return this.isCollidedWithEvents(x, y);
    };

    Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
        var events = $gameMap.eventsXyNt(x, y);
        return events.some(function(event) {
            return event.isNormalPriority();
        });
    };

    Game_CharacterBase.prototype.setPosition = function(x, y) {
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._realX = x;
        this._realY = y;
    };

    Game_CharacterBase.prototype.copyPosition = function(character) {
        this._x = character._x;
        this._y = character._y;
        this._realX = character._realX;
        this._realY = character._realY;
        this._direction = character._direction;
    };

    Game_CharacterBase.prototype.locate = function(x, y) {
        this.setPosition(x, y);
        this.straighten();
        this.refreshBushDepth();
    };

    Game_CharacterBase.prototype.direction = function() {
        return this._direction;
    };

    Game_CharacterBase.prototype.setDirection = function(d) {
        if (!this.isDirectionFixed() && d) {
            this._direction = d;
        }
        this.resetStopCount();
    };

    Game_CharacterBase.prototype.isTile = function() {
        return this._tileId > 0 && this._priorityType === 0;
    };

    Game_CharacterBase.prototype.isObjectCharacter = function() {
        return this._isObjectCharacter;
    };

    Game_CharacterBase.prototype.update = function() {
        if (this.isStopping()) {
            this.updateStop();
        }
        if (this.isJumping()) {
            this.updateJump();
        } else if (this.isMoving()) {
            this.updateMove();
        }
        this.updateAnimation();
    };

    Game_CharacterBase.prototype.updateStop = function() {
        this._stopCount++;
    };

    Game_CharacterBase.prototype.updateJump = function() {
        this._jumpCount--;
        this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
        this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
        this.refreshBushDepth();
        if (this._jumpCount === 0) {
            this._realX = this._x = $gameMap.roundX(this._x);
            this._realY = this._y = $gameMap.roundY(this._y);
        }
    };

    Game_CharacterBase.prototype.updateMove = function() {
        if (this._x < this._realX) {
            this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
        }
        if (this._x > this._realX) {
            this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
        }
        if (this._y < this._realY) {
            this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
        }
        if (this._y > this._realY) {
            this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
        }
        if (!this.isMoving()) {
            this.refreshBushDepth();
        }
    };

    Game_CharacterBase.prototype.updateAnimation = function() {
        this.updateAnimationCount();
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this._animationCount = 0;
        }
    };

    Game_CharacterBase.prototype.animationWait = function() {
        return (9 - this.realMoveSpeed()) * 3;
    };

    Game_CharacterBase.prototype.updateAnimationCount = function() {
        if (this.isMoving() && this.hasWalkAnime()) {
            this._animationCount += 1.5;
        } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
            this._animationCount++;
        }
    };

    Game_CharacterBase.prototype.updatePattern = function() {
        if (!this.hasStepAnime() && this._stopCount > 0) {
            this.resetPattern();
        } else {
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }
    };

    Game_CharacterBase.prototype.maxPattern = function() {
        return 4;
    };

    Game_CharacterBase.prototype.pattern = function() {
        return this._pattern < 3 ? this._pattern : 1;
    };

    Game_CharacterBase.prototype.setPattern = function(pattern) {
        this._pattern = pattern;
    };

    Game_CharacterBase.prototype.isOriginalPattern = function() {
        return this.pattern() === 1;
    };

    Game_CharacterBase.prototype.resetPattern = function() {
        this.setPattern(1);
    };

    Game_CharacterBase.prototype.refreshBushDepth = function() {
        if (this.isNormalPriority() && !this.isObjectCharacter() &&
            this.isOnBush() && !this.isJumping()) {
            if (!this.isMoving()) {
                this._bushDepth = 12;
            }
        } else {
            this._bushDepth = 0;
        }
    };

    Game_CharacterBase.prototype.isOnLadder = function() {
        return $gameMap.isLadder(this._x, this._y);
    };

    Game_CharacterBase.prototype.isOnBush = function() {
        return $gameMap.isBush(this._x, this._y);
    };

    Game_CharacterBase.prototype.terrainTag = function() {
        return $gameMap.terrainTag(this._x, this._y);
    };

    Game_CharacterBase.prototype.regionId = function() {
        return $gameMap.regionId(this._x, this._y);
    };

    Game_CharacterBase.prototype.increaseSteps = function() {
        if (this.isOnLadder()) {
            this.setDirection(8);
        }
        this.resetStopCount();
        this.refreshBushDepth();
    };

    Game_CharacterBase.prototype.tileId = function() {
        return this._tileId;
    };

    Game_CharacterBase.prototype.characterName = function() {
        return this._characterName;
    };

    Game_CharacterBase.prototype.characterIndex = function() {
        return this._characterIndex;
    };

    Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
        this._tileId = 0;
        this._characterName = characterName;
        this._characterIndex = characterIndex;
        this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
    };

    Game_CharacterBase.prototype.setTileImage = function(tileId) {
        this._tileId = tileId;
        this._characterName = '';
        this._characterIndex = 0;
        this._isObjectCharacter = true;
    };

    Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
        var x2 = $gameMap.roundXWithDirection(this._x, d);
        var y2 = $gameMap.roundYWithDirection(this._y, d);
        this.checkEventTriggerTouch(x2, y2);
    };

    Game_CharacterBase.prototype.checkEventTriggerTouch = function(x, y) {
        return false;
    };

    Game_CharacterBase.prototype.isMovementSucceeded = function(x, y) {
        return this._movementSuccess;
    };

    Game_CharacterBase.prototype.setMovementSuccess = function(success) {
        this._movementSuccess = success;
    };

    Game_CharacterBase.prototype.moveStraight = function(d) {
        this.setMovementSuccess(this.canPass(this._x, this._y, d));
        if (this.isMovementSucceeded()) {
            this.setDirection(d);
            this._x = $gameMap.roundXWithDirection(this._x, d);
            this._y = $gameMap.roundYWithDirection(this._y, d);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
            this.increaseSteps();
        } else {
            this.setDirection(d);
            this.checkEventTriggerTouchFront(d);
        }
    };

    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
        if (this.isMovementSucceeded()) {
            this._x = $gameMap.roundXWithDirection(this._x, horz);
            this._y = $gameMap.roundYWithDirection(this._y, vert);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
            this.increaseSteps();
        }
        if (this._direction === this.reverseDir(horz)) {
            this.setDirection(horz);
        }
        if (this._direction === this.reverseDir(vert)) {
            this.setDirection(vert);
        }
    };

    Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
        if (Math.abs(xPlus) > Math.abs(yPlus)) {
            if (xPlus !== 0) {
                this.setDirection(xPlus < 0 ? 4 : 6);
            }
        } else {
            if (yPlus !== 0) {
                this.setDirection(yPlus < 0 ? 8 : 2);
            }
        }
        this._x += xPlus;
        this._y += yPlus;
        var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
        this._jumpPeak = 10 + distance - this._moveSpeed;
        this._jumpCount = this._jumpPeak * 2;
        this.resetStopCount();
        this.straighten();
    };

    Game_CharacterBase.prototype.hasWalkAnime = function() {
        return this._walkAnime;
    };

    Game_CharacterBase.prototype.setWalkAnime = function(walkAnime) {
        this._walkAnime = walkAnime;
    };

    Game_CharacterBase.prototype.hasStepAnime = function() {
        return this._stepAnime;
    };

    Game_CharacterBase.prototype.setStepAnime = function(stepAnime) {
        this._stepAnime = stepAnime;
    };

    Game_CharacterBase.prototype.isDirectionFixed = function() {
        return this._directionFix;
    };

    Game_CharacterBase.prototype.setDirectionFix = function(directionFix) {
        this._directionFix = directionFix;
    };

    Game_CharacterBase.prototype.isThrough = function() {
        return this._through;
    };

    Game_CharacterBase.prototype.setThrough = function(through) {
        this._through = through;
    };

    Game_CharacterBase.prototype.isTransparent = function() {
        return this._transparent;
    };

    Game_CharacterBase.prototype.bushDepth = function() {
        return this._bushDepth;
    };

    Game_CharacterBase.prototype.setTransparent = function(transparent) {
        this._transparent = transparent;
    };

    Game_CharacterBase.prototype.requestAnimation = function(animationId) {
        this._animationId = animationId;
    };

    Game_CharacterBase.prototype.requestBalloon = function(balloonId) {
        this._balloonId = balloonId;
    };

    Game_CharacterBase.prototype.animationId = function() {
        return this._animationId;
    };

    Game_CharacterBase.prototype.balloonId = function() {
        return this._balloonId;
    };

    Game_CharacterBase.prototype.startAnimation = function() {
        this._animationId = 0;
        this._animationPlaying = true;
    };

    Game_CharacterBase.prototype.startBalloon = function() {
        this._balloonId = 0;
        this._balloonPlaying = true;
    };

    Game_CharacterBase.prototype.isAnimationPlaying = function() {
        return this._animationId > 0 || this._animationPlaying;
    };

    Game_CharacterBase.prototype.isBalloonPlaying = function() {
        return this._balloonId > 0 || this._balloonPlaying;
    };

    Game_CharacterBase.prototype.endAnimation = function() {
        this._animationPlaying = false;
    };

    Game_CharacterBase.prototype.endBalloon = function() {
        this._balloonPlaying = false;
    };


//-----------------------------------------------------------------------------
// Game_Character
//
// The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.

    Game_Character = function() {
        this.initialize.apply(this, arguments);
        return this;
    }

    Game_Character.prototype = Object.create(Game_CharacterBase.prototype);
    Game_Character.prototype.constructor = Game_Character;

    Game_Character.ROUTE_END               = 0;
    Game_Character.ROUTE_MOVE_DOWN         = 1;
    Game_Character.ROUTE_MOVE_LEFT         = 2;
    Game_Character.ROUTE_MOVE_RIGHT        = 3;
    Game_Character.ROUTE_MOVE_UP           = 4;
    Game_Character.ROUTE_MOVE_LOWER_L      = 5;
    Game_Character.ROUTE_MOVE_LOWER_R      = 6;
    Game_Character.ROUTE_MOVE_UPPER_L      = 7;
    Game_Character.ROUTE_MOVE_UPPER_R      = 8;
    Game_Character.ROUTE_MOVE_RANDOM       = 9;
    Game_Character.ROUTE_MOVE_TOWARD       = 10;
    Game_Character.ROUTE_MOVE_AWAY         = 11;
    Game_Character.ROUTE_MOVE_FORWARD      = 12;
    Game_Character.ROUTE_MOVE_BACKWARD     = 13;
    Game_Character.ROUTE_JUMP              = 14;
    Game_Character.ROUTE_WAIT              = 15;
    Game_Character.ROUTE_TURN_DOWN         = 16;
    Game_Character.ROUTE_TURN_LEFT         = 17;
    Game_Character.ROUTE_TURN_RIGHT        = 18;
    Game_Character.ROUTE_TURN_UP           = 19;
    Game_Character.ROUTE_TURN_90D_R        = 20;
    Game_Character.ROUTE_TURN_90D_L        = 21;
    Game_Character.ROUTE_TURN_180D         = 22;
    Game_Character.ROUTE_TURN_90D_R_L      = 23;
    Game_Character.ROUTE_TURN_RANDOM       = 24;
    Game_Character.ROUTE_TURN_TOWARD       = 25;
    Game_Character.ROUTE_TURN_AWAY         = 26;
    Game_Character.ROUTE_SWITCH_ON         = 27;
    Game_Character.ROUTE_SWITCH_OFF        = 28;
    Game_Character.ROUTE_CHANGE_SPEED      = 29;
    Game_Character.ROUTE_CHANGE_FREQ       = 30;
    Game_Character.ROUTE_WALK_ANIME_ON     = 31;
    Game_Character.ROUTE_WALK_ANIME_OFF    = 32;
    Game_Character.ROUTE_STEP_ANIME_ON     = 33;
    Game_Character.ROUTE_STEP_ANIME_OFF    = 34;
    Game_Character.ROUTE_DIR_FIX_ON        = 35;
    Game_Character.ROUTE_DIR_FIX_OFF       = 36;
    Game_Character.ROUTE_THROUGH_ON        = 37;
    Game_Character.ROUTE_THROUGH_OFF       = 38;
    Game_Character.ROUTE_TRANSPARENT_ON    = 39;
    Game_Character.ROUTE_TRANSPARENT_OFF   = 40;
    Game_Character.ROUTE_CHANGE_IMAGE      = 41;
    Game_Character.ROUTE_CHANGE_OPACITY    = 42;
    Game_Character.ROUTE_CHANGE_BLEND_MODE = 43;
    Game_Character.ROUTE_PLAY_SE           = 44;
    Game_Character.ROUTE_SCRIPT            = 45;

    Game_Character.prototype.initialize = function() {
        Game_CharacterBase.prototype.initialize.call(this);
    };

    Game_Character.prototype.initMembers = function() {
        Game_CharacterBase.prototype.initMembers.call(this);
        this._moveRouteForcing = false;
        this._moveRoute = null;
        this._moveRouteIndex = 0;
        this._originalMoveRoute = null;
        this._originalMoveRouteIndex = 0;
        this._waitCount = 0;
    };

    Game_Character.prototype.memorizeMoveRoute = function() {
        this._originalMoveRoute       = this._moveRoute;
        this._originalMoveRouteIndex  = this._moveRouteIndex;
    };

    Game_Character.prototype.restoreMoveRoute = function() {
        this._moveRoute          = this._originalMoveRoute;
        this._moveRouteIndex     = this._originalMoveRouteIndex;
        this._originalMoveRoute  = null;
    };

    Game_Character.prototype.isMoveRouteForcing = function() {
        return this._moveRouteForcing;
    };

    Game_Character.prototype.setMoveRoute = function(moveRoute) {
        this._moveRoute = moveRoute;
        this._moveRouteIndex = 0;
        this._moveRouteForcing = false;
    };

    Game_Character.prototype.forceMoveRoute = function(moveRoute) {
        if (!this._originalMoveRoute) {
            this.memorizeMoveRoute();
        }
        this._moveRoute = moveRoute;
        this._moveRouteIndex = 0;
        this._moveRouteForcing = true;
        this._waitCount = 0;
    };

    Game_Character.prototype.updateStop = function() {
        Game_CharacterBase.prototype.updateStop.call(this);
        if (this._moveRouteForcing) {
            this.updateRoutineMove();
        }
    };

    Game_Character.prototype.updateRoutineMove = function() {
        if (this._waitCount > 0) {
            this._waitCount--;
        } else {
            this.setMovementSuccess(true);
            var command = this._moveRoute.list[this._moveRouteIndex];
            if (command) {
                this.processMoveCommand(command);
                this.advanceMoveRouteIndex();
            }
        }
    };

    Game_Character.prototype.processMoveCommand = function(command) {
        var gc = Game_Character;
        var params = command.parameters;
        switch (command.code) {
            case gc.ROUTE_END:
                this.processRouteEnd();
                break;
            case gc.ROUTE_MOVE_DOWN:
                this.moveStraight(2);
                break;
            case gc.ROUTE_MOVE_LEFT:
                this.moveStraight(4);
                break;
            case gc.ROUTE_MOVE_RIGHT:
                this.moveStraight(6);
                break;
            case gc.ROUTE_MOVE_UP:
                this.moveStraight(8);
                break;
            case gc.ROUTE_MOVE_LOWER_L:
                this.moveDiagonally(4, 2);
                break;
            case gc.ROUTE_MOVE_LOWER_R:
                this.moveDiagonally(6, 2);
                break;
            case gc.ROUTE_MOVE_UPPER_L:
                this.moveDiagonally(4, 8);
                break;
            case gc.ROUTE_MOVE_UPPER_R:
                this.moveDiagonally(6, 8);
                break;
            case gc.ROUTE_MOVE_RANDOM:
                this.moveRandom();
                break;
            case gc.ROUTE_MOVE_TOWARD:
                this.moveTowardPlayer();
                break;
            case gc.ROUTE_MOVE_AWAY:
                this.moveAwayFromPlayer();
                break;
            case gc.ROUTE_MOVE_FORWARD:
                this.moveForward();
                break;
            case gc.ROUTE_MOVE_BACKWARD:
                this.moveBackward();
                break;
            case gc.ROUTE_JUMP:
                this.jump(params[0], params[1]);
                break;
            case gc.ROUTE_WAIT:
                this._waitCount = params[0] - 1;
                break;
            case gc.ROUTE_TURN_DOWN:
                this.setDirection(2);
                break;
            case gc.ROUTE_TURN_LEFT:
                this.setDirection(4);
                break;
            case gc.ROUTE_TURN_RIGHT:
                this.setDirection(6);
                break;
            case gc.ROUTE_TURN_UP:
                this.setDirection(8);
                break;
            case gc.ROUTE_TURN_90D_R:
                this.turnRight90();
                break;
            case gc.ROUTE_TURN_90D_L:
                this.turnLeft90();
                break;
            case gc.ROUTE_TURN_180D:
                this.turn180();
                break;
            case gc.ROUTE_TURN_90D_R_L:
                this.turnRightOrLeft90();
                break;
            case gc.ROUTE_TURN_RANDOM:
                this.turnRandom();
                break;
            case gc.ROUTE_TURN_TOWARD:
                this.turnTowardPlayer();
                break;
            case gc.ROUTE_TURN_AWAY:
                this.turnAwayFromPlayer();
                break;
            case gc.ROUTE_SWITCH_ON:
                $gameSwitches.setValue(params[0], true);
                break;
            case gc.ROUTE_SWITCH_OFF:
                $gameSwitches.setValue(params[0], false);
                break;
            case gc.ROUTE_CHANGE_SPEED:
                this.setMoveSpeed(params[0]);
                break;
            case gc.ROUTE_CHANGE_FREQ:
                this.setMoveFrequency(params[0]);
                break;
            case gc.ROUTE_WALK_ANIME_ON:
                this.setWalkAnime(true);
                break;
            case gc.ROUTE_WALK_ANIME_OFF:
                this.setWalkAnime(false);
                break;
            case gc.ROUTE_STEP_ANIME_ON:
                this.setStepAnime(true);
                break;
            case gc.ROUTE_STEP_ANIME_OFF:
                this.setStepAnime(false);
                break;
            case gc.ROUTE_DIR_FIX_ON:
                this.setDirectionFix(true);
                break;
            case gc.ROUTE_DIR_FIX_OFF:
                this.setDirectionFix(false);
                break;
            case gc.ROUTE_THROUGH_ON:
                this.setThrough(true);
                break;
            case gc.ROUTE_THROUGH_OFF:
                this.setThrough(false);
                break;
            case gc.ROUTE_TRANSPARENT_ON:
                this.setTransparent(true);
                break;
            case gc.ROUTE_TRANSPARENT_OFF:
                this.setTransparent(false);
                break;
            case gc.ROUTE_CHANGE_IMAGE:
                this.setImage(params[0], params[1]);
                break;
            case gc.ROUTE_CHANGE_OPACITY:
                this.setOpacity(params[0]);
                break;
            case gc.ROUTE_CHANGE_BLEND_MODE:
                this.setBlendMode(params[0]);
                break;
            case gc.ROUTE_PLAY_SE:
                //AudioManager.playSe(params[0]);
                break;
            case gc.ROUTE_SCRIPT:
                eval(params[0]);
                break;
        }
    };

    Game_Character.prototype.deltaXFrom = function(x) {
        return $gameMap.deltaX(this.x, x);
    };

    Game_Character.prototype.deltaYFrom = function(y) {
        return $gameMap.deltaY(this.y, y);
    };

    Game_Character.prototype.moveRandom = function() {
        var d = 2 + Math.randomInt(4) * 2;
        if (this.canPass(this.x, this.y, d)) {
            this.moveStraight(d);
        }
    };

    Game_Character.prototype.moveTowardCharacter = function(character) {
        var sx = this.deltaXFrom(character.x);
        var sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 4 : 6);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 4 : 6);
            }
        }
    };

    Game_Character.prototype.moveAwayFromCharacter = function(character) {
        var sx = this.deltaXFrom(character.x);
        var sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 6 : 4);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 2 : 8);
            }
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 6 : 4);
            }
        }
    };

    Game_Character.prototype.turnTowardCharacter = function(character) {
        var sx = this.deltaXFrom(character.x);
        var sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.setDirection(sy > 0 ? 8 : 2);
        }
    };

    Game_Character.prototype.turnAwayFromCharacter = function(character) {
        var sx = this.deltaXFrom(character.x);
        var sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 6 : 4);
        } else if (sy !== 0) {
            this.setDirection(sy > 0 ? 2 : 8);
        }
    };

    Game_Character.prototype.turnTowardPlayer = function() {
        this.turnTowardCharacter($gamePlayer);
    };

    Game_Character.prototype.turnAwayFromPlayer = function() {
        this.turnAwayFromCharacter($gamePlayer);
    };

    Game_Character.prototype.moveTowardPlayer = function() {
        this.moveTowardCharacter($gamePlayer);
    };

    Game_Character.prototype.moveAwayFromPlayer = function() {
        this.moveAwayFromCharacter($gamePlayer);
    };

    Game_Character.prototype.moveForward = function() {
        this.moveStraight(this.direction());
    };

    Game_Character.prototype.moveBackward = function() {
        var lastDirectionFix = this.isDirectionFixed();
        this.setDirectionFix(true);
        this.moveStraight(this.reverseDir(this.direction()));
        this.setDirectionFix(lastDirectionFix);
    };

    Game_Character.prototype.processRouteEnd = function() {
        if (this._moveRoute.repeat) {
            this._moveRouteIndex = -1;
        } else if (this._moveRouteForcing) {
            this._moveRouteForcing = false;
            this.restoreMoveRoute();
        }
    };

    Game_Character.prototype.advanceMoveRouteIndex = function() {
        var moveRoute = this._moveRoute;
        if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
            var numCommands = moveRoute.list.length - 1;
            this._moveRouteIndex++;
            if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
                this._moveRouteIndex = 0;
            }
        }
    };

    Game_Character.prototype.turnRight90 = function() {
        switch (this.direction()) {
            case 2:
                this.setDirection(4);
                break;
            case 4:
                this.setDirection(8);
                break;
            case 6:
                this.setDirection(2);
                break;
            case 8:
                this.setDirection(6);
                break;
        }
    };

    Game_Character.prototype.turnLeft90 = function() {
        switch (this.direction()) {
            case 2:
                this.setDirection(6);
                break;
            case 4:
                this.setDirection(2);
                break;
            case 6:
                this.setDirection(8);
                break;
            case 8:
                this.setDirection(4);
                break;
        }
    };

    Game_Character.prototype.turn180 = function() {
        this.setDirection(this.reverseDir(this.direction()));
    };

    Game_Character.prototype.turnRightOrLeft90 = function() {
        switch (Math.randomInt(2)) {
            case 0:
                this.turnRight90();
                break;
            case 1:
                this.turnLeft90();
                break;
        }
    };

    Game_Character.prototype.turnRandom = function() {
        this.setDirection(2 + Math.randomInt(4) * 2);
    };

    Game_Character.prototype.swap = function(character) {
        var newX = character.x;
        var newY = character.y;
        character.locate(this.x, this.y);
        this.locate(newX, newY);
    };

    Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
        var searchLimit = this.searchLimit();
        var mapWidth = $gameMap.width();
        var nodeList = [];
        var openList = [];
        var closedList = [];
        var start = {};
        var best = start;

        if (this.x === goalX && this.y === goalY) {
            return 0;
        }

        start.parent = null;
        start.x = this.x;
        start.y = this.y;
        start.g = 0;
        start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
        nodeList.push(start);
        openList.push(start.y * mapWidth + start.x);

        while (nodeList.length > 0) {
            var bestIndex = 0;
            for (var i = 0; i < nodeList.length; i++) {
                if (nodeList[i].f < nodeList[bestIndex].f) {
                    bestIndex = i;
                }
            }

            var current = nodeList[bestIndex];
            var x1 = current.x;
            var y1 = current.y;
            var pos1 = y1 * mapWidth + x1;
            var g1 = current.g;

            nodeList.splice(bestIndex, 1);
            openList.splice(openList.indexOf(pos1), 1);
            closedList.push(pos1);

            if (current.x === goalX && current.y === goalY) {
                best = current;
                goaled = true;
                break;
            }

            if (g1 >= searchLimit) {
                continue;
            }

            for (var j = 0; j < 4; j++) {
                var direction = 2 + j * 2;
                var x2 = $gameMap.roundXWithDirection(x1, direction);
                var y2 = $gameMap.roundYWithDirection(y1, direction);
                var pos2 = y2 * mapWidth + x2;

                if (closedList.contains(pos2)) {
                    continue;
                }
                if (!this.canPass(x1, y1, direction)) {
                    continue;
                }

                var g2 = g1 + 1;
                var index2 = openList.indexOf(pos2);

                if (index2 < 0 || g2 < nodeList[index2].g) {
                    var neighbor;
                    if (index2 >= 0) {
                        neighbor = nodeList[index2];
                    } else {
                        neighbor = {};
                        nodeList.push(neighbor);
                        openList.push(pos2);
                    }
                    neighbor.parent = current;
                    neighbor.x = x2;
                    neighbor.y = y2;
                    neighbor.g = g2;
                    neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                    if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                        best = neighbor;
                    }
                }
            }
        }

        var node = best;
        while (node.parent && node.parent !== start) {
            node = node.parent;
        }

        var deltaX1 = $gameMap.deltaX(node.x, start.x);
        var deltaY1 = $gameMap.deltaY(node.y, start.y);
        if (deltaY1 > 0) {
            return 2;
        } else if (deltaX1 < 0) {
            return 4;
        } else if (deltaX1 > 0) {
            return 6;
        } else if (deltaY1 < 0) {
            return 8;
        }

        var deltaX2 = this.deltaXFrom(goalX);
        var deltaY2 = this.deltaYFrom(goalY);
        if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
            return deltaX2 > 0 ? 4 : 6;
        } else if (deltaY2 !== 0) {
            return deltaY2 > 0 ? 8 : 2;
        }

        return 0;
    };

    Game_Character.prototype.searchLimit = function() {
        return 12;
    };


//-----------------------------------------------------------------------------
// Game_Event
//
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.

    Game_Event = function () {
        this.initialize.apply(this, arguments);
        return this;
    }

    Game_Event.prototype = Object.create(Game_Character.prototype);
    Game_Event.prototype.constructor = Game_Event;

    Game_Event.prototype.initialize = function(mapId, eventId) {
        Game_Character.prototype.initialize.call(this);
        this._mapId = mapId;
        this._eventId = eventId;
        this.locate(this.event().x, this.event().y);
        //this.refresh();
    };

    Game_Event.prototype.initMembers = function() {
        Game_Character.prototype.initMembers.call(this);
        this._moveType = 1;
        this._trigger = 0;
        this._starting = false;
        this._erased = false;
        this._pageIndex = -2;
        this._originalPattern = 1;
        this._originalDirection = 2;
        this._prelockDirection = 0;
        this._locked = false;
    };

    Game_Event.prototype.eventId = function() {
        return this._eventId;
    };

    Game_Event.prototype.event = function() {
        return $dataMap.events[this._eventId];
    };

    Game_Event.prototype.page = function() {
        return this.event().pages[this._pageIndex];
    };

    Game_Event.prototype.list = function() {
        return this.page().list;
    };

    Game_Event.prototype.isCollidedWithEvents = function(x, y) {
        var events = $gameMap.eventsXyNt(x, y);
        return events.length > 0;
    };

    Game_Event.prototype.lock = function() {
        if (!this._locked) {
            this._prelockDirection = this.direction();
            this.turnTowardPlayer();
            this._locked = true;
        }
    };

    Game_Event.prototype.unlock = function() {
        if (this._locked) {
            this._locked = false;
            this.setDirection(this._prelockDirection);
        }
    };

    Game_Event.prototype.updateStop = function() {
        if (this._locked) {
            this.resetStopCount();
        }
        Game_Character.prototype.updateStop.call(this);
        if (!this.isMoveRouteForcing()) {
            this.updateSelfMovement();
        }
    };

    Game_Event.prototype.updateSelfMovement = function() {
        if (!this._locked &&
            this.checkStop(this.stopCountThreshold())) {
            switch (this._moveType) {
                case 1:
                    this.moveTypeRandom();
                    break;
                case 2:
                    //this.moveTypeTowardPlayer();
                    break;
                case 3:
                    this.moveTypeCustom();
                    break;
            }
        }
    };

    Game_Event.prototype.stopCountThreshold = function() {
        return 30 * (5 - this.moveFrequency());
    };

    Game_Event.prototype.moveTypeRandom = function() {
        switch (Math.randomInt(6)) {
            case 0: case 1:
            this.moveRandom();
            break;
            case 2: case 3: case 4:
            this.moveForward();
            break;
            case 5:
                this.resetStopCount();
                break;
        }
    };

    Game_Event.prototype.moveTypeCustom = function() {
        this.updateRoutineMove();
    };

    Game_Event.prototype.isStarting = function() {
        return this._starting;
    };

    Game_Event.prototype.clearStartingFlag = function() {
        this._starting = false;
    };

    Game_Event.prototype.isTriggerIn = function(triggers) {
        return triggers.contains(this._trigger);
    };

    Game_Event.prototype.start = function() {
        // var list = this.list();
        // if (list && list.length > 1) {
        //     this._starting = true;
        //     if (this.isTriggerIn([0,1,2])) {
        //         this.lock();
        //     }
        // }
    };

    Game_Event.prototype.erase = function() {
        this._erased = true;
        this.refresh();
    };

    Game_Event.prototype.refresh = function() {
        // var newPageIndex = this._erased ? -1 : this.findProperPageIndex();
        // if (this._pageIndex !== newPageIndex) {
        //     this._pageIndex = newPageIndex;
        //     this.setupPage();
        // }
    };


    Game_Event.prototype.isOriginalPattern = function() {
        return this.pattern() === this._originalPattern;
    };

    Game_Event.prototype.resetPattern = function() {
        this.setPattern(this._originalPattern);
    };

    Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
        // if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
        //     if (!this.isJumping() && this.isNormalPriority()) {
        //         this.start();
        //     }
        // }
    };

    Game_Event.prototype.checkEventTriggerAuto = function() {
        // if (this._trigger === 3) {
        //     this.start();
        // }
    };

    Game_Event.prototype.locate = function(x, y) {
        Game_Character.prototype.locate.call(this, x, y);
        this._prelockDirection = 0;
    };

    Game_Event.prototype.forceMoveRoute = function(moveRoute) {
        Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
        this._prelockDirection = 0;
    };




//---------------------------------------------THE END-----------------------------------
})();