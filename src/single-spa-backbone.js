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

import { loadBackboneAppWithRequireJs, loadAppWithBackboneJs, loadAppSimple } from './single-spa-backbone-loader';
import unloadBackboneApp from './single-spa-backbone-unloader';

const defaultOptions = {
    BasePath: null,
    App: null,
    AppWithRequire: null,
    AppWithBackboneJs: null,
    DomElementSetter: null,
    ScriptElementRef: null
}

export default function singleSpaBackbone(userOptions) {

    if (typeof userOptions !== 'object') {
        throw new Error(`configuration object is not passed as parameter`);
    }

    const options = {
        ...defaultOptions,
        ...userOptions,
    };

    if (!options.BasePath) {
        throw new Error(`BasePath parameter is required`);
    }

    const basePath = options.BasePath;
    const length = basePath.length;

    if (length === 0) {
        throw new Error(`BasePath parameter cannot be empty`);
    }
    else {
        if (length > 1 && basePath.charAt(length - 1) === '/') {
            options.BasePath = basePath.substring(0, length - 2)
        }
    }

    if (options.AppWithRequire && options.AppWithBackboneJs
        || options.AppWithRequire && options.App
        || options.App && options.AppWithBackboneJs) {
        throw new Error(`Either App or AppWithRequire or AppWithBackboneJs parameter can be passed at a time`);
    }

    if (!options.App && !options.AppWithRequire && !options.AppWithBackboneJs) {
        throw new Error(`App or AppWithRequire or AppWithBackboneJs parameter need to be passed`);
    }

    if (!options.App && !options.AppWithBackboneJs && options.AppWithRequire && typeof options.AppWithRequire !== 'object') {
        throw new Error(`AppWithRequire parameter is expecting an object which is not supplied. It needs IsDataMain, AppPath, RequireJsPath parameter and optionally DependenciesJsPaths`);
    }

    if (!options.App && !options.AppWithRequire && options.AppWithBackboneJs && typeof options.AppWithBackboneJs !== 'object') {
        throw new Error(`AppWithBackboneJs parameter is expecting an object which is not supplied. It needs AppPath, BackboneJsPath and optionally DependenciesJsPaths`);
    }

    if (!options.AppWithBackboneJs && !options.AppWithRequire && options.App && typeof options.App !== 'object') {
        throw new Error(`App parameter is expecting an object which is not supplied. It needs AppPath`);
    }

    if (options.AppWithRequire) {

        if (typeof options.AppWithRequire.IsDataMain !== 'boolean') {
            throw new Error(`AppWithRequire.IsDataMain parameter is required and expects a boolean value`);
        }

        if (typeof options.AppWithRequire.AppPath !== 'string') {
            throw new Error(`AppWithRequire.AppPath parameter is required and expects a string value`);
        }

        if (typeof options.AppWithRequire.RequireJsPath !== 'string') {
            throw new Error(`AppWithRequire.RequireJsPath parameter is required and expects a string value`);
        }

        if (options.AppWithRequire.DependenciesJsPaths && typeof options.AppWithRequire.DependenciesJsPaths !== 'array') {
            throw new Error(`AppWithRequire.DependenciesJsPaths parameter expects an array`);
        }
    }

    if (options.AppWithBackboneJs) {

        if (typeof options.AppWithBackboneJs.AppPath !== 'string') {
            throw new Error(`AppWithBackboneJs.AppPath parameter is required and expects a string value`);
        }

        if (typeof options.AppWithBackboneJs.BackboneJsPath !== 'string') {
            throw new Error(`AppWithBackboneJs.BackboneJsPath parameter is required and expects a string value`);
        }

        if (options.AppWithBackboneJs.DependenciesJsPaths && typeof options.AppWithBackboneJs.DependenciesJsPaths !== 'array') {
            throw new Error(`AppWithBackboneJs.DependenciesJsPaths parameter expects an array`);
        }
    }

    if (options.App) {
        if (typeof options.App.AppPath !== 'string') {
            throw new Error(`App.AppPath parameter is required and expects a string value`);
        }
    }

    return {
        bootstrap: bootstrap.bind(null, options),
        mount: mount.bind(null, options),
        unmount: unmount.bind(null, options),
    };
}

function bootstrap(options) {
    return Promise.resolve();
}

function mount(options) {
    var promise = null;
    if (options.AppWithRequire)
        promise = loadBackboneAppWithRequireJs(options.BasePath, options.AppWithRequire, options.ScriptElementRef, options.DomElementSetter);
    else if (options.AppWithBackboneJs)
        promise = loadAppWithBackboneJs(options.BasePath, options.AppWithBackboneJs, options.ScriptElementRef, options.DomElementSetter);
    else if (options.App)
        promise = loadAppSimple(options.BasePath, options.App, options.ScriptElementRef, options.DomElementSetter);

    promise.then(function (result) {
        if (result)
            options.ScriptElementRef = result;
    });
    return promise;
}

function unmount(options) {
    return unloadBackboneApp();
}
