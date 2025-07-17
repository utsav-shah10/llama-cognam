const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("reserve words: ", function () {

    // reserve words can't be used as variables
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set true = 'a' %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // reserve words can't be used as variables
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set TRUE = 'a' %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // reserve words can't be used as variables
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ block }} 
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'loop' can be used as variable only inside loop scope
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ loop }} 
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'loop' can be used as variable only inside loop scope
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                    {{ loop.index }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

});