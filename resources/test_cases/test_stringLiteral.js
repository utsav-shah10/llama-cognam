const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("string literal: ", function () {

    // string literal can be represented using single quote
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 'abc' %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // string literal can be represented using double quote
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc" %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // string literal represented using single quote can contain double quote inside it
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 'abc"s' %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // string literal represented using single quote can't contain another single quote inside it
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 'abc's' %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // string literal represented using double quote can contain single quote inside it
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc's" %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // string literal represented using double quote can't contain another double quote inside it
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc"s" %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // '%}' in string literal is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc %}" %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // '#{' in string literal is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc #{" %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // '\\' in string literal is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc \\ a" %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // '\\n' in string literal is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc \n " %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // '\\r' in string literal is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = "abc \r " %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

});