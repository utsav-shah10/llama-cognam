const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("print statement: ", function () {

    //  print statement accepts either string or number type
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% print true %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    //  print statement accepts either string or number type
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% print { "a":  1 } %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    //  print statement accepts either string or number type
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% print 1.0 %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    //  print statement accepts either string or number type
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% print "1.0" %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    //  print statement accepts either string or number type
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = true %}
                    {% print a %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

});