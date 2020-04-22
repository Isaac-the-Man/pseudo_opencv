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
  cv.cvtColor(img, img, cv.COLOR_RGBA2RGB);
  let result = new cv.Mat();
  // process
  cv.bilateralFilter(img, result, params.d, params.sigmaColor, params.sigmaSpace,  eval(`cv.${params.border}`));
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
    d: extract(params, 's-slider1'),
    sigmaColor: extract(params, 's-slider2'),
    sigmaSpace: extract(params, 's-slider3'),
    border: extract(params, 'radio')
  };
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    blur = cv2.bilateralFilter(src, ${options.d}, ${options.sigmaColor}, ${options.sigmaSpace}, cv2.${options.border})
    cv2.imshow('output', blur)
    cv2.destroyAllWindows()
    `
  )
}
