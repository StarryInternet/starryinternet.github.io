/**
 * I'm not proud of this, okay?
 */

function Triangle( opts ) {
  this.scale = opts.scale;
  this.x = opts.x;
  this.y = opts.y;
  this.invert = opts.invert;
  this.angle = ( this.invert ? -90 :90 ) * ( Math.PI / 180 );
  this.pallete = ~~( Math.random() * Triangle.colors.length );
  this.hue = Triangle.colors[ this.pallete ][ 0 ];
  this.saturation = Triangle.colors[ this.pallete ][ 1 ];
  this.lightness = Triangle.colors[ this.pallete ][ 2 ];
  this.blink = {};
  this.tag = Math.floor( Math.random() * 500 );
}

Triangle.colors = [
  [ 5, 95, 70 ],
  [ 222, 15, 52 ],
  [ 223, 33, 35 ],
  [ 231, 61, 19 ],
  [ 210, 22, 79 ]
];

// get its color (including blink stuff) as hsla string
Triangle.prototype.color = function() {
  var progress, bump = 0, h, s, l, delta;

  if ( this.blink.blinking ) {
    progress = ( Date.now() - this.blink.start ) / this.blink.duration;
    bump = 2 * ( progress >= 0.5 ? 1 - progress : progress );
  }

  delta = ( 100 - this.lightness );

  h = this.hue;
  s = this.saturation;
  l = this.lightness + ( delta * bump );

  if ( progress >= 1 ) {
    this.blink.blinking = false;
  }

  return 'hsla( ' + h + ', ' + s + '%, ' + l + '%, 1 )';
};

// get its color (NOT including blink stuff) as hsla string
Triangle.prototype.naturalColor = function() {
  var h = this.hue;
  var s = this.saturation;
  var l = this.lightness;

  return 'hsla( ' + h + ', ' + s + '%, ' + l + '%, 1 )';
};

// get an array of [ x, y ] coordinates
Triangle.prototype.coords = function() {
  var i = 1, out = [], sides = 3, x, y;

  for ( ; i <= sides; ++i ) {
    x1 = Math.cos( i * 2 * Math.PI / sides );
    y1 = Math.sin( i * 2 * Math.PI / sides );
    // apply rotation
    x = x1 * Math.cos( this.angle ) - y1 * Math.sin( this.angle );
    y = y1 * Math.cos( this.angle ) + x1 * Math.sin( this.angle );
    // save and add position offsets + scaling
    out.push([ this.x + x * this.scale, this.y + y * this.scale ]);
  }

  return out;
};

// actually, this one's named pretty well...
Triangle.prototype.renderIntoContext = function( ctx, natural ) {
  var coords = this.coords();
  var length = coords.length;
  var i = 0;

  ctx.fillStyle = natural ? this.naturalColor() : this.color();
  ctx.beginPath();
  ctx.moveTo( coords[ 0 ][ 0 ], coords[ 0 ][ 1 ] );

  for ( ; i < length; ++i ) {
    ctx.lineTo( coords[ i ][ 0 ], coords[ i ][ 1 ] );
  }

  ctx.lineTo( coords[ 0 ][ 0 ], coords[ 0 ][ 1 ] );
  ctx.fill();
  ctx.closePath();
};

// make it blink
Triangle.prototype.flash = function() {
  if ( !this.blink.blinking ) {
    this.blink.blinking = true;
    this.blink.start = Date.now();
    this.blink.duration = 1000 + Math.random() * 3000;
  }
};
