FROM node:20-alpine

WORKDIR /app

# Sao chép tệp package.json và cài đặt dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Sao chép toàn bộ mã nguồn vào thư mục /app
COPY . .

# Cài đặt PM2 toàn cầu
RUN yarn global add pm2

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng với PM2
USER root

# Chạy ứng dụng với PM2
CMD ["pm2-runtime", "start", "./src/start.js"]