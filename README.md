# Healthcare Registration App
แอปพลิเคชันระบบลงทะเบียนบริการทางการแพทย์ ทำงานร่วมกับ Line Messaging API เพื่อแจ้งเตือน และบันทึกข้อมูลลง Google Sheets ผ่าน Google Apps Script

>For hospital use only.

---

## Tech Stack
- **Frontend/Backend:** Next.js
- **Styling:** Tailwind CSS
- **Database:** Google Sheets + Google Apps Script (GAS)
- **Notification:** Line Messaging API

## How to Run
```bash
npm install
npm run dev
```

## Environment Variables
สร้างไฟล์ `.env.local` ที่ Root folder แล้วกำหนดค่าดังนี้:
```env
NEXT_PUBLIC_GAS_URL=your_google_apps_script_web_app_url
LINE_CHANNEL_ACCESS_TOKEN=your_line_token
LINE_CHANNEL_SECRET=your_line_secret
```

## Additional Information
- Evidence of Use: https://www.kppmu.go.th/news-detail?hd=1&id=124000
- LINE Official Account: https://sites.google.com/view/hospital-line-gateway
