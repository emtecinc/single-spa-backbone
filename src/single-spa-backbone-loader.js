// MIT License

// Copyright (c) 2019 Emtec Inc

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

//Loads a backbone application using require js
export function loadBackboneAppWithRequireJs(basePath, appOptions, scriptElementRef, callbackDomElementSetter) {
    return new Promise((resolve, reject) => {

        if (callbackDomElementSetter)
            callbackDomElementSetter();

        var script = loadApp();

        function loadApp() {

            if (scriptElementRef && document.head.hasChildNodes(scriptElementRef)) {
                try {
                    if (Backbone) {
                        if (!Backbone.History.started)
                            Backbone.history.start();
                        Backbone.history.navigate(basePath, true);
                    }
                }
                catch (err) {
                    reject(err);
                }

                return scriptElementRef;
            }
            else {
                //Load dependant scripts
                if (appOptions.DependenciesJsPaths)
                    addDependencyScriptElements(basePath, appOptions.DependenciesJsPaths, reject);
                //Load require js script
                return addRequireJs(basePath, appOptions.AppPath, appOptions.RequireJsPath, appOptions.IsDataMain, reject);
            }
        }

        resolve(script);
    });
}

//Loads a backbone application using Backbone, Underscore (which is the only hard dependency of Backbone as per official documentation)
export function loadAppWithBackboneJs(basePath, appOptions, scriptElementRef, callbackDomElementSetter) {
    return new Promise((resolve, reject) => {

        if (callbackDomElementSetter)
            callbackDomElementSetter();

        var script = loadApp();

        function loadApp() {

            if (scriptElementRef && document.head.hasChildNodes(scriptElementRef)) {
                try {
                    if (Backbone) {
                        if (!Backbone.History.started)
                            Backbone.history.start();
                        Backbone.history.navigate(basePath, true);
                    }
                }
                catch (err) {
                    reject(err);
                }

                return scriptElementRef;
            }
            else {
                //Load dependency scripts
                if (appOptions.DependenciesJsPaths)
                    addDependencyScriptElements(basePath, appOptions.DependenciesJsPaths, reject);
                //load backbone script
                addScriptElement(basePath, appOptions.BackboneJsPath, reject);
                //Load app script
                return addScriptElement(basePath, appOptions.AppPath, reject);
            }

        }

        resolve(script);

    });
}

export function loadAppSimple(basePath, appOptions, scriptElementRef, callbackDomElementSetter) {
    return new Promise((resolve, reject) => {

        if (callbackDomElementSetter)
            callbackDomElementSetter();

        var script = loadApp();

        function loadApp() {

            if (scriptElementRef && document.head.hasChildNodes(scriptElementRef)) {
                try {
                    if (Backbone) {
                        if (!Backbone.History.started)
                            Backbone.history.start();
                        Backbone.history.navigate(basePath, true);
                    }
                }
                catch (err) {
                    reject(err);
                }

                return scriptElementRef;
            }
            else {
                //Load dependant scripts
                if (appOptions.DependenciesJsPaths)
                    addDependencyScriptElements(basePath, appOptions.DependenciesJsPaths, reject);

                var appPath = appOptions.AppPath;
                const lengthAppPath = appPath.length;
                if (lengthAppPath === 0) {
                    reject(`appPath parameter cannot be empty`);
                }
                else {
                    if (lengthAppPath > 1 && appPath.charAt(0) === '/') {
                        appPath = basePath + appPath;
                    }
                    else {
                        appPath = basePath + '/' + appPath;
                    }
                }

                var scriptElementAppJs = document.createElement('script');
                scriptElementAppJs.src = appPath;
                scriptElementAppJs.onerror = reject;
                document.head.appendChild(scriptElementAppJs);

                return scriptElementAppJs;
            }
        }

        resolve(script);
    });
}

//Injects a require js script element to the DOM
function addRequireJs(basePath, appPath, requireJsPath, isDataMain, reject) {

    const lengthRequireJsPath = requireJsPath.length;
    if (lengthRequireJsPath === 0) {
        reject(`requireJsPath parameter cannot be empty`);
    }
    else {
        if (lengthRequireJsPath > 1 && requireJsPath.charAt(0) === '/') {
            requireJsPath = basePath + requireJsPath;
        }
        else {
            requireJsPath = basePath + '/' + requireJsPath;
        }
    }

    const lengthAppPath = appPath.length;
    if (lengthAppPath === 0) {
        reject(`appPath parameter cannot be empty`);
    }
    else {
        if (lengthAppPath > 1 && appPath.charAt(0) === '/') {
            appPath = basePath + appPath;
        }
        else {
            appPath = basePath + '/' + appPath;
        }
    }

    var scriptElementRequireJs = document.createElement('script');
    scriptElementRequireJs.src = requireJsPath;
    if (isDataMain === true) {
        scriptElementRequireJs.setAttribute('data-main', appPath);
    }
    scriptElementRequireJs.onerror = reject;
    document.head.appendChild(scriptElementRequireJs);

    if (isDataMain === false) {
        var scriptElementAppJs = document.createElement('script');
        scriptElementAppJs.src = appPath;
        scriptElementAppJs.onerror = reject;
        document.head.appendChild(scriptElementAppJs);
    }

    return scriptElementRequireJs;
}

//Injects the dependency scripts to the DOM
function addDependencyScriptElements(basePath, vendorPaths, reject) {
    vendorPaths.array.forEach(scriptPath => {
        addScriptElement(basePath, scriptPath, reject);
    });
}

function addScriptElement(basePath, scriptPath, reject) {

    const lengthScriptPath = scriptPath.length;
    if (lengthScriptPath === 0) {
        reject(`scriptPath parameter cannot be empty`);
    }
    else {
        if (lengthScriptPath > 1 && scriptPath.charAt(0) === '/') {
            scriptPath = basePath + scriptPath;
        }
        else {
            scriptPath = basePath + '/' + scriptPath;
        }
    }

    var scriptElement = document.createElement('script');
    scriptElement.src = scriptPath;
    scriptElement.onerror = reject;
    document.head.appendChild(scriptElement);
    return scriptElement;
}