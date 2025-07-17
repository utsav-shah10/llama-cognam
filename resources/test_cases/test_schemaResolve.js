const {cloneType} = require('../src/type');

const applicationScopeObject = {
  menu: {
    scopeName: "application",
    declaration: "var",
    location: {
      templatePath: "contextSchema",
      line: 0,
      column: 0,
    },
    type: {
      typeSet: [
        "object",
      ],
      updateHistory: [
        {
          type: {
            typeSet: [
              "object",
            ],
            updateHistory: [
            ],
            objectProperties: {
              properties: {
                id: {
                  typeSet: [
                    "object",
                  ],
                  updateHistory: [
                  ],
                  objectProperties: {
                    properties: {
                      id1: {
                        typeSet: [
                          "string",
                          "sourceString",
                        ],
                        updateHistory: [
                        ],
                      },
                    },
                  },
                },
                attributes: {
                  typeSet: [
                    "string",
                    "sourceString",
                  ],
                  updateHistory: [
                  ],
                },
                name: {
                  typeSet: [
                    "reference",
                    "#/menu/properties/attributes",
                  ],
                  updateHistory: [
                  ],
                },
                code: {
                  typeSet: [
                    "string",
                    "boolean",
                  ],
                  updateHistory: [
                  ],
                },
                label: {
                  typeSet: [
                    "string",
                    "sourceString",
                  ],
                  updateHistory: [
                  ],
                },
                nav_type: {
                  typeSet: [
                    "string",
                    "sourceString",
                  ],
                  updateHistory: [
                  ],
                },
                measures: {
                  typeSet: [
                    "array",
                  ],
                  updateHistory: [
                  ],
                  arrayProperties: {
                    items: {
                      "0": {
                        typeSet: [
                          "boolean",
                        ],
                        updateHistory: [
                        ],
                      },
                      "1": {
                        typeSet: [
                          "boolean",
                        ],
                        updateHistory: [
                        ],
                      },
                    },
                  },
                },
                nav_items: {
                  typeSet: [
                    "array",
                  ],
                  updateHistory: [
                  ],
                  arrayProperties: {
                    additionalItems: {
                      typeSet: [
                        "object",
                      ],
                      updateHistory: [
                      ],
                      objectProperties: {
                        properties: {
                          label: {
                            typeSet: [
                              "string",
                              "sourceString",
                            ],
                            updateHistory: [
                            ],
                          },
                          href: {
                            typeSet: [
                              "string",
                              "sourceString",
                            ],
                            updateHistory: [
                            ],
                          },
                          class: {
                            typeSet: [
                              "string",
                              "sourceString",
                            ],
                            updateHistory: [
                            ],
                          },
                          custom_class: {
                            typeSet: [
                              "string",
                              "sourceString",
                            ],
                            updateHistory: [
                            ],
                          },
                          selected: {
                            typeSet: [
                              "boolean",
                            ],
                            updateHistory: [
                            ],
                          },
                          id: {
                            typeSet: [
                              "integer",
                            ],
                            updateHistory: [
                            ],
                          },
                          is_expanded: {
                            typeSet: [
                              "boolean",
                            ],
                            updateHistory: [
                            ],
                          },
                          description: {
                            typeSet: [
                              "string",
                              "sourceString",
                            ],
                            updateHistory: [
                            ],
                          },
                          icon: {
                            typeSet: [
                              "string",
                              "sourceString",
                            ],
                            updateHistory: [
                            ],
                          },
                          children: {
                            typeSet: [
                              "reference",
                              "#/menu/properties/nav_items",
                            ],
                            updateHistory: [
                            ],
                          },
                        },
                      },
                    },
                    items: {
                    },
                  },
                },
              },
            },
          },
          location: {
            templatePath: "contextSchema",
            line: 0,
            column: 0,
          },
        },
      ],
      objectProperties: {
        properties: {
          id: {
            typeSet: [
              "object",
            ],
            updateHistory: [
            ],
            objectProperties: {
              properties: {
                id1: {
                  typeSet: [
                    "string",
                    "sourceString",
                  ],
                  updateHistory: [
                  ],
                },
              },
            },
          },
          attributes: {
            typeSet: [
              "string",
              "sourceString",
            ],
            updateHistory: [
            ],
          },
          name: {
            typeSet: [
              "reference",
              "#/menu/properties/attributes",
            ],
            updateHistory: [
            ],
          },
          code: {
            typeSet: [
              "string",
              "boolean",
            ],
            updateHistory: [
            ],
          },
          label: {
            typeSet: [
              "string",
              "sourceString",
            ],
            updateHistory: [
            ],
          },
          nav_type: {
            typeSet: [
              "string",
              "sourceString",
            ],
            updateHistory: [
            ],
          },
          measures: {
            typeSet: [
              "array",
            ],
            updateHistory: [
            ],
            arrayProperties: {
              items: {
                "0": {
                  typeSet: [
                    "boolean",
                  ],
                  updateHistory: [
                  ],
                },
                "1": {
                  typeSet: [
                    "boolean",
                  ],
                  updateHistory: [
                  ],
                },
              },
            },
          },
          nav_items: {
            typeSet: [
              "array",
            ],
            updateHistory: [
            ],
            arrayProperties: {
              items: {
              },
              additionalItems: {
                typeSet: [
                  "object",
                ],
                updateHistory: [
                ],
                objectProperties: {
                  properties: {
                    label: {
                      typeSet: [
                        "string",
                        "sourceString",
                      ],
                      updateHistory: [
                      ],
                    },
                    href: {
                      typeSet: [
                        "string",
                        "sourceString",
                      ],
                      updateHistory: [
                      ],
                    },
                    class: {
                      typeSet: [
                        "string",
                        "sourceString",
                      ],
                      updateHistory: [
                      ],
                    },
                    custom_class: {
                      typeSet: [
                        "string",
                        "sourceString",
                      ],
                      updateHistory: [
                      ],
                    },
                    selected: {
                      typeSet: [
                        "boolean",
                      ],
                      updateHistory: [
                      ],
                    },
                    id: {
                      typeSet: [
                        "integer",
                      ],
                      updateHistory: [
                      ],
                    },
                    is_expanded: {
                      typeSet: [
                        "boolean",
                      ],
                      updateHistory: [
                      ],
                    },
                    description: {
                      typeSet: [
                        "string",
                        "sourceString",
                      ],
                      updateHistory: [
                      ],
                    },
                    icon: {
                      typeSet: [
                        "string",
                        "sourceString",
                      ],
                      updateHistory: [
                      ],
                    },
                    children: {
                      typeSet: [
                        "reference",
                        "#/menu/properties/nav_items",
                      ],
                      updateHistory: [
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    typeHistory: [
    ],
  },
};
  // function to reolve JSON references provided as context schema note that we don't have actually schema here
  // we have the contents of application sccope here which was filled by this context schema

function resolveApplicationScope(applicationScopeList,locator){
    // //locator will be the obj which need to be filled after resolved
    // //return the value as it is if not really need to be resolved
    // if(!('reference' in locator.typeSet)){
    //   return locator.typeSet;
    // }

    
    const refArr = locator.typeSet[1].split('/').slice(1);
    let cur = applicationScopeList;
    if(cur.hasOwnProperty("type")){
      cur = cur.type;
    }  
    for (let i = 0; i < refArr.length; i++) {
        if(cur.hasOwnProperty("type")){
          cur = cur.type;
        }  
      //we need to do this as we are not dealing with json schema itself , we are dealing with application scope object
        if(refArr[i] === 'properties' || refArr[i] === 'additionalProperties'){
          cur = cur.objectProperties;
        }
        if(refArr[i] === 'items' || refArr[i] === 'additionalItems'){
          cur = cur.arrayProperties;
        }

        cur = cur[refArr[i]];
        if (cur.hasOwnProperty("typeSet") && (cur.typeSet.includes("reference"))) {
          resolveApplicationScope(applicationScopeList,cur);
        }
      }
      const resolvedObj = cloneType(cur);
      for (let key in resolvedObj) {
        locator[key] = resolvedObj[key];
      }
      return;
  }
resolveApplicationScope(applicationScopeObject,applicationScopeObject.menu.type.objectProperties.properties.nav_items.arrayProperties.additionalItems.objectProperties.properties.children);
console.log("finished!");