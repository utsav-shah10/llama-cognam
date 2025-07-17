const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("Context Schema: ", function () {

    it("Should pass: ", function () {
        let theme = {
            preview: {
                index:
                    `
                    {{ a }}
                `,
                schema_index: {
                    context: {
                        a: { type: 'string' }
                    }
                }
            }
        }

        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', null, theme.preview.schema_index.context);
        printResult(result);
        assert(result.errors.length === 0);
    });

    // a's type boolean in contextSchema
    it("Should fail: ", function () {
        let theme = {
            preview: {
                index:
                    `
                    {{ a }}
                `,
                schema_index: {
                    context: {
                        a: { type: 'boolean' }
                    }
                }
            }
        }
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', null, theme.preview.schema_index.context);
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'a' is in context hence can't be modified
    it("Should fail: ", function () {
        let theme = {
            preview: {
                index:
                    `
                    {% set a = true %}
                `,
                schema_index: {
                    context: {
                        a: { type: 'boolean' }
                    }
                }
            }
        }
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', null, theme.preview.schema_index.context);
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'b' not present in context schema provided
    it("Should fail: ", function () {
        let theme = {
            preview: {
                index:
                    `
                        {{ b }}
                    `,
                schema_index: {
                    context: {
                        a: { type: 'boolean' }
                    }
                }
            }
        }
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', null, theme.preview.schema_index.context);
        printResult(result);
        assert(result.errors.length > 0);
    });

});