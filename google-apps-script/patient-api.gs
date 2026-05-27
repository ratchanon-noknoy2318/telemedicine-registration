// ดึงค่า Config จากระบบ Properties เพื่อปกปิด ID
const scriptProperties = PropertiesService.getScriptProperties();
const SPREADSHEET_ID = scriptProperties.getProperty('SPREADSHEET_ID');
const SHEET_NAME = scriptProperties.getProperty('SHEET_NAME');

/**
 * ฟังก์ชันสำหรับเชื่อมต่อ Spreadsheet (รองรับทั้งแบบผูกติดและแบบใช้ ID)
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  // ถ้าไม่ได้ตั้งค่า ID ไว้ จะพยายามดึงไฟล์ที่สคริปต์นี้สิงอยู่
  return SpreadsheetApp.getActiveSpreadsheet();
}

// ================================================================
// ฟังก์ชันสำหรับจัดการ GET requests (Dashboard)
// ================================================================
function doGet(e) {
  try {
    const spreadsheet = getSpreadsheet();
    return handleGetDashboardData(spreadsheet);
  } catch (err) {
    return createJsonResponse({ success: false, error: "doGet Error: " + err.message });
  }
}

// ================================================================
// ฟังก์ชันสำหรับจัดการ POST requests (Registration / Find)
// ================================================================
function doPost(e) {
  try {
    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) throw new Error("ไม่พบชื่อชีตที่ระบุในระบบ");

    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'register_new';

    // กรณีค้นหาข้อมูลผู้ป่วยเดิม
    if (action === 'find_patient') {
      const patientData = findPatientById(sheet, data.nationalId);
      if (patientData) {
        return createJsonResponse({ success: true, patient: patientData });
      } else {
        return createJsonResponse({ success: false, error: "ไม่พบข้อมูลผู้ป่วย" });
      }
    }

    // กรณีบันทึกข้อมูลใหม่ (ทั้ง Register ใหม่ และ รายเก่ามาซ้ำ)
    else if (action === 'register_new' || action === 'register_existing') {
      const newRow = [
        data.nationalId,
        new Date(), // วันที่ลงทะเบียน
        data.firstName,
        data.lastName,
        data.gender,
        data.dob,
        "'" + data.phone, // ใส่ ' เพื่อป้องกัน Google Sheet ตัดเลข 0 ตัวหน้า
        data.allergies || '',
        data.symptoms,
        data.weight || '',
        data.height || '',
        data.age || '',
        data.desired,
        data.disease || '',
        data.address || '',
        data.certificate || '',
      ];
      sheet.appendRow(newRow);
      return createJsonResponse({ success: true });
    }

    return createJsonResponse({ success: false, error: "Unknown action" });

  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * ฟังก์ชันค้นหาผู้ป่วย (ค้นหาจากล่างขึ้นบนเพื่อให้เจอข้อมูลล่าสุด)
 */
function findPatientById(sheet, nationalId) {
  const data = sheet.getDataRange().getValues();
  const searchId = String(nationalId).trim();

  for (let i = data.length - 1; i >= 1; i--) {
    const sheetNationalId = String(data[i][0]).trim();

    if (sheetNationalId === searchId) {
      const dobValue = data[i][5];
      let formattedDob = '';

      if (dobValue instanceof Date && !isNaN(dobValue)) {
        formattedDob = Utilities.formatDate(dobValue, 'Asia/Bangkok', 'yyyy-MM-dd');
      } else if (typeof dobValue === 'string' && dobValue) {
        formattedDob = dobValue.substring(0, 10);
      }

      return {
        nationalId: data[i][0],
        firstName: data[i][2],
        lastName: data[i][3],
        gender: data[i][4],
        dob: formattedDob,
        phone: data[i][6],
        address: data[i][14],
        allergies: data[i][7],
        disease: data[i][13],
        weight: data[i][9],
        height: data[i][10]
      };
    }
  }
  return null;
}

/**
 * ฟังก์ชันเตรียมข้อมูล Dashboard (จำนวนผู้ป่วยแยกเพศ ฯลฯ)
 */
function handleGetDashboardData(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // ตัวอย่างการสรุปข้อมูลพื้นฐาน
  let stats = {
    total: data.length - 1,
    male: 0,
    female: 0
  };

  for (let i = 1; i < data.length; i++) {
    const gender = String(data[i][4]).trim();
    if (gender === 'ชาย') stats.male++;
    if (gender === 'หญิง') stats.female++;
  }

  return createJsonResponse({ success: true, stats: stats });
}

/**
 * Helper ฟังก์ชันสำหรับสร้าง JSON Output
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}