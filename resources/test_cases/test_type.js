const assert = require('assert');
const { createNewType, getSuperType, cloneType, formatType, isSubtype, removeSubtype, removeDuplicateType, typeUnion, typeIntersection, updateType, typeFunction } = require('../src/type');

describe('src/type.js', function () {

    describe('createNewType()', function () {
        it('Should return corret type format', function () {
            const output = createNewType({ type: ['array', 'object'] });
            const expected = { typeSet: ['array', 'object'], updateHistory: [] };
            assert.deepEqual(output, expected);
        });

        it('Should return corret type format', function () {
            const output = createNewType({ type: 'array' }, [1]);
            const expected = { typeSet: ['array'], value: [1], updateHistory: [] };
            assert.deepEqual(output, expected);
        });

        // subtypes are removed
        it('Should return corret type format', function () {
            const output = createNewType(['integer', 'number']);
            const expected = { typeSet: ['number'], updateHistory: [] };
            assert.deepEqual(output, expected);
        });

    });

    describe('cloneType()', function () {
        it('Should clone it properly', function () {
            const type = createNewType({ type: 'integer' });
            const output = cloneType(type);
            const expected = createNewType({ type: 'integer' });;
            assert.deepEqual(output, expected);
        });

        it('Should clone it properly', function () {
            const type = createNewType({ type: 'array', items: { type: 'integer' } });
            const output = cloneType(type);
            const expected = createNewType({ type: 'array', items: { type: 'integer' } });;
            assert.deepEqual(output, expected);
        });

        it('Should reset updateHistory from type', function () {
            const type = createNewType({ type: 'array', items: { type: 'integer' } });
            type.updateHistory.push({ type: type });
            const output = cloneType({ ...type, updateHistory: [{ type: type }] });
            const expected = createNewType({ type: 'array', items: { type: 'integer' } });
            assert.deepEqual(output, expected);
        });

    });

    describe('formatType()', function () {

        it('Should return corret type format', function () {
            const formatted = formatType({ typeSet: ['array'] });
            const expected = 'array';
            assert.deepEqual(formatted, expected)
        });

        it('Should return corret type format', function () {
            const formatted = formatType(createNewType({ type: 'array', items: { type: 'string' } }));
            const expected = 'array<*: string>'
            assert.deepEqual(formatted, expected)
        });

    });

    describe('isSubtype()', function () {

        it('integer is subtype of number', function () {
            assert(isSubtype('integer', 'number') === true);
        });

        it('static string is subtype of string', function () {
            assert(isSubtype('staticString', 'string') === true);
        });

    });

    describe('removeSubtype()', function () {

        it('integer is subtype of number', function () {
            assert.deepEqual(removeSubtype(['number', 'integer']), ['number']);
        });
    });

    describe('removeSubtype()', function () {

        it('integer is subtype of number', function () {
            assert.deepEqual(removeDuplicateType(['integer', 'integer', 'number']), ['integer', 'number']);
        });
    });

    describe('typeUnion()', function () {

        it('should give correct union type for array type', function () {
            const type1 = createNewType({ type: 'array', items: { type: 'string' } });
            const type2 = createNewType({ type: 'array', items: { type: 'integer' } });
            const output = typeUnion(type1, type2);
            const expected = createNewType({ type: 'array', items: { type: ['string', 'integer'] } });
            assert.deepEqual(output, expected);
        });

        it('should give correct union type for array type', function () {
            const type1 = createNewType({ type: 'array', items: [{ type: 'string' }], additionalItems: { type: 'number' } });
            const type2 = createNewType({ type: 'array', items: [{ type: 'integer' }] });
            const type3 = createNewType({ type: 'array', items: [{ type: ['string', 'integer'] }], additionalItems: { type: 'number' } });
            assert.deepEqual(typeUnion(type1, type2), type3);
        });

        it('should give correct union type for object type', function () {
            const type1 = createNewType({ type: 'object', additionalProperties: { type: 'string' } });
            const type2 = createNewType({ type: 'object', additionalProperties: { type: 'integer' } });
            const type3 = createNewType({ type: 'object', additionalProperties: { type: ['string', 'integer'] } });
            assert.deepEqual(typeUnion(type1, type2), type3);
        });

        it('should give correct union type for object type', function () {
            const type1 = createNewType({ type: 'object', properties: { 'a': { type: 'string' } }, additionalProperties: { type: 'number' } });
            const type2 = createNewType({ type: 'object', properties: { 'a': { type: 'integer' } } });
            const type3 = createNewType({ type: 'object', properties: { 'a': { type: ['string', 'integer'] } }, additionalProperties: { type: 'number' } });
            assert.deepEqual(typeUnion(type1, type2), type3);
        });
    });

    describe('updateType()', function () {
        it('Should update type correctly', function () {
            const type1 = createNewType(['integer', 'string']);
            const type2 = createNewType(['number']);
            const type3 = createNewType('integer');
            assert(updateType(type1, type2) === true);
            assert.deepEqual(type1, type3);
        });

        it('Should update type correctly', function () {
            const type1 = createNewType({ type: 'array', items: [{ type: 'number' }] });
            const type2 = createNewType({ type: 'array', items: [{ type: 'integer' }] });
            const type3 = createNewType({ type: 'array', items: [{ type: 'integer' }] });
            assert(updateType(type1, type2) === true);
            assert.deepEqual(type1, type3);
        });

        it('Should return false if update is not possible', function () {
            const type1 = createNewType({ type: 'array', items: [{ type: 'number' }, { type: 'number' }] });
            const type2 = createNewType({ type: 'array', items: [{ type: 'integer' }] });
            assert(updateType(type1, type2) === false);
        });

    });

    describe('typeIntersection()', function () {
        it('Should update type correctly', function () {
            const type1 = createNewType(['integer', 'string']);
            const type2 = createNewType(['number']);
            const type3 = createNewType('integer');
            assert.deepEqual(typeIntersection(type1, type2), type3);
        });
    });

    describe('typeFunctions', function () {

        describe('getArrayFirstItemType()', function () {
            it('Should return type of first item in the array', function () {
                const input = [createNewType({ type: 'array', items: [{ type: 'string' }] })];
                const output = typeFunction({ name: 'getArrayFirstItemType' }, input);
                const expected = createNewType({ type: 'string' });
                assert.deepEqual(output, expected);
            });

            it('Should return type additionaItem if type of first item is not known', function () {
                const input = [createNewType({ type: 'array', items: { type: 'string' } })];
                const output = typeFunction({ name: 'getArrayFirstItemType' }, input);
                const expected = createNewType({ type: 'string' });
                assert.deepEqual(output, expected);
            });
        });

        describe('getArrayLastItemType()', function () {

            it('Should return type of laste item of the array if array is static', function () {
                const input = [createNewType({ type: 'array', items: [{ type: 'integer' }, { type: 'string' }] })];
                const output = typeFunction({ name: 'getArrayLastItemType' }, input);
                const expected = createNewType({ type: 'string' });
                assert.deepEqual(output, expected);
            });

            it('Should return type of additional item if array is not static', function () {
                const input = [createNewType({ type: 'array', items: { type: 'string' } })];
                const output = typeFunction({ name: 'getArrayLastItemType' }, input);
                const expected = createNewType({ type: 'string' });
                assert.deepEqual(output, expected);
            });
        });

        describe('getConcatinatedArrayType()', function () {
            it('Should concatinate array properly', function () {
                const type1 = createNewType({ type: 'array', items: [{ type: 'string' }] });
                const type2 = createNewType({ type: 'array', items: [{ type: 'integer' }] });
                const input = [type1, type2];
                const output = typeFunction({ name: 'getConcatinatedArrayType' }, input);
                const expected = createNewType({ type: 'array', items: [{ type: 'string' }, { type: 'integer' }] });
                assert.deepEqual(output, expected);
            });
        });

        describe('getSameType()', function () {
            it('Should return the same input type', function () {
                const input = [createNewType({ type: 'string' })];
                const output = typeFunction({ name: 'getSameType' }, input);
                const expected = input[0];
                assert.deepEqual(output, expected);
            });
        });

        describe('getMemberInArray()', function () {
            it('Should return correct member type', function () {
                const type1 = createNewType({ type: 'array', items: [{ type: 'string' }] });
                const type2 = createNewType({ type: 'integer' }, 0);
                const input = [type1, type2];
                const output = typeFunction({ name: 'getMemberInArray' }, input);
                const expected = createNewType({ type: 'string' });
                assert.deepEqual(output, expected);
            });

            it('Should return superType if exact index is not known', function () {
                const type1 = createNewType({ type: 'array', items: [{ type: 'string' }] });
                const type2 = createNewType({ type: 'integer' });
                const input = [type1, type2];
                const output = typeFunction({ name: 'getMemberInArray' }, input);
                const expected = getSuperType()
                assert.deepEqual(output, expected);
            });
        });

        describe('getMemberInObject()', function () {
            it('Should return correct member type', function () {
                const type1 = createNewType({ type: 'object', properties: { 'a': { type: 'string' } } });
                const type2 = createNewType({ type: 'string' }, 'a');
                const input = [type1, type2];
                const output = typeFunction({ name: 'getMemberInObject' }, input);
                const expected = createNewType({ type: 'string' });
                assert.deepEqual(output, expected);
            });

            it('Should return superType if exact key is not known', function () {
                const type1 = createNewType({ type: 'object', properties: { 'a': { type: 'string' } } });
                const type2 = createNewType({ type: 'string' });
                const input = [type1, type2];
                const output = typeFunction({ name: 'getMemberInObject' }, input);
                const expected = getSuperType();
                assert.deepEqual(output, expected);
            });
        });


    })
})