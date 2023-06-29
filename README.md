# Warehouse Mockup Server

Created by nodejs(express)

## วิธีใช้งาน Server แบบ Localhost

i. install npm, nodejs, nodemon
ii. สร้างโฟล์เดอร์ ด้วยคำสั่ง (Mac, Linux) $ mkdir warehouse => $ cd warehouse
iii. ติดตั้ง node_modules ดังนี้ $ npm i express cors fs
iv. คัดลอก ไฟล์ /json, /services และ index.js
v. รันแบบ localhost ด้วย & nodemon

### ตัวหลังบ้านนี้ใช้งานได้จริง ✅️
- หลังบ้านจะรับ request จากหน้าบ้าน
- ข้อมูลจะถูกบันทึกเป็น .json ด้วยเครื่องมือ `fs.writeFile` ของ Nodejs
