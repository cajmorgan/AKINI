# AKINI

## An alternative lightweight Front-End buildsystem

<dl>
<dt><a href="#WhatIs">What is AKINI?</a></dt>
<dd></dd>
<dt><a href="#Features">Features</a></dt>
<dd></dd>
<dt><a href="#API">API</a></dt>
<dd></dd>
</dl>

<a name="WhatIs"></a>

### What is AkINI?

AKINI is a lightweight HTML/CSS/Vanilla JS build system for those who want a more reliable way to structure their web projects and skip the whole process of using complicated modules and frameworks. AKINI is built to keep the project in fit and include the tools needed when developing.

<a name="Features"></a>

### Features

AKINI comes with a small API and a opinionated structure that has to be followed. There are two classes that are part of the public API:
- Compiler
- Generator

<a name="API"></a>

### Structure

To work with this library, a specific folder structure must be followed. Below is a general structure with example names marked with **.

```bash
.
├── components/
│   ├── *header*
│   └── ...
├── pages/
│   ├── ... 
│   └── *home*/
│       ├── components /
│       │   ├── *banner*/
│       │   │   ├── static.js 
│       │   │   ├── dynamic.js
│       │   │   └── styles.css
│       │   └── ...
│       └── page.js
├── public
└── server/
    └── server.js
```

#### Things to be aware of
Pages are statically generated and compiled through the Generator & Compiler classes. Every page share one namespace so name clashes between global variables and classes/ids can happen if not careful. 

AKINI does not support import/export f.e like Webpack. It's possible though to pass external scripts in the build through the compiler (see file examples to see how it's done). 

### Tutorial
The easiest way to see how the system works are through practical examples. 
Let's start with the pages folder. 

```bash
├── pages/
│   ├── ... 
│   └── home/
│       ├── components /
│       │   ├── banner/
│       │   │   ├── static.js 
│       │   │   ├── dynamic.js
│       │   │   └── styles.css
│       │   └── ...
│       └── page.js
```

#### page.js
```js
/** Importing Compiler class and all the components for the page (static.js file) **/
const { Compiler } = require('akini');
const header = require('../../components/header/static');
const banner = require('./components/banner/static');
const playlists = require('./components/playlists/static');
const getHeard = require('./components/getHeard/static');
const artists = require('./components/artists/static');
const footer = require('../../components/footer/static');

/** components constant array, decides the order of the components rendered **/
const components = [header, banner, playlists, getHeard, artists, footer];

/** 
 * importComponents is an array of objects which are
 * automatically imported through the root components folder
 * **/
const importComponents = [
  { component: 'global' },
  { component: 'header' },
  { component: 'footer' },
]

/** Custom external scripts array, needs to be included for every page**/
const customScripts = [{ src: 'http://kit.fontawesome.com/123456.js', mode: 'defer' }]

/** Compiler class definition with a number of arguments passed to the HTML header **/
const compiler = new Compiler(components, 'home', customScripts, { lang: 'en', importComponents, favicon: { type: '', path: '' }, title: 'Hit Music Grp' });

/** This method does the compilation of the page and all its components, 
 * completely independent of other pages. 
 * **/
compiler.compile();

```

### Component example
#### static.js
```js
const { Generator } = require('akini');
const generator = new Generator();

/** AKINI uses it's own language that compiles down to HTML 
 * This is done solely through the generator method createTree. 
 * More specific information regarding this under API.
 */
const banner = generator.createTree(`
  div className: 'banner'
    div className: 'banner__items'
      div className: 'title_large' id: 'banner-title'
      a className: 'button_highlight' href: '/submit' id: 'banner_button' innerText: 'We want to hear you!'
end`)

/** Just require it in page.js **/
module.exports = banner;
```
#### dynamic.js 
In dynamic.js just write your good ole vanilla JS, or use external scripts if you have imported them. Note that you are using the same namespace across the whole page. This compiles down to one minified JS file per page. 
```js
const title = document.getElementById('banner-title');
let start = 0;
let slicedAmount = 0;
let counter = 0;
let titleSelection = 0;
let titleString = ["A New Journey", "Next Hit Song?", "Let Us Listen!"];
let spawnedElements = [];

function animateTextController() {
  spawnedElements.forEach(element => element.parentNode.removeChild(element));
  spawnedElements = [];
  slicedAmount = 0;
  counter = 0;
  start = 0;
  titleSelection++;
  if (titleSelection === titleString.length)
    titleSelection = 0;
  window.requestAnimationFrame(animateText);
}

function animateText(timestamp) {
  if (!start)
    start = timestamp;
  if (timestamp - start > 1000 || slicedAmount === titleString[titleSelection].length) {
    return 0;
  }

  if (counter === 4) {
    counter = 0;
    const letter = document.createElement('span');
    letter.classList.add('banner-title__letter');
    letter.innerText = titleString[titleSelection][slicedAmount];
    title.appendChild(letter);

    spawnedElements.push(letter);
    slicedAmount++;
  }

  counter++;
  window.requestAnimationFrame(animateText)
}

function fullyLoaded() {
  window.requestAnimationFrame(animateText);
  setInterval(animateTextController, [5500])
  window.removeEventListener('load', fullyLoaded);
}

const loadedEvent = window.addEventListener('load', fullyLoaded);


```

#### styles.css
```css
.banner {
	display: flex;
	align-items: center;
	justify-content: center;
  height: 100vh;
  width: 100vw;
  background-image: url('../images/banner.webp');
	background-size: cover;
}

.banner__items {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.title_large {
	color: white;
	font-size: 70px;
  font-family: 'Copperplate', sans-serif;
  font-weight: 700;
	margin-top: 10px;
	width: 555px;
	height: 100px;
}

.banner-title__letter {
	animation: blur 5s forwards;
}

@keyframes blur {
	0% { filter: blur(12px); opacity: 0; }
	10% { filter: blur(0); opacity: 1; }
	80% { filter: blur(0); opacity: 1; }
	100% { filter: blur(12px); opacity: 0; }
}

.button_highlight {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	width: 200px;
	border-radius: 0;
	border: none;
	font-family: Copperplate;
	font-size: 16px;
	opacity: 0.8;
	color: white;
	transition-duration: 0.5s;
	animation: breathing 4s infinite;
	margin: 10px;
	text-decoration: none;
}

.button_highlight:hover {
	opacity: 1;
	transform: scale(1.02);
	cursor: pointer;
}

@keyframes breathing {
	0% {
		background-color: var(--second-color-darker);

	}
	50% {
		background-color: var(--second-color);
	}

	100% {
		background-color: var(--second-color-darker);
	}
}

```

This simple structure is necessary to follow for all components with the correct names, which makes the project easy to keep clean. To continue with practical examples, I think it would be wise to show an example of the general components in the root folder:

```bash
.
└── components/
    └── *header*/
        ├── static.js
        ├── dynamic.js
        └── styles.css
```

As can be seen in the page.js example, you can import them solely by passing in an object with a component key and a value of the name. They follow the exact same structure as page specific components. 


### Server folder
At the current version, the server folder requires a server.js file and it's wise to use the library's own inbuilt system for re-compiling when saving, but this is of course possible to set up with external libraries as well.

#### server.js
```js
const express = require('express');
const { Compiler } = require('akini');

const PORT = 4444;

const app = express();
app.use(express.static('build'));
app.use(express.static('public'));
app.use(express.json());

(async () => {
  const compiler = new Compiler([], '', { isBuilding: true }); //Pass in, "isBuilding" when using for watch
  await compiler.watch();
})()


app.get('/', (req, res) => {
  res.redirect('/home');
})

app.get('*', (req, res) => {
  res.redirect('/404');
})

app.listen(PORT, () => console.log(`👹 -> ${PORT}`))

```


## API

{{{API}}}
