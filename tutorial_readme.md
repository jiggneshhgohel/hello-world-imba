### Tutorial Steps

Create an empty repository named `hello-world-imba` in your account with any Cloud-based Git service, for e.g. I created it on my Github account whose URL
is https://github.com/jiggneshhgohel/hello-world-imba.git. In the steps below we will be using this URL.

Now on your local machine create a directory `imba` at a desired location

```
$ mkdir imba
```

Now create an empty directory, under `imba`, naming it by the repo name

```
imba$ mkdir hello-world-imba
```

In the steps below we will refer the path `imba/hello-world-imba` as `project_root`

Now clone the repository on your local machine under `imba` directory

```
project_root$ git clone https://github.com/jiggneshhgohel/hello-world-imba.git .
```

Now we setup the initial skeleton

```
project_root$ mkdir -p src/backend
project_root$ mkdir -p src/frontend
project_root$ mkdir dist
```

Now we generate a plain old package.json

```
project_root$ npm init
```

Answer all questions with the default values or your desired values. For e.g. mine values looked like

```
package name: (hello-world-imba)
version: (1.0.0)
description: Hello World for Imba
entry point: (index.js)
test command:
git repository: (https://github.com/jiggneshhgohel/hello-world-imba.git)
keywords: imba
author: Jignesh Gohel
license: (ISC)
About to write to /jwork/imba/hello-world-imba/package.json:

{
  "name": "hello-world-imba",
  "version": "1.0.0",
  "description": "Hello World for Imba",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jiggneshhgohel/hello-world-imba.git"
  },
  "keywords": [
    "imba"
  ],
  "author": "Jignesh Gohel",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/jiggneshhgohel/hello-world-imba/issues"
  },
  "homepage": "https://github.com/jiggneshhgohel/hello-world-imba#readme"
}


Is this OK? (yes)
```

At this point we are done with setting up the project's initial skeleton. Now we will push this to the cloud repository. Note that we will need to create `.gitkeep` files under empty folders to commit them to the repository.

```
project_root$ touch src/backend/.gitkeep
project_root$ touch src/frontend/.gitkeep
project_root$ touch dist/.gitkeep

project_root$ git add src
project_root$ git add dist

project_root$ git commit -m "project's initial skeleton"
```

-----------------------------

Now we will create a file which will be served when someone opens our application at http://localhost:8080.

```
project_root$ touch dist/index.html
```

and add following content to it

```
<!doctype html>
<html class="no-js" lang="">
  <head>
    <title>Hello World</title>
    <meta charset="utf-8">
  </head>

  <body>
    <script src="client.js"></script>
  </body>
</html>
```


Now to serve that file, we write a small Node.js HTTP server. We will use [expressjs](https://expressjs.com) to write the server and we will write it using [Imba](http://imba.io) programming language.

So let's create the file in which we will be writing our server:

```
project_root$ touch src/backend/server.imba
```

Next we will install the dependencies i.e. [express](https://www.npmjs.com/package/express) and [imba](https://www.npmjs.com/package/imba)

```
project_root$ npm install express --save
project_root$ npm install imba --save
```

Those commands should do 2 things:

1. generate a `package-lock.json` under `project_root`

2. update `package.json` by adding `dependencies` section which should look like following

```
  "dependencies": {
    "express": "^4.16.4",
    "imba": "^1.4.1"
  }
```

_Note: The dependencies versions are the then versions when the dependencies were installed at on this tutorial author's local machine_.

3. You should see a `node_modules` folder created under `project_root`. This folder contains all the dependencies we have installed till now. So a lot of files!
Now a question might be raised whether it will be practical to commit this folder to the repository or not. For that following [StackOverflow Post](https://stackoverflow.com/a/19416403/936494) can be referred to, but in our case we don't need to do commit this folder and hence it should be be ignored while commiting the changes. For making this happen we need to introduce a `.gitignore` file under `project_root`.

Once `.gitignore` file is created we can manually add entries to it OR we can use the industry-recommended standard entries for a Node-based project. So we will take the latter approach and for that we will globally install a package named [gitignore](https://www.npmjs.com/package/gitignore). To install it run the following command:

```
project_root$ npm install gitignore -g
```

_Note: If you encounter any permission issues then try running with `sudo` i.e. `sudo npm install gitignore -g`_


Once installed we will fetch the `.gitignore` for type `Node` using following command:

```
project_root$ gitignore Node
```

At this point we will have a `.gitignore` file available under `project_root`. Now if you run following command you should not see `node_modules` folder available for committing
to the repository.

```
project_root$ git status
```

OK now let's commit the changes we have done until now and in subsequent steps we will take the up writing of server

-----------------------------

Now we will write our server we mentioned about earlier. To do that open up `src/backend/server.imba` in a text-editor and add following code to it:

```
var express = require 'express'
var server = express()

server.use(express.static('./dist'))

var port = process:env.PORT or 8080

var server = server.listen(port) do
    console.log 'server is running on port ' + port
```

**Now there in we have the following line**

```
server.use(express.static('./dist'))
```

**which looks interesting and needs some explanation. That basically indicates that our server shall serve static files from `project_root/dist` folder. At this time we have just one file `index.html` here and later we will have our front-end code written in Imba compiled and added to this folder. Refer [here](https://expressjs.com/en/starter/static-files.html) for more details on how Express serves static files.**


Now the question arises how do we run this server? Will that code run using the default Node.js interpreter (`v10.14.0` as of this writing)? Let’s give it a try:


```
project_root$ node ./src/backend/server.imba
$project_root$/src/backend/server.imba:1
(function (exports, require, module, __filename, __dirname) { var express = require 'express'
                                                                                    ^^^^^^^^^

SyntaxError: Unexpected string
    at new Script (vm.js:79:7)
    at createScript (vm.js:251:10)
    at Object.runInThisContext (vm.js:303:10)

```

No, it doesn’t. Probably because the server code is written in Imba language and Node understands Javascript only.
So we will need to use the Imba's compiler to compile the code to JavaScript. To do the compilation we can follow the Usage instructions at https://www.npmjs.com/package/imba#usage but to do that we will need to globally install imba. So let's do that:

```
project_root$ npm install -g imba
```

_Note: If you encounter any permission issues then try running with `sudo` i.e. `sudo npm install -g imba`_

Now to compile run following command

```
project_root$ imbac src/backend/server.imba
```

That should compile and generate `server.js` under `project_root/src/backend`

Now try running `server.js`

```
project_root$ node ./src/backend/server.js
```

and you should see the log `server is running on port 8080`. Now open up a browser and type in `localhost:8080`. You should see `Hello World` in the browser's page title.
Congrats!

**Now one might wonder that we didn't explicitly requested any file then how come the `index.html` was served? That's because our server is implemented to serve static files.
And if you check at https://expressjs.com/en/api.html#express.static you should find that `express.static(root, [options])` accepts an option named `index` which has its default value set to `index.html`. So this is why `index.html` gets automatically served as root page of our application.**

Now we can get rid of compilation step and hence the compiled `.js` file by using the `imba` utility which as per [imba docs](https://www.npmjs.com/package/imba#imba-1) is a basic node wrapper for running imba-scripts. So what we can do is

```
project_root$ imba src/backend/server.imba
```

That should compile and execute `server.imba` and you should see the log `server is running on port 8080` and access the application.

Now at this point in time we just have a handful of files in our application and also we have yet to build and serve the front-end code for the browser i.e. the `client.js`
included in our `project_root/dist/index.html` and this front-end code also we will write in Imba. So that brings us to following tasks:

1. Compiling our `.imba` files.

2. Starting the back-end server.

3. Serving our front-end code written in `Imba`.

That's a lot in terms of manual operations, so we should consider automating those tasks. So that brings us to [Webpack](https://webpack.js.org/). Following is an easy-to-understand description quoted (with slight modifications) from a nice [beginner Node tutorial](https://www.nodebeginner.org/blog/post/setting-up-a-javascript-project-for-es6-development-with-babel-and-webpack/) I found on web.

> Webpack describes [itself](https://webpack.js.org/concepts/) as *a static module bundler for modern JavaScript applications*.The reason it exists is that the way we want to organize our own code and its external dependencies, and the way that JavaScript and other assets are best served to a browser, are often very different, and this difference can be cumbersome to manage.

> Webpack makes this a lot easier: we organize and write our own code the way we want, we refer to external dependencies like the NPM-installed packages the way we want, and we have Webpack bundle it all together in one single bundle file which has all the content the browser needs, served in the format it likes.

> The price we pay for this is some setup work that we need to do, but which isn’t that complicated.

One more easy to understand explanation of the purpose of Webpack I found [here](https://medium.com/@paul.allies/webpack-managing-javascript-and-css-dependencies-3b4913f49c58).
I have quoted it below with slight modifications:

> Webpack is a build tool to manage your dependencies (css, js, etc.). But why do we need it when we can just add js and css to our html file.

> For a small size application we don’t need to manage the dependencies of js and css, however as your application grows they will need to be kept track of
many file dependencies and their loading order. Additionally, code minification is not implemented. Webpack helps is in improving our dependency management.

So we start by installing [Webpack](https://www.npmjs.com/package/webpack)

```
project_root$ npm install webpack --save
```

That should do following 2 things:

1. update `package.json` by updating `dependencies` section under it by appending it `webpack` package like following

```
  "webpack": "^4.29.0"
```

_Note: The dependencies versions are the then versions when the dependencies were installed at on this tutorial author's local machine_.

2. update `package-lock.json` w.r.t changes in `package.json`

Now we will need to create a `webpack.config.js` under `project_root` which Webpack will use. For more details on that file please refer the [official documentation](https://webpack.js.org/configuration/)

```
project_root$ touch webpack.config.js
```

Now open up the file in a text-editor and add following content to it:

```
const path = require('path');

module.exports = {
    entry: {
      app: path.resolve(__dirname, 'src/frontend/client.imba')
    },
    module: {
        rules: [
            {
                use: 'imba/loader',
                // Only run `.imba` files through Imba Loader
                test: /\.imba$/,
            }
        ]
    },
    resolve: {
        extensions: ['.imba', '.js', '.json']
    },
    output: {
        filename: "client.js",
        path: path.resolve(__dirname, 'dist')
    }
}
```

That config tells Webpack several things:

* the entry file of our frontend application is `src/frontend/client.imba` which should be compiled and output a bundle in `project_root/dist/client.js`. Starting at the entry file webpack will merge all the code into one bundle file, here called `client.js` which would be generated in `project_root/dist` folder which is configured throug the `output` option as shown above.

* we want to use the Imba loader `imba/loader`. Usually a loader is to be installed like other packages but in case of Imba in its recent versions it comes with its own Webpack loader. Please refer [here](https://www.npmjs.com/package/imba-loader) for more details. To know more about Webpack Loaders please refer [here](https://www.npmjs.com/package/webpack#loaders)

* Imba loader loader shall only process `.imba` files

^^^^^^^^^^^^^^^^^

Note: `path` is a utility Node module. For more information refer the [official documentation](https://nodejs.org/api/path.html#path_path_resolve_paths)

^^^^^^^^^^^^^^^^^

Next to automate our server start step we update our `package.json` in following manner:

* Remove `"main": "index.js"` from it

* Replace `"scripts"` entry with following

```
  "scripts": {
    "start": "imba src/backend/server.imba",
    "build": "webpack"
  }
```

Refer following links for more details on the `start`, `build` entries:

* https://docs.npmjs.com/misc/scripts
* https://webpack.js.org/guides/getting-started/#npm-scripts
* https://stackoverflow.com/questions/34829673/build-script-in-package-json-using-webpack-with-config-flag-as
* https://stackoverflow.com/a/38864024/936494

```
project_root$ npm run build
```

That should prompt to install `webpack-cli` in following manner:

```
> hello-world-imba@1.0.0 build <project_root>
> webpack

One CLI for webpack must be installed. These are recommended choices, delivered as separate packages:
 - webpack-cli (https://github.com/webpack/webpack-cli)
   The original webpack full-featured CLI.
We will use "npm" to install the CLI via "npm install -D".
Do you want to install 'webpack-cli' (yes/no): yes
Installing 'webpack-cli' (running 'npm install -D webpack-cli').
```

Type in `yes` to install `webpack-cli`. That should do 3 things:

1. update `package.json` by adding `devDependencies` section under it like following:

```
  "devDependencies": {
    "webpack-cli": "^3.2.1"
  }
```

_Note: The dependencies versions are the then versions when the dependencies were installed at on this tutorial author's local machine_.

2. update `package-lock.json` w.r.t changes in `package.json`

3. build the bundle as per the webpack config. But we should see an error like following:

```

> hello-world-imba@1.0.0 build $project_root$
> webpack


Insufficient number of arguments or no entry found.
Alternatively, run 'webpack(-cli) --help' for usage info.

Hash: 420857edf9ba66db054d
Version: webpack 4.29.0
Time: 56ms
Built at: 01/25/2019 6:21:33 PM

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/

ERROR in Entry module not found: Error: Can't resolve '$project_root$/src/frontend/client.imba' in '$project_root$'
npm ERR! code ELIFECYCLE
npm ERR! errno 2
npm ERR! hello-world-imba@1.0.0 build: `webpack`
npm ERR! Exit status 2
npm ERR!
npm ERR! Failed at the hello-world-imba@1.0.0 build script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/jignesh/.npm/_logs/2019-01-25T12_51_33_348Z-debug.log
```

So we have an error as well as warning here.

To fix the warning we add `mode: 'development'` above the `entry` option in our `webpack.config.js`. After adding the entries should look like following:

```
module.exports = {
    mode: 'development',
    entry: {
      app: path.resolve(__dirname, 'src/frontend/client.imba')
    },
    ...
    ...
    ...
}
```

The error is quite obvious: we don't have yet a file named `client.imba` under `project_root/src/frontend`. So let's create it

```
project_root$ touch src/frontend/client.imba
```

Now open it in a text-editor and add following content to it:

```
tag App

    def render
        <self>
            <p> "Hello, World!"

Imba.mount <App>
```

Now again run following command

```
project_root$ npm run build
```

and this time the bundle should be created successfully with output like following

```
> hello-world-imba@1.0.0 build <project_root>
> webpack

Hash: c4091654ca15a26c12e6
Version: webpack 4.29.0
Time: 533ms
Built at: 01/26/2019 12:39:36 AM
    Asset     Size  Chunks             Chunk Names
client.js  107 KiB     app  [emitted]  app
Entrypoint app = client.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {app} [built]
[./src/frontend/client.imba] 298 bytes {app} [built]
    + 13 hidden modules

```

Next we start the server. To do that run following command

```
project_root$ npm run start
```

Now open a browser window at http://localhost:8080/ and you should see your `Hello, World!` in the browser page.

Let’s dissect what exactly happens.

As before, opening the page in your browser sends a request to the running Node.js backend server. The server code (which has been compiled on-the-fly from Imba to Javascript via Imba Loader) receives the request for URL /, and responds with the content of file `dist/index.html`.

This HTML file is rendered by the browser. The browser encounters the `<script src="client.js"></script>` line, and as a result, it sends another request to `http://localhost:8080/client.js`.

Again, our server receives that request, and responds with the contents of file `dist/client.js`. This file has been generated by Webpack.

Running `npm run build` made Webpack look at our main frontend code file in `src/frontend/client.imba`, which it knows about because it is defined as the application entry point in `webpack.config.js`.

Then Webpack compiles our fronend code `.imba` file and adds it to the our bundle file `client.js`.

Finally, our browser receives the response from our server containing the contents of file `client.js`, and runs the contained JavaScript code, resulting in the `Hello, World!` page.

Now one last thing remains is to update our `.gitignore` file by adding `dist/client.js` because that is not intended to be pushed to our repository. So add it and save the changes and commit the changes.

-----------------------------

Now let's work onto introducing [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server). Its documentation says

> Use [webpack](https://webpack.js.org/) with a development server that provides live reloading. This should be used for development only.

> It uses [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) under the hood, which provides fast in-memory access to the webpack assets.

Now an obvious question which might arise is that why do we need webpack-dev-server when our purpose with the application is already achieved in terms that everything is working as expected. To answer that consider following:

* Presently our server is built on top of `express` and as was mentioned in earlier part of this tutorial, it just serves static files. So our application is not using its real potential in terms of it being used as a web-application framework. We are using it just for serving static files.

* Another thing is that everytime we make any changes to our frontend code in `project_root/src/frontend/client.imba` we have to rebuild the bundle using `npm run build` for making the changes come into effect on the browser and at times we might also need to restart the server using `npm run start` in case just rebuilding the bundle doesn't help.
So this frequent rebuilding of bundle, post any changes in our frontend code, becomes a tedious task as the application grows. So how we can avoid this? How about if we had some solution which continuosly watches our frontend code and as soon as we change it, the former rebuilds the package and shows the updated changes in browser automatically? Yes that sounds like live reloading and webpack-dev-server is built to solve the problem we just discussed. So we have two things:

  * watch the code changes

  * live reload the changes in browser

**watch** can be leveraged by using [webpack's watch mode](https://webpack.js.org/guides/development/#using-watch-mode) and **live reload** by [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server). webpack-dev-server also serves the static assets as was mentioned earlier in a quote from
package's documentation page.

OK now that the intention is made clear behind using the webpack-dev-server let's work onto introduce it in our application.

So we start by installing webpack-dev-server.

```
project_root$ npm install webpack-dev-server --save
```

That should do 2 things like we have explained earlier with installation of other packages i.e. it would update `dependencies` section in `package.json` and update the `package-lock.json` accordingly.

Next we remove `express` from our application.

```
project_root$ npm uninstall express
```

That again should do 2 things i.e. it would update `dependencies` section in `package.json` and update the `package-lock.json` accordingly.

The removal of `express` from our application also makes the `project_root/src/backend/server.imba` redundant. So let's remove it too.

```
project_root$ rm -r src/backend
```

Next to start webpack-dev-server we update our `package.json` in following manner:

* Replace "scripts" entry with following

```
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch",
    "start:dev": "webpack-dev-server"
  }
```

That's as per what is shown at https://webpack.js.org/guides/development/#using-webpack-dev-server. And to use that one should run following command
to enable watching

```
project_root$ npm run watch
```

That is as shown under documentation at https://webpack.js.org/guides/development/#using-watch-mode


and in another terminal you should run following command to start webpack-dev-server.

```
project_root$ npm run start:dev
```

But if you check `watch` config options' [documentation](https://webpack.js.org/configuration/watch/#watch) it says following:

> In webpack-dev-server and webpack-dev-middleware watch mode is enabled by default.

So `"watch": "webpack --watch"` in our `scripts` is redundant and hence we should remove it. After removal `scripts` should look like

```
  "scripts": {
    "build": "webpack",
    "start:dev": "webpack-dev-server"
  }
```

Now you can verify that without the explict watch script the watch is enabled. To do that run

```
project_root$ npm run start:dev
```

That should start the server and also compile the files. You should see output like following:

```
> hello-world-imba@1.0.0 start:dev <project_root>
> webpack-dev-server

ℹ ｢wds｣: Project is running at http://localhost:8080/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wdm｣: Hash: 536c074b2d6f31d8c77d
Version: webpack 4.29.0
Time: 723ms
Built at: 01/27/2019 4:49:22 PM
    Asset     Size  Chunks             Chunk Names
client.js  450 KiB     app  [emitted]  app
Entrypoint app = client.js
[0] multi (webpack)-dev-server/client?http://localhost:8080 ./src/frontend/client.imba 40 bytes {app} [built]
[./node_modules/ansi-html/index.js] 4.16 KiB {app} [built]
[./node_modules/events/events.js] 13.3 KiB {app} [built]
[./node_modules/html-entities/index.js] 231 bytes {app} [built]
[./node_modules/imba/imba.imba] 51 bytes {app} [built]
[./node_modules/imba/src/imba/index.imba] 574 bytes {app} [built]
[./node_modules/loglevel/lib/loglevel.js] 7.68 KiB {app} [built]
[./node_modules/url/url.js] 22.8 KiB {app} [built]
[./node_modules/webpack-dev-server/client/index.js?http://localhost:8080] (webpack)-dev-server/client?http://localhost:8080 7.78 KiB {app} [built]
[./node_modules/webpack-dev-server/client/overlay.js] (webpack)-dev-server/client/overlay.js 3.58 KiB {app} [built]
[./node_modules/webpack-dev-server/client/socket.js] (webpack)-dev-server/client/socket.js 1.05 KiB {app} [built]
[./node_modules/webpack-dev-server/node_modules/strip-ansi/index.js] (webpack)-dev-server/node_modules/strip-ansi/index.js 161 bytes {app} [built]
[./node_modules/webpack/hot sync ^\.\/log$] (webpack)/hot sync nonrecursive ^\.\/log$ 170 bytes {app} [built]
[./node_modules/webpack/hot/emitter.js] (webpack)/hot/emitter.js 75 bytes {app} [built]
[./src/frontend/client.imba] 313 bytes {app} [built]
    + 24 hidden modules
ℹ ｢wdm｣: Compiled successfully.
```


Now make any changes to any file say `project_root/src/frontend/client.imba` and as soon as you save those
changes you should see again see the logs like following.


```
ℹ ｢wdm｣: Compiling...
ℹ ｢wdm｣: Hash: b7f1d1366cbd4fdc956c
Version: webpack 4.29.0
Time: 21ms
Built at: 01/27/2019 5:53:51 PM
    Asset     Size  Chunks             Chunk Names
client.js  450 KiB     app  [emitted]  app
Entrypoint app = client.js
[./src/frontend/client.imba] 313 bytes {app} [built]
    + 38 hidden modules
ℹ ｢wdm｣: Compiled successfully.

```


That implies watch is working! So that is pretty much about watch in general and in context of webpack-dev-server.

^^^^^^^^^^^^^^^^^

An important thing to note is that even though watch is enabled you would initially need to run following to build the bundle


```
project_root$ npm run build
```

and on subsequent changes in files the bundle would automatically get updated. How avoiding this affects us can be verified by manually removing the file
`client.js` from `project_root/dist` and then run `npm run start:dev` and you would not find the `client.js` being generated in folder `project_root/dist`.

^^^^^^^^^^^^^^^^^

Now that webpack-dev-server is running, open a browser window at http://localhost:8080 and you should see your `Hello, World!` in the browser page.

**Wait! It doesn't show `Hello, World!`!!! It shows our application's files and directories listing.**

OK to fix that we should go back to the `npm run start:dev` command output, when it was first ran, to see if we can get any clue on why this happened? If you notice we can see a line there

```
ℹ ｢wds｣: webpack output is served from /
```

The `/` implies our that webpack-dev-server is serving files from our `project_root`. But we want to serve the files from `project_root/dist` folder because that is where
our `index.html` lies and also the bundled `client.js`. So we should need to instruct `webpack-dev-server` to serve files from `project_root/dist`. So how we do that? Now if
you check the package's documentation at https://www.npmjs.com/package/webpack-dev-server#the-result there is a paragraph referencing a link to the documentation

> See the [documentation](https://webpack.js.org/configuration/dev-server/#devserver) for more use cases and options.

Let's open that link and see what we find there.

We can see a [devServer](https://webpack.js.org/configuration/dev-server/#devserver) option which looks like it can help us resolve the problem we are facing. Let's introduce
that option in our `webpack.config.js` by adding following:

```
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  }
```

After adding it should look like

```
...

module.exports = {
    ...
    ...
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    }
}
```

Now stop and restart the server

```
project_root$ npm run start:dev
```

This time you should see an following additional line in the output in addition to the output previously shown for this command

```
ℹ ｢wds｣: Content not from webpack is served from $project_root$/dist
```

Now open a browser window at http://localhost:8080 and you should see your `Hello, World!` in the browser page.

Now edit the code in `project_root/src/frontend/client.imba` by changing

```
  <p> "Hello, World!"
```

TO

```
  <p> "Hello, World! Live reloaded!"
```

and you should see this change automatically in effect in browser page at http://localhost:8080. Congrats!

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Now one might wonder like earlier with express-based server that we didn't explicitly requested any file then how come the `index.html` was served? To answer that
webpack has a configuration option [devServer.index](https://webpack.js.org/configuration/dev-server/#devserver-index) which defaults to value `index.html`. How is that because in documentation it is not specified? To answer that you should refer https://github.com/webpack/webpack-dev-middleware#index option's default value and as has been mentioned earlier `webpack-dev-server`uses `webpack-dev-middleware` under the hood. For curious people like me I figured that out from [webpack-dev-server code](https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L471) and if you search for `middleware` in that file you will find `this.middleware` set to `webpackDevMiddleware` at [line](https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L166)**


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now one minor change: If you check the [documentation](https://webpack.js.org/configuration/dev-server/#devserver-contentbase) for `devServer.contentBase` option you can see that
there is following section

> Usage via the CLI

which shows how the `contentBase` option can be specified in command-line. To use it from command-line we should two things:

1. Remove following config option we added to our `webpack.config.js`

```
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    }
```

2. Update `package.json` by updating `scripts` section in following manner:

```
  "scripts": {
    "build": "webpack",
    "start:dev": "webpack-dev-server --content-base dist"
  }
```

**Note that this `path` specified is relative to our `project_root`.**

So finally we are done with this. Now save the changes made in codebase and commit the changes.

-----------------------------

Now let's introduce CSS into our application for styling our page. For this application we would use [W3.CSS](https://www.w3schools.com/w3css/default.asp). Its's documentation says

> W3.CSS is a modern CSS framework with built-in responsiveness. It supports responsive mobile first design by default, and it is smaller and faster than similar CSS frameworks.

> W3.CSS can also speed up and simplify web development because it is easier to learn, and easier to use than other CSS frameworks

So using W3.CSS we can avoid writing the boilerplate for standard styles needed in a typical web application.

OK so let's start.

First download the W3.CSS from the official [source](https://www.w3schools.com/w3css/default.asp).

Next create a folder `css` under `project_root/src` and copy the downloaded W3.CSS to it.

Next open up `project_root/dist/index.html` in an editor and add following content under the `<head>` tag in it:

```
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="src/css/w3.css">
```

Next open up `project_root/src/frontend/client.imba` in an editor and replace the code under `<self>` with following:

```
<div.w3-container.w3-teal>
    <h1> "Hello, World!"

<div.w3-container>
    <p>
        "This is the traditional Hello World application built using "
        <a href="http://imba.io" target="_blank"> "Imba"
        <span> "."

<div.w3-container.w3-teal>
    <p> "Footer"
```

_**Note that Imba is indentation-based so inconsistent indentation would cause Imba compiler to raise errors**_


Now re-build the bundle using following command, in case you made the above change prior running `npm run start:dev`.


```
project_root$ npm run build
```

*If the webpack-dev-server was first started and then the changes were made that should have caused Webpack to automatically rebuild the bundle. To recollect refer the details above regarding watch and live-reloading explained in earlier part of the tutorial.*

Assuming webpack-dev-server is not running start it using command

```
project_root$ npm run start:dev
```

and then open a browser window at http://localhost:8080 and you should see the the content added in `client.imba` to be rendered as styled with the W3.CSS stylings we used.

**Wait! It shows updated content but no styles are getting applied.**

OK to find out the root cause behind this problem we should look into Browser's Developer Tools. For e.g. in Firefox `Inspector` tab I can see the DOM source.
There in we need to look into whether the `src/css/w3.css` path is resolved and whether the stylesheet is loaded. Checking that we should see that the stylesheet
is not loaded and hence the stylings weren't applied to markup. To find out the cause behind it not getting resolved try accessing the CSS file from the browser by
typing in `http://localhost:8080/src/css/w3.css` in the address bar and you should see following message

> Cannot GET /src/css/w3.css

So the root cause is that the CSS file path is not getting resolved. Now if you recollect we specified `--content-base dist` in `start:dev` script command. As we are already aware the path specified for content-base tells the webpack-dev-server where to serve the content from. It already serves the content from `project_root/dist` folder. And now we want the server to serve our CSS files from `project_root/src/css` folder. So we have a need to serve content from multiple folders of our application. Now if we check
the `devServer.contentBase` [documentation](https://webpack.js.org/configuration/dev-server/#devserver-contentbase) it says

> It is also possible to serve from multiple directories:

so we should leverage this feature. To do this we update the `scripts` section in our `package.json` in following manner

```
  "scripts": {
    "build": "webpack",
    "start:dev": "webpack-dev-server --content-base dist --content-base src/css"
  },
```

**_Note: Refer https://stackoverflow.com/a/54492872/936494 regarding from CLI how multiple directories can be specified for `--content-base` argument)_**

Now stop and restart the server. This time when you start the server you should see logs like following:

```
> hello-world-imba@1.1.0 start:dev $project_root$
> webpack-dev-server --content-base dist --content-base src/css

ℹ ｢wds｣: Project is running at http://localhost:8080/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from $project_root$/dist, $project_root$/src/css
ℹ ｢wdm｣: Hash: b7dea8b91a7a1758297f
```

which informs that server is serving content from following folders: `project_root/dist`, `project_root/src/css`.

Now let's again open the URL `http://localhost:8080` and see that we get the styled page.

**Nope! It still shows unstyled page!**

OK that implies the CSS file is still not getting loaded. In that case let's try to access the CSS file directly using URL `http://localhost:8080/src/css/w3.css`.
No it shows the same error previously seen:

> Cannot GET /src/css/w3.css

OK so what could be the issue now? Pondering over how the `index.html` from `project_root/dist` is served, we don't access the `index.html` by specifying the full path
in URL i.e we don't use the URL `http://localhost:8080/dist/index.html`. Accessing that URL should show following error:

> Cannot GET /dist/index.html

But if we use the URL `http://localhost:8080/index.html` we can see the page contents being rendered. So we can infer that to access the files served from specified
content-base paths we should access those files without prefixing those file-names with those specified paths i.e. to access `w3.css` from `src/css`, we should use
the URL `http://localhost:8080/w3.css` and NOT `http://localhost:8080/src/css/w3.css`. So let's try accessing the former URL `http://localhost:8080/w3.css`. Bingo! The CSS file got loaded. So according to this finding, for the CSS to be resolved by `index.html` we should update the following line in it

```
<link rel="stylesheet" href="src/css/w3.css">
```

WITH

```
<link rel="stylesheet" href="w3.css">
```

Now try refreshing the page in browser. Bingo! Now we can see a styled Hello, World! page. Congrats!

Now save the changes made in codebase and commit the changes.

-----------------------------

Now that CSS is successfully integrated into our application let's work onto managing this dependency through Webpack because as of now we manage its inclusion in our `index.html` manually. Webpack makes this management possible through its Loaders concept.

Following are some easy to understand explanation of the Loaders I found at referenced places:

[Reference-1](https://medium.com/@paul.allies/webpack-managing-javascript-and-css-dependencies-3b4913f49c58).

> Loaders are tasks that are applied on a per file basis and run when webpack is building your bundle. A typical task would be preprocess a sass file into css and load the output into the head section of our html file.


[Reference-2](https://medium.com/a-beginners-guide-for-webpack-2/webpack-loaders-css-and-sass-2cc0079b5b3a)

> Webpack by itself only knows javascript, so when we want it to pack any other type of resources like .css or .scss or .ts, webpack needs help in order to compile and bundle those non-javascript types of resources.

> Loaders are the node-based utilities built for webpack to help webpack to compile and/or transform a given type of resource that can be bundled as a javascript module.

_Also we have already seen a Loader in action earlier, the Imba Loader, we configured in our `webpack.config.js`._


So getting back to our requirement we would utilize following loaders: [css-loader](https://www.npmjs.com/package/css-loader) and [style-loader](https://www.npmjs.com/package/style-loader). Again quoting the easy to follow explanation of both of them from **Reference-2** mentioned above:

> css-loader would help webpack to collect CSS from all the css files referenced in your application and put it into a string.

> style-loader would take the output string generated by the css-loader and put it inside the `<style>` tags in our `index.html` file.

So let's start by installing them

```
project_root$ npm install css-loader style-loader --save-dev
```

__*Note that we are using `--save-dev` option above because these dependencies are really development dependencies and should not be required to be installed on
if we deploy this application to a live server (aka production environment). Earlier also we installed various dependencies like `webpack`, `webpack-dev-server` which
when installed got added to `dependencies` section in our `package.json` and NOT in `devDependencies` section. That's because we just used the `--save` option, instead of
`--save-dev` option while installing them. From now onwards in any installation steps we will use use those installation options as applicable.*__

OK so getting back to our installation step, that should do following 2 things:

1. update package.json by updating `devDependencies` section under it by appending it `css-loader` and `style-loader` packages like following

```
  "css-loader": "^2.1.0",
  "style-loader": "^0.23.1",
```

_Note: The dependencies versions are the then versions when the dependencies were installed at on this tutorial author's local machine._

2. update `package-lock.json` w.r.t changes in `package.json`

Next we will update our `webpack.config.js` by adding configuration for these loaders. To do that open the file in a text-editor and add following to `module.rules` array
like we added for Imba loader:

```
{
    use:['style-loader','css-loader'],
    test:/\.css$/
}
```

That tells webpack that for any file which has filename matching with the regular expression specified in the `test` property, first use `css-loader` to compile those and then use `style-loader` on the output of `css-loader`. **Note, the order in which webpack applies loaders on the matching resources is from last to first.** This can be also seen
specified in the official [documentation](https://webpack.js.org/concepts/loaders/#configuration) as quoted below:

> Loaders are evaluated/executed from right to left

Now that for those loaders to bundle our CSS they will need to finds it in the dependency tree when it starts building the package starting from the entry file configured in `webpack.config.js`. To make it found we do two thing:

1. update `project_root/dist/index.html` by removing the following `<link>` tag we manually added in earlier steps.

```
<link rel="stylesheet" href="w3.css">
```

That is because now we need the inclusion of our CSS to be managed by webpack so we simply remove it and to make our configured loaders find the CSS we add it to our dependency tree by following the step 2 below

2. update our entry file i.e. `project_root/src/frontend/client.imba` by adding following `import` statement at the top to have it considered as a module dependency by webpack.

```
import '../css/w3.css'
```

_Note: `import` is supported by Imba. You can find examples at http://imba.io/guides/language/modules_


Now re-build the bundle using following command, in case you made the above change prior running `npm run start:dev`.


```
project_root$ npm run build
```

*If the webpack-dev-server was first started and then the changes were made that should have caused Webpack to automatically rebuild the bundle. To recollect refer the details above regarding watch and live-reloading explained in earlier part of the tutorial.*

Assuming webpack-dev-server is not running start it using command

```
project_root$ npm run start:dev
```

and then open a browser window at http://localhost:8080 and you should see the the styled content.

Now open the Browser's Developer Tools, for e.g. in Firefox `Inspector` tab check the DOM source you should find the source of our `w3.css` injected as a string into
`<style>` tag under `<head>` tag which confirms that the styling was injected by our configured css-loader and style-loader because how we initially referenced our
CSS using `<link>` tag, to make the styles available for use to our page, we removed it in step 1 earlier.

One last thing: Since we removed the `<link>` tag referencing our CSS there seems now no need to make webpack-dev-server serve content from `src/css` folder. Thus we should
update our `package.json` by removing `--content-base src/css` option from `"start:dev"` command. After doing that our `scripts` section should look like

```
  "scripts": {
    "build": "webpack",
    "start:dev": "webpack-dev-server --content-base dist"
  },
```

Now restart the server again and refresh the page at http://localhost:8080 and you should still see the the styled content.

Now save the changes made in codebase and commit the changes.

-----------------------------

Continuing our CSS management part from previous steps now we will work onto introducing a Webpack Plugin which should facilitate bundling our CSS in a separate file, unlike
bundling and getting it injected into `<style>` tag. An easy to follow reasoning for doing this is quoted below, with slight modifications, from [this](https://medium.com/a-beginners-guide-for-webpack-2/extract-text-plugin-668e7cd5f551) reference:

> getting the CSS files bundled and then getting the resulting css included within the <style> tags is okay at the point of the beginning of the development phase when we have very little css, but as our CSS will grow, it would be nice to have our CSS generated in a separate text file like app.bundle.css instead of having all the CSS getting injected as a string within the <style> tags in the html file.

To deal with that we should be using a Webpack [Plugin](https://webpack.js.org/concepts/#plugins). An easy to understand explanation of Plugin concept is quoted below from [this](https://medium.com/@paul.allies/webpack-managing-javascript-and-css-dependencies-3b4913f49c58) reference:

> Plugin is a process applied on your bundle before it is sent to the output file. A typical plugin is the minification plugin.

Note that the references linked here demonstrates, dealing with the above mentioned concern, using [Extract Text Plugin](https://www.npmjs.com/package/extract-text-webpack-plugin). However on the plugin's [Homepage](https://github.com/webpack-contrib/extract-text-webpack-plugin#usage) following warning is issued

> Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) instead.

Since we are using webpack v4 in our application we will use the suggested **mini-css-extract-plugin**.

OK so let's start by installing it

```
project_root$ npm install mini-css-extract-plugin --save-dev
```

That should do following 2 things:

1. update package.json by updating `devDependencies` section under it by appending it `mini-css-extract-plugin` package like following

```
  "mini-css-extract-plugin": "^0.5.0",
```

_Note: The dependencies versions are the then versions when the dependencies were installed at on this tutorial author's local machine._

2. update `package-lock.json` w.r.t changes in `package.json`

Next we will update our `webpack.config.js` by adding configuration for this plugin. To do that open the file in a text-editor and do following:

1. add following at the top of file BEFORE `module.exports`:

```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
```

2. add following under `module.exports`

```
plugins: [
  new MiniCssExtractPlugin()
],
```

3. replace following under `module.rules` array

```
{
    use:['style-loader','css-loader'],
    test:/\.css$/
}
```

WITH

```
{
    test:/\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader"
    ]
}
```

That is similar to how we specified `style-loader` and `css-loader` earlier. The only difference here is that here we have replaced `style-loader` with `MiniCssExtractPlugin.loader`. And that tells webpack that for any file which has filename matching with the regular expression specified in the `test` property, first use `css-loader` to compile those and then use `MiniCssExtractPlugin.loader` on the output of `css-loader`.

So after those modifications our `webpack.config.js` should look like (note unchanged parts are shown as truncated with `...`)


```
....
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    ...,
    ...,
    plugins: [
      new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            ...,
            {
                test:/\.css$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader"
                ]
            }
        ]
    },
    ...,
    ...
}
```

Note that we didn't used the Minimal Config as shown [here](https://github.com/webpack-contrib/mini-css-extract-plugin#minimal-example). That is we didn't provided
following options while instantiating `MiniCssExtractPlugin`

```
filename: "[name].css",
chunkFilename: "[id].css"
```

neither we specified following loader options

```
options: {
  // you can specify a publicPath here
  // by default it use publicPath in webpackOptions.output
  publicPath: '../'
}
```

**That's because we don't need such customizations at this point and the default values for those options should work for us.**

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

BTW if you are wondering what does `[name]`, `[id]` etc mean then you should refer the official [documentation](https://webpack.js.org/configuration/output/#output-filename).
In a nutshell they are placeholders used to attach specific information to webpack output. Additional references I found are listed below:

* https://survivejs.com/webpack/optimizing/adding-hashes-to-filenames/
* https://stackoverflow.com/q/50202837/936494


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now let's re-build the bundle using following command


```
project_root$ npm run build
```

That should show output like following

```
> hello-world-imba@1.1.0 build $project_root$
> webpack

Hash: 101c2d4b5d4bf36e9417
Version: webpack 4.29.0
Time: 697ms
Built at: 02/08/2019 2:26:38 AM
    Asset      Size  Chunks             Chunk Names
  app.css  22.9 KiB     app  [emitted]  app
client.js   108 KiB     app  [emitted]  app
Entrypoint app = app.css client.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {app} [built]
[./src/css/w3.css] 39 bytes {app} [built]
[./src/frontend/client.imba] 872 bytes {app} [built]
    + 14 hidden modules
Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!src/css/w3.css:
    Entrypoint mini-css-extract-plugin = *
    [./node_modules/css-loader/dist/cjs.js!./src/css/w3.css] 23.5 KiB {mini-css-extract-plugin} [built]
        + 1 hidden module
```

As can be seen there are two assets generated by names `client.js`, `app.css` both under `project_root/dist` folder as specified by our `output` property
in `webpack.config.js`. The `app.css` has been generated by the `mini-css-extract-plugin` we configured. *The file name and the output folder to generate to etc
should be based on default values used by it.*

Now let's start the webpack-dev-server using command

```
project_root$ npm run start:dev
```

and then open a browser window at http://localhost:8080 and you should see the styled content.

**Oops! It shows content but no styles are getting applied.**

OK let's open the Browser's Developer Tools, for e.g. in Firefox `Inspector` tab and check the DOM source for whether we have our generated `app.css` referenced there. No! So the obvious reason for no styles getting applied is the page missing reference to our bundled CSS. If you recollect earlier we used `style-loader` to inject the bundled CSS
into `<style>` tag under `<head>` but with `mini-css-extract-plugin` we wanted the CSS to be bundled in a separate file. Now `mini-css-extract-plugin` just generates this separate bundle and doesn't do automatic injection of bundle reference into DOM. So we should manually reference it like we did initially, when we introduced CSS into our application, using `<link>` tag, which we removed later while introducing `css-loader` and `style-loader`.

So let's add the `<link>` tag again. To do that open up `project_root/dist/index.html` in a text editor and add the following `<link>` tag under the `<head>` tag

```
<link rel="stylesheet" href="app.css">
```

Since our webpack-dev-server is configured to serve content from `project_root/dist` folder the `app.css` file path doesn't need to be specified as `dist/app.css`. *To recollect refer the explanation of referencing file paths served by webpack-dev-server from a particular directory in the section where we introduced CSS in our application.*

Now try refreshing the page in browser. Bingo! The styling is restored. Congrats!

Now one last thing remains is to update our `.gitignore` file by adding `dist/app.css` because that is a bundled asset which is not intended to be pushed to our repository.

Now save the changes made in codebase and commit the changes.

-----------------------------

If you can remember in previous steps we forgot to add our `<link>` tag referencing the bundled CSS generated by `mini-css-extract-plugin` and because of which our page didn't shown up as expected and we needed to get into diagnosing mode. Forgetting minor things like these can happen during development but it should prove to be really annoying when we work on a large feature and such minor mistakes makes our work return unexpected results. So is there something available which can help us avoid such minor mistakes? Fortunately yes because we are not the first ones who has encountered this issue. The developers who were seriously disappointed with the faced issue determined themselves to build a soution
which can help other developers to avoid facing the disappoinments they faced and those altruistic developers came up with [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin). *First I came across this plugin while I was going through [this](https://medium.com/a-beginners-guide-for-webpack-2/webpack-loaders-css-and-sass-2cc0079b5b3a) reference and then I ended up finding [this](https://medium.com/a-beginners-guide-for-webpack-2/index-html-using-html-webpack-plugin-85eabdb73474) reference.*

Note that if you check the plugin's documentation on the [official page](https://github.com/jantimon/html-webpack-plugin) it says

> This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles

Reading that you might get a thought then how come it will help solve the primary issue of helping us avoid manually include the CSS in our HTMl file. To answer that
if you read the details under [Usage](https://github.com/jantimon/html-webpack-plugin/blob/master/README.md#usage) section in the official documentation you should find
following:

> If you have multiple webpack entry points, they will all be included with script tags in the generated HTML.

> If you have any CSS assets in webpack's output (for example, CSS extracted with the [ExtractTextPlugin](https://github.com/webpack/extract-text-webpack-plugin)) then these will be included with <link> tags in the HTML head.

That confirms that we have ended up with the right solution. And we get additional advantage to automatically generate one or more HTML files, generate HTML files based on a template file and other such awesome features the plugin provides.

OK so let's get to integrating it in our application.

First we install it

```
project_root$ npm install html-webpack-plugin --save-dev
```

That should do following 2 things:

1. update package.json by updating `devDependencies` section under it by appending it `html-webpack-plugin` package like following

```
"html-webpack-plugin": "^3.2.0",
```

*Note: The dependencies versions are the then versions when the dependencies were installed at on this tutorial author's local machine.*

2. update `package-lock.json` w.r.t changes in `package.json`

Next we will update our `webpack.config.js` by adding configuration for this plugin. To do that open the file in a text-editor and do following:

1. add following at the top of file BEFORE `module.exports`:

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
```

2. add following under `module.exports.plugins` Array

```
new HtmlWebpackPlugin({
  title: 'Hello World',
  template: path.resolve(__dirname, 'src/index.html')
})
```

That config will use the template HTML generate a file `index.html` that includes all your webpack bundles. That will be generated under folder `project_root/dist`, having its title set to `Hello World`. *Why under folder `project_root/dist`? Because that is path we have configured through Webpack's `output` option.*

Plugin provides various configuration options for customization. Please refer the [documentation](https://github.com/jantimon/html-webpack-plugin/blob/master/README.md#options).

So after those modifications our `webpack.config.js` should look like (note unchanged parts are shown as truncated with ...)

```
...
...
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    ...
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        title: 'Hello World',
        template: path.resolve(__dirname, 'src/index.html')
      })
    ],
    ...
    ...
}
```

Next we add our template file `index.html` under `project_root/src` folder. To do that first create the file

```
project_root$ touch src/index.html
```

Then open the file in a text-editor and add following content to it

```
<!doctype html>
<html class="no-js" lang="">
  <head>
    <title><%= htmlWebpackPlugin.options.title %></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body>
  </body>
</html>
```

An interesting thing you can see in there is the code `<%= htmlWebpackPlugin.options.title %>`. `htmlWebpackPlugin.options` is a variable provided by HTML Webpack Plugin to make our templates use the values configured for the plugin in `webpack.config.js`. There are other variables available too. Please refer the [documentation](https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates) for more details on them.

Now that we are using a template HTML file we should get rid of the `index.html` we manually created under `project_root/dist` in the beginning of this **whole** tutorial.

Now let's re-build the bundle using following command

```
project_root$ npm run build
```

That should show output like following

```
> hello-world-imba@1.1.0 build $project_root$
> webpack

Hash: bffcd483c63c9ae4754a
Version: webpack 4.29.0
Time: 834ms
Built at: 03/09/2019 1:14:59 PM
     Asset       Size  Chunks             Chunk Names
   app.css   22.9 KiB     app  [emitted]  app
 client.js    108 KiB     app  [emitted]  app
index.html  316 bytes          [emitted]
Entrypoint app = app.css client.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {app} [built]
[./src/css/w3.css] 39 bytes {app} [built]
[./src/frontend/client.imba] 872 bytes {app} [built]
    + 14 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./src/index.html] 487 bytes {0} [built]
    [./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module
Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!src/css/w3.css:
    Entrypoint mini-css-extract-plugin = *
    [./node_modules/css-loader/dist/cjs.js!./src/css/w3.css] 23.5 KiB {mini-css-extract-plugin} [built]
        + 1 hidden module
```

As can be seen there are three assets generated by names `client.js`, `app.css`, `index.html` all under `project_root/dist` folder as specified by our `output` property in `webpack.config.js`. The `app.css` has been generated by the `mini-css-extract-plugin` and `index.html` has been generated by the `html-webpack-plugin` we configured. *The file name and the output folder to generate to etc should be based on default values used by it.*

**Now if check the `project_root/dist/index.html` you should see that it has our CSS and JS bundles automatically included. That's facilitates by HTML Webpack Plugin!**

Now let's start the webpack-dev-server using command

```
project_root$ npm run start:dev
```

and then open a browser window at http://localhost:8080 and you should see the the styled content. Congrats!

Now one last thing remains is to update our `.gitignore` file by adding `dist/index.html` because that is a bundled asset which is not intended to be pushed to our repository.

Now save the changes made in codebase and commit the changes. **Note that while commiting `dist/index.html` should not be committed.**


-----------------------------

### References used for building this tutorial:

* https://www.nodebeginner.org/blog/post/setting-up-a-javascript-project-for-es6-development-with-babel-and-webpack/

* https://github.com/imba/hello-world-imba/commits/master

* https://medium.com/@paul.allies/webpack-managing-javascript-and-css-dependencies-3b4913f49c58

* https://medium.com/a-beginners-guide-for-webpack-2/webpack-loaders-css-and-sass-2cc0079b5b3a

* https://medium.com/a-beginners-guide-for-webpack-2/extract-text-plugin-668e7cd5f551

* https://medium.com/a-beginners-guide-for-webpack-2/index-html-using-html-webpack-plugin-85eabdb73474

* https://javascriptplayground.com/webpack-html-plugin/

### Resources to refer ahead:

* https://github.com/koolamusic/awesome-imba