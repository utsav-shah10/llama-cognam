// this file shows how to use blendedLint.js library
// this is how a validator file should like
const { Linter } = require('../src/index');
const { printResult } = require('./print');
// const { data } = require('../contexts/business_1_errorFree.js');
const { data } = require('../contexts/blended_error_free_with_warnings.js');
// const {validate} = require('../public/validation/src/validator.js');
// // const fs = require('fs')
// const isEqual = require('lodash.isequal');


//function to check if its valid to validate the file present at templatePath
function notValid(templatePath){
    var a = templatePath.split('.');
    if(a.length > 4)return true;
    return false;
}


function validate(theme,cache={}) {
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

    var linter = new Linter(userEnvironment);
    var context = { 'theme': theme };
    var allErrors = [], allWarnings = [];

    var foldersToBeValidated = ['html','css','layouts','preview'];
    var recentAncestorSchema = null;
    if(theme.hasOwnProperty('_meta__schema')){
        recentAncestorSchema = theme['_meta__schema'];
    }
    var templateQueue = [];

    for ( i in foldersToBeValidated) {
        var folderName = foldersToBeValidated[i];
        if (!theme.hasOwnProperty(folderName)) {
            let error = new Error('The directory "' + folderName + '" does not exist in the theme.');
            allErrors.push({'type': error.name, 'message': error.message});
        } else {
            var namedSchema = '_meta__'+folderName;
            if(theme[folderName].hasOwnProperty(namedSchema)){
                templateQueue.push({ content: theme[folderName], path: 'theme.' + folderName, schema: theme[folderName][namedSchema], schemaPath: 'theme.' + folderName + '.' + '_'+folderName });
            }else if(theme[folderName].hasOwnProperty('_meta__schema')){
                templateQueue.push({ content: theme[folderName], path: 'theme.' + folderName, schema: theme[folderName]['_meta__schema'], schemaPath: 'theme.' + folderName + '._schema'});
            }else{
                if(recentAncestorSchema !== null){
                    templateQueue.push({ content: theme[folderName], path: 'theme.' + folderName, schema: recentAncestorSchema, schemaPath: 'theme._schema'});
                }else{
                    templateQueue.push({ content: theme[folderName], path: 'theme.' + folderName, schema: recentAncestorSchema, schemaPath: "Not found!"});
                }
            }
        }
    }
    // var cache = {}
    // running lint on all templates present
    while (templateQueue.length > 0) {
        var template = templateQueue.shift();
        var content = template.content;
        var path = template.path;
        // if(path== 'theme.preview'){
        //     console.log("Heyyyyyyyyyyyyyyy")
        // }
        var recentAncestorSchema = template.schema;
        var recentAncestorSchemaPath = template.schemaPath;
        var result = {}
        if(notValid(path)){
            continue;
        }
        if (typeof content === 'string') {
            // var result;
            var parser;

            const template_hash = linter.hash(content)
            
            if (template_hash in cache) {
                parser = cache[template_hash]
            } else {
                parser = linter.parse(content,path)
                cache[template_hash] = parser
            }
            if(recentAncestorSchema === null){
  
                let {resultFinal,cacheResult} = parser.evaluate(cache,content,path,context)
                cache = cacheResult
                result = resultFinal
                // result = linter.lintTemplate(content, path, context);
            }else{
                if(recentAncestorSchemaPath == 'theme._schema')continue;
                // result = linter.lintTemplate(content, path, context, recentAncestorSchema , recentAncestorSchemaPath);
                debugger;
                let {resultFinal,cacheResult} = parser.evaluate(cache,content,path,context,recentAncestorSchema,recentAncestorSchemaPath)
                cache = cacheResult
                result = resultFinal
            }
            // allBlocks = allBlocks.concat(result)
            allErrors = allErrors.concat(result.errors);
            allWarnings = allWarnings.concat(result.warnings);
            
        } else if (typeof content === 'object') {
            for (key in content) {
            	// not validating validation folder
            	if(key !== 'validation'){

                var namedSchema = '_meta__'+key;
                if(content[key] === null){
                    continue;
                }
                if(content[key].hasOwnProperty(namedSchema)){
                    templateQueue.push({ content: content[key], path: path + '.' + key, schema: content[key][namedSchema], schemaPath: path + '.' + key + "." + '_'+key });
                }else if(content[key].hasOwnProperty('_meta__schema')){
                    templateQueue.push({ content: content[key], path: path + '.' + key, schema: content[key]['_meta__schema'], schemaPath: path + '.' + key + '_schema'});
                }else{
                    if(recentAncestorSchema !== null){
                        templateQueue.push({ content: content[key], path: path + '.' + key, schema: recentAncestorSchema , schemaPath: recentAncestorSchemaPath });
                    }else{
                        templateQueue.push({ content: content[key], path: path + '.' + key, schema: recentAncestorSchema , schemaPath: "Not found!" });
                    }
            		
            	}
            }
                
            }
        }
    }
    return { errors: allErrors, warnings: allWarnings, cache:cache };
    // return { errors: allErrors, warnings: allWarnings, cache:cache };
}
// var startTime = performance.now()
const result = validate(data);
// var endTime = performance.now()

// console.log(`took ${endTime/1000 - startTime/1000} seconds`)
// console.log(result);

printResult(result);