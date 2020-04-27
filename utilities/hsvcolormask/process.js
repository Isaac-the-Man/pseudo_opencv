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
  let hsv = new cv.Mat();
  cv.cvtColor(img, hsv, cv.COLOR_RGB2HSV);
  let result = new cv.Mat();
  // process
  if (params) {
    if (params.enableMask2) {
      let mask1 = new cv.Mat();
      let lower1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [params.h1u, params.s1u, params.v1u, 0]);
      let upper1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [params.h1d, params.s1d, params.v1d, 255]);
      cv.inRange(hsv, lower1, upper1, mask1);
      let mask2 = new cv.Mat();
      let lower2 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [params.h2u, params.s2u, params.v2u, 0]);
      let upper2 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [params.h2d, params.s2d, params.v2d, 255]);
      cv.inRange(hsv, lower2, upper2, mask2);
      let combinedMask = new cv.Mat();
      cv.add(mask1, mask2, combinedMask);
      cv.bitwise_and(img, img, result, combinedMask);
      mask1.delete();
      mask2.delete();
      lower1.delete();
      upper1.delete();
      lower2.delete();
      upper2.delete();
      combinedMask.delete();
    } else {
      let mask1 = new cv.Mat();
      let lower1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [params.h1u, params.s1u, params.v1u, 0]);
      let upper1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [params.h1d, params.s1d, params.v1d, 255]);
      cv.inRange(hsv, lower1, upper1, mask1);
      cv.bitwise_and(img, img, result, mask1);
      mask1.delete();
      lower1.delete();
      upper1.delete();
    }
  } else {
    result = img.clone();
  }
  cv.imshow('outputCanvas', result);
  img.delete();
  hsv.delete();
  result.delete();
}

// HOOK UP LISTENERS
function onEventChange() {
  let params = getParams();
  console.log(params);
  console.log('updated');
  options = {
    h1u: extract(params, 'r-slider-h1')[0],
    h1d: extract(params, 'r-slider-h1')[1],
    s1u: extract(params, 'r-slider-s1')[0],
    s1d: extract(params, 'r-slider-s1')[1],
    v1u: extract(params, 'r-slider-v1')[0],
    v1d: extract(params, 'r-slider-v1')[1],
    h2u: extract(params, 'r-slider-h2')[0],
    h2d: extract(params, 'r-slider-h2')[1],
    s2u: extract(params, 'r-slider-s2')[0],
    s2d: extract(params, 'r-slider-s2')[1],
    v2u: extract(params, 'r-slider-v2')[0],
    v2d: extract(params, 'r-slider-v2')[1],
    enableMask2: extract(params, 'toggle'),
  };
  if (options.enableMask2) {
    document.getElementById('enabled').classList.remove('invisible');
  } else {
    document.getElementById('enabled').classList.add('invisible');
  }
  process(options);
  appendCode('codePython',
    options.enableMask2 ?
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)

    # create mask
    mask1 = cv2.inRange(hsv, (${options.h1u},${options.s1u},${options.v1u}), (${options.h1d},${options.s1d},${options.v1d}))
    mask2 = cv2.inRange(hsv, (${options.h2u},${options.s2u},${options.v2u}), (${options.h2d},${options.s2d},${options.v2d}))

    # apply mask
    mask_combined = mask1 + mask2
    cv2.bitwise_and(src, src, mask_combined)

    cv2.imshow('output', src)
    cv2.destroyAllWindows()
    `
    :
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');
    hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)

    # create mask
    mask1 = cv2.inRange(hsv, (${options.h1u},${options.s1u},${options.v1u}), (${options.h1d},${options.s1d},${options.v1d}))

    # apply mask
    cv2.bitwise_and(src, src, mask1)

    cv2.imshow('output', src)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    `
  )
}
