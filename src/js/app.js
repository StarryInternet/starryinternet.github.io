function app() {

  // hero container
  var hero = document.querySelector('.hero');
  // onscreen canvas
  var foreground = document.querySelector('#foreground');
  // cached, offscreen background canvas
  var background = document.createElement('canvas');
  var bgctx = background.getContext('2d');
  var fgctx = foreground.getContext('2d');

  var triangles = [];

  // active rAF animation
  var anim;

  // last rAF timestamp
  var last = 0;

  // tear the whole thing down and build it up again
  function reset() {
    var hires = window.devicePixelRatio || 2;
    var width = window.innerWidth * hires;
    var height = parseInt( window.getComputedStyle( hero ).height, 10 ) * hires;

    // triangle height
    var tHeight = 30 * hires;
    // triangle scale (diameter of an enclosing circle)
    var tScale = ( 2 / 3 ) * tHeight;
    // triangle width
    var tWidth = Math.floor( ( ( Math.sqrt( 3 ) / 2 ) * ( tScale / hires ) ) * hires );

    // # horizontal triangles
    var horizontal = Math.ceil( width / tWidth ) + tWidth;
    // # vertical triangles
    var vertical = Math.ceil( height / tHeight );

    var i = 0;
    var j = 0;
    var x, y;
    var invert;

    triangles = [];

    for ( ; i < vertical; ++i ) {
      y = i * tHeight;
      for ( j = 0; j < horizontal; ++j ) {
        // invert every other triangle
        invert = ( i + j ) % 2 === 0;
        x = j * tWidth;
        triangles.push(
          new Triangle({
            x: x,
            // rotated triangles need to be offset to fit correctly
            y: y + ( invert ? tScale * 1 : tScale * 0.5 ),
            scale: tScale,
            invert: invert
          })
        );
      }
    }

    background.width = foreground.width = width;
    background.height = foreground.height = height;

    last = 0;

    cancelAnimationFrame( anim );

    bgctx.clearRect( 0, 0, background.width, background.height );
    render( 0 );
  }

  // draw some trianglezzz
  function render( timestamp ) {
    // how many frames?
    var timescale = last ? ( timestamp - last ) / ( 1000 / 60 ) : 1;
    // target random triangles
    var tag = Math.floor( Math.random() * 500 );

    fgctx.clearRect( 0, 0, foreground.width, foreground.height );
    fgctx.drawImage( background, 0, 0 );

    triangles.forEach(function( triangle, i ) {
      // make 'em blink
      if ( triangle.tag === tag ) {
        triangle.flash();
      }
      // blinking triangles go direct to fg
      if ( triangle.blink.blinking ) {
        triangle.renderIntoContext( fgctx, false );
      }
      // non-blinking go to bg and get cached
      if ( !triangle.hasRendered ) {
        triangle.renderIntoContext( bgctx, true );
        triangle.hasRendered = true;
      }
    });

    anim = requestAnimationFrame( render );
  }

  reset();

  document.body.classList.add('active');

  // debounce resize events and redraw the canvas
  window.addEventListener( 'resize', (function(){
    var timer;
    return function() {
      clearTimeout( timer );
      timer = setTimeout( reset, 100 );
    };
  }()));
}

window.addEventListener( 'DOMContentLoaded', app );

window.Starry = {
  apply: function apply() {
    window.location = 'https://starry.com/careers';
  }
};

console.log('Hi there. Looking for a new job? Just Starry.apply()');
