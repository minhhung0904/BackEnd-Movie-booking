FROM node:20-alpine as builder

WORKDIR /app

# Sao chép tệp package.json và cài đặt dependencies
COPY package.json yarn.lock ./
RUN yarn install --production \
    && yarn global add pm2 

# Sao chép toàn bộ mã nguồn vào thư mục /app
COPY . .

# Thay đổi người dùng để đảm bảo quyền truy cập
USER node

# Mở cổng 3000
EXPOSE 3000

# Thiết lập lệnh CMD để chạy ứng dụng mà không cần file config
CMD ["pm2-docker", "start", "./src/start.js", "--no-auto-exit", "--name", "api", "--exec-mode", "cluster", "--instances", "max", "--max-memory-restart", "1G", "--node-args", "--expose-gc --max-old-space-size=1024"]