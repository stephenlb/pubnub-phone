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
        callback   : function(call) {
            call.event
            phone.onincoming(call);
        }
    });
};

// -----------------------------------------------------------------------
// MAKE A CALL (OUTBOUDN)
// -----------------------------------------------------------------------
phone.call = function(args) {
    p.publish({
        channel : 'pubnub-phone-' + args.number,
        message : {
            event : 'call',
            data  : args
        }
    });
};

// -----------------------------------------------------------------------
// CREATE A CALL OBJECT
// -----------------------------------------------------------------------
var callbank = {};
function call_in() {
    var call = {
        accept  : function(cb) { call.onaccept  = cb },
        decline : function(cb) { call.ondecline = cb },
        end     : function(cb) { call.onend     = cb },
        fail    : function(cb) { call.onfail    = cb }
    };

    call.disconnect = function() {
        // .. TODO clean DISCONNECT HERE
    };

    return call;
}
function call_out() {
    var call = {
        end     : function(cb) { call.onend  = cb },
        fail    : function(cb) { call.onfail = cb }
    };

    call.disconnect = function() {
        // .. TODO clean DISCONNECT HERE
    };

    return call;
}

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
