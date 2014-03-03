/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var colors    = require('colors'),
    gd        = require('node-gd'),
    _         = require('underscore.deferred');

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var robo = [
  "\n", 
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
  '       OO  OO      OO  OO         ', 
  "\n"
];
              
/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

module.exports = {

  // ...
  robo: robo,
  quotes: quotes,
  drquotes: drquotes,
  
  /**
  * TBD
  * 
  * @method delegate
  * @public
  * @return {Object}
  */    
  delegate: function delegate(req, res, next){

    var dstX = 0, dstY = 0,
        srcX = 0, srcY = 0,
        dstW = 300, dstH = 300,            
        srcW = 300, srcH = 300;

    var format = "png";
    var stack = [];

    /**
    * Loads image onto stack
    * 
    * @method load
    * @private
    * @return {Promise} layer.loaded
    */    
    var load = function load(filename){

      var dfd = _.Deferred();

      setTimeout(function(){
        gd.openPng(filename, function(err, image) {
          image.copyResampled(output, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH);
          dfd.resolve();
        });
      }, 10);

      return dfd.promise();
    }

    var output = null;
    output = gd.createTrueColor(300, 300);
    output.filledRectangle(0, 0, 300, 300, output.colorAllocate(255, 255, 0));

    stack.push(load("assets/images/foreground/body/004-blue_body-04.png"));
    stack.push(load("assets/images/foreground/face/000-blue_face-07.png"));
    stack.push(load("assets/images/foreground/accessories/000-blue_accessory-01.png"));
    stack.push(load("assets/images/foreground/mouth/006-blue_mouth-06.png"));
    stack.push(load("assets/images/foreground/eyes/004-blue_eyes-03.png"));

    _.when(stack).then(function(){
      output.savePng("out2.png", 0, function(err) {
        res.end("test");
        return console.log("image saved!");
      });
    });
  }
};