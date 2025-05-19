
# PerfectChat 

Real-time чат на React с Firebase, 
функции:
  авторизация через Google,
  обмен сообщениями в реальном времени,
  загрузка изображений,
  адаптивный интерфейс


Быстрый старт

1. Клонируйте репозиторий:
  git clone https://github.com/maksimaleinikov/perfectChat.git
  cd perfectChat
2. Установите зависимости
  npm install
3. Создайте файл .env.local в корне проекта и добавьте конфигурацию Firebase:
  VITE_API_KEY=your-api-key
  VITE_AUTH_DOMAIN=your-project.firebaseapp.com
  VITE_PROJECT_ID=your-project-id
  VITE_STORAGE_BUCKET=your-bucket.appspot.com
  VITE_MESSAGING_SENDER_ID=your-sender-id
  VITE_APP_ID=your-app-id
4. Запуск приложения
  npm run dev
5. Доступ
  http://localhost:3000
