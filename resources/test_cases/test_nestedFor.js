const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});


describe("nested for type updation check : ", function () {

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    

			{% for key, value in content|items %} 

	
				  {% for social, entry in value.social|items %}

					<li><a href="{{entry.link}}">{{ entry.icon }}</a></li>	

				  {% endfor %}					


			{% endfor %} 


                  
                `
            }            
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length == 0);
    });
});