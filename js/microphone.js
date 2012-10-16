/* Hey, let's be friends! http://twitter.com/pubnub
   Edits by JohnMHarrisJr, http://twitter.com/johnmharrisjr */

(function(){

return;
return;
return;

var p = PUBNUB;

navigator.webkitGetUserMedia( 'audio,video', function(stream) {
    var audio  = p.create('video')
    ,   source = webkitURL.createObjectURL(stream);

    /*
    p.attr( audio, 'controls', 'true' );
    p.attr( audio, 'prelaod', 'auto' );
    */
    p.attr( audio, 'autoplay', 'true' );
    p.css( audio, {
        position : 'absolute',
        top : '0',
        left : 320,
        height : 460
    } );

    audio.src = source;
    console.log(stream);
    console.log(source);

    p.search('body')[0].appendChild(audio);
} );


})();
