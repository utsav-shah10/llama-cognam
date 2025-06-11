const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');
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
    it("File Test: ", function () {
        const theme = data;
        var content = theme.preview.about;
        var path = 'theme.preview.about';
        var contextSchema = { 
            "menu":{
              "$schema": "http://json-schema.org/draft-04/schema#",
              "description": "$schema for navigation entry",
              "id": "http://some.site.somewhere/navigation-schema#",
              "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "attributes": {
                      "type": "string"
                    },
                    "name": {
                      "type": "string"
                    },
                    "label": {
                      "type": "string"
                    },
                    "nav_type": {
                      "type": "string"
                    },
                    "nav_items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "label": {
                            "type": "string"
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
                            "type": "string"
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
                            "type": "array",
                            "schema": {
                              "#ref": "#/menu/properties/nav_items"
                            }
                          }
            
                        }
                        ,
                      "required": ["label", "href", "children", "class", "selected", "id"]
                      }
            
                    }
            
                  },
                  "required": ["nav_items"]
              },
              "theme":{
                "$schema": "http://json-schema.org/draft-04/schema#",
                "description": "$schema for theme only for footer_nav",
                "id": "http://some.site.somewhere/navigation-schema#",
                "type": "object",
                "properties": {
                  "grid":{
                    "type": "object",
                    "properties":{
                      "break_lg": {
                        "type": "string"
                      },
                      "break_md": {
                        "type": "string"
                      },
                      "break_sm": {
                        "type": "string"
                      },
                      "depth_nv": {
                        "type": "string"
                      },
                      "gutter_lg": {
                        "type": "string"
                      },
                      "gutter_md": {
                        "type": "string"
                      },
                      "gutter_sm": {
                        "type": "string"
                      },
                      "inverse": {
                        "type": "boolean"
                      },
                      "length_nv": {
                        "type": "string"
                      },
                      "width_lg": {
                        "type": "string"
                      },
                      "width_md": {
                        "type": "string"
                      },
                      "width_nv": {
                        "type": "string"
                      },
                      "width_sm": {
                        "type": "string"
                      }
                    }
                  },
                  "macros":{
                    "type": "string"
                  },
                  "css":{
                    "type":"object",
                    "properties":{
                      "height_units_per_line": {
                        "type":"integer"
                      }
                     }
                  },
                  "style_set":{
                    "type":"object",
                    "properties":{
                      "base_font_style":{
                        "type":"string"
                      },
                      "base_line_ratio":{
                        "type":"integer"
                      },
                      "font_scale_ratio":{
                        "type":"integer"
                      },
                      "base_font_size_default":{
                        "type":"integer"
                      },
                      "base_font_size_md":{
                        "type":"integer"
                      },
                      "base_font_size_lg":{
                        "type":"integer"
                      },
                      "heading_font_style":{
                        "type":"string"
                      },
                      "heading_scale_ratio":{
                        "type":"integer"
                      },
                      "large_heading_font_style":{
                        "type":"string"
                      },
                      "large_heading_scale_ratio":{
                        "type":"integer"
                      },
                      "navigation_font":{
                        "type":"object",
                        "properties":{
                          "name": {
                            "type":"string"
                          },
                          "representation": {
                            "type":"string"
                          },
                          "source": {
                            "type":"string"
                          },
                          "value": {
                            "type":"string"
                          }
                        }
                      },
                    }
                  },
                  "palette":{
                    "type":"object",
                    "properties":{
                      "black": {
                        "type":"string"
                      },
                      "bold": {
                        "type":"string"
                      },
                      "bright": {
                        "type":"string"
                      },
                      "dark": {
                        "type":"string"
                      },
                      "label": {
                        "type":"string"
                      },
                      "light": {
                        "type":"string"
                      },
                      "very_dark":{
                        "type":"string"
                      },
                      "very_light": {
                        "type":"string"
                      },
                      "white": {
                        "type":"string"
                      }
                    }
                  }
                }
              }
            }        
        var startTime = performance.now()
        const result = linter.lintTemplate(content, path, { theme });
        var endTime = performance.now()
        printResult(result);
        console.log(`took ${endTime/1000 - startTime/1000} seconds`)
        // console.log(result.errors);
        assert(result.errors.length > 0);
    });
});