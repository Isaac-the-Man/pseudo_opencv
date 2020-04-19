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
  if (params) {
    cv.threshold(img, result, params.thresh, params.maxval, eval(`cv.${params.type}`));
  } else {
    cv.threshold(img, result, 0, 255, cv.THRESH_BINARY);
  }
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
    thresh: extract(params, 'r-slider')[0],
    maxval: extract(params, 'r-slider')[1],
    type: extract(params, 'radio'),
  };
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(gray, ${options.thresh}, ${options.maxval},cv2.${options.type})
    cv2.imshow('output', thresh)
    cv2.destroyAllWindows()
    `
  )
}
