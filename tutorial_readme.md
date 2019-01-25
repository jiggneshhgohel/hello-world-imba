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
