# SkillMatch — Skill-Based Job & Internship Matching Platform

เว็บแอปจับคู่งานและฝึกงานสำหรับบัณฑิตจบใหม่ด้วยทักษะ (วิชา CSD3202 การพัฒนาเว็บแอปพลิเคชัน — Assignment 7)
พัฒนาด้วย **React 18 + Vite + React Router + Firebase (Realtime Database / Authentication / Hosting)**

## ฟังก์ชันที่พัฒนาเสร็จ

| กลุ่ม | ฟังก์ชัน |
|---|---|
| Public | หน้าแรก, ค้นหา, รายการงาน (กรอง/เรียง/แบ่งหน้า, สลับมุมมองการ์ด/รายการ), **แยกหมวดหมู่ 5 สายงานพร้อมสีและไอคอนของแต่ละหมวด**, หน้าหมวดหมู่, **รายชื่อบริษัทและหน้าโปรไฟล์บริษัท**, รายละเอียดงาน (หน้าที่ที่ต้องทำ, สวัสดิการ, รูปแบบการทำงาน, วันปิดรับ), งานที่เกี่ยวข้อง, โหมดมืด |
| บัณฑิต | สมัคร/เข้าสู่ระบบ, โปรไฟล์ + เลือกทักษะ, **Match %** กับทุกตำแหน่ง, สมัครงาน, ติดตามสถานะ/ยกเลิกใบสมัคร, รายการโปรด |
| บริษัท | โปรไฟล์บริษัท, ประกาศ/แก้ไข/เปิด-ปิด/ลบงาน, ดูผู้สมัคร (พร้อม Match %), เปลี่ยนสถานะ ผ่าน/ไม่ผ่าน |
| แอดมิน | สถิติระบบ, ระงับ/ปลดระงับบัญชี, เปิด-ปิด/ลบประกาศงานทั้งระบบ |
| รูปภาพ | ปกงานและปกบริษัทสร้างอัตโนมัติตามหมวดหมู่ (ไม่ต้องมีไฟล์รูป) และใส่ลิงก์รูปจริงได้ที่ฟิลด์ `image_url` / `logo_url` / `cover_url` — ถ้าลิงก์เสียระบบจะกลับไปใช้ภาพที่สร้างให้เอง |
| ทั่วไป | Loading / Empty / Error state, Toast, Modal ยืนยัน, Protected Route ตามบทบาท, Responsive |

สูตร Match % = (ทักษะที่ผู้ใช้มีและตำแหน่งต้องการ ÷ ทักษะที่ตำแหน่งต้องการทั้งหมด) × 100

## วิธีติดตั้งและใช้งาน

```bash
npm install
cp .env.example .env     # แล้วใส่ค่า Firebase ของคุณ
npm run dev              # http://localhost:5173
npm run build            # สร้าง production build ใน dist/
```

### ตั้งค่า Firebase (ทำครั้งเดียว)
1. [Firebase Console](https://console.firebase.google.com) → Add project
2. **Build → Realtime Database** → Create database → แท็บ **Data** → เมนู ⋮ → **Import JSON** → เลือกไฟล์ `firebase-import.json`
3. แท็บ **Rules** → วางเนื้อหาจาก `database.rules.json` → Publish
4. **Build → Authentication → Sign-in method** → เปิด **Email/Password**
5. **Project settings → Your apps → Web (`</>`)** → คัดลอกค่า config ใส่ใน `.env`

### บัญชีสำหรับทดสอบ
ข้อมูลตัวอย่างใน JSON มีโปรไฟล์อยู่แล้ว แต่ Firebase Auth ต้องมีบัญชีที่ **อีเมลตรงกัน** จึงจะ Login ได้:
Authentication → Users → Add user แล้วสร้างด้วยอีเมลเหล่านี้ (ตั้งรหัสผ่านเอง)

| บทบาท | อีเมล |
|---|---|
| แอดมิน | `admin@platform.example.com` |
| บริษัท | `hr@technova.example.com` |
| บัณฑิต | `napat.s@example.com` |

หรือกด **สมัครสมาชิก** ในเว็บเพื่อสร้างบัญชีใหม่ได้เลย (ระบบสร้างโปรไฟล์ใน Database ให้อัตโนมัติ)

### Deploy ขึ้น Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # เลือก project เดิม, public = dist, SPA = Yes, อย่า overwrite index.html
npm run build
firebase deploy
```
(`firebase.json` ตั้งค่า SPA rewrite ไว้แล้ว ถ้าใช้ Vercel/Netlify ให้ตั้ง rewrite `/* → /index.html`)

## ใช้บนมือถือ

เว็บออกแบบแบบ Responsive และติดตั้งเป็นแอปได้ (PWA): มีแถบเมนูด้านล่างแบบแอป, ตัวกรองแบบพับได้, ฟอร์ม/ปุ่มขนาดกดง่าย, Modal แบบ Bottom Sheet, รองรับรอยบากจอ (safe area) และโหมดมืด

**1) ลองบนมือถือจริงระหว่างพัฒนา**
```bash
npm run dev:phone
```
แล้วเปิดมือถือ (ต่อ Wi-Fi เดียวกับคอมพิวเตอร์) ไปที่ `http://<IP ของคอมพิวเตอร์>:5173`
- Windows: เปิด Command Prompt พิมพ์ `ipconfig` ดูค่า **IPv4 Address** (เช่น 192.168.1.25)
- ถ้า Windows Firewall ถาม ให้กด **Allow access**
- ถ้า Login ผ่าน IP ไม่ได้ ให้ไปใช้วิธีที่ 2 (Deploy) แทน

**2) ใช้งานจริงบนมือถือ (แนะนำ)** — Deploy ขึ้น Firebase Hosting (ดูหัวข้อ Deploy) จะได้ลิงก์ https ที่เปิดได้ทุกเครื่อง จากนั้นติดตั้งเป็นแอป:
- iPhone (Safari): ปุ่มแชร์ → **เพิ่มไปยังหน้าจอโฮม**
- Android (Chrome): เมนู ⋮ → **ติดตั้งแอป / Add to Home screen**

(การติดตั้งเป็นแอปต้องใช้ https หรือ localhost เท่านั้น)

## โครงสร้างข้อมูล Firebase
`skill_categories`, `skills`, `companies`, `jobs`, `users`, `admins`, `applications`, `favorites` ตามที่ออกแบบใน Assignment 5 ส่วนที่ 2
(ไฟล์ `firebase-import.json`) — ชื่อ node/field เป็น snake_case ทั้งหมด

**ฟิลด์ที่เพิ่มจากแบบเดิมใน Assignment 5** (ควรระบุในรายงานว่าเป็นส่วนขยายตอนพัฒนา):
- `jobs`: `work_mode` (onsite/hybrid/remote), `openings`, `deadline`, `responsibilities[]`, `benefits[]`
- `companies`: `industry`, `size`, `address`, `tagline`, `perks[]`, `cover_url`
- หมวดหมู่ของงานไม่ได้เก็บเป็นฟิลด์ แต่คำนวณจากหมวดของทักษะที่ตำแหน่งนั้นต้องการมากที่สุด

## โครงสร้างโปรเจกต์
```
src/
├── components/{layout,common,features/{jobs,applications,profile,admin}}
├── pages/                 หน้าจอตาม Route
├── routes/AppRoutes.jsx   Route + Protected Route ตาม Role
├── services/              firebase.js (เชื่อมต่อ) + firebaseService.js (CRUD)
├── context/               AuthContext, ToastContext
├── hooks/                 useAuth, useFetchJobs, useFavorites, useToast
├── data/helpers.js        สูตร Match %, label, format
└── styles/global.css
```

| Route | หน้า | สิทธิ์ |
|---|---|---|
| `/` `/jobs` `/search` `/jobs/:jobId` `/categories` `/companies` `/companies/:companyId` `/about` | Home / Listings / Search / Detail / Categories / Companies / Company profile / About | Public |
| `/login` `/register` | Auth | Guest |
| `/graduate/dashboard?tab=profile\|applications\|favorites` | บัณฑิต | Graduate |
| `/company/dashboard?tab=overview\|jobs\|post\|applicants\|profile` | บริษัท | Company |
| `/admin/dashboard?tab=overview\|users\|jobs` | แอดมิน | Admin |

## หมายเหตุด้านความปลอดภัย
- ค่า Firebase เก็บใน `.env` (อยู่ใน `.gitignore`) ห้าม commit ขึ้น GitHub
  (Web API key ของ Firebase ไม่ใช่ความลับ แต่ความปลอดภัยจริงมาจาก Database Rules)
- Rules เป็นระดับโครงงานนักศึกษา: jobs/skills/companies อ่านได้สาธารณะ ส่วนที่เหลือต้อง Login
  การแยกสิทธิ์ตามบทบาทเกิดที่ฝั่ง client — ถ้าใช้งานจริงควรผูก rule กับ `auth.uid` หรือ Custom Claims
- เรซูเม่เก็บเป็นลิงก์ (ไม่ใช้ Firebase Storage)
