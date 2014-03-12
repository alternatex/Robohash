#!/bin/bash
# This is a simple script and will be executed on your CI system if 
# available.  Otherwise it will execute while your application is stopped
# before the build step.  This script gets executed directly, so it
# could be python, php, ruby, etc.

set -e

cd ~/app-root/runtime/

# create dir to put all our stuff
mkdir -p cairo
cd cairo

# libpng
curl http://optimate.dl.sourceforge.net/project/libpng/libpng15/1.5.17/libpng-1.5.17.tar.gz -o libpng.tar.gz

# jpeg
curl http://www.ijg.org/files/jpegsrc.v8d.tar.gz -o jpegsrc.tar.gz

# pixman
curl http://www.cairographics.org/releases/pixman-0.28.2.tar.gz -o pixman.tar.gz  

# freetype
curl http://download-mirror.savannah.gnu.org/releases//freetype/freetype-2.4.11.tar.gz -o freetype.tar.gz  

# cairo
curl http://cairographics.org/releases/cairo-1.12.14.tar.xz -o cairo.tar.xz  

# unpack all
tar -xzf *.tar.gz 

# remove to avoid hiting the quota
rm *.tar.gz *.tgz

# important (yeah, as all sequentially here. can be forgotten as not persisted...)
export PKG_CONFIG_PATH='/usr/local/lib/pkgconfig'  
export LD_LIBRARY_PATH='/usr/local/lib':$LD_LIBRARY_PATH  

# libpng install
cd libpng-1.5.17/
./configure --prefix=$OPENSHIFT_DATA_DIR/local
make 
make install

# jpeg install
cd jpeg-8d/
./configure --disable-dependency-tracking --prefix=$OPENSHIFT_DATA_DIR/local
make
sudo make install

# pixman install
cd pixman-0.28.2/  
./configure --prefix=$OPENSHIFT_DATA_DIR/local
make 
sudo make install  

# freetype install
cd freetype-2.4.11/  
./configure --prefix=$OPENSHIFT_DATA_DIR/local
make 
sudo make install 

# cairo install
cd cairo-1.12.14/  
./configure --disable-dependency-tracking --without-x --prefix=$OPENSHIFT_DATA_DIR/local
make 
sudo make install 

Installation Red Hat OpenShift Origin

Custom installation directory to persist. » Check existing openshift packages on how, where, naming best practices....

---

The Amazon Linux AMI comes with old packages, e.g., Cairo 1.8.8. Here's one way to get node-canvas up and running from source.

Remove the old package:

$ sudo yum erase cairo
Set up some env vars (add to ~/.bashrc):

export PKG_CONFIG_PATH='/usr/local/lib/pkgconfig'  
export LD_LIBRARY_PATH='/usr/local/lib':$LD_LIBRARY_PATH  

libpng

```bash 
curl http://optimate.dl.sourceforge.net/project/libpng/libpng15/1.5.17/libpng-1.5.17.tar.gz -o libpng.tar.gz  
tar -zxf libpng.tar.gz && cd libpng-1.5.17/
./configure --prefix=$OPENSHIFT_DATA_DIR/local
make 
make install  
```

jpeg
curl http://www.ijg.org/files/jpegsrc.v8d.tar.gz -o jpegsrc.tar.gz
tar -zxf jpegsrc.tar.gz && cd jpeg-8d/
./configure --disable-dependency-tracking --prefix=$OPENSHIFT_DATA_DIR/local
$ make
$ sudo make install
pixman

pixman

```bash
curl http://www.cairographics.org/releases/pixman-0.28.2.tar.gz -o pixman.tar.gz  
tar -zxf pixman.tar.gz && cd pixman-0.28.2/  
./configure --prefix=$OPENSHIFT_DATA_DIR/local
make 
sudo make install  
```

freetype

```bash
curl http://download-mirror.savannah.gnu.org/releases//freetype/freetype-2.4.11.tar.gz -o freetype.tar.gz  
tar -zxf freetype.tar.gz && cd freetype-2.4.11/  
./configure --prefix=$OPENSHIFT_DATA_DIR/local
make 
sudo make install 
```

cairo

```bash
curl http://cairographics.org/releases/cairo-1.12.14.tar.xz -o cairo.tar.xz  
tar -xJf cairo.tar.xz && cd cairo-1.12.14/  
./configure --disable-dependency-tracking --without-x --prefix=$OPENSHIFT_DATA_DIR/local
make 
sudo make install 
```

Now npm install canvas should build & run just fine.