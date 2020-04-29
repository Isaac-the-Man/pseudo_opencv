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
  cv.threshold(img, result, 0, 255, eval(`cv.${params.type} + cv.THRESH_OTSU`));
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
    type: extract(params, 'radio'),
  };
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(gray, 0, 255,cv2.${options.type} + cv2.THRESH_OTSU)
    cv2.imshow('output', thresh)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    `
  )
}
