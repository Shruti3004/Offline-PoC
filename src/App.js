import React, { useEffect, useRef } from 'react';
import support from 'enketo-core/src/js/support';
import { Form } from 'enketo-core';
import { transform } from "enketo-transformer/web";

function App() {
  async function renderForm() {
    const getURLParameter = (name) => {
      return decodeURI(
        (new RegExp(name + '=' + '(.+?)(&|$)').exec(window.location.search) || [null, null])[1]
      );
    }
    var form;
    var formStr;
    var modelStr;
    var xformURL = "http://64.227.170.159:3007/form/instance/11f124e2-3949-431a-bf0a-fd76adbac73e";

    // if querystring touch=true is added, override detected touchscreen presence
    if (getURLParameter('touch') === 'true') {
      support.touch = true;
      document.querySelector('html').classList.add('touch');
    }

    // const xform = fs.readFileSync(xformURL);
    // const result = await transform({
    //   xform: xform,
    // });
    // console.log({ result });


    if (xformURL && xformURL !== 'null') {
      // document.querySelector('.guidance').remove();
      xformURL = /^https?:\/\//.test(xformURL) ? xformURL : window.location.origin + '/' + xformURL;
      var transformerUrl = 'http://' + window.location.hostname + ':8085/transform?xform=' + xformURL;
      fetch(transformerUrl)
        .then(response => response.json())
        .then(survey => {
          formStr = survey.form;          
          modelStr = survey.model;          
          const range = document.createRange();          
          const formEl = range.createContextualFragment(formStr).querySelector('form');          
          document.querySelector('.form-header').after(formEl);
          initializeForm();
        })
        .catch(() => {
          window.alert('Error fetching form from enketo-transformer at:\n\n' + transformerUrl + '.\n\nPlease check that enketo-transformer has been started.');
        });
    } else if (document.querySelector('form.or')) {
      document.querySelector('.guidance').remove();
      modelStr = window.globalModelStr;
      initializeForm();
    }

    // initialize the form
    function initializeForm() {
      console.log('Initial')
      const formEl = document.querySelector('form.or');
      form = new Form(formEl, {
        modelStr: modelStr
      }, {
        'printRelevantOnly': false
      });
      // for debugging
      window.form = form;
      //initialize form and check for load errors
      const loadErrors = form.init();
      if (loadErrors.length > 0) {
        window.alert('loadErrors: ' + loadErrors.join(', '));
      }
    }



    // get query string parameter

  }

  useEffect(() => {
    renderForm();
  }, [])

  return (
    <div className="App" style={{ height: "90vh", width: "65vw" }}>
      <div className='form-header' >

      </div>
    </div>
  );
}

export default App;
