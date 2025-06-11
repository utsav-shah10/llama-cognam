const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("set statement: ", function () {

    // syntax error
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ set a = 'a' }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // correct syntax for set statement
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 'a' %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // correct syntax for set statement
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {%- set a = 'a' %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // string is allowed inside render statement
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 'a' %}
                    {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // boolean is not allowed inside render statement
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 'a' %}
                    {% set a = true %}
                    {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'a' is not a function
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 3 %}
                    {{ a() }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // using a variable before its definition is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ a }}
                    {% set a = 4 %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

});