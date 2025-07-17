const assert = require('assert');
const { Linter } = require('../src/index');
const { printResult } = require('./print');

const linter = new Linter({});


describe("for items filter check : ", function () {

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `       

			{% for key, value in content|items %} 				  

					<li><a href="{{value.link}}">{{ value.icon }}</a></li>		 			


			{% endfor %} 
                  
                `
            }            
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length == 0);
    });

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    {% for key, value in content|items %}
                    <li class="list">
                      <div class="style">
                        <span class="icon {{(value.activeBig)}}"><i class="fa {{(value.icon)}}"></i></span>
                        <div class="data">
                          <h6>{{(value.title)}}</h6>
                          <p>{{(value.data|safe)}}</p>
                        </div>
                      </div>
                    </li>
                    {% endfor %}
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });


    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    <ul class="blogList">

   {% for key, value in content|items %}
      <li class="list anim1">
        <div class="style">
          <div class="thumb">
            <div class="postDate">
              <b>{{(value.post)}}</b>
              <span class="name">By {{(value.post_by)}}</span>            
          <div class="contentStyle">
            <div class="textPart">
              <h5>{{(value.name)}}</h5>
              <p>{{(value.content)}}</p>
              <ul class="actionList">
                <li>
                  <span class="icon"><i class="fa fa-user"></i></span>
                  <span class="name">{{(value.category)}}</span>
                </li>
                <li>
                  <span class="icon"><i class="fa fa-comment-o"></i></span>
                  <span class="name">{{(value.comment)}} comments</span>
                </li>
              </ul>
              <a href="#0" class="linkbtn">Read More <i class="next"></i> </a>
            </div>
          </div>
        </div>
      </li>
    {% endfor %}

</ul>
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    it("Should pass: ", function () {
        const theme = {
            preview: {
                index:
                    `
                    <ul class="blogList">

    {% for key, value in content|items %}
    <li class="list anim2">
      <div class="style">        
        <div class="contentStyle">
          <h6>{{(value.name)}}</h6>
          <ul class="actionList">
            <li>
              <span class="icon"><i class="fa fa-user"></i></span>
              <span class="name">{{(value.post_by)}}</span>
            </li>
            <li>
              <span class="icon"><i class="fa fa-comment-o"></i></span>
              <span class="name">{{(value.comment)}} comments</span>
            </li>
          </ul>
          <p>{{(value.content)}}</p>
          <div class="dateBar">
            <span class="icon"><i class="fa fa-calendar"></i></span>
            <span class="name">{{(value.post)}}</span>
          </div>
        </div>
      </div>
    </li>
    {% endfor %}

</ul>
                `
            }
        };
        const result = linter.lintTemplate(theme.preview.index, 'theme.preview.index');
        printResult(result);
        assert(result.errors.length === 0);
    });

    
});