const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("for..else: ", function () {

    // Multiple definition of symbol 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 3 %}
                    {% for a in list %}
                    {{ c }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Multiple declaration of symbol 'a'
    it("Should fail :", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 3 %}
                    {% for a, b in (dict) | items %}
                    {{ a }} {{ b }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // multiple declaration of symbol 'a'.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 3 %}
                    {% for b in list %}
                        {% set a = 2%}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // iterator variable can't be modified inside for loop
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                        {% set a = 2%}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // '2' is not iterable
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in 2 %}
                        {{ a }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'loop' variable can't be modified inside for loop
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                        {% set loop = 2 %}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // multiple declaration of symbol 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 3 %}
                    {% for b in list %}
                        {{ b }}
                    {% else %}
                    {% set a = 4 %}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // else scope is a sibling of iterator scope hence does not have acess to iterator variable
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                        {{ a }}
                    {% else %}
                        {{ a }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // syntax for dual item for statement is 'for a,b  (dict) | items'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a, b in [1,2,3] %}
                    {{ a }} {{ b }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // syntax for dual item for statement is 'for a,b  (dict) | items'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a, b in c %}
                    {{ a }} {{ b }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'items' filter work on 'object' type
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set arr = [] %}
                    {% for a, b in (arr) | items %}
                    {{ b }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // type of 'b' is union of all the values of the dictionary, which is boolean
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set dict = {'first': true, 'second': false} %}
                    {% for a, b in (dict) | items %}
                    {{ b }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // syntax for dual item for statement is 'for a,b  (dict) | items'
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a, b in (dict) | items %}
                    {{ a }} {{ b }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // type of 'a' is 'string' as we are iterating over dictionary
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a, b in (dict) | items %}
                    {{ round(a) }} {{ b }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // type of loop.first and loop.last is boolean
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                    {% if loop.first or loop.last %}
                        {{ "First or last element" }}
                    {% endif %}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

});
