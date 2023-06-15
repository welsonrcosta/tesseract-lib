const ffi = require('ffi-napi')
const ref = require('ref-napi')

let TessBaseAPI = ref.types.void,
  TessBaseAPIPtr = ref.refType(TessBaseAPI);
//Picture struct
let Pix = ref.types.void,
  PixPtr = ref.refType(Pix);

const libt = ffi.Library(".\\tesseract53.dll", {  
  TessBaseAPICreate: [TessBaseAPIPtr, []],
  TessBaseAPIInit3: ["int", [TessBaseAPIPtr, "string", "string"]],
  TessBaseAPIEnd: ["void", [TessBaseAPIPtr]],
  TessBaseAPIDelete: ["void", [TessBaseAPIPtr]],
  TessBaseAPIClear: ["void", [TessBaseAPIPtr]],
  TessBaseAPIGetUTF8Text: ["string", [TessBaseAPIPtr]],
  TessVersion: ["string", []],
  TessBaseAPISetImage2: ["void", [TessBaseAPIPtr, PixPtr]],
  });

  console.log(libt)