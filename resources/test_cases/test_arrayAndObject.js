const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("array: ", function () {

    // we know that every member of list must be a string
    // a is alias of all members of list and string can't be added
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% for a in list %}
                    {{ lower(a) }}
                {% endfor %}
                {{ list[1] + 2 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // all the member of 'list' have type ['string', 'number']
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% for a in list %}
                    {% if a == 1 %}
                        {{ a }}
                    {% endif %}
                {% endfor %}
                {{ list[1] ~ "" }}
            
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // items filter accepts 'object' type so after set statement type of 'list' is 'object'
    // for statement work on 'array' type so, null type error for 'list' variable
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set x = list|items %}
                    {% for a in list %}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // integer can be added
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = [1, 2, 3, 4] %}
                    {{ a[0] + 2 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // strings can't be added
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = ['1', '2', '3', '4'] %}
                    {{ a[0] + 2 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // this should fail due to type contradiction; aliases can point to members of arrays and objects
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = list[2] %}
                    {{ a|template|render }}
                    {{ list[2] ~ "1" }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Null type error for variable 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ a[0] + 3 }}
                    {{ lower(a[0]) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Null type error for variable 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ a[1] }}
                    {{ a[1] | template | render  }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Null type error for variable 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% print a[1] %}
                    {{ a[1] | template | render  }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Null type error for variable 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for b in a[0] %}
                    {{ b }}
                    {% endfor %}
                    {{ a[0] }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Null type error for variable 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ a[1] | template | render  }}
                    {{ a[1] }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Integer can be added
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = [1, 2, 3, 4] %}
                    {{ a.0 + 2 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // String can't be added
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = ['1', '2', '3', '4'] %}
                    {{ a.0 + 2 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Integer can be added
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = {"a":  1, "b":  2, "c":  3, "d":  4} %}
                    {{ a.a + 2 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // Addition of string is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = {"a":  "1", "b":  "2", "c":  "3", "d":  "4"} %}
                    {{ a.a + 2 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Boolean type inside render is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = [true, false, true, false] %}
                    {% for x in a %}
                    {{ x }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Boolean type inside render is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for x in [true, false, true, false] %}
                    {{ x }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // loop.first returns boolean which is prohibited inside render
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                    {{ loop.first }}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // loop.index returns integer which can be used inside render
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

    // null type error for variable 'a'
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ a }}
                    {{ a[0] }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // no type contradiction
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for c in list %}
                    {{ b }}
                    {% endfor %}
                    {{ list.0 }}
                    {{ list.1|template|render }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // empty object is allowed
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = {} %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // empty array is allowed
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = [] %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

});