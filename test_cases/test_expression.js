const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("Expressions: ", function () {

    describe("Addition: ", function () {

        // addition of string is prohibited
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index: `{% print (a + 'st') %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // addition of string is prohibited
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index: `{% print ('st' + a) %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    })


    describe("Negate: ", function () {

        // negate operator on string is prohibited
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index: `{% print (-'st') %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // negate operator works on integer
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index: `{% print (-2) %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // negate operator works on integer
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index: `{% print (-a) %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });


    describe("concatinate: ", function () {

        // concatinate operator work on strings
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index: `{% print('a' ~ 'b') %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // concatinate operator does not work on boolean
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index: `{% print (a ~ true) %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // concatinate operator does not work on boolean
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index: `{% print (false ~ a) %}`
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("in: ", function () {

        // in operator works on string
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% if (a in 'abc') %}
                        present
                        {% endif %}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // in operator work on array
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% if (a in ['a', 'b', 'c']) %}
                        present
                        {% endif %}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

    });

    describe("notIn: ", function () {

        // notIn operator works on string
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% if (a not in 'abc') %}
                        not present
                        {% endif %}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // notIn operator work on array
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% if (a not in ['a', 'b', 'c']) %}
                        not present
                        {% endif %}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });
    });

    describe('dot', function () {

        // dot's typeSignature : <array>.<integer> or <object>.<identifier>
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = {'a' : 1} %}
                        {{ a.a }}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // dot's typeSignature : <array>.<integer> or <object>.<identifier>
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = [0, 1] %}
                        {{ a.0 }}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // dot's typeSignature : <array>.<integer> or <object>.<identifier>
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = {'0' : 0} %}
                        {{ a.0 }}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });
    });

    describe("subscript: ", function () {

        // subscript's typeSignature : <array>[<integer>] or <object>[<identifier>]
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = {'a' : 1} %}
                        {{ a['a'] }}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // subscript's typeSignature : <array>[<integer>] or <object>[<identifier>]
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = [0, 1] %}
                        {{ a[0] }}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // subscript's typeSignature : <array>[<integer>] or <object>[<identifier>]
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = {'0' : 1} %}
                        {{ a[0] }}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // subscript's typeSignature : <array>[<integer>] or <object>[<identifier>]
        // according to 2nd statement b's type should be integer but accoring to 3rd it should be string 
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                        {% set a = [1,2,3] %}
                        {{ a[b] }}
                        {{ lower(b) }}
                        `
                }
            }
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });
    });

});