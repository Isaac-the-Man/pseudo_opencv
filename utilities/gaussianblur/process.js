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
    cv.GaussianBlur(img, result, new cv.Size(params.ksizex, params.ksizey), params.sigmax, params.sigmay,  eval(`cv.${params.border}`));
  } else {
    cv.GaussianBlur(img, result, new cv.Size(3,3), 0);
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
    ksizex: extract(params, 's-slider1'),
    ksizey: extract(params, 's-slider2'),
    sigmax: extract(params, 's-slider3'),
    sigmay: extract(params, 's-slider4'),
    border: extract(params, 'radio')
  };
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    blur = cv2.GaussianBlur(src, (${options.ksizex},${options.ksizey}), ${options.sigmax}, ${options.sigmay}, cv2.${options.border})
    cv2.imshow('output', blur)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    `
  )
}
