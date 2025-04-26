1、首先创建项目的基本目录结构：
checkin-app/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── uploads/
│ └── .env
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── services/
├── Dockerfile.backend
├── Dockerfile.frontend
└── docker-compose.yml
初始化前后端项目
创建完文件结构后，你需要初始化前后端项目：

后端初始化：

cd checkin-app/backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors multer dotenv
​
前端初始化：

cd checkin-app/frontend
npx create-react-app .
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
​
