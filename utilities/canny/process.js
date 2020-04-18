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
  let result = new cv.Mat();
  // process
  if (params) {
    cv.Canny(img, result, params.threshold1, params.threshold2, params.apertureSize, params.L2gradient);
  } else {
    cv.Canny(img, result, 50, 100, 3, false);
  }
  cv.imshow('outputCanvas', result);
  img.delete();
  result.delete();
}

// HOOK UP LISTENERS
function onEventChange() {
  let params = getParams();
  console.log('updated');
  options = {
    threshold1: extract(params, 's-slider1'),
    threshold2: extract(params, 's-slider2'),
    apertureSize: extract(params, 's-slider3'),
    L2gradient: extract(params, 'toggle1')
  };
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    edges = cv2.Canny(src, ${options.threshold1}, ${options.threshold2}, apertureSize=${options.apertureSize}, L2gradient=${options.L2gradient})
    cv2.imshow('output', edges)
    cv2.destroyAllWindows()
    `
  )
}
