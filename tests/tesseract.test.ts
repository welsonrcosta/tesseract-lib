import * as path from "path";
import tesseract, { DetectionArea } from "../src/tesseract-ffi";

const enum PMS {
  Quincy,
  XConcept,
}

describe("should Detect patient numbers", () => {
  let tess: tesseract;

  beforeAll(() => {
    const lang_data = path.join(".", "lang_data");
    tess = new tesseract(lang_data, "deub");
  });

  beforeEach(() => {
    tess.clear();
  });

  afterAll(() => {
    tess.close();
  });

  it.each([
    ["quincy_small_118372", PMS.Quincy],
    ["quincy_small_12889", PMS.Quincy],
    ["quincy_small_25072", PMS.Quincy],
    ["quincy_small_red_131665", PMS.Quincy],
    ["quincy_big_609239", PMS.Quincy],
    ["quincy_high_id_1027330", PMS.Quincy],
    ["quincy_big_alt_background_color_1249558", PMS.Quincy],
    ["quincy_bigger_11390", PMS.Quincy],
    ["quincy_bigger_172877", PMS.Quincy],
    ["quincy_bigger_4566", PMS.Quincy],
    ["quincy_bigger_91072", PMS.Quincy],
    ["12345-cleartype", PMS.XConcept],
    ["12345-no-cleartype", PMS.XConcept],
    ["67890-cleartype", PMS.XConcept],
    ["67890-no-cleartype", PMS.XConcept],
    ["13579-font4", PMS.XConcept],
    ["20468-font4", PMS.XConcept],
    ["13579-font5", PMS.XConcept],
    ["42680-font5", PMS.XConcept],
    ["12345-font6", PMS.XConcept],
    ["23112-font6", PMS.XConcept],
    ["6009-font6", PMS.XConcept],
    ["6078-font6", PMS.XConcept],
  ])("reads from %s", (screenshotName, pmsSelector) => {
    const expectedPatientId = Number(/(\d+)/.exec(screenshotName)![1]);
    const folder = pmsSelector === PMS.Quincy ? "quincy" : "x-concept";
    const screenshot = path.join(
      "tests",
      "assets",
      folder,
      `${screenshotName}.png`
    );
    let patientId;

    const detect = tess.detect(screenshot);
    if (pmsSelector == PMS.XConcept) {
      patientId = Number(detect?.trim().match(/Nr.*\s(\d+)/)?.[1]);
    } else {
      // if(screenshotName =='quincy_small_118372' ){
      //   console.log(detect)
      // }
      patientId = Number(detect?.match(/mmer[:._\s]*(\d+)/)?.[1]);
    }

    expect(patientId).toBe(expectedPatientId);
  });

  describe(`Should detect using "precise detection area"`, () => {
    it.each([
      ["quincy_small_118372", PMS.Quincy, new DetectionArea(735, 88, 50, 15)],
      // ['quincy_small_12889', PMS.Quincy, null],
      ["quincy_small_25072", PMS.Quincy, new DetectionArea(733, 80, 50, 15)],
      ["quincy_small_red_131665",PMS.Quincy, new DetectionArea(730, 88, 50, 15)],
      ['quincy_big_609239', PMS.Quincy, new DetectionArea(916, 112, 50, 15)],
      // ['quincy_high_id_1027330', PMS.Quincy, null],
      // ['quincy_big_alt_background_color_1249558', PMS.Quincy, null],
      // ['quincy_bigger_11390', PMS.Quincy, null],
      // ['quincy_bigger_172877', PMS.Quincy, null],
      // ['quincy_bigger_4566', PMS.Quincy, null],
      // ['quincy_bigger_91072', PMS.Quincy, null],
      // ['12345-cleartype', PMS.XConcept, null],
      // ['12345-no-cleartype', PMS.XConcept, null],
      // ['67890-cleartype', PMS.XConcept, null],
      // ['67890-no-cleartype', PMS.XConcept, null],
      // ['13579-font4', PMS.XConcept, null],
      // ['20468-font4', PMS.XConcept, null],
      // ['13579-font5', PMS.XConcept, null],
      // ['42680-font5', PMS.XConcept, null],
      // ['12345-font6', PMS.XConcept, null],
      // ['23112-font6', PMS.XConcept, null],
      // ['6009-font6', PMS.XConcept, null],
      // ['6078-font6', PMS.XConcept, null],
    ])(`reads from %s`, (screenshotName, pmsSelector, detectionArea) => {
      const expectedPatientId = Number(/(\d+)/.exec(screenshotName)![1]);
      const folder = pmsSelector === PMS.Quincy ? "quincy" : "x-concept";
      const screenshot = path.join(
        "tests",
        "assets",
        folder,
        `${screenshotName}.png`
      );

      if (!detectionArea) return;

      const detect = tess.detect(screenshot, detectionArea);
      const patientId = Number(detect?.trim());

      expect(patientId).toBe(expectedPatientId);
    });
  });
});
