const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("variables: ", function () {

    describe("filters", function () {

        // null type error for variable 'a'
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set s = a ~ "b" %}
                        {% set t = a|template %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });
    });


    describe('macro', function () {

        // The signature of the macro is determined to be number, number, which contradicts the static types.
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% macro m1(a) %}
                        {{ a + 1 }}
                        {% endmacro %}
                        {{ m1("one") }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });


        // Type signature of macro matches with static value provided
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% macro m1(a,b) %}
                        {{ a ~ b }}
                        {% endmacro %}
                        {{ m1(1, 2) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0)
        });

        // type signature of macro (a:['string', 'number']) does not matches with the type of value (['boolean']) provided
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% macro m1(a) %}
                        {{ a | int }}
                        {% endmacro %}
                        {{ m1(true) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // type signature of macro (a:['string', 'number']) does not matches with the type of value (['boolean']) provided
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% macro m1(a) %}
                        {{ a | safe }}
                        {% endmacro %}
                        {{ m1(1) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // the signature of the macro is determined to be number, number, which contradicts the type supplied for x(string), y(string)
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% macro macro(a,b) %}
                        {{ a + b }}
                        {% endmacro %}
                        {{ lower(x) ~ lower(y) }}
                        {{ macro(x,y) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("subtypes: ", function () {

        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ a|safe ~ a|e }}
                        {{ a|int + a|number }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        })
    })

    describe("functions: ", function () {

        // null type error for variable 'a'
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {{ lower(a) }}
                        {{ a + 3 }}
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
                        {{ round(a) }}
                        {{ upper(a) }}
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
                        {{ floor(a) }}
                        {{ title(a) }}
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
                        {{ lower(a) }}
                        {{ a ~ 'a' }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("aliasing", function () {

        // aliasing happens when right is an varable, member of an array or object
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set b = a %}
                        {{ b + 1 }}
                        {{ lower(a) }}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);

        });

        // aliasing does not happens when right side is an expression.
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = b|int %}
                        {{ a + 1 }}
                        {{ lower(b) }} 
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
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

        // this should fail due to type contradiction; aliases can point to members of arrays and objects
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = list.2 %}
                        {{ a|template|render }}
                        {{ list.2 ~ "1" }}  
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });
    })

})