const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("filters: ", function () {

    describe("invalid filter: ", function () {
        // given filter does not exists
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 123 | abc }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // given filter does not exists
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 123 | string | abc }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("string: ", function () {

        // string filter's argument should be string or nothing
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 123 | string(1) }}
                    `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // string filter's argument should be string or nothing
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 123 | string('a') }}
                    `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // string filter's argument should be string or nothing
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 123 | string }}
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
                        {{ a | string(b) }}
                        {{ a }} {{ b }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a | string(b) }}
                        {{ a | template | render }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("number: ", function () {

        // number filter does not work on boolean
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ true | number }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // number filter's argument should be integer or nothing
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 1.234 | number('a') }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // number filter's argument should be integer or nothing
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ '12.345' | number(2) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // number filter's argument should be integer or nothing
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ '12' | number }}
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
                        {{ a | number(b) }}
                        {{ a }} {{ b }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // null type error of variable 'a'
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a | number(b) }}
                        {{ a | template | render }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("int", function () {

        // 'int' filter does not work on boolean
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ true | int }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // int filter work on string
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ '12' | int }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // 'int' filter takes only one argument
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ '12' | int(1) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("template: ", function () {

        // template operator does not work on boolean
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = true | template %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // template operator work on source string
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set b = a | template %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("render: ", function () {

        // render filter does not work on boolean
        it("should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ true | render }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // render filter's argument should be either an object or nothing
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a | render('a') }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // null type error for variable 'a'
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a | render }}
                        {{ a }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a | render({'a' : 1}) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("safe: ", function () {

        // safe filter does not work on boolean
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ true | safe }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // safe filter work on string
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 'st' | safe }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // null type error of variable 'a'
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a[0] | safe }}
                        {{ round(a[0]) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("e(escape): ", function () {

        // e(escape) filter does not work on boolean
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ true | e }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // e(escape) filter work on string
        it("Should pass :", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ 'st' | e }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // null type error of variable 'a'
        it("Should pass :", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a[0] | e }}
                        {{ round(a[0]) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

});