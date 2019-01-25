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

Now we will create a file which will be served when someone opens our application at http://127.0.0.1:8080.

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

Now there in we have the following line

```
server.use(express.static('./dist'))
```

which looks interesting and needs some explanation. That basically indicates that our server shall serve static files from `project_root/dist` folder. At this time we have just one file `index.html` here and later we will have our front-end code written in Imba compiled and added to this folder. Refer [here](https://expressjs.com/en/starter/static-files.html) for more details on how Express serves static files.


Now the question arises how do we run this server? Will that code run using the default Node.js interpreter (`v10.14.0` as of this writing)? Let’s give it a try:


```
project_root$ node ./src/backend/server.imba
/jwork/imba/hello-world-imba/src/backend/server.imba:1
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

Now one might wonder that we didn't explicitly requested any file then how come the `index.html` was served? That's because our server is implemented to serve static files.
And if you check at https://expressjs.com/en/api.html#express.static you should find that `express.static(root, [options])` accepts an option named `index` which has its default value set to `index.html`. So this is why `index.html` gets automatically served as root page of our application.

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

That's a lot in terms of manual operations, so we should consider automating those tasks. So that brings us to [Webpack](https://webpack.js.org/). Following is an easy-to-understand description quoted (with slight updates) from a nice [beginner Node tutorial](https://www.nodebeginner.org/blog/post/setting-up-a-javascript-project-for-es6-development-with-babel-and-webpack/) I found on web.

> Webpack describes [itself](https://webpack.js.org/concepts/) as *a static module bundler for modern JavaScript applications*.The reason it exists is that the way we want to organize our own code and its external dependencies, and the way that JavaScript and other assets are best served to a browser, are often very different, and this difference can be cumbersome to manage.

> Webpack makes this a lot easier: we organize and write our own code the way we want, we refer to external dependencies like the NPM-installed packages the way we want, and we have Webpack bundle it all together in one single bundle file which has all the content the browser needs, served in the format it likes.

> The price we pay for this is some setup work that we need to do, but which isn’t that complicated.

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

* the entry file of our frontend application is `src/frontend/client.imba` which should be compiled and output a bundle in `project_root/dist/client.js`
* we want to use the Imba loader `imba/loader`. Usually a loader is to be installed like other packages but in case of Imba in its recent versions it comes with its own Webpack loader. Please refer [here](https://www.npmjs.com/package/imba-loader) for more details. To know more about Webpack Loaders please refer [here](https://www.npmjs.com/package/webpack#loaders)
* Imba loader loader shall only process `.imba` files
* We also want Imba to ignore any files that don’t end in `.imba`


Next to automate our server start step we update our `package.json` in following manner:

* Remove `"main": "index.js"` from it

* Replace `"scripts"` entry with following

```
  "scripts": {
    "start": "imba src/backend/server.imba",
    "build": "webpack"
  }
```

Refer following links for more details on the `start`, `build` entries.

https://docs.npmjs.com/misc/scripts
https://webpack.js.org/guides/getting-started/#npm-scripts
https://stackoverflow.com/questions/34829673/build-script-in-package-json-using-webpack-with-config-flag-as
https://stackoverflow.com/a/38864024/936494

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

> hello-world-imba@1.0.0 build /jwork/imba/hello-world-imba
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

Now open a browser window at http://127.0.0.1:8080/ and you should see your `Hello World` in the browser page.

Let’s dissect what exactly happens.

As before, opening the page in your browser sends a request to the running Node.js backend server. The server code (which has been compiled on-the-fly from Imba to Javascript via Imba Loader) receives the request for URL /, and responds with the content of file `dist/index.html`.

This HTML file is rendered by the browser. The browser encounters the `<script src="client.js"></script>` line, and as a result, it sends another request to `http://127.0.0.1:8080/client.js`.

Again, our server receives that request, and responds with the contents of file `dist/client.js`. This file has been generated by Webpack.

Running `npm run build` made Webpack look at our main frontend code file in `src/frontend/client.imba`, which it knows about because it is defined as the application entry point in `webpack.config.js`.

Then Webpack compiles our fronend code `.imba` file and adds it to the our bundle file `client.js`.

Finally, our browser receives the response from our server containing the contents of file `client.js`, and runs the contained JavaScript code, resulting in the `Hello, World!` page.

Now one last thing remains is to update our `.gitignore` file by adding `dist/client.js` because that is not intended to be pushed to our repository. So add it and save the changes and commit the changes.

-----------------------------


### References used for building this tutorial:

* https://www.nodebeginner.org/blog/post/setting-up-a-javascript-project-for-es6-development-with-babel-and-webpack/

* https://github.com/imba/hello-world-imba/commits/master

### Resources to refer ahead:

* https://github.com/koolamusic/awesome-imba