# Require library
gd = require 'node-gd'

width = 300
height = 300

# Create blank new image in memory
output_img = gd.createTrueColor width, height

color = output_img.colorAllocate(255,255,0)
output_img.filledRectangle(0,0,300,300,color)

# Load existing image file on disk into memory
gd.openPng "assets/images/foreground/body/004-blue_body-04.png", (err, input_img) ->
  console.error "error: ", err
  console.log "width: ", input_img.width
  console.log "height: ", input_img.width
  
  dstX=0
  dstY=0
  srcX=0
  srcY=0
  dstW=300
  dstH=300
  srcW=300
  srcH=300

  # Render input over the top of output
  input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH

  gd.openPng "assets/images/foreground/face/000-blue_face-07.png", (err, input_img) ->
    console.error "error: ", err
    console.log "width: ", input_img.width
    console.log "height: ", input_img.width

    dstX=0
    dstY=0
    srcX=0
    srcY=0
    dstW=300
    dstH=300
    srcW=300
    srcH=300

    # Render input over the top of output
    input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH

    gd.openPng "assets/images/foreground/accessories/000-blue_accessory-01.png", (err, input_img) ->
      console.error "error: ", err
      console.log "width: ", input_img.width
      console.log "height: ", input_img.width

      dstX=0
      dstY=0
      srcX=0
      srcY=0
      dstW=300
      dstH=300
      srcW=300
      srcH=300

      # Render input over the top of output
      input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH

      gd.openPng "assets/images/foreground/mouth/006-blue_mouth-06.png", (err, input_img) ->
        console.error "error: ", err
        console.log "width: ", input_img.width
        console.log "height: ", input_img.width

        dstX=0
        dstY=0
        srcX=0
        srcY=0
        dstW=300
        dstH=300
        srcW=300
        srcH=300

        # Render input over the top of output
        input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH

        gd.openPng "assets/images/foreground/eyes/004-blue_eyes-03.png", (err, input_img) ->
          console.error "error: ", err
          console.log "width: ", input_img.width
          console.log "height: ", input_img.width

          dstX=0
          dstY=0
          srcX=0
          srcY=0
          dstW=300
          dstH=300
          srcW=300
          srcH=300

          # Render input over the top of output
          input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH

          # Write image buffer to disk
          output_img.savePng "out.png", 0, (err) ->
            console.log "image saved!"