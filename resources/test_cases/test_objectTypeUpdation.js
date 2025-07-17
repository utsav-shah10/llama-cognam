const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});


describe("object type updation check: ", function () {

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    
  {%- macro unit_height(theme) -%}
      {{ round(theme.a,2) }}
  {%- endmacro -%}
  {%- set b = theme.b -%} 

  {%- set base_unit_height = unit_height(theme)|number -%}
                `
            }            
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length == 0);
    });
});