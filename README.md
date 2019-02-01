# single-spa-backbone
A plugin which provides life cycle events for building [single-spa](https://github.com/CanopyTax/single-spa) applications using [Backbone](http://backbonejs.org/). 

There are mostly two styles of creating backbone applications

1. Using [RequreJS](https://requirejs.org/) which will loads the application and all it's dependencies, including the templates loaded using [Handlebars](https://handlebarsjs.com/), [RequireJS:Text](https://github.com/requirejs/text) or any other engine. 

   If your applicatioin is written using this style, then you will have to pass the `AppWithRequire` parameter as otions in the plugin, and choose the flavour to load the app, either through `data-main` attribute or without it.

2. Using [Backbone](http://backbonejs.org/) and ApplicationPath (Entry point of application) directly as script elements and optionally loading other dependencies.


## Example
Examples can be found in the [single-spa-examples](https://github.com/emtecinc/single-spa-samples) repository.

## Quickstart

**Option 1** : Using `RequireJS` with `data-main`

First, in the [single-spa application](https://github.com/CanopyTax/single-spa/blob/master/docs/applications.md#registered-applications), run `npm install --save @emtec/single-spa-backbone`. Then, create an entry file for application like below, assuming the application has some `BasePath` with `AppPath` and `RequireJsPath' being relative to the base path.

```js
import singleSpaBackbone from '@emtecinc/single-spa-backbone';

const backBoneLifecycles = singleSpaBackbone({
	BasePath: 'appBasePath',
	AppWithRequire:
	{
		IsDataMain: true,
		AppPath: 'src/app',
		RequireJsPath: 'lib/require.js'
	},
	DomElementSetter: domElementSetter
});

export const bootstrap = [
	backBoneLifecycles.bootstrap,
];

export const mount = [
	backBoneLifecycles.mount,
];

export const unmount = [
	backBoneLifecycles.unmount,
];


function domElementSetter() {

	//use the same element id to render into, in the backbone app
	let el = document.getElementById('shell-container');
	if (!el) {
		el = document.createElement('div');
		el.id = 'shell-container';
		document.body.appendChild(el);
	}

}
```

`DomElementSetter` gives you a provision to hook up your callback, and can be used to create a container element in the dom which will be used to load the app.

Please note that this hook up is just a setter and don't expect you to return a value. You need to explicity use the same element #id in the backbone application to use it as app region or container.


**Option 2** : Using `RequireJS` without `data-main`

`IsDataMain` will be set to `false` in this case

```js
import singleSpaBackbone from '@emtecinc/single-spa-backbone';

const backBoneLifecycles = singleSpaBackbone({
	BasePath: 'appBasePath',
	AppWithRequire:
	{
		IsDataMain: false,
		AppPath: 'src/app',
		RequireJsPath: 'lib/require.js'
	},
	DomElementSetter: domElementSetter
});

export const bootstrap = [
	backBoneLifecycles.bootstrap,
];

export const mount = [
	backBoneLifecycles.mount,
];

export const unmount = [
	backBoneLifecycles.unmount,
];


function domElementSetter() {

	//use the same element id to render into, in the backbone app
	let el = document.getElementById('shell-container');
	if (!el) {
		el = document.createElement('div');
		el.id = 'shell-container';
		document.body.appendChild(el);
	}

}
```


## Options

All options are passed to single-spa-backbone via the `userOptions` parameter when calling `singleSpaBackbone(userOptions)`. The following options are available:

* `BasePath` (required) : The base path of the backbone application. Mostly it will be the public path from where the app is server and other paths will be realtive to this. This parameter expects a string type.
* `AppWithRequire` (required) : This parameter takes an object and expects below properties:
	* `IsDataMain` (required) : This parameter takes a boolean value and is used to specify whethe require js will use `data-main` to load the app.
	* `AppPath` (required) : This parameter takes a string value and specifies the path of javascript file, which is entry point of your application and will be booted up using RequreJs. The path is relative to BasePath.
	* `RequireJsPath` (required) : This parameter takes a string value and takes the path of the RequireJs file and is relative to BasePath.
	* `DependenciesJsPaths` (optional) : This is an optional paramter takes an array of strings. It can be used to optionally provide a list of javascript path which you want to load in the browser.
* `DomElementSetter` (optional) : This is an optional parameter and can be mostly used to create a dom element, whose id can be later used in the backbone app to laod the application. However, you can freely use this callback for any other purpose. It is called before anything else.



