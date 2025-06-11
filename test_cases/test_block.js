const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("block: ", function () {

    //  Each separate block within a template has its own, independent scope.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% set a = 3 %}
                {% block content %}
                    {% set a = 4 %}
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    //  Each separate block within a template has its own, independent scope.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% block content %}
                    {% set a = 4 %}
                {% endblock %}
                {{ a }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Multiple block of same name are not allowed
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% block content %}
                content
                {% endblock %}
        
                {% block content %}
                content
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // if context is provided and a reference is unresolved then error is thrown
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.home1 | template %}
                {% block content %}
                content1
                {% endblock %}
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

    // if context is not provided and a reference is not resolved then only warning is shown 
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.home1 | template %}
                {% block content %}
                content1
                {% endblock %}
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
        }
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
        assert(result.warnings.length > 0);
    });

    // Multiple block of same name are not allowed
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                content
                {% endblock %}
                `
            },
            "html": {
                "home":
                    `
                {% block content %}
                content
                {% endblock %}

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

    // Multiple block of same name are not allowed.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                content1
                {% endblock %}
        
                {% block content %}
                content1
                {% endblock %}
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

    // Render statement only accepts string and number data type.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                {{ a }}
                {% endblock %}
                `
            },
            "html": {
                "home":
                    `
                {% set a = true %}
                {% block content %}
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // Render statement only accepts string and number data type.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                {% endblock %}
                `
            },
            "html": {
                "home":
                    `
                {% set a = true %}
                {% block content %}
                {{ a }}
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // parent tag is replaced by clossest ancestor.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                {% set a = 3 %}
                {% parent %}
                {% endblock %}
                `
            },
            "html": {
                "home":
                    `
                {% block content %}
                {% set a = 4 %}
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // parent tag is replaced by clossest ancestor.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.child | template %}
                {% block content %}
                {% set a = 3 %}
                {% parent %}
                {% endblock %}
                `
            },
            "html": {
                "home":
                    `
                {% block content %}
                home
                {% endblock %}
            `,
                "child":
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                {% set a = 3 %}
                {% endblock %}
            `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    // parent tag is replaced by clossest ancestor.
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.child | template %}
                {% block content %}
                {% set a = 3 %}
                {% parent %}
                {% endblock %}
                `
            },
            "html": {
                "home":
                    `
                {% block content %}
                {% set a = 3 %}
                {% endblock %}
                `,
                "child":
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                child
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length === 0);
    });

    // parent tag is replaced by clossest ancestor.
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                {% extends theme.html.child | template %}
                {% block content %}
                {% parent %}
                {% endblock %}
                `
            },
            "html": {
                "home":
                    `
                {% set a = 3 %}
                {% block content %}
                home
                {% endblock %}
                `,
                "child":
                    `
                {% extends theme.html.home | template %}
                {% block content %}
                {% set a = 3 %}
                {% endblock %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
        printResult(result);
        assert(result.errors.length > 0);
    });

    describe("Nested Block ", function () {

        // nested blocks does not have access to containing block
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% block outer %}
                        {% set a = 4 %}
                        {% block inner %}
                            {{ a }}
                        {% endblock %}
                    {% endblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // nested blocks are evaluated at the place of outermost block 
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% block outer %}
                        {% set a = 4 %}
                        {% block inner %}
                            {% set a = 3 %}
                        {% endblock %}
                    {% endblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });
    });

    describe("ifBlock", function () {

        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% ifblock content %}
                        {% block content %}
                            content
                        {% endblock %}
                    {% endifblock %}
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
                    {% ifblock content %}

                    {% endifblock %}
   
                    {% block content %}
                       Inside block content
                   {% endblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // Block 'content' does not exists.
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% ifblock content %}
                    This will be rendered only if block named content exists
                    {% endifblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // Block 'content2' does not exists.
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% ifblock content1 content2 %}
                    This will be rendered only if block named content1 and content2 exists
                    {% endifblock %}
   
                    {% block content1 %}
                    Inside block content1
                    {% endblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

    describe("endBlock", function () {
        // valid template
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% block content %}
                    Inside block content
                    {% endblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // valid template
        it("Should pass: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% block content %}
                    Inside block content
                    {% endblock content %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length === 0);
        });

        // block name mismatch
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% block content0 %}
                    Inside block content
                    {% endblock content1 %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
            printResult(result);
            assert(result.errors.length > 0);
        });

        // block name mismatch
        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% block content0 %}
                        Inside block content
                        {% block content %}
                            Inside block content
                        {% endblock content %}
                    {% endblock content %}
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
                    {% extends theme.html.home | template %}
                    {% block content %}
                    {% parent %}
                    {% endblock content %}
                    `
                },
                "html": {
                    "home":
                        `
                    {% block content %}
                    {% endblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
            printResult(result);
            assert(result.errors.length === 0);
        });

        it("Should fail: ", function () {
            const theme = {
                preview: {
                    index:
                        `
                    {% extends theme.html.home | template %}
                    {% block content %}
                    {% parent %}
                    {% endblock content0 %}
                    `
                },
                "html": {
                    "home":
                        `
                    {% block content %}
                    {% endblock %}
                    `
                }
            };
            const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index', { theme });
            printResult(result);
            assert(result.errors.length > 0);
        });

    });

});