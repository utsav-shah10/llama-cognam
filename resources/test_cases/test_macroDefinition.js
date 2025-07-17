const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});


describe("macro definition scope : ", function () {
    //macro cannot be defined inside sub-scopes 
    it("Should fail: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% if menu.nav_items %}
                    <nav id="{{menu.id}}" class="nav foot-nav">
                      {% macro navigation_links(items, menu_level) %}
                  
                        {% if items %}
                          {% if menu_level == 0 %}
                            <ul class="footer-nav {{ items.class }}">
                          {% endif %}
                            {% for item in items %}
                            {% if menu_level == 0 %}
                              <li id="{{- item.id -}}" class="nav-footer-item menu-item {{item.custom_class}} {{item.class}}{% if item.selected %}menu-item--active-trail active{% endif %}">
                            {% endif %}
                          <a href="{% include item.href|template %}" {% if item.description %} title="{{ item.description }} {% endif %}">
                                    {%- if item.icon %}<i class="fa {{ item.icon }}"></i>{%- endif %}
                                  {{- item.label -}}
                                  </a>
                              </li>
                            {% endfor %}
                          </ul>
                          {% endif %}
                      {% endmacro %}
                  
                    {{ navigation_links(menu.nav_items, 0) }}
                    </nav>
                  
                  {% endif %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length > 0);
    });
});