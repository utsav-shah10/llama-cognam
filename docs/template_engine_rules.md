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

- **Type Acceptance**: Print statements accept either `string` or `number` types only
- **Usage**: Used for outputting values to the template

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

### Symbol Declaration Rules
- Multiple definition/declaration of the same symbol is **prohibited**
- Iterator variables **cannot be modified** inside the for loop
- Loop variables **cannot be modified** inside the for loop

### Type and Iteration Rules
- **Integers are not iterable** - only arrays and objects can be iterated
- **Else scope** is a sibling of iterator scope and does not have access to iterator variables

### Dictionary Iteration Syntax
- Correct syntax for dual item iteration: `for a,b (dict) | items`
- The `items` filter only works on `object` type
- In `for a,b (dict) | items`:
  - Type of `b` is a union of all dictionary values
  - Type of `a` is `string` (dictionary keys)

### Loop Properties
- `loop.first` and `loop.last` are of type `boolean`

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

- **Type Acceptance**: Render statements accept either `string` or `number` types only

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

### Function and Variable Rules
- **Functions must be present** in user environment to be used
- **Variable names cannot be the same** as function names (naming conflicts prohibited)

```javascript
// If function 'process' exists in user environment
{{ process(data) }}  // Valid

// Invalid - naming conflict
{% set process = "value" %}  // Not allowed if 'process' is a function
```

---

## Verbatim Statements

### Rule Coverage: `./test/test_verbatimStatement.js`

### Content Restrictions
- Verbatim statement's code segment **must not contain**:
  - `"{% endraw %}"`
  - `"{% endverbatim %}"`

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

### Object Property Access Rules

#### Basic Property Access
- `x.b` can be used with if condition, and if true, can be used inside that if statement
- `x.b` can **only** be used with if condition when the property might not exist
- Direct usage `{{x.b}}` is **not allowed** if `x` doesn't contain `b` as key

#### Logical Operators
- `x.b` can be used **only with `and` operator** in if conditions
- **`or` operator is not valid** with potentially undefined object properties

#### Scope Limitations
- Object keys **cannot be accessed in `elif` or `else` blocks** if checked in if statement

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

### Context Modification Rules
- **Items present in context cannot be modified**
- **Items not present in context cannot be used directly**

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

### Block Scope Rules
- **Each separate block** within a template has its own **independent scope**
- **Multiple blocks of same name** are not allowed
- **Nested blocks do not have access** to enclosing block variables
- **Nested blocks are evaluated** at the place of outermost block

### Context and Resolution
- **If context is provided** and a reference is unresolved, then **error is thrown**
- **If context is not provided** and a reference is not resolved, then only **warning is shown**
- **Parent tag is replaced** by closest ancestor

### IfBlock Statement
- `ifblock` is used to check if a block is present
- Block must be defined before `ifblock` check

### Block Name Matching
- Block starting and ending names **must match exactly**

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

### Built-in Function Argument Types

#### String Functions
- `lower()` - accepts string argument
- `upper()` - accepts string argument  
- `title()` - accepts string argument

#### Number Functions
- `round()` - accepts number argument
- `ceil()` - accepts number argument
- `floor()` - accepts number argument

#### Collection Functions
- `length()` - accepts either array or object argument
- `mean()` - accepts array argument

#### Utility Functions
- `range()` - accepts integers as arguments
- `rgbcolor()` - accepts either string or colorArray arguments
- `hexcolor()` - accepts either string or colorArray arguments

### Filter to Function Conversion
The following Jinja/Twig filters are converted to functions:
- `first`, `last`, `join`, `concat`
- `lower`, `upper`, `title` 
- `round`, `ceil`, `floor`
- `length`, `mean`, `range`

### Function Rules
- **String addition is prohibited**
- **Functions or macros need to be discovered** in user-function scope

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

### Template Inclusion Rules
- **No template containing block tags or extends tag** may be included
- **Included template has access to passed arguments only** (when using `only` keyword)
- **Only object is accepted** as context for inclusion
- **Recursive include is not allowed**

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

### Validation Capabilities
- **Able to detect invalid keys** for nested objects
- **Able to predefine static arrays** in JSON
- **Type resolution**: `"string"` and `"number"` in JSON resolve to `["string","sourceString"]` and `["integer","number"]` in application scope
- **Reference resolution**: References resolve when needed, not before prepopulating application scope

---

## Schema Resolution

### Rule Coverage: `./test/test_schemaResolve.js`

### Resolution Process
- Function resolves JSON references provided as context schema
- Deals with application scope object contents (filled by context schema)
- **Not dealing with JSON schema itself**, but with application scope object

---

## If-Else Statements

### Rule Coverage: `./test/test_ifElse.js`

### Expression Rules
- **If statement expression must evaluate** to one of the JSON types
- **Variables set before if...else** can be overridden inside the if...else statement
- **Variables set only inside if/else** segment cannot be used afterwards
- **Type union**: Type of variable after if...else statement is union of possible types

### Scope Rules
- **If-else statements share scope** with their container
- **Application scope variables cannot be modified**

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

### Macro Definition Rules
- **No macro may share the name** of any other object in same scope or parent scope
- **Macro statement may not appear inside** if...else or for...else statements
- **Calling a macro before its definition** is prohibited
- **Macro does not have access** to containing scope
- **Internal macro scope is subordinate** to user-function scope, not application scope

### Macro Functionality
- **Macros can call themselves recursively**
- **Macro arguments cannot have name** of a builtin function

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

### Reserved Word Rules
- **Reserved words cannot be used as variables**
- Reserved words include: `true`, `TRUE`, `block`, `ifblock`, `if`, `else`, `elif`, `set`, etc.
- **`loop` can be used as variable only inside loop scope**

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

### Operator Rules

#### Negate Operator
- **Prohibited on strings**
- **Works on integers**

#### Concatenate Operator
- **Works on strings**
- **Does not work on boolean**

#### In/NotIn Operators
- **`in` operator works on string and array**
- **`notIn` operator works on string and array**

#### Access Operators
- **Dot operator**: `<array>.<integer>` or `<object>.<identifier>`
- **Subscript operator**: `<array>[<integer>]` or `<object>[<identifier>]`

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

### Definition Scope Rules
- **Macros cannot be defined inside sub-scopes**
- Must be defined at template root level

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

### String Concatenation
- **`~` operator is used for string concatenation**

### Aliasing Rules
- **Aliasing happens when RHS is**:
  - A variable
  - Member of an array or object
- **Aliasing does not happen when RHS is an expression**

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

### Quote Rules
- **Single quotes can contain double quotes**
- **Single quotes cannot contain another single quote**
- **Double quotes can contain single quotes**  
- **Double quotes cannot contain another double quote**

### Prohibited Content
String literals **must not contain**:
- `'%}'`
- `'#{'` 
- `'\\'`
- `'\\n'`
- `'\\r'`

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

### Import Rules
- **Circular import is prohibited** (prevents circular macro calls)

```javascript
// File A importing File B, and File B importing File A
// This creates a circular dependency and is not allowed
```

---

## Resolve Operations

### Rule Coverage: `./test/test_resolve.js`

### Resolution Rules
- **Escaping works** for output safety
- **String is marked safe** using safe filter
- **Function calls in expressions are not allowed**

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

### Collection Rules
- **`items` filter accepts 'object' type**
- **For statement works on 'array' type**
- **Empty object and empty array are allowed**

### Loop Properties
- **`loop.first` returns boolean** (prohibited inside render)
- **`loop.index` returns integer** (can be used inside render)

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

### Filter Argument Rules

#### String Filters
- **`string` filter**: argument should be string or nothing
- **`int` filter**: works on string, takes only one argument, does not work on boolean

#### Number Filters  
- **`number` filter**: argument should be integer or nothing, does not work on boolean

#### Template Filters
- **`template` operator**: does not work on boolean, works on source string
- **`render` filter**: does not work on boolean, argument should be object or nothing

#### Safety Filters
- **`safe` filter**: does not work on boolean, works on string
- **`e` (escape) filter**: does not work on boolean, works on string

### Error Handling
- **Null type errors** are thrown for undefined variables

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