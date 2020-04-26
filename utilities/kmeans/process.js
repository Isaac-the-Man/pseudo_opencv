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
  // process
  let sample= new cv.Mat(img.rows * img.cols, 3, cv.CV_32F);
  for( var y = 0; y < img.rows; y++ )
      for( var x = 0; x < img.cols; x++ )
        for( var z = 0; z < 3; z++)
          sample.floatPtr(y + x*img.rows)[z] = img.ucharPtr(y,x)[z];
  let centers = new cv.Mat();
  var labels= new cv.Mat();
  cv.kmeans(sample, params.k, labels, new cv.TermCriteria(eval(params.type), 10, 1.0), params.attempts, eval(`cv.${params.initial}`), centers);
  var newImage= new cv.Mat(img.size(),img.type());
  for( var y = 0; y < img.rows; y++ ){
    for( var x = 0; x < img.cols; x++ ){
      var cluster_idx = labels.intAt(y + x*img.rows,0);
      var redChan = new Uint8Array(1);
      var greenChan = new Uint8Array(1);
      var blueChan = new Uint8Array(1);
      var alphaChan = new Uint8Array(1);
        redChan[0]=centers.floatAt(cluster_idx, 0);
      greenChan[0]=centers.floatAt(cluster_idx, 1);
       blueChan[0]=centers.floatAt(cluster_idx, 2);
      alphaChan[0]=255;
      newImage.ucharPtr(y,x)[0] =  redChan;
      newImage.ucharPtr(y,x)[1] =  greenChan;
      newImage.ucharPtr(y,x)[2] =  blueChan;
      newImage.ucharPtr(y,x)[3] =  alphaChan;
    }
  }
  cv.imshow('outputCanvas', newImage);
  img.delete();
  newImage.delete();
}

// functions
function modifyForPython(txt){
  switch (txt) {
    case 'cv.TermCriteria_MAX_ITER + cv.TermCriteria_EPS':
      return 'cv2.TERM_CRITERIA_MAX_ITER + cv2.TERM_CRITERIA_EPS'
      break;
    case 'cv.TermCriteria_MAX_ITER':
      return 'cv2.TERM_CRITERIA_MAX_ITER'
      break;
    case 'cv.TermCriteria_EPS':
      return 'cv2.TERM_CRITERIA_EPS'
      break;
  }
}

// HOOK UP LISTENERS
function onEventChange() {
  let params = getParams();
  console.log(params);
  console.log('updated');
  options = {
    k: extract(params, 's-slider1'),
    type: extract(params, 'radio-type'),
    maxCount: extract(params, 's-slider3'),
    epsilon: extract(params, 's-slider4'),
    attempts: extract(params, 's-slider5'),
    initial: extract(params, 'radio-init')
  };
  console.log(eval(`cv.${options.initial}`));
  process(options);
  appendCode('codePython',
    `
    import cv2
    import numpy as np

    src = cv2.imread('image.jpg');

    # flatten image
    flattened = src.reshape((-1, 3))

    # convert to float 32
    flattened = np.float32(flattened)

    # k means clustering
    ret, label, center = cv2.kmeans(flattened, ${options.k}
      , (${modifyForPython(options.type)}, ${options.maxCount}, ${options.epsilon})
      , ${options.attempts}, cv.${options.initial})

    # convert back to unint8 and assemble image
    center = np.uint8(center)
    res = center[label.flatten()]
    res2 = res.reshape((src.shape))

    cv2.imshow('output', res2)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    `
  )
}
