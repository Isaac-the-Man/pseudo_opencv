// tabs
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


// store all gui components' data
const registered = {
  toggle: [],
  radio: [],
  single_slider: [],
  range_slider: []
};

// RENDER TEMPLATES
// render toggle buttons
function initToggle(id, args) {
  const gui_toggle_template =
  `<label class="gui-component switch">
    <input type="checkbox" onclick="onEventChange();" ${(()=>{if(args && args.default) return 'checked'})()}><span class="toggle round"></span>
  </label>`;
  document.getElementById(id).innerHTML = gui_toggle_template;
  registered['toggle'].push(id);
}
// render radio group
function initRadioGroup(id, groupName, optionsArr, args) {
  let first = true;
  let options_template = '';
  for (var i = 0; i < optionsArr.length; i++) {
    let gui_radio_template =
    `<label class="radio-container">${optionsArr[i][0]}
      <input type="radio" name="${groupName}" onclick="onEventChange();" ${(()=>{if(first) {first=false;return 'checked';}})()} value="${optionsArr[i][1]}">
      <span class="checkmark"></span>
    </label>`;
    options_template += gui_radio_template;
  }
  let gui_radios_template =
  `<div class="gui-component radio-group">${options_template}</div>`;
  document.getElementById(id).innerHTML = gui_radios_template;
  registered['radio'].push(id);
}
// render single slider
var single_slider_count = 0;
function initSingleSlider(id, min, max, args) {
  let gui_single_slider_template =
  `<div class="gui-component gui-slider-component gui-slider-single">
    <div class="gui-slider single-slider-${single_slider_count}"></div>
  </div>`;
  document.getElementById(id).innerHTML = gui_single_slider_template;
  $(`.single-slider-${single_slider_count}`).slider({
    min: min,
    max: max,
    value: (()=>{if(args&&args.default){return args.default;}return 0;})(),
    step: (()=>{if(args&&args.step){return args.step;}return 1;})()
  })
  .slider("float")
  .slider("pips", {
    rest: false
  })
  .on("slidechange", function(e,ui) {
    onEventChange();
  });
  single_slider_count++;
  registered['single_slider'].push(id);
}
// render range slider
var range_slider_count = 1;
function initRangeSlider(id, min, max, args) {
  let gui_range_slider_template =
  `<div class="gui-component gui-slider-component gui-slider-scale">
    <div class="scale-slider gui-slider range-slider-${range_slider_count}"></div>
  </div>`;
  document.getElementById(id).innerHTML = gui_range_slider_template;
  $(`.range-slider-${range_slider_count}`).slider({
    min: min,
    max: max,
    values: (()=>{if(args&&args.default){return args.default;}return [min,max];})(),
    range: true
  })
  .slider("float")
  .slider("pips", {
    rest: false
  })
  .on("slidechange", function(e,ui) {
    onEventChange();
  });
  range_slider_count++;
  registered['range_slider'].push(id);
}

// EVENT LISTENER HOOK UP
// read all values
function getParams() {
  let result = [];
  // read toggle values
  if (registered['toggle'].length > 0) {
    for (var i = 0; i < registered['toggle'].length; i++) {
      let val = document.querySelector(`#${registered['toggle'][i]} input`).checked;
      result.push([registered['toggle'][i], val]);
    }
  }
  // read radio values
  if (registered['radio'].length > 0) {
    for (var i = 0; i < registered['radio'].length; i++) {
      let radios = document.querySelectorAll(`#${registered['radio'][i]} input`);
      let val = 0;
      for (var j = 0; j < radios.length; j++) {
        if (radios[j].checked) {
          val = radios[j].value;
          break;
        }
      }
      result.push([registered['radio'][i], val]);
    }
  }
  // read single slider values
  if (registered['single_slider'].length > 0) {
    for (var i = 0; i < registered['single_slider'].length; i++) {
      let val = $(`#${registered['single_slider'][i]} .gui-slider`).slider('values', 0);
      result.push([registered['single_slider'][i], val]);
    }
  }
  // read range slider values
  if (registered['range_slider'].length > 0) {
    for (var i = 0; i < registered['range_slider'].length; i++) {
      let min = $(`#${registered['range_slider'][i]} .gui-slider`).slider('values', 0);
      let max = $(`#${registered['range_slider'][i]} .gui-slider`).slider('values', 1);
      result.push([registered['range_slider'][i], [min, max]]);
    }
  }
  return result;
}

// extract specific element's value
function extract(result, key) {
  for (var i = 0; i < result.length; i++) {
    if (result[i][0] === key) {
      return result[i][1]
    }
  }
  throw new Error("NullValue");
}

// create code block
function appendCode(id, txt) {
  console.log('appended');
  let block = document.getElementById(id);
  block.innerHTML = '';
  let code_element = document.createElement('code');
  code_element.innerHTML = txt;
  let pre_element = document.createElement('pre');
  pre_element.appendChild(code_element);
  block.appendChild(pre_element);
  preCode("pre code, textarea");
  Prism.highlightAll();
}
