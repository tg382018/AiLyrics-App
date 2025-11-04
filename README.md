# AI Lyrics Backend

AI tarafından oluşturulan şarkı sözleri için RESTful API backend uygulaması. NestJS framework'ü ile geliştirilmiştir.

## 🚀 Teknolojiler

- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication ve authorization
- **Swagger** - API dokümantasyonu
- **TypeScript** - Type-safe JavaScript
- **Passport** - Authentication middleware

## 📋 Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ JWT tabanlı authentication
- ✅ Şarkı oluşturma ve listeleme
- ✅ Swagger UI ile interaktif API dokümantasyonu
- ✅ Environment-based configuration
- ✅ CORS desteği
- ✅ Validation ve error handling

## 🛠️ Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB (yerel veya cloud)
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone https://github.com/tg382018/AiLyrics-App.git
cd AiLyrics-App/ai-lyrics-backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment dosyalarını oluşturun:

`.env.development` dosyası oluşturun:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

`.env.production` dosyası oluşturun:
```env
NODE_ENV=production
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Uygulamayı çalıştırın:

Development modu:
```bash
npm run start:dev
```

Production modu:
```bash
npm run build
npm run start:prod
```

## 📚 API Dokümantasyonu

Uygulama çalıştıktan sonra Swagger UI'ya erişebilirsiniz:

```
http://localhost:3000/swagger
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri (JWT gerekli)

### Songs
- `GET /api/songs` - Tüm şarkıları listele
- `POST /api/songs/create` - Yeni şarkı oluştur

### Users
- `GET /api/users` - Tüm kullanıcıları listele
- `POST /api/users/register` - Kullanıcı kaydı
- `POST /api/users/login` - Kullanıcı girişi

## 🧪 Test

```bash
# Unit testler
npm run test

# E2E testler
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts

- `npm run start:dev` - Watch mode ile development
- `npm run build` - Production build
- `npm run start:prod` - Production modunda çalıştır
- `npm run lint` - Code linting
- `npm run format` - Code formatting

## 📦 Proje Yapısı

```
src/
├── auth/           # Authentication modülü
├── users/           # Kullanıcı yönetimi
├── songs/           # Şarkı yönetimi
├── app.module.ts    # Ana modül
└── main.ts          # Uygulama entry point
```

## 🔒 Güvenlik

- JWT token'ları 7 gün geçerlidir
- Şifreler bcrypt ile hash'lenir
- CORS yapılandırılmıştır
- Environment variables ile hassas bilgiler korunur

## 📄 Lisans

Bu proje private bir projedir.

## 👤 Yazar

Tahsin Gülçek
