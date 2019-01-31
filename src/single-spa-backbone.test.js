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

import singleSpaBackbone from '../src/single-spa-backbone';

describe(`test scope for single-spa-backbone`, () => {

    let basePath = '/base';
    let appPath = 'appPath';

    test(`throws an error if you don't pass required opts and with correct type`, () => {
        expect(() => singleSpaBackbone()).toThrowError('configuration object is not passed as parameter');
        expect(() => singleSpaBackbone({})).toThrowError('BasePath parameter is required');
        expect(() => singleSpaBackbone({ BasePath: null })).toThrowError('BasePath parameter is required');
        expect(() => singleSpaBackbone({ BasePath: '' })).toThrowError('BasePath parameter is required');
        expect(() => singleSpaBackbone({ BasePath: '/' })).toThrowError('Either AppWithRequire or AppSimple parameter need to be passed');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: {}, AppSimple: {} })).toThrowError('Either AppWithRequire or AppSimple parameter can be passed at a time');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: 'app' })).toThrowError('AppWithRequire parameter is expecting an object which is not supplied. It needs IsDataMain, AppPath, RequireJsPath parameter and optionally DependenciesJsPaths');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: {} })).toThrowError('AppWithRequire.IsDataMain parameter is required and expects a boolean value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: { IsDataMain: true } })).toThrowError('AppWithRequire.AppPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: { IsDataMain: {} } })).toThrowError('AppWithRequire.IsDataMain parameter is required and expects a boolean value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: { IsDataMain: true, AppPath: appPath } })).toThrowError('AppWithRequire.RequireJsPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: { IsDataMain: true, AppPath: {} } })).toThrowError('AppWithRequire.AppPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: { IsDataMain: true, AppPath: appPath, RequireJsPath: {} } })).toThrowError('AppWithRequire.RequireJsPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppWithRequire: { IsDataMain: true, AppPath: appPath, RequireJsPath: 'requireJsPath', DependenciesJsPaths: {} } })).toThrowError('AppWithRequire.DependenciesJsPaths parameter expects an array');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppSimple: 'app' })).toThrowError('AppSimple parameter is expecting an object which is not supplied. It needs AppPath, BackboneJsPath and optionally DependenciesJsPaths');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppSimple: {} })).toThrowError('AppSimple.AppPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppSimple: { AppPath: {} } })).toThrowError('AppSimple.AppPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppSimple: { AppPath: appPath } })).toThrowError('AppSimple.BackboneJsPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppSimple: { AppPath: appPath, BackboneJsPath: {} } })).toThrowError('AppSimple.BackboneJsPath parameter is required and expects a string value');
        expect(() => singleSpaBackbone({ BasePath: basePath, AppSimple: { AppPath: appPath, BackboneJsPath: 'backboneJsPath', DependenciesJsPaths: {} } })).toThrowError('AppSimple.DependenciesJsPaths parameter expects an array');
    });

    test(`returns script element if valid props are passed to single spa backbone for simple app`, () => {

        let backboneJsPath = 'backboneJsPath';
        let expectedSrcPath = `http://localhost${basePath}/${appPath}`;
        let options = { BasePath: basePath, AppSimple: { AppPath: appPath, BackboneJsPath: backboneJsPath } };
        const lifeCycleSpa = singleSpaBackbone(options);
        return lifeCycleSpa
            .mount()
            .then((val) => {
                expect(val).toBeInstanceOf(HTMLScriptElement);
                expect(val).toMatchObject({ src: expectedSrcPath });
            });
    });

    let requireJsPath = 'requireJsPath';
    let expectedSrcPath = `"${basePath}/${requireJsPath}"`;
    let expectedDataMainPath = `"${basePath}/${appPath}"`;

    test(`returns script element if valid props are passed to single spa backbone for data main app`, () => {

        let options = { BasePath: basePath, AppWithRequire: { IsDataMain: true, AppPath: appPath, RequireJsPath: requireJsPath } };
        const lifeCycleSpa = singleSpaBackbone(options);
        return lifeCycleSpa
            .mount()
            .then((val) => {
                expect(val).toBeInstanceOf(HTMLScriptElement);
                expect(val.outerHTML).toBe(`<script src=${expectedSrcPath} data-main=${expectedDataMainPath}></script>`);
            });
    });

    test(`returns script element if valid props are passed to single spa backbone for data main app with require js path having leading forward slash`, () => {

        let inputRequireJsPath = `/${requireJsPath}`;
        let options = { BasePath: basePath, AppWithRequire: { IsDataMain: true, AppPath: appPath, RequireJsPath: inputRequireJsPath } };
        const lifeCycleSpa = singleSpaBackbone(options);
        return lifeCycleSpa
            .mount()
            .then((val) => {
                expect(val).toBeInstanceOf(HTMLScriptElement);
                expect(val.outerHTML).toBe(`<script src=${expectedSrcPath} data-main=${expectedDataMainPath}></script>`);
            });
    });

});