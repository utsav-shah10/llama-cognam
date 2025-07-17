const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});


describe("comment expression check: ", function () {

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `                   
                    <span class="name">{{(value.comment)}} comments</span>
                `
            }            
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length == 0);
    });

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `                   
                    <span class="name">{{(comment)}} comments</span>
                `
            }            
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length == 0);
    });
});
