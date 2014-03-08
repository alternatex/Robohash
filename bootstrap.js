/**
* Bootstrap
* @module robohash
**/

var colors    = require('colors'),
    gd        = require('node-gd'),
    _         = require('underscore.deferred');

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

module.exports = {

  // ...
  delegate: function delegate(req, res, next, options){

    var dstX = 0, dstY = 0,
        srcX = 0, srcY = 0,
        dstW = options.width, dstH = options.height,            
        srcW = options.width, srcH = options.height;

    var format = "png";
    var stack = [];
    var stacked = {};

    // TODO: cache
    var cache = {
      dir: '',
      ttl: 31536000000 // 1 year in ms      
    };

    /**
    * load and stack image (w/promise)
    * 
    * @method load
    * @private
    * @return {Promise} layer.loaded
    */    
    var load = function load(filename){

      var dfd = _.Deferred();

      setTimeout(function(){
        gd.openPng(filename, function(err, image) {
          stacked[filename]=image;          
          dfd.resolve();
        });
      }, 10);

      return dfd.promise();
    }

    // ...
    var output = null;
    output = gd.createTrueColor(options.width, options.height);

    // apply background color options
    var red   = options.red   || 123,
        green = options.green || 123,
        blue  = options.blue  || 0;

    // initialize image
    output.filledRectangle(0, 0, options.width, options.height, output.colorAllocate(red, green, blue));

    // prepare images / layers in order *
    var images = [
      "assets/images/foreground/body/004-blue_body-04.png",
      "assets/images/foreground/face/000-blue_face-07.png",
      "assets/images/foreground/accessories/000-blue_accessory-01.png",
      "assets/images/foreground/mouth/006-blue_mouth-06.png",
      "assets/images/foreground/eyes/004-blue_eyes-03.png"
    ];

    // load images
    images.forEach(function(image){
      stack.push(load(image));
    });

    // when all stacked images are loaded
    _.when(stack).then(function(){

      // post process in order
      images.forEach(function(image){
        stacked[image].copyResampled(output, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH);
      })

      // write to disk
      output.savePng("out2.png", 0, function(err) {

      require('gm')("out2.png").toBuffer(function (err, buffer) {
        if (err) return handle(err);
          res.end(buffer);
        });         
        return console.log("image saved!");
      });
    });
  }
};

console.log([
  '                                 ',  
  '         \\             /        ',  
  '        __\\___________/__       ',  
  '       /                 \\      ',  
  '      /     ___    ___    \\     ',  
  '      |    /   \\  /   \\   |    ',  
  '      |    |  H || H  |   |      ',  
  '      |    \\___/  \\___/   |    ',  
  '      |                   |      ',  
  '      |  \\             /  |     ',  
  '      |   \\___________/   |     ',  
  '      \\                   /     ',  
  '       \\_________________/      ',  
  '      _________|__|_______       ',  
  '    _|                    |_     ',  
  '   / |                    | \\   ',  
  '  /  |            O O O   |  \\  ',  
  '  |  |                    |  |   ',  
  '  |  |            O O O   |  |   ',  
  '  |  |                    |  |   ',  
  '  /  |                    |  \\  ',  
  ' |  /|                    |\\  | ',  
  '  \\| |                    | |/  ',  
  '     |____________________|      ',  
  '        |  |        |  |         ',  
  '        |__|        |__|         ',  
  '       / __ \\      / __ \\      ',  
  '       OO  OO      OO  OO        ',
  '                                 '].join("\n").rainbow);