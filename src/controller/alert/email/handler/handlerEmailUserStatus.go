package handlerEmailAlert

import (
	"fmt"
	"time"
)

func CreateNewRegisterEmailHTML(fullName string) string {
	loc, _ := time.LoadLocation("Asia/Bangkok")
	t := time.Now().In(loc).Format("02/01/2006 15:04:05")
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#FF6B00,#e65c00);padding:30px;text-align:center;">
      <h1 style="margin:0;color:white;font-size:22px;">🔔 มีผู้สมัครเข้าใช้งานระบบใหม่</h1>
    </div>
    <div style="padding:40px 30px;">
      <p style="color:#333;font-size:16px;">มีผู้สมัครเข้าใช้งานระบบ ชื่อ <strong>%s</strong></p>
      <p style="color:#666;font-size:14px;">กรุณาตรวจสอบและอนุมัติการเข้าใช้งาน</p>
      <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:4px;">
        <p style="margin:0;color:#856404;font-size:13px;">🕐 เวลาสมัคร: <strong>%s</strong></p>
      </div>
    </div>
    <div style="background:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #e9ecef;">
      <p style="margin:0;color:#6c757d;font-size:12px;">© 2025 ระบบตรวจสอบรถพยาบาล | ระบบอัตโนมัติ</p>
    </div>
  </div>
</body>
</html>`, fullName, t)
}

func CreateApproveEmailHTML(fullName string) string {
	loc, _ := time.LoadLocation("Asia/Bangkok")
	t := time.Now().In(loc).Format("02/01/2006 15:04:05")
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#28a745,#1e7e34);padding:30px;text-align:center;">
      <h1 style="margin:0;color:white;font-size:22px;">✅ บัญชีได้รับการอนุมัติ</h1>
    </div>
    <div style="padding:40px 30px;">
      <p style="color:#333;font-size:16px;">สวัสดีคุณ <strong>%s</strong></p>
      <p style="color:#666;font-size:14px;line-height:1.6;">บัญชีของคุณได้รับการอนุมัติเรียบร้อยแล้ว<br>สามารถเข้าใช้งานระบบตรวจสอบรถพยาบาลได้ทันที</p>
      <div style="background:#d4edda;border-left:4px solid #28a745;padding:15px;margin:20px 0;border-radius:4px;">
        <p style="margin:0;color:#155724;font-size:13px;">🕐 อนุมัติเมื่อ: <strong>%s</strong></p>
      </div>
    </div>
    <div style="background:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #e9ecef;">
      <p style="margin:0;color:#6c757d;font-size:12px;">© 2025 ระบบตรวจสอบรถพยาบาล | ระบบอัตโนมัติ</p>
    </div>
  </div>
</body>
</html>`, fullName, t)
}

func CreateSuspendEmailHTML(fullName string) string {
	loc, _ := time.LoadLocation("Asia/Bangkok")
	t := time.Now().In(loc).Format("02/01/2006 15:04:05")
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#dc3545,#c82333);padding:30px;text-align:center;">
      <h1 style="margin:0;color:white;font-size:22px;">⛔ บัญชีถูกระงับการใช้งาน</h1>
    </div>
    <div style="padding:40px 30px;">
      <p style="color:#333;font-size:16px;">สวัสดีคุณ <strong>%s</strong></p>
      <p style="color:#666;font-size:14px;line-height:1.6;">บัญชีของคุณถูกระงับการใช้งาน<br>กรุณาติดต่อผู้ดูแลระบบ</p>
      <div style="background:#f8d7da;border-left:4px solid #dc3545;padding:15px;margin:20px 0;border-radius:4px;">
        <p style="margin:0;color:#721c24;font-size:13px;">🕐 ระงับเมื่อ: <strong>%s</strong></p>
      </div>
    </div>
    <div style="background:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #e9ecef;">
      <p style="margin:0;color:#6c757d;font-size:12px;">© 2025 ระบบตรวจสอบรถพยาบาล | ระบบอัตโนมัติ</p>
    </div>
  </div>
</body>
</html>`, fullName, t)
}
