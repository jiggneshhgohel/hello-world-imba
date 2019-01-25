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

