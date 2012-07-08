/* Hey, let's be friends! http://twitter.com/pubnub */
var phone = (function(){

// -----------------------------------------------------------------------
// PUBNUB SETUP
// -----------------------------------------------------------------------
var phone = {}
,   p     = PUBNUB.init({
    publish_key   : 'demo',
    subscribe_key : 'demo',
    ssl           : false
});

// -----------------------------------------------------------------------
// LISTEN FOR CALLS (INBOUDN)
// -----------------------------------------------------------------------
phone.listen = function(number) {
    p.subscribe({
        restore    : true,
        channel    : 'pubnub-phone-' + number,
        connect    : function(){ phone.onready() },
        disconnect : function(){ phone.ondisconnect() },
        reconnect  : function(){ phone.onreconnect() },
        callback   : function(message) {
            console.log(message);
        }
    });
};

// -----------------------------------------------------------------------
// MAKE A CALL (OUTBOUDN)
// -----------------------------------------------------------------------
phone.call = function(number) {
    p.publish({
        channel : 'pubnub-phone-' + number,
        message : {
            number : my_phone_number,
            name   : 'phone'
        }
    });
};

// -----------------------------------------------------------------------
// SETUP PHONE CALLBACK WITH ACCESSORS
// -----------------------------------------------------------------------
p.each( [
    'ready',
    'incoming',
    'disconnect',
    'reconnect'
], function(cb) {
    phone[cb]      = function(c) { phone['on'+cb] = c };
    phone['on'+cb] = function(){};
} );



// -----------------------------------------------------------------------
// CREATE A CALL OBJECT
// -----------------------------------------------------------------------
var callbank = {};
function create_call() {
    var callbacks = {
        established : function(){},
        ended       : function(){},
        failed      : function(){}
    },  call      = {
        established : function(cb) { callbacks.established = cb },
        ended       : function(cb) { callbacks.ended       = cb },
        failed      : function(cb) { callbacks.failed      = cb }
    };

    call.answer = function() {
        //accept call
    };

    call.decline = call.end = function() {
        //decline/end call
    };

    return call;
}
/*
    // ----------------------------
    // Receive Calls on THIS Number
    // ----------------------------
    phone.listen(6711);

    // -----------------------------
    // Make a Call to Another Device
    // -----------------------------
    var call = phone.call(4151234);

    call.connected(function(call){
        // Call Established
    });
    call.disconnected(function(call){
        // the call ended
        console.log(call.name);
        console.log(call.number);
    });

    // -----------------------------
    // Phone State
    // -----------------------------
    phone.ready(function(){
        // THIS phone ready to receive calls
    });
    phone.offline(function(){
        // THIS phone is now offline
    });
    phone.online(function(){
        // THIS phone is now online
    });

    phone.incoming(function(call){
        // ========================================
        // VoIP here
        // ---------
        // TODO: Establish a Voice Connection here.
        // ========================================
        console.log(call.name);
        console.log(call.number);

        call.disconnected(function(call){
            // the call ended
            console.log(call.name);
            console.log(call.number);
        });

        call.answer();
        call.end();
    });
*/

return phone;

})();
