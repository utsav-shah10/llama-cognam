const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});

describe("Without Context: ", function () {
    //artcle becomes string eventually
    it("Should fail: ", function () {
        var schema = {
            "package":{
                "type": "object",
                "properties":{
                    "fixtures":{
                        "type":"object",
                        "properties":{
                                "article":{
                                    "type":"string"
                                }
                            }
                        }
                    }
                }
        };
        const theme = {
            preview: {
                index:
                    `
                    {% set article = package.fixtures.article %}
                    {{ article }}
                    {% include package.fixtures.article|template %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index',null,schema);
        printResult(result);
        assert(result.errors.length > 0);
    });

    it("Should fail: ", function () {
        var schema = {
            "container":{
                "type": "object",
                "properties":{
                    "ambiguous":{
                        "type":["string","number"]
                        }
                    }
                }
        };
        const theme = {
            preview: {
                index:
                    `
                    {% set number = container.ambiguous %}
                    {{ number + 1 }}
                    {{ container.ambiguous ~ "text" }}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index',null,schema);
        printResult(result);
        assert(result.errors.length > 0);
    });
});