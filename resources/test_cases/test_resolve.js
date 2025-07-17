const assert = require('assert');
const { resolve } = require('../src/resolve');
const { buildParseTree } = require('../src/utils');

function resolveExpressionIntemplate(template, context) {
    const { tree } = buildParseTree(template);
    const exprCtx = tree.blendedBlock()[0].blended().renderStatement();
    return resolve(exprCtx, context);
}

describe("ExpressionEvaluator: ", function () {

    // since 1+1 = 2
    it("Should output 2:", function () {
        const template = "{{ 1 + 1 }}";
        const { output } = resolveExpressionIntemplate(template, {});
        assert(output.value === 2);
    });

    // escaping works
    it("Should output '&gt':", function () {
        const template = "{{ '>' | e }}";
        const { output } = resolveExpressionIntemplate(template, {});
        assert(output.value === '&gt;');
    });

    // string is marked safe using safe filter
    it("Should output '>':", function () {
        const template = "{{ '>' | safe | e }}";
        const { output } = resolveExpressionIntemplate(template, {});
        assert(output.value === '>');
    });

    // no filter named 'abc'
    it("Should give error:", function () {
        const template = "{{ 'a' | abc  }}";
        const { error } = resolveExpressionIntemplate(template, {});
        assert(error);
        console.log(error);
    });

    // function in expression is not allowed
    it("Should give error:", function () {
        const template = "{{ lower('AA') }}";
        const { error } = resolveExpressionIntemplate(template, {});
        assert(error);
        console.log(error);
    });

    // object 'user' has member named 'name' whose value is 'john'
    it("Should output john:", function () {
        const template = "{{ user.name }}";
        const { output } = resolveExpressionIntemplate(template, { user: { name: "john" } });
        assert(output.value === "john");
    });

    // context passed does not have symbol named 'user'
    it("Should give error:", function () {
        const template = "{{ user }}";
        const { error } = resolveExpressionIntemplate(template, {});
        assert(error);
        console.log(error);
    });

    // object 'user' has no member named 'country'
    it("Should give error:", function () {
        const template = "{{ user.country }}";
        const { error } = resolveExpressionIntemplate(template, { user: { name: "john" } });
        assert(error);
        console.log(error);
    });

    // object 'user' has no member named 'country'
    it("Should give error:", function () {
        const template = "{{ user['country'] }}";
        const { error } = resolveExpressionIntemplate(template, { user: { name: "john" } });
        assert(error);
        console.log(error);
    });

});