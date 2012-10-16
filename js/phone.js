/* Hey, let's be friends! http://twitter.com/pubnub
   Edits by JohnMHarrisJr, http://twitter.com/johnmharrisjr */
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

// BACKUP
var myphonenumber = 0,
calling_number = 0;

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
            if(call.data.purpose == "call"){
                phone.onincoming(call);
            }else if(call.data.purpose == "declined" && call.data.mynumber == calling_number){
                calling_number = 0;
                sounds.stopAll();
                hide_screen(pubnub_call);
                show_screen(pubnub_dailpad);
            }
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
// ACCEPT CALL
// -----------------------------------------------------------------------
phone.acceptcall = function(args) {
    p.publish({
        channel : 'pubnub-phone-' + args.number,
        message : {
            event : 'accepted',
            data  : args
        }
    });
};
// -----------------------------------------------------------------------
// DECLINE CALL
// -----------------------------------------------------------------------
phone.declinecall = function(args) {
    p.publish({
        channel : 'pubnub-phone-' + calling_number,
        message : {
            event : 'declined',
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
        /*
        p.publish({
            channel : 'pubnub-phone-' + args.number,
            message : {
                event : 'disconnect',
                data  : args
            }
        });
        */
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
