var imgElement = document.getElementById('inputImg');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function() {
  onEventChange();
};

function onOpenCVReady() {
  cv['onRuntimeInitialized'] = function() {
    console.log('OpenCV Loaded.');
    onEventChange();
  };
}

function process(params) {
  console.log(params);
  let img = cv.imread(imgElement);
  cv.cvtColor(img, img, cv.COLOR_RGB2GRAY);
  let result = new cv.Mat();
  // process
  cv.adaptiveThreshold(img, result, params.maxval, eval(`cv.${params.adaptive}`), eval(`cv.${params.type}`), params.block, params.constant);
  cv.imshow('outputCanvas', result);
  img.delete();
  result.delete();
}

// HOOK UP LISTENERS
function onEventChange() {
  let params = getParams();
  console.log(params);
  console.log('updated');
  options = {
    maxval: extract(params, 's-slider1'),
    adaptive: extract(params, 'radio1'),
    type: extract(params, 'radio2'),
    block: extract(params, 's-slider2'),
    constant: extract(params, 's-slider3')
  };
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, ${options.maxval}, cv2.${options.adaptive},cv2.${options.type}, ${options.block}, ${options.constant})
    cv2.imshow('output', thresh)
    cv2.destroyAllWindows()
    `
  )
}
