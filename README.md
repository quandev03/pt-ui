# Hi-VN - Hệ thống quản lý nội bộ

<a alt="Vissoft logo" href="https://vissoft.vn/" target="_blank" rel="noreferrer"><img src="https://vissoft.vn/upload/images/group-34075.png" width="45"></a>

✨ **Dự án được phát triển bởi [Venn](https://github.com/ChuNguyenChuong) - Vissoft** ✨

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Scripts chính](#scripts-chính)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Development](#development)
- [Build & Deploy](#build--deploy)
- [Testing](#testing)
- [Nx Commands](#nx-commands)

## 🎯 Tổng quan

Hi-VN là hệ thống quản lý nội bộ được xây dựng trên nền tảng React Monorepo với Nx workspace. Dự án bao gồm hai ứng dụng chính:

- **Internal App** - Hệ thống quản lý nội bộ 
- **Partner App** - Hệ thống đối tác 

Được thiết kế với:
- **Scalability**: Dễ dàng mở rộng với nhiều apps và shared libraries
- **Developer Experience**: Setup sẵn tools và best practices
- **Performance**: Optimized builds với Vite và Nx caching
- **Type Safety**: Full TypeScript support

## 🛠 Công nghệ sử dụng

### Core Technologies

- **React 18.3.1** - UI Library
- **TypeScript 5.5.2** - Type safety
- **Vite** - Build tool và dev server
- **Nx 19.5.6** - Monorepo management

### UI & Styling

- **Tailwind CSS 3.4.3** - Utility-first CSS
- **Styled Components 6.1.16** - CSS-in-JS
- **Ant Design 5.26.0** - UI Component library
- **Lucide React** - Icon library

### State Management

- **Zustand 5.0.5** - Lightweight state management
- **TanStack Query 5.69.0** - Server state management

### Authentication & Services

- **Firebase 12.0.0** - Authentication và backend services
- **React OAuth Google** - Google OAuth integration
- **Axios** - HTTP client

### Testing

- **Vitest** - Unit testing framework
- **Jest** - Testing utilities
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message validation
- **Yarn** - Package manager

## 🚀 Cài đặt

### Prerequisites

- Node.js >= 18
- Yarn >= 1.22

### Installation Steps

```bash
# Clone repository
git clone <repository-url>
cd hi-vn

# Install dependencies
yarn install

# Setup environment (nếu cần)
cp .env.example .env.local
```

## 📝 Scripts chính

### Development

```bash
yarn internal          # 🚀 Chạy internal app development mode
yarn partner           # 🚀 Chạy partner app development mode
yarn nx:graph          # 📊 Xem dependency graph
yarn nx:reset          # 🔄 Reset Nx cache
```

### Build & Production

```bash
yarn build:internal    # 🏗️  Build internal app for production
yarn build:partner     # 🏗️  Build partner app for production
yarn start:internal    # ▶️  Serve internal app (port 3001)
yarn start:partner     # ▶️  Serve partner app (port 3000)
```

### Library Management

```bash
yarn vis-add <name>    # 📦 Tạo library mới trong libs/
```

### Utilities

```bash
yarn nx:repair         # 🔧 Sửa chữa Nx workspace
```

## 📁 Cấu trúc dự án

```
hi-vn/
├── 📁 apps/                    # Ứng dụng chính
│   ├── 📁 internal/           # Hệ thống quản lý nội bộ
│   │   ├── 📁 src/
│   │   │   ├── 📁 modules/    # Feature modules
│   │   │   │   ├── 📁 Auth/   # Authentication module
│   │   │   │   ├── 📁 UserManagement/ # User management
│   │   │   │   └── 📁 WelcomePage/    # Welcome page
│   │   │   ├── 📁 routers/    # Routing configuration
│   │   │   ├── 📁 services/   # API services
│   │   │   └── 📁 types/      # TypeScript types
│   │   ├── index.html
│   │   ├── vite.config.ts     # Vite configuration
│   │   └── tailwind.config.js # Tailwind config
│   │
│   └── 📁 partner/            # Hệ thống đối tác
│       ├── 📁 src/
│       │   ├── 📁 modules/    # Feature modules
│       │   ├── 📁 routers/    # Routing configuration
│       │   ├── 📁 services/   # API services
│       │   └── 📁 types/      # TypeScript types
│       ├── index.html
│       ├── vite.config.ts     # Vite configuration
│       └── tailwind.config.js # Tailwind config
│
├── 📁 libs/                   # Shared libraries
│   └── 📁 common/            # Common components/utils
│       ├── 📁 lib/           # UI Components
│       │   ├── 📁 Button/    # Button components
│       │   ├── 📁 Input/     # Input components
│       │   ├── 📁 Table/     # Table components
│       │   ├── 📁 Modal/     # Modal components
│       │   └── 📁 ...        # Other components
│       ├── 📁 hooks/         # Custom hooks
│       ├── 📁 services/      # Shared services
│       ├── 📁 types/         # Shared types
│       └── 📁 utils/         # Utility functions
│
├── 📁 dist/                   # Build output
│   └── 📁 apps/
│       ├── 📁 internal/      # Internal app build
│       └── 📁 partner/       # Partner app build
│
├── 📊 package.json           # Root dependencies & scripts
├── 📊 nx.json               # Nx workspace config
├── 📊 tsconfig.base.json    # TypeScript base config
├── 📊 commitlint.config.cjs # Commit message rules
└── 📋 README.md             # This file
```

## 💻 Development

### Khởi động Development Server

```bash
# Chạy internal app
yarn internal

# Chạy partner app
yarn partner
```

- Internal app: http://localhost:4200
- Partner app: http://localhost:4200 (sẽ tự động chuyển port nếu có conflict)
- Hot reload enabled
- TypeScript checking
- ESLint integration

### Tạo Library mới

```bash
yarn vis-add my-feature
```

Sẽ tạo library mới tại `libs/my-feature/` với:
- TypeScript setup
- Vitest testing
- Export barrel (index.ts)

### Best Practices

- 📝 Code theo TypeScript strict mode
- 🎨 Sử dụng Tailwind CSS cho styling
- 🧪 Viết tests cho components
- 📐 Follow ESLint rules
- 🔄 Commit với conventional commit format

## 🏗️ Build & Deploy

### Development Build

```bash
yarn build:internal
yarn build:partner
```

### Production Serve

```bash
yarn start:internal  # Port 3001
yarn start:partner   # Port 3000
```

- Serves từ `dist/apps/[app-name]/`
- Production optimized
- Environment variables từ `.env.local`

### Docker Deployment

Dự án có sẵn Dockerfile cho từng app:
- `Dockerfile-Internal` - Cho internal app
- `Dockerfile-Partner` - Cho partner app
- `Dockerfile-Sign` - Cho signing app

## 🧪 Testing

### Chạy Tests

```bash
# Tất cả tests
yarn test

# Watch mode
yarn test --watch

# Coverage report
yarn test --coverage
```

### Testing Guidelines

- Unit tests cho components
- Integration tests cho features
- E2E tests với Playwright
- Accessibility testing

## ⚡ Nx Commands

### Workspace Management

```bash
# Xem project graph
npx nx graph

# Reset cache
npx nx reset

# Repair workspace
npx nx repair
```

### Running Tasks

```bash
# Chạy specific target
npx nx <target> <project>

# Multiple targets
npx nx run-many -t build test

# Filtered projects
npx nx run-many -t build -p internal partner
```

### Generate Commands

```bash
# Tạo React component
npx nx g @nx/react:component MyComponent --project=internal

# Tạo library
npx nx g @nx/react:library my-lib --directory=libs/my-lib
```

## 📚 Resources

### Documentation

- 📖 [Nx Documentation](https://nx.dev)
- ⚛️ [React Documentation](https://react.dev)
- 🎨 [Tailwind CSS](https://tailwindcss.com)
- 📘 [TypeScript Handbook](https://typescriptlang.org)
- 🔥 [Firebase Documentation](https://firebase.google.com/docs)

## 🤝 Contributing

### Git Workflow

1. Tạo branch theo naming convention
2. Code & commit với conventional format
3. Push và tạo Pull Request
4. Code review & merge

### 🌿 Branch Naming Rules

#### Protected Branches (Chỉ admin)

- `main` - Production branch
- `develop` - Development branch
- `test` - Testing environment
- `uat` - User Acceptance Testing
- `dev-common` - Common development

> ⚠️ **Lưu ý**: Chỉ user có email `chunguyenchuong2014bg@gmail.com` mới được push trực tiếp lên các protected branches.

#### Feature Branches (Tất cả developers)

- `feature/*` - Tính năng mới
- `bugfix/*` - Sửa lỗi
- `hotfix/*` - Sửa lỗi khẩn cấp
- `release/*` - Chuẩn bị release
- `deploy/*` - Deploy scripts/configs
- `conflict/*` - Giải quyết conflicts

**Ví dụ branch names:**

```bash
feature/user-authentication
bugfix/fix-login-error
hotfix/security-patch
release/v1.2.0
```

### 📝 Commit Message Rules

Project sử dụng **Conventional Commits** với **commitlint** để kiểm tra format.

#### Format bắt buộc:

```
type(SCOPE): subject
```

#### Types cho phép:

- `feat` - Tính năng mới
- `bug` - Sửa lỗi
- `hotfix` - Sửa lỗi khẩn cấp
- `release` - Release version

#### Scope rules:

- **Bắt buộc** phải có scope
- Format: **UPPERCASE** với chữ cái, số và dấu gạch ngang
- Ví dụ: `C010GESIM-0`, `USER-AUTH`, `API-V1`

#### Subject rules:

- **Không được để trống**
- **Không được kết thúc bằng dấu chấm**
- **Tối đa 150 ký tự**

#### ✅ Ví dụ commit messages đúng:

```bash
feat(USER-AUTH): thêm chức năng đăng nhập
bug(API-V1): sửa lỗi validation email
hotfix(SECURITY): cập nhật dependencies
release(V1-2-0): chuẩn bị release version 1.2.0
```

#### ❌ Ví dụ commit messages sai:

```bash
# Thiếu type và scope
Thêm chức năng đăng nhập

# Scope không đúng format (phải UPPERCASE)
feat(user-auth): thêm chức năng đăng nhập

# Kết thúc bằng dấu chấm
feat(USER-AUTH): thêm chức năng đăng nhập.

# Thiếu scope
feat: thêm chức năng đăng nhập
```

### 🚫 Pre-commit Hooks

Project có cấu hình **husky hooks**:

1. **Pre-commit hook**:
   - Kiểm tra branch naming convention
   - Chạy build để đảm bảo code không lỗi
   - Kiểm tra quyền push lên protected branches

2. **Commit-msg hook**:
   - Validate commit message format với commitlint
   - Đảm bảo tuân thủ conventional commits

#### Bypass hooks (Không khuyến nghị):

```bash
# Bỏ qua pre-commit hook
git commit --no-verify -m "feat(SCOPE): commit message"

# Bỏ qua commit-msg hook
git commit --no-edit --no-verify
```

### 🔧 Troubleshooting Commit Issues

#### Lỗi Branch Naming:

```bash
# Đổi tên branch hiện tại
git branch -m new-branch-name

# Hoặc tạo branch mới
git checkout -b feature/ten-tinh-nang
```

#### Lỗi Commit Message:

```bash
# Sửa commit message cuối cùng
git commit --amend -m "feat(SCOPE): mô tả ngắn gọn"

# Hoặc commit với format đúng
git commit -m "feat(USER-AUTH): thêm chức năng đăng nhập"
```

---

🏢 **Developed by [Vissoft Vietnam](https://vissoft.vn)**
