(function(){

// -----------------------------------------------------------------------
// PUBNUB SETUP
// -----------------------------------------------------------------------
var p = PUBNUB.init({
    publish_key : 'demo',
    subscribe_key : 'demo',
    ssl           : false
});

var pubnub_phone = p.$("pubnub-phone");

// -----------------------------------------------------------------------
// CREATE BIND TOUCH EVENTS
// -----------------------------------------------------------------------
function find_action( target, event ) {
    if (target && !p.attr( target, 'action' ))
        return find_action(target.parentNode);

    return target ? {
        action : p.attr( target, 'action' ),
        value  : p.attr( target, 'value' ),
        target : target,
        event  : event
    } : {
        action : '',
        value  : '',
        target : null,
        event  : event
    };
}
p.bind( 'mousedown,touchstart', pubnub_phone, function(e) {
    var details = find_action(e.target || e.srcElement);
    p.events.fire( details.action + '-down', details );
    return false;
} );

p.bind( 'mouseup,touchend', pubnub_phone, function(e) {
    var details = find_action(e.target || e.srcElement);
    p.events.fire( details.action + '-up', details );
//console.log( details.action + '-up' );
    return false;
} );

// -----------------------------------------------------------------------
// SHOW STATUS IN/OUT
// -----------------------------------------------------------------------
var call_tpl       = p.$('pubnub-call-template').innerHTML
,   pubnub_call    = p.$('pubnub-call')
,   pubnub_dailpad = p.$('pubnub-dialpad');

function show_call_status(args) {
    if (!args) return;

    args.buttons = p.$('pubnub-'+args.way+'-call-template').innerHTML
    pubnub_call.innerHTML = p.supplant( call_tpl, args );
    hide_screen(pubnub_dailpad);
    show_screen(pubnub_call);
}

// HIDE VIA ANIMATION
function hide_screen(screen) {
    animate( screen, [
        { d : 0.4, s : 0.7, opacity : 0 }
    ], function() {
        p.css( screen, { 'z-index' : 100 } );
    } );
}

// SHOW VIA ANIMATION
function show_screen(screen) {
    animate( screen, [
        { d : 0.0001, s : 0.5, opacity : 0.7 },
        { d : 0.4,    s : 1,   opacity : 1 }
    ], function() {
        p.css( screen, { 'z-index' : 10000 } );
    } );
}

// -----------------------------------------------------------------------
// DIALPAD NUMBER PAD KEY-PRESS
// -----------------------------------------------------------------------
var outbound_number = p.$('pubnub-dialpad-header');
outbound_number.value = '';

p.events.bind( 'dialpad-press-up', sounds.stopAll );
p.events.bind( 'dialpad-press-down', function(data) {
    sounds.play(p.supplant( 'tone/Dtmf{value}.ogg', data ));
    if (+data.value || data.value === '0')
        outbound_number.innerHTML = format_phone_number(
            outbound_number.value += data.value
        );
} );

// -----------------------------------------------------------------------
// DIALPAD CALL BUTTON
// -----------------------------------------------------------------------
p.events.bind( 'dialpad-call-down', function(data) {
    sounds.play('tone/ring-out.ogg');
    show_call_status({
        way     : 'out',
        contact : format_phone_number(outbound_number.value) || ' ',
        detail  : 'calling...'
    });
} );
// -----------------------------------------------------------------------
// END BUTTON
// -----------------------------------------------------------------------
p.events.bind( 'end-up', function(data) {
    sounds.stopAll();
    hide_screen(pubnub_call);
    show_screen(pubnub_dailpad);
} );

// -----------------------------------------------------------------------
// DIALPAD DELETE BUTTON
// -----------------------------------------------------------------------
function remove_digit() {
    outbound_number.value = outbound_number.value.slice(0,-1);
    outbound_number.innerHTML = format_phone_number(
        outbound_number.value
    );
    if (!outbound_number.value) clearInterval(outbound_number.interval);
}

p.events.bind( 'dialpad-delete-down', function(data) {
    clearTimeout(outbound_number.timeout);
    outbound_number.timeout = setTimeout( function() {
        clearInterval(outbound_number.interval);
        outbound_number.interval = setInterval( remove_digit, 40 );
    }, 400 );
    remove_digit();
} );
p.events.bind( 'dialpad-delete-up', function(data) {
    clearTimeout(outbound_number.timeout);
    clearInterval(outbound_number.interval);
} );

function format_phone_number(number) {
    var num = ''+number
    ,   len = num.length;

    if (len < 5 || len > 12) return num;
    if (len < 8) return p.supplant( '{1}-{0}', [
        num.slice(-4),
        num.slice( -7, -4 )
    ] );

    return p.supplant( '{3} ({2}) {1}-{0}', [
        num.slice(-4),
        num.slice( -7, -4 ),
        num.slice( -10, -7 ),
        num.slice( -12, -10 ) || ' '
    ] );
}

})();
