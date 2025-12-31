FROM node:20-alpine as builder

WORKDIR /app

# Sao chép tệp package.json và cài đặt dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Sao chép toàn bộ mã nguồn vào thư mục /app
COPY . .

RUN yarn global add pm2

# Thay đổi người dùng để đảm bảo quyền truy cập
USER node

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng với PM2 mà không cần cấu hình
CMD ["pm2-runtime", "./src/start.js"]