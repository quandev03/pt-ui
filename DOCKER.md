# Docker Setup for HVN UI

Hướng dẫn build và chạy cả Internal và Partner apps bằng Docker.

## 🚀 Quick Start

### Build và chạy cả hai apps:
```bash
docker-compose up --build
```

### Build và chạy riêng lẻ:
```bash
# Chỉ Internal app
docker-compose up --build internal-web

# Chỉ Partner app  
docker-compose up --build partner-web
```

## 📋 Services

### Internal App
- **URL**: http://localhost:3001/admin/
- **Container**: hvn-internal-web
- **Port**: 3001
- **Dockerfile**: Dockerfile.internal
- **Env file**: apps/Internal/.env.development

### Partner App
- **URL**: http://localhost:3002/
- **Container**: hvn-partner-web
- **Port**: 3002
- **Dockerfile**: Dockerfile.partner
- **Env file**: apps/Partner/.env.development

## 🛠️ Commands

### Development
```bash
# Build cả hai apps
docker-compose build

# Chạy background
docker-compose up -d

# Xem logs
docker-compose logs -f internal-web
docker-compose logs -f partner-web

# Stop containers
docker-compose down
```

### Production
```bash
# Build với production environment
docker-compose -f docker-compose.yml up --build
```

## 🔧 Environment Variables

Các environment variables được load từ:
- `apps/Internal/.env.development` cho Internal app
- `apps/Partner/.env.development` cho Partner app

### Key Variables:
- `VITE_BASE_API_URL`: API base URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `VITE_FIREBASE_CONFIG_OBJECT`: Firebase configuration
- `VITE_STORAGE_KEY_PREFIX`: Local storage prefix

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│  Internal App   │    │   Partner App   │
│   Port: 3001    │    │   Port: 3002    │
│   /admin/       │    │       /         │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌─────────────────┐
            │   hvn-network   │
            │   (bridge)      │
            └─────────────────┘
```

## 🔍 Troubleshooting

### Container không start:
```bash
# Kiểm tra logs
docker-compose logs internal-web
docker-compose logs partner-web

# Rebuild từ đầu
docker-compose down
docker system prune -f
docker-compose up --build
```

### Port conflicts:
```bash
# Thay đổi ports trong docker-compose.yml
ports:
  - "3001:3001"  # Internal
  - "3002:3002"  # Partner
```

### Environment issues:
```bash
# Kiểm tra env files tồn tại
ls -la apps/Internal/.env.development
ls -la apps/Partner/.env.development
``` 