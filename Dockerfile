# استفاده از تصویر Node.js به عنوان بیس ایمیج
FROM node:16

# تنظیم دایرکتوری کاری در کانتینر
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و package-lock.json به داخل دایرکتوری کاری
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی کردن تمام فایل‌ها و پوشه‌ها از پروژه به داخل کانتینر
COPY . .

# پورت اپلیکیشن (در اینجا پورت 8888)
EXPOSE 443

# دستور برای اجرای اپلیکیشن
CMD ["node", "index.js"]
