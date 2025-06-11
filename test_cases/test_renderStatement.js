const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("render statement: ", function () {

    // render statement accepts either string or number type.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ false }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // render statement accepts either string or number type.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ { "a":  1 } }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // render statement accepts either string or number type.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ 1.0 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // render statement accepts either string or number type.    
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ "1.0" }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{- "1.0" -}}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // render statement accepts either string or number type.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = true %}
                    {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });
});