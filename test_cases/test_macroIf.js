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
    it("syntax error in included template Test: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% macro test(dict) %}
                    {% if dict.b %}
                        {{ dict.b }}
                    {% endif %}
                    {% endmacro %}
                    {% set x = {'a':0} %}
                    {{ test(x) }}
                    `
                    ,
                index1: 
                    `
                    {% set x = {'a':0} %}
                    {% if x.b %}
                        {{ x.b }}
                    {% endif %}
                    {{ x.b }}
                    `,
                index2:
                `
                {% include theme.preview.index1 |template with { 'a': 'hi', 'theme': theme } only %}
                `,
                index3: 
                `
                {% macro test(dict) %}
                {% if dict.a %}
                  {{ dict.a }}
                {% elif dict.b %}
                  {{ dict.c }}
                {% endif %}
                {% endmacro %}
                {% set x = {"a":0 } %}
                {{ test(x) }}
                `,
                index4: 
                `
                {% set x = {"a":0 } %}
                {% if x.b %}
                  {{ x.b }}
                {% endif %}
                {{ x.b }}
                `,
                index5:
                `
                {% set b = false %}
                {% set c = false %}
                {% set d = true %}
                {% if b  %}
                {{ 'b' }}
                {% elif c %}
                {{ 'c' }}
                {% elif r %}
                {{ 'd' }}
                {% elif e %}
                {{ 'd' }}
                {% elif d %}
                {{ 'd' }}
                {% endif %}
                `

            },
            base:
            `
            {{ image('s1') }}
            `
        };   
    
        var path = 'theme.preview.index3';
        const content = theme.preview.index3;
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