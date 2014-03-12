#!/usr/bin/env node

/* -------------------------------------------------- 

  Example:
  --------  
  `curl http://localhost/robohash.js/xyz`

  Resources:
  ----------
  - https://github.com/alternatex/robohash.js 
  - https://github.com/e1ven/robohash

 -------------------------------------------------- */

var v = require('./package.json').version;

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var bootstrap = require('./lib/robohash.js'),
    colors    = require('colors'),
    qs        = require('querystring'),
    restify   = require('restify'),
    request   = require('superagent'),
    _         = require('underscore');

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

_.mixin( require('underscore.deferred') );

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

console.log();
console.log(" + ----------------------------- +");
console.log(" + ---- Robohash.js ("+v+") ---- +");
console.log(" + ----------------------------- +");

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var port = port || 8080;

var defaults = {
  width: 300,
  height: 300
};

var server = restify.createServer({
  name: 'robohash.js',
  version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var parameters = ['gravatar','ignoreext','size','set','bgset','color', 'red', 'green', 'blue'];
var gravatar_baseurl = "https://secure.gravatar.com/avatar/";

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

server.get(/\/assets\/?.*/, restify.serveStatic({
  directory: './assets'
}));

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

server.get('/image/:name', function (req, res, next) {
  
  // gather client ip
  var ip = '192.168.1.10';

  // ...
  return bootstrap.delegate(req, res, next);
});

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

server.get('/.*/', function (req, res, next) {
  
  var options = {};
  var hash = '';
  var clientip = req.headers['X-Forwarded-For'] || req.connection.remoteAddress;

  // querystring-proxy-bust:
  // -----------------------
  // Two ways to set the robo's opts, by querystring or within the path  using / as a replacement for [&?].
  // Example:
  // /abc.png/set=100x100/set=any/ is translated/processed as /abc.png?set=any&s=100x100
  
  // process pathname
  var pathname = req._url.pathname.substring(1);
  var segments = pathname.split("/");
  segments.forEach(function(segment){
    var pair = segment.split("=");
    if(parameters.indexOf(pair[0])!=-1)
      options[pair[0]]=pair[1];
  });

  // process querystring (higher order)
  _.chain(req.query).keys().each(function(key){

    // process registered parameters only
    if(parameters.indexOf(key)!=-1){

      // debug log
      if(!_.isUndefined(options[key])){
        console.log("override option".warn + " path " + JSON.stringify([key, options[key]]).info+" query "+JSON.stringify([key, req.query[key]]).info);
      }

      // assign/override
      options[key] = req.query[key];

    // fallback
    } else {

      // build hash
      //hash+=(hash.length>0?'&':'') + key+(req.query[key]? '='+req.query[key]: '');
    }
  });

  // ...
  options.ignoreext = !_.isUndefined(req.query['ignoreext']);

  // post process options: size
  if(!_.isUndefined(options['size'])){
    var size = options['size'].split('x');  
    options.width  = (4096 >= size[0] && size[0]>0) ? size[0] : defaults.width;
    options.height = (4096 >= size[1] && size[1]>0) ? size[1] : defaults.height;
  } else {
    options.width = defaults.width;
    options.height = defaults.height;
  }

  // post process options: integer values
  ['width', 'height', 'red', 'green', 'blue'].forEach(function(intVal){
    options[intVal]=parseInt(0+options[intVal]);
  });

  // fallback
  if(hash.length==0) hash = clientip;

  // helper: appendix
  var appendix = segments[segments.length-1];

  // gather resource
  var resource = (appendix.indexOf('=')!=-1 || appendix=='')?'empty':appendix;
  
  // ...
  var urlencode = function urlencode(str){
    return encodeURIComponent(JSON.stringify(str));
  };

  // ...
  hash=resource;

  if(!_.isUndefined(req.query['gravatar'])){
    var md5sum = require('crypto').createHash('md5');
    md5sum.update(hash);
    hash = md5sum.digest('hex');
  } 
  
  // ...
  var gravatar_url = gravatar_baseurl + hash + "?s=" + options.height;

  console.log("gravatar_url is: ", gravatar_url); 

  if(_.indexOf(['hashed', 'true'], req.query['gravatar'])!=-1){
    try {
      var file = require('fs').createWriteStream("./fileeee.jpg");

      var requested = request.get(gravatar_url).on('end', function(){
        var temp = require('fs').createReadStream('./fileeee.jpg');
        temp.on('data', function(data){
          res.write(data);
        }).on('end', function(data){
          res.end(data);
        });
      }).pipe(file, {end: true});

    } catch(ex){
      console.log("Gravatar retrieval using url %s failed".error, gravatar_url, ex);
    }
  } else {
    console.log("nahahahahah", req.query['gravatar'], req.query);

  options.avatar = false;

  // ...
  var Robohash = function Robohash(hash){
    this.hash = hash;
  };

  var robohash = new Robohash(hash);

  // say hi
  console.log("resource", resource, "hash", hash, "options", options, "query", req.query, "remote", clientip);

  // ...
  return bootstrap.delegate(req, res, next, options);

  // say bye
  res.end("bye");
  }
});

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

server.listen(port, function () {

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
    '                                 ']
    .join("\n").rainbow);

  // ...
  console.log('Listening at %s', server.url);

});

/*              

# Allow users to manually specify a robot 'set' that they like.
# Ensure that this is one of the allowed choices, or allow all
# If they don't set one, take the first entry from sets above.

if args.get('set',r.sets[0]) in r.sets:
  roboset = args.get('set',r.sets[0])
elif args.get('set',r.sets[0]) == 'any':
  roboset = r.sets[r.hasharray[1] % len(r.sets) ]
else:
  roboset = r.sets[0]

# If they specified multiple sets, use up a bit of randomness to choose one.
# If they didn't specify one, default to whatever we decided above.

possiblesets = []
for tmpset in args.get('sets',roboset).split(','):
  if tmpset in r.sets:
    possiblesets.append(tmpset)
if possiblesets:
  roboset = possiblesets[r.hasharray[1] % len(possiblesets) ]


# Only set1 is setup to be color-seletable. The others don't have enough pieces in various colors.
# This could/should probably be expanded at some point.. 
# Right now, this feature is almost never used. ( It was < 44 requests this year, out of 78M reqs )

if args.get('color') in r.colors:
  roboset = 'set1'
  color = args.get('color')

# If they DID choose set1, randomly choose a color.
if roboset == 'set1' and color is None:
  color = r.colors[r.hasharray[0] % len(r.colors) ]
  roboset = 'set1'

# Allow them to set a background, or keep as None
if args.get('bgset') in r.bgsets + ['any']:
  bgset = args.get('bgset')
                                         
# We're going to be returning the image directly, so tell the browser to expect a binary.
self.set_header("Content-Type", "image/" + format)

# Build our Robot.
r.assemble(roboset=roboset,format=format,bgset=bgset,color=color,sizex=sizex,sizey=sizey)

# Print the Robot to the handler, as a file-like obj
if r.format != 'datauri':
  r.img.save(self,format=r.format)
else:
  # Or, if requested, base64 encode first.
  fakefile = io.BytesIO()
  r.img.save(fakefile,format='PNG')
  fakefile.seek(0)
  b64ver = base64.b64encode(fakefile.read())
  b64ver = b64ver.decode('utf-8')
  self.write("data:image/png;base64," + str(b64ver))
*/
