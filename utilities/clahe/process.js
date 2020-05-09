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
  let clahe = new cv.CLAHE(params.clipLimit, new cv.Size(params.theGridSize, params.theGridSize));
  clahe.apply(img, result);
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
    clipLimit: extract(params, 's-slider1'),
    theGridSize: extract(params, 's-slider2')
  };
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    clahe = cv.createCLAHE(${options.clipLimit}, (${options.theGridSize}, ${options.theGridSize}))
    normalized = clahe.apply(gray)
    cv2.imshow('output', normalized)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    `
  )
}
