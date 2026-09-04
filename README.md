# GitHub Pages — Portfolio

این نسخه برای اجرای مستقیم روی GitHub Pages آماده شده و دیگر به React/Vite build نیاز ندارد.

## ساختار

- `index.html` — صفحه اصلی
- `css/styles.css` — استایل‌ها و انیمیشن‌های CSS
- `js/app.js` — منطق سایت و انیمیشن‌های scroll
- `data/site.json` — محتوای قابل ویرایش سایت
- `images/projects/` — تصاویر پروژه‌ها

## تغییر محتوا

برای تغییر نام، متن‌ها، پروژه‌ها، مهارت‌ها، داستان و لینک‌های تماس فقط `data/site.json` را ویرایش کن.

برای اضافه کردن پروژه، یک آبجکت جدید داخل آرایه `projects` قرار بده و عکس‌ها را داخل `images/projects/` بگذار.

## GitHub Pages

1. این فایل‌ها را در root یک repository قرار بده.
2. در GitHub برو به **Settings → Pages**.
3. Source را روی **Deploy from a branch** بگذار.
4. branch اصلی و folder ریشه (`/`) را انتخاب کن.
5. Save.

چون مسیرها relative هستند، سایت روی آدرس‌های معمول GitHub Pages مثل
`https://USERNAME.github.io/REPOSITORY/` هم درست کار می‌کند.

## نکته

برای اینکه انیمیشن‌های اصلی دقیقاً همان رفتار نسخه اولیه را داشته باشند، `GSAP` و `ScrollTrigger` از CDN بارگذاری می‌شوند. بنابراین بازدیدکننده هنگام لود سایت باید اینترنت داشته باشد.
