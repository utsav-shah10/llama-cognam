const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("verbatim: ", function () {

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% verbatim %}
                    {% endverbatim %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // verbatim statement’s code segment must not contain the substrings "{% endraw %}" or "{% endverbatim %}"
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% verbatim %}
                    Inside verbatim "{% endverbatim %}"
                    {% endverbatim %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // verbatim statement’s code segment must not contain the substrings "{% endraw %}" or "{% endverbatim %}"
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% verbatim %}
                    Inside verbatim {{ a }} {% endraw %}
                    {% endverbatim %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

});