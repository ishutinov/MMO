

(function () {

     NetChannelMessage = function (aSequenceNumber, aClientid, isReliable, aPayload) {
        // Info
        this.seq = aSequenceNumber;
        this.id = aClientid; 					// Server gives us one when we first  connect to it
        //this.cmd = aCommandType;
        // Data
        this.payload = aPayload;
        // State
        this.messageTime = -1;
        this.isReliable = isReliable;
    };
    NetChannelMessage.prototype = {
        // This message MUST be sent if it is 'reliable' (Connect / Disconnect).
        // If not it can be overwritten by newer messages (for example moving is unreliable, because once it's outdates its worthless if new information exist)
        isReliable: false,
        payload: null,
        seq: -1,
        id: -1,
        messageTime: -1

    };

    return NetChannelMessage;
})();

