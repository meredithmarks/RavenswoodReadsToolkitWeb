
Correct syntax highlighting (plugin): https://packagecontrol.io/packages/Babel

1)

install package control: (sublime) view > show console > 

"import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)"

2) (sublime) cmd + shift + p > "Package Install: Install Package" > Babel






have webpack auto-update: ./node_modules/.bin/webpack -d --watch
otherwise: ./node_modules/.bin/webpack -d
or simpler: 
    "dev": npm run dev
    "build" : npm run build

install local server: npm install -g serve
run server: serve


general react setup, with webpack, babel, etc.