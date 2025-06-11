
// this file shows how to use blendedLint.js library
// this is how a validator file should like
const { Linter } = require('../src/index');
const { printResult } = require('./print');
const fs = require('fs')
const { data } = require('../contexts/blended_error_free_with_warnings.js');



//function to check if its valid to validate the file present at templatePath
function notValid(templatePath){
    var a = templatePath.split('.');
    if(a.length > 4)return true;
    return false;
}
function absoluteSchema(theme,path,templateName){
    let schema = theme["_meta__schema"]
    let schemaPath = path + '._schema'
    schema = JSON.parse(schema.content)
    if(schema.hasOwnProperty(templateName)){
        return true;
    }
    return false;
}
function getClosestSchema(theme,name,path,recentAncestorSchema,recentAncestorSchemaPath){

    var namedSchema = '_meta__'+ name; 
    // var content = theme[name];
    let schema;
    let schemaPath; 
    if (theme.hasOwnProperty(namedSchema)) {
       schema = theme[namedSchema]
       schemaPath = path + '._' + name
    //    schemaPath = 'theme' + '._' + name
    } else if (theme.hasOwnProperty("_meta__schema") && absoluteSchema(theme,path,name)) {
        schema = theme["_meta__schema"]
        schema = JSON.parse(schema.content)[name];
        schemaPath = path + '._schema'
        // schemaPath = 'theme' + '._schema'
    } else {
        schema = recentAncestorSchema && recentAncestorSchema[name];
        schemaPath = schema ? recentAncestorSchemaPath: "Not found!"
        // schemaPath = recentAncestorSchemaPath
    }
    return { schema:schema, schemaPath:schemaPath };

}


function layoutValidate(theme, cache = {}) {
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
    const context = { theme };
    const errors = [];
    const warnings = [];

    const foldersToBeValidated = ["html","css","preview","layouts"];

    // var necessaryKeys = ["html","css","preview","layouts","_meta__package","validation"]
    // for(const folderName of necessaryKeys){
    //     if(!theme.hasOwnProperty(folderName)){
    //         errors.push({ type: "Error", message: `The directory "${folderName}" does not exist in the theme and it's a mandatory folder in the theme.` });
    //     }
    // }
    
    let recentAncestorSchema = theme.hasOwnProperty("_meta__schema") ? JSON.parse(theme["_meta__schema"].content) : null;

    var templateQueue = [];
    let recentAncestorSchemaPath = recentAncestorSchema ?'theme._schema' : "Not found!";

    for (const folderName of foldersToBeValidated) {
        if (!theme.hasOwnProperty(folderName)) {
            errors.push({ type: "Error", message: `The directory "${folderName}" does not exist in the theme.` });
        } else {
            let content = theme[folderName];
            let schemaDetail = getClosestSchema(theme,folderName,'theme',recentAncestorSchema,recentAncestorSchemaPath);
            templateQueue.push({ 
                content,
                path: `theme.${folderName}`, 
                schema: schemaDetail.schema, 
                schemaPath: schemaDetail.schemaPath
            })
        }
    }
     
    while (templateQueue.length > 0) {
   
        const { content, path, schema, schemaPath } = templateQueue.shift();

        if (typeof content === "string") {
            const templateHash = linter.hash(content);
            const parser = cache[templateHash] || (cache[templateHash] = linter.parse(content, path));
            // const data = "\ntemplate :- "+ path + "\n" + "schema :- "+ schemaPath + "\n\n";
            //                 // Write data in 'Output.txt' .
            //                 fs.appendFile('Console.txt', data, (err) => {

            //                     // In case of a error throw err.
            //                     if (err) throw err;
            //                 })
            if(schema!=null){
                debugger;
            }
            const { resultFinal, cacheResult } = parser.evaluate(cache, content, path, context, schema, schemaPath);
            // const { resultFinal, cacheResult } = schema ? parser.evaluate(cache, content, path, context, schema, schemaPath) : parser.evaluate(cache, content, path, context);
            cache = cacheResult;
            errors.push(...resultFinal.errors);
            warnings.push(...resultFinal.warnings);
        } else if (typeof content === "object") {
                for (const key in content) {
                    if (key !== "validation") {
                        
                        const subContent = content[key];
                        if (subContent === null) {
                            continue;
                        }
                        const subPath = `${path}.${key}`;
                        const schemaDetails = getClosestSchema(content,key,path,schema,schemaPath);

                        templateQueue.push({ content: subContent, path: subPath, schema: schemaDetails.schema, schemaPath: schemaDetails.schemaPath });
                        }
                    }
                }

    }

    return { errors, warnings, cache };
}
const result = layoutValidate(data);

printResult(result);
console.log(result.errors.length)
console.log(result.warnings.length)