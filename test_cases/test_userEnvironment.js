const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

// in this case we are creating Linter instance in each test case as userEnvironment is different for each case
describe("user functions: ", function () {

    // home function is not defined
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ home() }}
                `
            }
        };
        const linter = new Linter();
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // home function is provided in userEnvironment
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {{ home() }}
                `
            }
        };
        const userEnvironment = {
            functions: [
                {
                    "name": "home",
                    "argNames": [],
                    "return": [
                        {
                            "argTypes": [],
                            "returnType": "string"
                        }
                    ]
                }
            ]

        };
        const linter = new Linter(userEnvironment);
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });


    // css_links function is not defined
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for link in css_links(theme) %}
                        <link rel="stylesheet" href="{{ link }}" >
                    {% endfor %}
                `
            }
        };
        const linter = new Linter();
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // css_links function is provided in userEnvironment
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for link in css_links(theme) %}
                        <link rel="stylesheet" href="{{ link }}" >
                    {% endfor %}
                `
            }
        };
        const userEnvironment = {
            functions: [
                {
                    "name": "css_links",
                    "argNames": ["theme"],
                    "return": [
                        {
                            "argTypes": ["object"],
                            "returnType": { type: "array", items: { type: "string" } }
                        }
                    ]
                }
            ]

        };
        const linter = new Linter(userEnvironment);
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // nav_links function is not defined
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    <a href="{{nav_links(theme, 'home')}}">Home</a>
                `
            }
        };
        const linter = new Linter();
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // nav_links function is provided in userEnvironment
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    <a href="{{nav_links(theme, 'home')}}">Home</a>
                `
            }
        };
        const userEnvironment = {
            functions: [
                {
                    "name": "nav_links",
                    "argNames": ["theme", "template_name"],
                    "return": [
                        {
                            "argTypes": ["object", "string"],
                            returnType: "string"
                        }
                    ]
                }
            ]

        };
        const linter = new Linter(userEnvironment);
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // image function is not defined
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    <img src="{{ image(value.media.src) }}" />     
                `
            }
        };
        const linter = new Linter();
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

    // image function is provided in userEnvironment
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    <img src="{{ image(value.media.src, 390, 540, "crop") }}"/>  
                `
            }
        };
        const userEnvironment = {
            functions: [
                {
                    "name": "image",
                    "argNames": ["image_meta", "height", "width", "filters"],
                    "return": [
                        {
                            "argTypes": ["object", ["null", "integer"], ["null", "integer"], "string"],
                            "returnType": "string"
                        }
                    ]
                }
            ]
        };
        const linter = new Linter(userEnvironment);
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // image function is provided in userEnvironment
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    <img src="{{ image(value.media.src) }}" />     
                `
            }
        }
        const userEnvironment = {
            functions: [
                {
                    "name": "image",
                    "argNames": ["image_meta", "height", "width", "filters"],
                    "return": [
                        {
                            "argTypes": ["object", ["null", "integer"], ["null", "integer"], ["null", "string"]],
                            "returnType": "string"
                        }
                    ]
                }
            ]
        };
        const linter = new Linter(userEnvironment);
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    // image is user function hence can't be used as variable
    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set image = 'saikat' %}
                `
            }
        };
        const userEnvironment = {
            functions: [
                {
                    "name": "image",
                    "argNames": ["image_meta", "height", "width", "filters"],
                    "return": [
                        {
                            "argTypes": ["object", ["null", "integer"], ["null", "integer"], ["null", "string"]],
                            "returnType": "string"
                        }
                    ]
                }
            ]
        };
        const linter = new Linter(userEnvironment);
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });

});