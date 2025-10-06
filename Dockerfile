# ใช้ Node.js เวอร์ชัน 18
FROM node:18

# ตั้ง working directory
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# เปิด port 8080
EXPOSE 8080

# รันเซิร์ฟเวอร์
CMD ["node", "index.js"]
