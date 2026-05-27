// ดึงค่าจาก Script Properties ทั้งหมด
const scriptProperties = PropertiesService.getScriptProperties();

const CHANNEL_ACCESS_TOKEN = scriptProperties.getProperty('CHANNEL_ACCESS_TOKEN');
const ADMIN_USER_ID = scriptProperties.getProperty('ADMIN_USER_ID');
const SPREADSHEET_ID = scriptProperties.getProperty('SPREADSHEET_ID');
const SHEET_NAME = scriptProperties.getProperty('SHEET_NAME'); // ดึงชื่อชีตจากระบบ

/**
 * ฟังก์ชันหลักสำหรับตรวจสอบและส่งการแจ้งเตือน
 */
function sendLineReminders() {
  // ตรวจสอบว่าตั้งค่า Properties ครบหรือยัง
  if (!CHANNEL_ACCESS_TOKEN || !SPREADSHEET_ID || !SHEET_NAME) {
    Logger.log("Error: กรุณาตั้งค่า Script Properties ให้ครบ (TOKEN, ID, SHEET_NAME)");
    return;
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log("Error: ไม่พบชีตชื่อ " + SHEET_NAME);
      return;
    }

    const data = sheet.getDataRange().getValues();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const name = row[2];      // คอลัมน์ C
      const dateVal = row[17];  // คอลัมน์ R
      const timeStr = row[18];  // คอลัมน์ S

      if (!dateVal || !name) continue;

      let appointmentDate = new Date(dateVal);
      if (isNaN(appointmentDate.getTime())) continue;

      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate.getTime() === today.getTime()) {
        pushLineFlexMessage(ADMIN_USER_ID, name, formatDate(appointmentDate), timeStr);
      }
    }
    Logger.log("ดำเนินการตรวจสอบนัดหมายเสร็จสิ้น");
  } catch (err) {
    Logger.log("เกิดข้อผิดพลาด: " + err.message);
  }
}

// --- ฟังก์ชัน pushLineFlexMessage และ formatDate ใช้โค้ดเดิมได้เลย ---