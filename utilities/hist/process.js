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
  cv.equalizeHist(img, result);
  cv.imshow('outputCanvas', result);
  img.delete();
  result.delete();
}

// HOOK UP LISTENERS
function onEventChange() {
  process();
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');

    # convert to gray scale
    gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)

    # normalize the image
    hist = cv2.equalizeHist(gray)

    cv2.imshow('output', hist)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    `
  )
}
