const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("import: ", function () {

    // 'module1' is not defined
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ module1.macro1() }}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // if reference is not resolved and context is provided then error is thrown
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file2 | template  as macro_file %}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // if reference is not resolved and context is not provided then only warning is shown
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file2 | template  as macro_file %}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
        assert(result.warnings.length > 0);
    });


    // macro m2 is not defined in module1
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file1 as module1 %}
                    {{ module1.m2() }}
                `
            },
            macros: {
                "file1":
                    `
                {% macro m1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // macro 'm2' does not exist in file1
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% from theme.macros.file1 | template import m1, m2 %}
                `
            },
            macros: {
                "file1":
                    `
                {% macro m1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    it("Should pass: ", function () {
        const theme = {
            "preview": {
                index:
                    `
                    {% from theme.macros.file1 | template import m1, m2 %}
                `
            },
            "macros": {
                "file1":
                    `
                {% macro m1() %}
                This is m1
                {% endmacro %}

                {% macro m2() %}
                This is m2
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // no template containing block tags or an extends tag may be imported
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file1 | template as macro_file %}
                `
            },
            macros: {
                "file1":
                    `
                {% block content %}
                content
                {% endblock %}
                {% macro m1() %}
                macro m1
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // no template containing block tags or an extends tag may be imported
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file1 | template as macro_file %}
                `
            },
            macros: {
                "file1":
                    `
                {% extends theme.html.home | template %}
                `
            },
            "html": {
                "home":
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

    // syntax error in imported file's macro definition
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file1 | template as macro_file %}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1( %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // type error in imported file's macro definition
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file1 | template as macro_file %}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                {{ true }}
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% import theme.macros.file1 | template as macro_file %}
                    {{ macro_file.macro1() }}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro macro1() %}
                    This is macro1.
                    {% endmacro %}
                    {% import theme.macros.file1 | template as macro_file %}
                    {{ macro_file.macro1() }}
                    {{ macro1() }}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // multiple macro of same name
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro macro1() %}
                    This is macro1.
                    {% endmacro %}
                    {% from theme.macros.file1 | template import macro1 %}
                    {{ macro1() }}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // macro can't share name with any other variables
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set macro1 = "Hello world" %}
                    {% from theme.macros.file1 | template import macro1 %}
                    {{ macro1() }}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro macro1() %}
                    This is macro1.
                    {% endmacro %}
                    {% from theme.macros.file1 | template import macro1 as macro2 %}
                    {{ macro1() }}
                    {{ macro2() }}
                `
            },
            macros: {
                "file1":
                    `
                {% macro macro1() %}
                This is macro1.
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // circular import ( hence circular macro calls ) is prohibited
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% from  theme.macros.file1 | template import macro1%}
                `
            },
            macros: {
                "file1":
                    `
                {% from theme.macros.file2 | template import macro2 %}
                {% macro macro1() %}
                    macro1
                {{ macro2() }}
                {% endmacro %}
                `,
                "file2":
                    `
                {% from theme.macros.file3 | template import macro3 %}
                {% macro macro2() %}
                    macro2
                {{ macro3() }}
                {% endmacro %}
                `,
                "file3":
                    `
                {% from theme.macros.file1 | template import macro1 %}
                {% macro macro3() %}
                    macro3
                {{ macro1() }}
                {% endmacro %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

});