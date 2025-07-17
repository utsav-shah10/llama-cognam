const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("macro: ", function () {

    // no macro may share the name of any other object defined before or after its definition in the same scope, or in any parent scope
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set hello = 3 %}
                    {% macro hello() %}
                        Hello
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // macro statement may not appear inside an if...else statement
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if true %}
                    {% macro hello() %}
                        Hello
                    {% endmacro %}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // macro statement may not appear inside an for...else statement
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                    {% macro hello() %}
                        Hello
                    {% endmacro %}
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // calling a macro before its definition is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ m1(a) }}
                    {% macro m1(a) %}
                    {{ a }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // macro does not have acess to containing scope
    it("Should fail:  ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 4 %}
                    {% macro m1() %}
                        {{ a }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // sibling macro's are imported in each other's scope
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1() %}
                    This is macro m1.
                    {% endmacro %}
                
                    {% macro m2() %}
                    {{ m1() }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // this passes because the internal macro scope is subordinate to the user-function scope, not application scope
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a,b) %}
                    {% set x = 1 %}
                    {% endmacro %}
                    {{ x }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // this fails due to the fact that {{ x }} inside macro is not specified in the arguments to the macro
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a,b) %}
                    {{ x }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // This fails because m2 has not yet been defined in the same file when m1 is interpreted
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {% print m2(a) %}
                    {% endmacro %}
          
                    {% macro m2(a) %}
                        {% print m1(a) %}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    //  This passes because m1 is defined before m2 yet been defined in the same file when m2 is interpreted
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {% print a %}
                    {% endmacro %}
            
                    {% macro m2(a) %}
                        {% print m1(a) %}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    //  macro can call themselves recursively.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ m1(a) }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    //  macro m1 accepts only 1 arguments but 2 argument is given
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ a }}
                    {% endmacro %}
                    {{ m1(1, 2) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    //  macro m1 takes 2 arguments but 1 argument is given
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a ,b) %}
                    {{ a }}
                    {% endmacro %}
                    {{ m1(1) }}
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
                    {% macro m1(a,b) %}
                    {{ m1(b, a) }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // this macro declaration should fail because the recursive call swaps the arguments
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a,b) %}
                    {{ m1(b, a) }}
                    {{ round(a) }}
                    {{ lower(b) }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // this macro declaration should fail because the recursive call swaps the arguments
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a,b) %}
                    {{ a|template|render }}
                    {{ b }}
                    {{ m1(b, a) }}
                    {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // by type inference macro m1 accepts an array whose first element is string
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ lower(a[0]) }}
                    {% endmacro %}
                    {{ m1(['a']) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // by type inference macro m1 accepts an array whose first element is strig
    it('Should fail', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ lower(a[0]) }}
                    {% endmacro %}
                    {{ m1([1]) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // by type inference macro m1 accepts an array whose second element is string or number
    it('Should pass', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ a[1] }}
                    {% endmacro %}
                    {{ m1([true, 'a']) }}
                `
            }
        }
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // by type inference macro m1 accepts an array whose second element is string or number
    it('Should fail', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ a[1] }}
                    {% endmacro %}
                    {{ m1([false, true]) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // macro arguments can't have name of a builtin function
    it('Should fail', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(length) %}
                    {{ length }}
                    {% endmacro %}
                    {{ m1(1) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // see type inference
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ a }}
                    {% set a = true %}
                    {% endmacro %}
                    `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // only type before first set statement will be used for inferring argument type
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                        {% macro m1(a) %}
                        {{ a }}
                        {% set a = 'a' %}
                        {% endmacro %}
                        
                        {{ m1(1) }}
                        `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

});