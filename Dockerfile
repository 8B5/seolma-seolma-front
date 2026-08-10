# Frontend (Vue 3 + Vite) 멀티스테이지 빌드 (Capacity Lab)
# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# docker 모드: 앞단 nginx 리버스 프록시를 통해 상대경로 /api 로 호출
RUN npm run build -- --mode docker

# ---- Serve stage ----
FROM nginx:1.27-alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.static.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
