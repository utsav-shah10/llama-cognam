const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("if..obj.key: ", function () {

    // x.b can be used with if condition and if true same can be used inside that if statement.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.b %}
                      {{ dict.b }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {"a":0} %}
                    {{ test(x) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // x.b can be used with if condition and if true same can be used inside that if statement.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.b %}
                      {{ dict.b }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {"a":0} %}
                    {% set y = {"a":0, "b":1} %}
                    {{ test(x) }}
                    {{ test(y) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // x.b can be used with if condition and if true same can be used inside that if statement.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set y = {"a":0, "b":1} %}
                    {% if y.b %}
                      {{ y.b }}
                    {% endif %}
                    {% set x = {"a":0} %}
                    {% if x.b %}
                      {{ x.b }}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // x.b can be used only with if condition and if true same can be used inside that if statement.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set x = {"a":0} %}
                    {% if x.b %}
                      {{ x.b }}
                    {% endif %}
                    {{ x.b }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // x.b can be used with if condition and only with and operator and if true same can be used inside that if statement.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.b and true %}
                      {{ dict.b }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {"a":0} %}
                    {% set y = {"a":0, "b":1} %}
                    {{ test(x) }}
                    {{ test(y) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // we can't use or operator with x.b in if condition.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.b or true %}
                      {{ dict.b }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {"a":0} %}
                    {% set y = {"a":0, "b":1} %}
                    {{ test(x) }}
                    {{ test(y) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // x.b can be used with if condition and only with and operator and if true same can be used inside that if statement.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.a %}
                      {{ dict.a }}
                    {% elif dict.b %}
                      {{ dict.b }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {"a":0} %}
                    {% set y = {"b":1} %}
                    {{ test(x) }}
                    {{ test(y) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // we can't use or operator with x.b in if condition.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.a %}
                      {{ dict.a }}
                    {% elif dict.b or true %}
                      {{ dict.b }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {"a":0} %}
                    {% set y = {"b":1} %}
                    {{ test(x) }}
                    {{ test(y) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // we can't use or operator with x.b in if condition.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.a %}
                      {{ dict.a }}
                    {% elif dict.b %}
                      {{ dict.b }}
                    {% elif dict.c or true %}
                      {{ dict.c }}
                    {% elif dict.d and false %}
                      {{ dict.d }}
                    {% elif dict.e %}
                      {{ dict.e }}
                    {% elif dict.f and true %}
                      {{ dict.f }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {"a":0 } %}
                    {% set y = {"f":1 } %}
                    {{ test(x) }}
                    {{ test(y) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // x.a checked in if condition and used in elif condition.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set x = {"a":0 } %}
                    {% if x.b %}
                      {{ x.b }}
                    {% elif x.c %}
                      {{ x.b }}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // x.a checked in if condition and used in else condition.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set x = {"a":0 } %}
                    {% if x.b %}
                      {{ x.b }}
                    {% else %}
                      {{ x.b }}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // x.c checked in elif condition and used in else condition.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set x = {"a":0 } %}
                    {% if x.b %}
                      {{ x.b }}
                    {% elif x.c %}
                      {{ x.c }}
                    {% else %}
                     {{ x.c }}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

});
