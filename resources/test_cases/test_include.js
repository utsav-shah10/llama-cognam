const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("include: ", function () {

    // if context is provided and a reference is unresolved then error is thrown
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                        {% include theme.layouts.file2 | template %}
                    `
            },
            layouts: {
                "file1":
                    `
                    This is file1.
                    `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // if context is not provided and a reference is not resolved then only warning is shown 
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                        {% include theme.layouts.file2 | template %}
                    `
            },
            layouts: {
                "file1":
                    `
                    This is file1.
                    `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
        assert(result.warnings.length > 0);
    });

    // no template containing block tags or an extends tag may be included
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template %}
                `
            },
            layouts: {
                "file1":
                    `
                {% block content %}
                content
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // no template containing block tags or an extends tag may be included
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template %}
                `
            },
            "html": {
                "home":
                    `
                {% block content %}
                content
                {% endblock %}
                `
            },
            layouts: {
                "file1":
                    `
                {% extends theme.html.home | template %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // included template has access to passed arguments only
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template with { 'a':1 } only %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ b }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // the included template has access to passed arguments only
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template with { 'a':1 } only %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // 'a' gets added to master template's application scope
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // 'a' gets added to master template's application scope
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template %}
                    {% set a = 3 %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // boolean value inside render statement is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template with { 'a':true } only %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // type of 'a' is boolean. render statement does not accept boolean.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = true %}
                    {% include theme.layouts.file1 | template with { 'b':1 } %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // 'a' type gets overridden by argument object
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = true %}
                    {% include theme.layouts.file1 | template with { 'a':1 } %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // 'a' is assumed to be in application scope
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.file1 | template with a %}
                `
            },
            layouts: {
                "file1":
                    `
                file1
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // boolean inside render is not allowed
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = {'b' : true} %}
                    {% include theme.layouts.file1 | template with a %}
                `
            },
            layouts: {
                "file1":
                    `
                {{ b }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Only object is accepted as context
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set a = 3 %}
                    {% include theme.layouts.file1 | template with a %}
                `
            },
            layouts: {
                "file1":
                    `
                file1
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // recursive include not allowed
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% include theme.layouts.html1 | template %}
                    `
            },
            layouts: {
                html1: '{% include theme.layouts.html2 | template %}',
                html2: '{% include theme.layouts.html3 | template %}',
                html3: '{% include theme.layouts.html1 | template %}'
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // inline template can be used
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                            {% set a = '{{ 10 }}' %}
                            {% include a | template %}
                        `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // inline template can be used: boolean inside render is not allowed
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                                {% set a = '{{ true }}' %}
                                {% include a | template %}
                            `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ ambiguous }}
                    {% include theme.layouts.file1 %}
                    {{ ambiguous ~ "one" }}
                `
            },
            layouts: {
                "file1":
                    `
                    {{ ambiguous + 1 }}
                `
            },
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

});