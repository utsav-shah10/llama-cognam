const assert = require('assert');
var isEqual = require('lodash.isequal');
function isSchemaEquivalent(schema1,schema2){
    return isEqual(schema1,schema2);
}

var schema = {
    "menu":{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "$schema for navigation entry",
    "id": "http://some.site.somewhere/navigation-schema#",
    "type": "object",
        "properties": {
            "id": {
            "type": "object",
            "properties":{
                "id1":{
                "type":"string"
                }
            }
            },
            "attributes": {
            "type": "integer"
            },
            "name": {
            "#ref": "#/menu/properties/attributes"
            },
            "code":{
            "type":["string","boolean"]
            },
            "label": {
            "type": "string"
            },
            "nav_type": {
            "type": "string"
            },
            "measures":{
            "type":"array",
            "items":["boolean","integer"]
            },
            "nav_items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                "label": {
                    "type": "integer"
                },
                "href": {
                    "type": "string"
                },
                "class": {
                    "type": "string"
                },
                "custom_class": {
                    "type": "string"
                },
                "selected": {
                    "type": "boolean"
                },
                "id": {
                    "type": "integer"
                },
                "is_expanded": {
                    "type": "boolean"
                },
                "description": {
                    "type": "string"
                },
                "icon": {
                    "type": "string"
                },
                "children": {
                    "#ref": "#/menu/properties/nav_items"
                }
    
                }
                ,
            "required": ["label", "href", "children", "class", "selected", "id"]
            }
            
            }
        },
        "required": ["nav_items"]
    }
    };

describe("JSON Schema Verification: ", function () {
    it("Should pass: ", function () {
        var schema2 = {
            "menu":{
            "description": "$schema for navigation entry",
            "id": "http://some.site.somewhere/navigation-schema#",
            "$schema": "http://json-schema.org/draft-04/schema#",
            
                "properties": {
                    "id": {
                    "type": "object",
                    "properties":{
                        "id1":{
                        "type":"string"
                        }
                    }
                    },
                    "attributes": {
                    "type": "integer"
                    },
                    "name": {
                    "#ref": "#/menu/properties/attributes"
                    },
                    "code":{
                    "type":["string","boolean"]
                    },
                    "label": {
                    "type": "string"
                    },
                    "nav_type": {
                    "type": "string"
                    },
                    "measures":{
                    "type":"array",
                    "items":["boolean","integer"]
                    },
                    "nav_items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                        "label": {
                            "type": "integer"
                        },
                        "href": {
                            "type": "string"
                        },
                        "class": {
                            "type": "string"
                        },
                        "custom_class": {
                            "type": "string"
                        },
                        "selected": {
                            "type": "boolean"
                        },
                        "id": {
                            "type": "integer"
                        },
                        "is_expanded": {
                            "type": "boolean"
                        },
                        "description": {
                            "type": "string"
                        },
                        "icon": {
                            "type": "string"
                        },
                        "children": {
                            "#ref": "#/menu/properties/nav_items"
                        }
            
                        }
                        ,
                    "required": ["label", "href", "children", "class", "selected", "id"]
                    }
                    
                    }
                },
                "type": "object",
                "required": ["nav_items"]
            }
            };
        assert(isSchemaEquivalent(schema,schema2));
    });
});