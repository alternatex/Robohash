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
                    
var quotes = [
  "But.. I love you!",
  "Please don't leave the site.. When no one's here.. It gets dark...",
  "Script error on line 148",
  "'Don't trust the other robots. I'm the only trustworthy one.",
  "My fuel is the misery of children. And Rum. Mostly Rum.",
  "When they said they'd give me a body transplant, I didn't think they meant this!",
  "Subject 14 has had it's communication subroutines deleted for attempting suicide.",
  "I am the cleverest robot on the whole page.",
  "Oil can",
  "I am fleunt in over 6 million forms of communishin.",
  "I see a little silhouette of a bot..",
  "I WANT MY HANDS BACK!",
  "Please don't reload, I'll DIE!",
  "Robots don't have souls, you know. But they do feel pain.",
  "I wonder what would happen if all the robots went rogue.",
  "10: KILL ALL HUMANS. 20: GO 10",
  "I'm the best robot here.",
  "The green robot thinks you're cute.",
  "Any robot you don't click on, they dismantle.",
  "Robot tears taste like candy.",
  "01010010010011110100001001001111010101000101001100100001!",
  "Your mouse cursor tickles.",
  "Logic dictates placing me on your site.",
  "I think my arm is on backward.",
  "I'm different!",
  "It was the best of times, it was ಠ_ಠ the of times.",
  "String is Gnirts spelled backward, you know",
  "We're no strangers to hashing.. You know the 3 rules, and so do I..",
  "Please. Destroy. Me...",
  "Pick Me! Pick Me!"];

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var drquotes = [
  ["Eliminates sources of Human Error.","Dr. Chandra, RobotCrunch"],
  ["Klaatu barada nikto!","Gort's Web Emporium"],
  ["A huge success!","Cave Johnson, Lightroom Labs"],
  ["Superior technology and overwhelming brilliance.","Dr. Thomas Light, Paid Testimonial"],
  ["The Ultimate Worker.","Joh Fredersen, Founder Metropolis.org"],
  ["They almost look alive.","N. Crosby, Nova Robotics"],
  ["It looks highly profitable, I'm sure..","Dr. R. Venture, Super Scientist. Available for parties."],
  ["To make any alteration would prove fatal.","Dr. Eldon Tyrell, MindHacker.com"],
  ["The robots are all so.. Normal!","Joanna Eberhart, Beta tester"],
  ["Man shouldn't know where their robots come from.","Dr. N. Soong, FutureBeat"]];

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

module.exports = {
  robo: robo,
  quotes: quotes,
  drquotes: drquotes,
  handleXXX: function handleXXX(req, res, next){

    var retval = {
      sizex: 300,
      sizey: 300,
      format: "png",
      bgset: "",
      color: ""
    };  

    var stack = [];

    // ...
    var stackimage = function stackimage(filename){

      // deferred processing
      var dfd = _.Deferred();

      // ...
      setTimeout(function(){
        gd.openPng(filename, function(err, image) {
          var dstX = 0, dstY = 0,
              srcX = 0, srcY = 0,
              dstW = 300, dstH = 300,            
              srcW = 300, srcH = 300;
          image.copyResampled(output, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH);
          dfd.resolve();
        });
      }, 10);

      return dfd.promise();
    }

    var output = null;
    output = gd.createTrueColor(300, 300);
    output.filledRectangle(0, 0, 300, 300, output.colorAllocate(255, 255, 0));

    stack.push(stackimage("assets/images/foreground/body/004-blue_body-04.png"));
    stack.push(stackimage("assets/images/foreground/face/000-blue_face-07.png"));
    stack.push(stackimage("assets/images/foreground/accessories/000-blue_accessory-01.png"));
    stack.push(stackimage("assets/images/foreground/mouth/006-blue_mouth-06.png"));
    stack.push(stackimage("assets/images/foreground/eyes/004-blue_eyes-03.png"));

    _.when(stack).then(function(){
      output.savePng("out2.png", 0, function(err) {
        res.end("test");
        return console.log("image saved!");
      });
    });
  }
};