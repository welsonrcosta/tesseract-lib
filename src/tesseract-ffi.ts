var ffi = require("ffi-napi");
const ref = require("ref-napi");
const path = require("path");

//Base API
let TessBaseAPI = ref.types.void,
  TessBaseAPIPtr = ref.refType(TessBaseAPI);
//Picture struct
let Pix = ref.types.void,
  PixPtr = ref.refType(Pix);

function getTesseractLib() {
  return path.join("./lib/", "libtesseract.5.3.1.dylib");
}

// TessBaseAPI* TessBaseAPICreate();
// int TessBaseAPIInit3(TessBaseAPI* handle, const char* datapath, const char* language);
// void TessBaseAPIClear(TessBaseAPI *handle);
// char *TessBaseAPIGetUTF8Text(TessBaseAPI *handle);
// const char *TessVersion();
// void TessBaseAPISetImage2(TessBaseAPI *handle, struct Pix *pix);

//Leptonica
//PIX * pixRead (const char *filename)
const libt = ffi.Library(getTesseractLib(), {
  TessBaseAPICreate: [TessBaseAPIPtr, []],
  TessBaseAPIInit3: ["int", [TessBaseAPIPtr, "string", "string"]],
  TessBaseAPIEnd: ["void", [TessBaseAPIPtr]],
  TessBaseAPIDelete: ["void", [TessBaseAPIPtr]],
  TessBaseAPIClear: ["void", [TessBaseAPIPtr]],
  TessBaseAPIGetUTF8Text: ["string", [TessBaseAPIPtr]],
  TessVersion: ["string", []],
  TessBaseAPISetImage2: ["void", [TessBaseAPIPtr, PixPtr]],

  pixRead: [PixPtr, ["string"]],
});

export default class tesseract {
  tess = null

  constructor(tessdata: string, lang: string) {
    this.tess = libt.TessBaseAPICreate();
    var res = libt.TessBaseAPIInit3(this.tess, tessdata, lang);
    if (res != 0) {
      libt.TessBaseAPIDelete(this.tess);
      throw Error("Could not initialize libtesseract");
    }
  }

  detect(image: string) : string{
    let pix = libt.pixRead(image);
    libt.TessBaseAPISetImage2(this.tess, pix);
    return libt.TessBaseAPIGetUTF8Text(this.tess);
  }

  close() {
    if (this.tess != null) {
      libt.TessBaseAPIEnd(this.tess);
      libt.TessBaseAPIClear(this.tess);
      libt.TessBaseAPIDelete(this.tess);
    }
  }
}
