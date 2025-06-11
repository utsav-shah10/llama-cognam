const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("functions: ", function () {

    describe('lower', function () {

        // lower function accepts string as argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ lower(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // lower function accepts string as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ lower('ABC') }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe('upper', function () {

        // upper function accepts string as argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ upper(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // upper function accepts string as argument.
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ upper('ABC') }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("title: ", function () {

        // title function accepts string as argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ title(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // title function accepts string as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ title('ABC') }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("round: ", function () {

        // round function accepts number as argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ round(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // round function accepts number as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ round(1.4) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("ceil: ", function () {

        // ceil function accepts number as argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ ceil(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > -0);
        });

        // ceil function accepts number as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ ceil(1.4) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("floor: ", function () {

        // floor function accepts number as argument
        it("Should fail: floor function accepts number as argument.", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ floor(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // floor function accepts number as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ floor(1.4) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("length: ", function () {

        // length function accepts either array or object as argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ length(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // length function accepts either array or object as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ length([1,2,3]) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // length function accepts either array or object as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ length({ 'a' : 1}) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("mean: ", function () {

        // mean function accepts array as argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ mean(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // mean function accepts array as argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ mean([1,2,3]) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("range: ", function () {

        // range function accepts integers as arguments
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = range(1, 10) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        // range function accepts integers as arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = range('a', 'z') %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // null type error of variable 'a'
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = range(1, 10) %}
                        {{ lower(a[0]) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

    });

    describe('first', function () {

        // render accepts either string or number
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = [true, false] %}
                        {{ first(a) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // render accepts either string or number
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = [1, 2] %}
                        {{ first(a) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

    });

    describe("last: ", function () {

        // render accepts either string or number
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = [true, false] %}
                        {{ last(a) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // render accepts either string or number
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = [1, 2] %}
                        {{ last(a) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

    });

    describe("concat: ", function () {

        // render accepts either string or number
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = concat([1,2], [true, false]) %}
                        {{ a[2] }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // render accepts either string or number
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = concat([1,2], [true, false]) %}
                        {{ a[0] }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

    });

    describe("join: ", function () {

        // render accepts either string or number
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = join(',' , ['a', 'b', 'c']) %}
                        {{ a }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        // addition of string is prohibited
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = join(',' , ['a', 'b', 'c']) %}
                        {{ a + 3 }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // render accepts either string or number
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = join(',' , b) %}
                        {{ b[0] }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        // null type error of variable b
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = join(',' , b) %}
                        {{ b[0] | template | render }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

    });

    describe("rgbcolor: ", function () {

        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = rgbcolor("#111111") %}
                        {% set b = rgbcolor([1, 2, 3]) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = rgbcolor(b) %}
                        {{ b }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        // null type error of variable 'b'
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = rgbcolor(b) %}
                        {{ b | template | render }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // rgbcolor function accept either string or colorArray arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = rgbcolor(123) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // rgbcolor function accept either string or colorArray arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = rgbcolor([1, '2', 3]) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // gbcolor function accept either string or colorArray arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = rgbcolor([1, 2]) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

    });

    describe("hexcolor: ", function () {

        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = hexcolor("#111111") %}
                        {% set b = hexcolor([1, 2, 3]) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        // render accepts either string or number
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = hexcolor(b) %}
                        {{ b }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        // null type error of variable 'b'
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = hexcolor(b) %}
                        {{ b | template | render }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // hexcolor function accept either string or colorArray arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = hexcolor(123) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // hexcolor function accept either string or colorArray arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = hexcolor([1, '2', 3]) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // hexcolor function accept either string or colorArray arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = hexcolor([1, 2]) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

    });

    describe("all: ", function () {

        // functions or macros can't be discovered in user-function scope
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ abc() }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // invalid number of arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ lower('ab', 'ac') }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // lower functions takes an argument
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ lower() }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // hexcolor function accept either string or colorArray arguments
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = hexcolor([1, 2, 3, 4]) %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0)
        });

        // 'a' is not a function or macro
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

    });
});