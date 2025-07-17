const assert = require('assert');
const { stringify } = require('querystring');
const { Linter } = require('../src/index');
const { printResult } = require('../test/print');
const fs = require('fs')
const { data } = require('../contexts/business_sunny_update_draft');
var userEnvironment = {
    "functions": [
        {
            "name": "theme_data",
            "argNames": ["theme_object", "block", "template"],
            "return": [
                {
                    "argTypes": ["object", "string", "string"],
                    "returnType": "object"
                }
            ]
        },
        {
            "name": "nav_links",
            "argNames": ["theme", "template_name"],
            "return": [
                {
                    "argTypes": ["object", "string"],
                    "returnType": "string"
                }
            ]
        },
        {
            "name": "css_links",
            "argNames": ["theme"],
            "return": [
                {
                    "argTypes": ["object"],
                    "returnType": { "type": "array", "items": { "type": "string" } }
                }
            ]
        },
        {
            "name": "hash",
            "argNames": ["layout", "prefix"],
            "return": [
                {
                    "argTypes": ["string", ["null", "string"]],
                    "returnType": "string"
                }
            ]
        },
        {
            "name": "home",
            "argNames": [],
            "return": [
                {
                    "argTypes": [],
                    "returnType": "string"
                }
            ]
        },
        {
            "name": "image",
            "argNames": ["path", "height", "width", "filters"],
            "return": [
                {
                    "argTypes": ["string", ["integer", "null"], ["integer", "null"], ["string", "null"]],
                    "returnType": "string"
                }
            ]
        }
    ]
};
const linter = new Linter(userEnvironment);
describe("singleFile: ", function () {
    this.timeout(500000);
    it("File Test: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% set items = {'a':1 , 'b': 2 } %}
                    {% set val = items|string %}
                    {{ items['a'] }}
                    {{ val }}
                    {% set obj = val|Object %}
                    {{ obj['b'] }}
                    {% set val1 = listA|string %}
                    {{ val1 }}
                    {% set val2 = val1|Array %}
                    {{ val2[2]}}
                    `
            }
        };   
    
        var path = 'theme.preview.index';
        const content = theme.preview.index;
        const result = linter.parse(content,path);
        var {resultFinal,cacheResult} = result.evaluate({ },content,path,{theme})
      
        // const result = linter.lintTemplate(content, path, { theme });
        // const result1 = linter.lintTemplate(content1, path1, { theme });
        // const blocks = linter.blocks();
        printResult(resultFinal);
        console.log(resultFinal)
        // console.log(result.warnings);
        assert(result.errors.length > 0);
    });
});