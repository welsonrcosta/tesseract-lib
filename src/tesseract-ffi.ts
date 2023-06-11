import {Library} from 'ffi-napi'
import {types, refType, Pointer} from "ref-napi"
import path from "path"
import os from 'os'

//Base API
let TessBaseAPI = types.void,
  TessBaseAPIPtr = refType(TessBaseAPI);
//Picture struct
let Pix = types.void,
  PixPtr = refType(Pix);

function getTesseractLib() {
  const platform = os.platform()
  if (platform == "win32") {
    return path.join(".","lib", "tesseract53");
  } else if (platform == 'darwin') {
    return path.join(".","lib", "libtesseract.5.3.1.dylib");
  }
  throw Error('unsupported platform: ' + platform)
}

function getLeptonicaLib() {
  const platform = os.platform()
  if (platform == "win32") {
    return path.join(".","lib", "leptonica-1.84.0");
  } else if (platform == 'darwin') {
    return path.join(".","lib", "libtesseract.5.3.1.dylib");
  }
  throw Error('unsupported platform: ' + platform)
}

//Leptonica
//PIX * pixRead (const char *filename)
const libl = Library(getLeptonicaLib(), {
  pixRead: [PixPtr, ["string"]],
})

// TessBaseAPI* TessBaseAPICreate();
// int TessBaseAPIInit3(TessBaseAPI* handle, const char* datapath, const char* language);
// void TessBaseAPIClear(TessBaseAPI *handle);
// char *TessBaseAPIGetUTF8Text(TessBaseAPI *handle);
// const char *TessVersion();
// void TessBaseAPISetImage2(TessBaseAPI *handle, struct Pix *pix);
const libt = Library(getTesseractLib(), {
  TessBaseAPICreate: [TessBaseAPIPtr, []],
  TessBaseAPIInit3: ["int", [TessBaseAPIPtr, "string", "string"]],
  TessBaseAPIEnd: ["void", [TessBaseAPIPtr]],
  TessBaseAPIDelete: ["void", [TessBaseAPIPtr]],
  TessBaseAPIClear: ["void", [TessBaseAPIPtr]],
  TessBaseAPIGetUTF8Text: ["string", [TessBaseAPIPtr]],
  TessVersion: ["string", []],
  TessBaseAPISetImage2: ["void", [TessBaseAPIPtr, PixPtr]],
});



export default class tesseract {
  tess: Pointer<void>

  constructor(tessdata: string, lang: string) {
    this.tess = libt.TessBaseAPICreate();
    var res = libt.TessBaseAPIInit3(this.tess, tessdata, lang);
    if (res != 0) {
      libt.TessBaseAPIDelete(this.tess);
      throw Error("Could not initialize libtesseract");
    }
  }

  detect(image: string): string | null {
    let pix = libl.pixRead(image);
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
