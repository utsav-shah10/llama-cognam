# Template Engine Rules Documentation

This document outlines the comprehensive rules and constraints for the JavaScript template engine, organized by functionality and test coverage.

## Table of Contents

1. [Print Statements](#print-statements)
2. [For-Else Loops](#for-else-loops)
3. [Render Statements](#render-statements)
4. [User Environment](#user-environment)
5. [Verbatim Statements](#verbatim-statements)
6. [Object Conditionals](#object-conditionals)
7. [Context Schema](#context-schema)
8. [Block Statements](#block-statements)
9. [Functions](#functions)
10. [Include Statements](#include-statements)
11. [JSON Schema Validation](#json-schema-validation)
12. [Schema Resolution](#schema-resolution)
13. [If-Else Statements](#if-else-statements)
14. [Macros](#macros)
15. [Reserved Words](#reserved-words)
16. [Expressions](#expressions)
17. [Macro Definitions](#macro-definitions)
18. [Variables](#variables)
19. [String Literals](#string-literals)
20. [Import Statements](#import-statements)
21. [Resolve Operations](#resolve-operations)
22. [Arrays and Objects](#arrays-and-objects)
23. [Filters](#filters)

---

## Print Statements

### Rule Coverage: `./test/test_printStatement.js`

- **R1:** Print statements accept either `string` or `number` types only
- **R2:** Print statements are used for outputting values to the template

```javascript
// Valid examples
{{ "Hello World" }}  // string
{{ 42 }}            // number

// Invalid examples
{{ true }}          // boolean not allowed
```

---

## For-Else Loops

### Rule Coverage: `./test/test_forElse.js`

- **R1:** Multiple definition/declaration of the same symbol is prohibited
- **R2:** Iterator variables cannot be modified inside the for loop
- **R3:** Loop variables cannot be modified inside the for loop
- **R4:** Integers are not iterable - only arrays and objects can be iterated
- **R5:** Else scope is a sibling of iterator scope and does not have access to iterator variables
- **R6:** Correct syntax for dual item iteration is `for a,b (dict) | items`
- **R7:** The `items` filter only works on `object` type
- **R8:** In `for a,b (dict) | items`, type of `b` is a union of all dictionary values
- **R9:** In `for a,b (dict) | items`, type of `a` is `string` (dictionary keys)
- **R10:** `loop.first` and `loop.last` are of type `boolean`

```javascript
// Valid for loop
{% for item in array %}
  {{ item }}
{% endfor %}

// Valid dictionary iteration
{% for key, value in dict | items %}
  {{ key }}: {{ value }}
{% endfor %}

// Invalid - modifying iterator
{% for item in array %}
  {% set item = "new_value" %}  // Not allowed
{% endfor %}
```

---

## Render Statements

### Rule Coverage: `./test/test_renderStatement.js`

- **R1:** Render statements accept either `string` or `number` types only

```javascript
// Valid
{% render "template.html" %}
{% render 123 %}

// Invalid
{% render true %}  // boolean not allowed
```

---

## User Environment

### Rule Coverage: `./test/test_userEnvironment.js`

- **R1:** Functions must be present in user environment to be used
- **R2:** Variable names cannot be the same as function names (naming conflicts prohibited)

```javascript
// If function 'process' exists in user environment
{{ process(data) }}  // Valid

// Invalid - naming conflict
{% set process = "value" %}  // Not allowed if 'process' is a function
```

---

## Verbatim Statements

### Rule Coverage: `./test/test_verbatimStatement.js`

- **R1:** Verbatim statement's code segment must not contain `"{% endraw %}"`
- **R2:** Verbatim statement's code segment must not contain `"{% endverbatim %}"`

```javascript
// Valid
{% verbatim %}
  This is raw content
{% endverbatim %}

// Invalid
{% verbatim %}
  Content with {% endverbatim %} inside  // Not allowed
{% endverbatim %}
```

---

## Object Conditionals

### Rule Coverage: `./test/test_objWithIf.js`

- **R1:** `x.b` can be used with if condition, and if true, can be used inside that if statement
- **R2:** `x.b` can only be used with if condition when the property might not exist
- **R3:** Direct usage `{{x.b}}` is not allowed if `x` doesn't contain `b` as key
- **R4:** `x.b` can be used only with `and` operator in if conditions
- **R5:** `or` operator is not valid with potentially undefined object properties
- **R6:** Object keys cannot be accessed in `elif` or `else` blocks if checked in if statement

```javascript
// Valid usage
{% if x.b %}
  {{ x.b }}  // Safe to use here
{% endif %}

{% if x.b and true %}  // Valid with 'and'
  {{ x.b }}
{% endif %}

// Invalid usage
{{ x.b }}  // Not allowed if 'b' might not exist

{% if x.b or true %}  // 'or' not allowed
  {{ x.b }}
{% endif %}

{% if x.b %}
  {{ x.b }}
{% elif x.c %}
  {{ x.b }}  // Not allowed in elif
{% endif %}
```

---

## Context Schema

### Rule Coverage: `./test/test_contextSchema.js`

- **R1:** Items present in context cannot be modified
- **R2:** Items not present in context cannot be used directly

```javascript
// Given context: { a: { type: 'boolean' } }

// Invalid - modifying context item
{% set a = true %}  // Not allowed since 'a' is in context

// Invalid - using undefined context item
{{ b }}  // Not allowed since 'b' is not in context
```

---

## Block Statements

### Rule Coverage: `./test/test_block.js`

- **R1:** Each separate block within a template has its own independent scope
- **R2:** Multiple blocks of same name are not allowed
- **R3:** Nested blocks do not have access to enclosing block variables
- **R4:** Nested blocks are evaluated at the place of outermost block
- **R5:** If context is provided and a reference is unresolved, then error is thrown
- **R6:** If context is not provided and a reference is not resolved, then only warning is shown
- **R7:** Parent tag is replaced by closest ancestor
- **R8:** `ifblock` is used to check if a block is present
- **R9:** Block must be defined before `ifblock` check
- **R10:** Block starting and ending names must match exactly

```javascript
// Valid block usage
{% block content %}
  Inside block content
{% endblock %}

{% ifblock content %}
  This will render since content block exists
{% endifblock %}

// Invalid - multiple blocks with same name
{% block content %}
  First content
{% endblock %}
{% block content %}  // Not allowed - duplicate name
  Second content
{% endblock %}

// Invalid - mismatched names
{% block content0 %}
  Inside block content
{% endblock content1 %}  // content0 != content1

// Invalid - ifblock before block definition
{% ifblock content %}
  This will fail
{% endifblock %}
// Block 'content' not defined yet
```

---

## Functions

### Rule Coverage: `./test/test_function.js`

- **R1:** `lower()` accepts string argument
- **R2:** `upper()` accepts string argument  
- **R3:** `title()` accepts string argument
- **R4:** `round()` accepts number argument
- **R5:** `ceil()` accepts number argument
- **R6:** `floor()` accepts number argument
- **R7:** `length()` accepts either array or object argument
- **R8:** `mean()` accepts array argument
- **R9:** `range()` accepts integers as arguments
- **R10:** `rgbcolor()` accepts either string or colorArray arguments
- **R11:** `hexcolor()` accepts either string or colorArray arguments
- **R12:** The following Jinja/Twig filters are converted to functions: `first`, `last`, `join`, `concat`, `lower`, `upper`, `title`, `round`, `ceil`, `floor`, `length`, `mean`, `range`
- **R13:** String addition is prohibited
- **R14:** Functions or macros need to be discovered in user-function scope

```javascript
// Valid function calls
{{ lower("HELLO") }}
{{ range(1, 5) }}
{{ length(myArray) }}

// Invalid
{{ "hello" + "world" }}  // String addition prohibited
```

---

## Include Statements

### Rule Coverage: `./test/test_include.js`

- **R1:** No template containing block tags or extends tag may be included
- **R2:** Included template has access to passed arguments only (when using `only` keyword)
- **R3:** Only object is accepted as context for inclusion
- **R4:** Recursive include is not allowed

```javascript
// Invalid - including template with blocks
{% include "template_with_blocks.html" %}
// Where template_with_blocks.html contains:
// {% block content %}...{% endblock %}

// Valid - limited context inclusion
{% include "template.html" with { 'a': 1 } only %}
// template.html can only access variable 'a'

// Invalid - accessing undefined variable in included template
// If included with 'only' and specific context:
{% include "template.html" with { 'a': 1 } only %}
// template.html trying to access {{ b }} would fail
```

---

## JSON Schema Validation

### Rule Coverage: `./test/test_JSON_schema_validation.js`

- **R1:** Able to detect invalid keys for nested objects
- **R2:** Able to predefine static arrays in JSON
- **R3:** Type resolution: `"string"` and `"number"` in JSON resolve to `["string","sourceString"]` and `["integer","number"]` in application scope
- **R4:** Reference resolution: References resolve when needed, not before prepopulating application scope

---

## Schema Resolution

### Rule Coverage: `./test/test_schemaResolve.js`

- **R1:** Function resolves JSON references provided as context schema
- **R2:** Deals with application scope object contents (filled by context schema)
- **R3:** Not dealing with JSON schema itself, but with application scope object

---

## If-Else Statements

### Rule Coverage: `./test/test_ifElse.js`

- **R1:** If statement expression must evaluate to one of the JSON types
- **R2:** Variables set before if...else can be overridden inside the if...else statement
- **R3:** Variables set only inside if/else segment cannot be used afterwards
- **R4:** Type of variable after if...else statement is union of possible types
- **R5:** If-else statements share scope with their container
- **R6:** Application scope variables cannot be modified

```javascript
// Valid - variable override
{% set a = 7 %}
{% if true %}
  {% set a = 3 %}  // Override allowed
{% endif %}
// a is now 3

// Invalid - variable not in scope
{% if condition %}
  {% set newVar = 1 %}
{% endif %}
{{ newVar }}  // Error - newVar not in scope

// Type union example
{% if condition %}
  {{ a|template|render }}  // a treated as template path
{% else %}
  {{ a ~ "" }}  // a treated as string
{% endif %}
{{ a }}  // a has union type of string and sourceString
```

---

## Macros

### Rule Coverage: `./test/test_macro.js`

- **R1:** No macro may share the name of any other object in same scope or parent scope
- **R2:** Macro statement may not appear inside if...else or for...else statements
- **R3:** Calling a macro before its definition is prohibited
- **R4:** Macro does not have access to containing scope
- **R5:** Internal macro scope is subordinate to user-function scope, not application scope
- **R6:** Macros can call themselves recursively
- **R7:** Macro arguments cannot have name of a builtin function

```javascript
// Valid macro definition and usage
{% macro greeting(name) %}
  Hello, {{ name }}!
{% endmacro %}

{{ greeting("World") }}

// Valid - macro calling another macro
{% macro m1() %}
  Content from m1
{% endmacro %}

{% macro m2() %}
  {{ m1() }}  // Valid - internal macro scope
{% endmacro %}

// Invalid - macro inside if statement
{% if condition %}
  {% macro invalidMacro() %}  // Not allowed
    Content
  {% endmacro %}
{% endif %}

// Invalid - using macro before definition
{{ undefinedMacro() }}  // Error
{% macro undefinedMacro() %}
  Content
{% endmacro %}
```

---

## Reserved Words

### Rule Coverage: `./test/test_reserveWord.js`

- **R1:** Reserved words cannot be used as variables
- **R2:** Reserved words include: `true`, `TRUE`, `block`, `ifblock`, `if`, `else`, `elif`, `set`, etc.
- **R3:** `loop` can be used as variable only inside loop scope

```javascript
// Invalid variable names
{% set true = "value" %}    // 'true' is reserved
{% set block = "value" %}   // 'block' is reserved
{% set if = "value" %}      // 'if' is reserved

// Valid - loop inside loop scope
{% for item in items %}
  {% set loop = item %}     // Valid inside loop
{% endfor %}
```

---

## Expressions

### Rule Coverage: `./test/test_expression.js`

- **R1:** Negate operator is prohibited on strings
- **R2:** Negate operator works on integers
- **R3:** Concatenate operator works on strings
- **R4:** Concatenate operator does not work on boolean
- **R5:** `in` operator works on string and array
- **R6:** `notIn` operator works on string and array
- **R7:** Dot operator: `<array>.<integer>` or `<object>.<identifier>`
- **R8:** Subscript operator: `<array>[<integer>]` or `<object>[<identifier>]`

```javascript
// Valid expressions
{{ -42 }}              // Negate on integer
{{ "hello" ~ "world" }} // String concatenation
{{ "sub" in "substring" }} // String contains
{{ item in array }}     // Array contains

// Invalid expressions
{{ -"string" }}         // Negate on string not allowed
{{ true ~ false }}      // Boolean concatenation not allowed

// Valid access patterns
{{ array.0 }}           // Array with integer
{{ object.property }}   // Object with identifier
{{ array[0] }}          // Array subscript
{{ object["key"] }}     // Object subscript
```

---

## Macro Definitions

### Rule Coverage: `./test/test_macroDefinition.js`

- **R1:** Macros cannot be defined inside sub-scopes
- **R2:** Must be defined at template root level

```javascript
// Valid - macro at root level
{% macro rootMacro() %}
  Content
{% endmacro %}

// Invalid - macro in sub-scope
{% if condition %}
  {% macro subScopeMacro() %}  // Not allowed
    Content
  {% endmacro %}
{% endif %}
```

---

## Variables

### Rule Coverage: `./test/test_variables.js`

- **R1:** `~` operator is used for string concatenation
- **R2:** Aliasing happens when RHS is a variable
- **R3:** Aliasing happens when RHS is member of an array or object
- **R4:** Aliasing does not happen when RHS is an expression

```javascript
// String concatenation
{{ "Hello, " ~ "World" }}  // Results in "Hello, World"

// Aliasing examples
{% set a = b %}           // Aliasing (b is variable)
{% set a = obj.prop %}    // Aliasing (member access)
{% set a = b + c %}       // No aliasing (expression)
```

---

## String Literals

### Rule Coverage: `./test/test_stringLiteral.js`

- **R1:** Single quotes can contain double quotes
- **R2:** Single quotes cannot contain another single quote
- **R3:** Double quotes can contain single quotes  
- **R4:** Double quotes cannot contain another double quote
- **R5:** String literals must not contain `'%}'`
- **R6:** String literals must not contain `'#{'` 
- **R7:** String literals must not contain `'\\'`
- **R8:** String literals must not contain `'\\n'`
- **R9:** String literals must not contain `'\\r'`

```javascript
// Valid string literals
'String with "double quotes"'
"String with 'single quotes'"

// Invalid string literals
'String with 'single quotes''    // Nested single quotes
"String with "double quotes""    // Nested double quotes
'String with %} closing tag'     // Prohibited content
"String with #{ interpolation"   // Prohibited content
```

---

## Import Statements

### Rule Coverage: `./test/test_import.js`

- **R1:** Circular import is prohibited (prevents circular macro calls)

```javascript
// File A importing File B, and File B importing File A
// This creates a circular dependency and is not allowed
```

---

## Resolve Operations

### Rule Coverage: `./test/test_resolve.js`

- **R1:** Escaping works for output safety
- **R2:** String is marked safe using safe filter
- **R3:** Function calls in expressions are not allowed

```javascript
// Valid
{{ variable|safe }}      // Mark as safe
{{ variable|e }}         // Escape output

// Invalid
{{ lower('STRING') }}    // Function in expression not allowed
```

---

## Arrays and Objects

### Rule Coverage: `./test/test_arrayAndObject.js`

- **R1:** `items` filter accepts 'object' type
- **R2:** For statement works on 'array' type
- **R3:** Empty object and empty array are allowed
- **R4:** `loop.first` returns boolean (prohibited inside render)
- **R5:** `loop.index` returns integer (can be used inside render)

```javascript
// Valid collections
{% set emptyArray = [] %}
{% set emptyObject = {} %}

// Valid loop usage
{% for item in array %}
  Index: {{ loop.index }}    // Valid - integer
{% endfor %}

// Invalid
{% for item in array %}
  {% render loop.first %}    // Invalid - boolean in render
{% endfor %}
```

---

## Filters

### Rule Coverage: `./test/test_filter.js`

- **R1:** `string` filter: argument should be string or nothing
- **R2:** `int` filter: works on string, takes only one argument, does not work on boolean
- **R3:** `number` filter: argument should be integer or nothing, does not work on boolean
- **R4:** `template` operator: does not work on boolean, works on source string
- **R5:** `render` filter: does not work on boolean, argument should be object or nothing
- **R6:** `safe` filter: does not work on boolean, works on string
- **R7:** `e` (escape) filter: does not work on boolean, works on string
- **R8:** Null type errors are thrown for undefined variables

```javascript
// Valid filter usage
{{ "hello"|string }}           // String filter
{{ "123"|int }}               // Int conversion
{{ stringVar|template|render }} // Template processing
{{ output|safe }}             // Mark as safe
{{ userInput|e }}             // Escape output

// Invalid filter usage
{{ true|string }}             // Boolean not allowed
{{ true|number }}             // Boolean not allowed  
{{ true|template }}           // Boolean not allowed
{{ variable|int|int }}        // Multiple arguments not allowed
```

---

## Summary

This template engine implements a strict type system with comprehensive validation rules covering:

- **Type Safety**: Strict type checking for all operations
- **Scope Management**: Clear scoping rules for variables, blocks, and macros
- **Security**: Prevention of code injection and unsafe operations
- **Template Inheritance**: Controlled block and include mechanisms
- **Expression Evaluation**: Safe expression parsing and evaluation

All rules are enforced at compile-time to ensure template safety and predictable behavior.
