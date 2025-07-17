const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("if..else: ", function () {

    // The expression of an if statement must evaluate to one of the JSON types
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if 1 %}
                    Inside if
                   {% endif %}
       
                   {% if true %}
                    Inside if
                   {% endif %}
       
                   {% if {'a':1} %}
                   Inside if
                   {% endif %}
       
                   {% if [1] %}
                   Inside if
                   {% endif %}
       
                   {% if '1' %}
                    Inside if
                   {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // Variables that are set before entering an if...else statement can be overridden inside the if..else statement
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 7 %}
                    {% if true %}
                        {% set a = 3 %}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // type of 'a' after exiting if-else statement is union of 'string' and 'number'
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                        {% set a = 1 %}
                    {% else %}
                        {% set a = "1" %}
                    {% endif %}
                    {{ a + 1 }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // A variable set only inside if segment can't be used afterwards.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {% set a = 1 %}
                    {% endif %}
                    {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // A variable set only inside else segment can't be used afterwards.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {{b}}
                    {% else %}
                        {% set a = 1 %}
                    {% endif %}
                    {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // type of 'a' after if..else statement is union of 'string' and 'sourceString'
    it('Should pass', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {{ a|template|render }}
                    {% else %}
                        {{ a ~ "" }}
                    {% endif %}
                    {{ a|template|render }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // type of 'a' after if..else statement is union of 'string' and 'sourceString'
    it('Should pass', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {{ a|template|render }}
                    {% else %}
                        {{ a ~ "" }}
                    {% endif %}
                    {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });


    it('Should fail', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {% set a = 3 %}
                    {% else %}
                        {{ a }}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    it('Should fail', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {{ a }}
                    {% else %}
                        {% set a = 3 %}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // if-else statement share scope with their container
    // Since only one of if-else statement will execute
    // type of 'a' will be union of 'string' and 'number'
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if value %}
                    {{ a + 1 }}
                    {% else %}
                        {{ lower(a) }}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    /**
     * The type of "a" would be the union of string and source string and also "a" would be an alias representing all members of "list".
     * The type of "list.0", which is the first member of "list", would be the intersection of the permitted types of the
     * print statement (number and string) with the prior type of that first member (which is the union of string and source string).
     * That intersection is the string type, so the first member of list would be assigned the string type, and all other members would
     * be the union type of string and source string.
     * The type of "list.1" would be the intersection of the permitted input types of the template filter with the prior type of the
     * second member of the list:  <source string> ∩ <source string ∪ string> becomes <source string>
     * So this passes.
     */

    it('Should pass', function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for a in list %}
                    {% if b %}
                        {{ a|template|render }}
                    {% else %}
                        {{ a ~ "" }}
                    {% endif %}
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

    // 'a' is assumed to be come via application scope and applicat scope's variables can't be modified
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {{ a }}
                    {% else %}
                        {% set a = "1" %}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'a' is assumed to be come via application scope and applicat scope's variables can't be modified
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if b %}
                    {% set a = "1" %}
                    {% else %}
                        {{ a }}
                    {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // if...else statement share scope with their container
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro m1(a) %}
                    {{ a }}
                    {% endmacro %}
        
                    {% if b %}
                        {{ m1(b) }}
                    {% endif %}
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
                    {{ a }}
                    {% if b %}
                        {{ lower(b) }}
                    {% else %}
                        {{ lower(b) }}
                    {% endif %}
                    {{ round(b) }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

});
