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

var bootstrap = require('./bootstrap.js'),
    colors    = require('colors'),
    qs        = require('querystring'),
    restify   = require('restify'),
    _         = require('underscore.deferred');

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

var port = port || 8080;

var server = restify.createServer({
  name: 'robohash.js',
  version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

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

  // delegate
  return bootstrap.handleXXX(req, res, next);
});

/* -------------------------------------------------- */
/*                                                    */
/* -------------------------------------------------- */

server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

/*
ip = self.request.remote_ip
  

random.shuffle(drquotes)
self.write(self.render_string('templates/root.html',ip=ip,robo=random.choice(robo),drquote1=drquotes[1],drquote2=drquotes[2],quotes=quotes))

class ImgHandler(tornado.web.RequestHandler):
  """
  The ImageHandler is our tornado class for creating a robot.
  called as Robohash.org/$1, where $1 becomes the seed string for the Robohash obj
  """
  def get(self,string=None):

    # Normally, we pass in arguments with standard HTTP GET variables, such as
    # ?set=any and &size=100x100
    # 
    # Some sites don't like this though.. They cache it weirdly, or they just don't allow GET queries.
    # Rather than trying to fix the intercows, we can support this with directories... <grumble>
    # We'll translate /abc.png/s_100x100/set_any to be /abc.png?set=any&s=100x100
    # We're using underscore as a replacement for = and / as a replacement for [&?]

    args = self.request.arguments.copy()  

    for k in list(args.keys()):
      v = args[k]
      if type(v) is list:
        if len(v) > 0:
          args[k] = args[k][0]
        else:
          args[k] = ""

    # Detect if they're using the above slash-separated parameters.. 
    # If they are, then remove those parameters from the query string.
    # If not, don't remove anything.
    split = string.split('/')
    if len(split) > 1:
      for st in split:
        b = st.split('_')
        if len(b) == 2:
          if b[0] in ['gravatar','ignoreext','size','set','bgset','color']:
            args[b[0]] = b[1]
            string = re.sub("/" + st,'',string)

    # Ensure we have something to hash!
    if string is None:
        string = self.request.remote_ip


    # Detect if the user has passed in a flag to ignore extensions.
    # Pass this along to to Robohash obj later on.

    ignoreext = args.get('ignoreext','false').lower() == 'true'

    # Split the size variable in to sizex and sizey
    if "size" in args:
        sizex,sizey = args['size'].split("x")
        sizex = int(sizex)
        sizey = int(sizey)
        if sizex > 4096 or sizex < 0:
          sizex = 300
        if sizey > 4096 or sizey < 0:
          sizey = 300
                  
    # Allow Gravatar lookups - 
    # This allows people to pass in a gravatar-style hash, and return their gravatar image, instead of a Robohash.
    # This is often used for example, to show a Gravatar if it's set for an email, or a Robohash if not.
    if args.get('gravatar','').lower() == 'yes':
      # They have requested that we hash the email, and send it to Gravatar.
      default = "404"
      gravatar_url = "https://secure.gravatar.com/avatar/" + hashlib.md5(string.lower()).hexdigest() + "?"
      gravatar_url += urlencode({'default':default, 'size':str(sizey)})
    elif args.get('gravatar','').lower() == 'hashed':
      # They have sent us a pre-hashed email address.
      default = "404"
      gravatar_url = "https://secure.gravatar.com/avatar/" + string + "?"
      gravatar_url += urlencode({'default':default, 'size':str(sizey)})
    
    # If we do want a gravatar, request one. If we can't get it, just keep going, and return a robohash
    if args.get('gravatar','').lower() in ['hashed','yes']:
      try:
        f = urlopen(gravatar_url)
        self.redirect(gravatar_url, permanent=False)  
        return
      except:
        args['avatar'] = False
          
    # Create our Robohashing object
    r = Robohash(string)


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

def main():
    tornado.options.parse_command_line()
    # timeout in seconds
    timeout = 10
    socket.setdefaulttimeout(timeout)

    settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "cookie_secret": "9b90a85cfe46cad5ec136ee44a3fa332",
    "login_url": "/login",
    "xsrf_cookies": True,
    }

    application = tornado.web.Application([
        (r'/(crossdomain\.xml)', tornado.web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__),
        "static/")}),
        (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__),
        "static/")}),
        (r"/", MainHandler),
        (r"/(.*)", ImgHandler),
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application,xheaders=True)
    http_server.listen(options.port)

    print("The Oven is warmed up - Time to make some Robots! Listening on port: " + str(options.port))
    tornado.ioloop.IOLoop.instance().start()
if __name__ == "__main__":
    main()
*/
