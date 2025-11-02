# İşletme Yönetim Sistemi - Frontend

React.js tabanlı dinamik modüler ERP frontend uygulaması.

## 🏗 Mimari

### Dinamik Modül Sistemi

Frontend, dinamik modül sistemi ile geliştirilmiştir:

- **ModuleRegistry**: Frontend modüllerinin kayıt edilmesi
- **ComponentLoader**: Dinamik bileşen yükleme
- **PermissionManager**: Client-side yetki kontrolü
- **MenuGenerator**: Dinamik menü oluşturma

### Teknoloji Stack

- **React 18**: Modern React özellikleri (Hooks, Suspense)
- **TypeScript**: Tip güvenliği
- **Redux Toolkit**: State yönetimi
- **Material-UI**: UI bileşen kütüphanesi
- **React Router v6**: Client-side routing
- **Vite**: Hızlı build tool

## 📁 Dizin Yapısı

```
frontend/
├── src/
│   ├── components/        # Genel bileşenler
│   │   ├── Layout/       # Layout bileşenleri
│   │   ├── Forms/        # Form bileşenleri
│   │   ├── Tables/       # Tablo bileşenleri
│   │   └── Guards/       # Route guard'ları
│   ├── pages/            # Sayfa bileşenleri
│   │   ├── Auth/         # Kimlik doğrulama sayfaları
│   │   ├── Dashboard/    # Dashboard sayfaları
│   │   └── System/       # Sistem yönetimi sayfaları
│   ├── store/            # Redux store
│   │   ├── slices/       # Redux slices
│   │   └── index.ts      # Store konfigürasyonu
│   ├── services/         # API servisleri
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Yardımcı fonksiyonlar
│   ├── types/            # TypeScript tip tanımları
│   ├── core/             # Frontend modül sistemi
│   ├── modules/          # Dinamik modül bileşenleri
│   │   ├── stok-yonetimi/
│   │   ├── fatura-yonetimi/
│   │   └── ...
│   ├── theme/            # Material-UI tema
│   ├── styles/           # Global stiller
│   ├── App.tsx           # Ana uygulama bileşeni
│   └── main.tsx          # Uygulama giriş noktası
├── public/               # Public dosyalar
└── package.json
```

## 🎨 UI/UX Tasarım

### Tema Sistemi

Material-UI tema sistemi kullanılarak tutarlı tasarım sağlanır:

```typescript
// src/theme/index.ts
export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  // ... diğer tema ayarları
});
```

### Responsive Tasarım

- Mobile-first yaklaşım
- Breakpoint'ler: xs, sm, md, lg, xl
- Flexible grid sistemi
- Touch-friendly interface

### Accessibility

- WCAG 2.1 AA uyumluluğu
- Keyboard navigation
- Screen reader desteği
- High contrast mode

## 🔐 Güvenlik

### Client-Side Güvenlik

- XSS koruması
- CSRF token yönetimi
- Secure cookie kullanımı
- Input sanitization

### Route Guards

```typescript
// AuthGuard: Kimlik doğrulama kontrolü
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>

// ModuleGuard: Modül erişim kontrolü
<ModuleGuard moduleCode="STOK_YONETIMI" permission="stok.urun.liste">
  <StokListesi />
</ModuleGuard>
```

## 📊 State Yönetimi

### Redux Toolkit

```typescript
// store/slices/authSlice.ts
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    // ... diğer reducer'lar
  },
});
```

### Async Actions

```typescript
// RTK Query kullanımı
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // API endpoint'leri
  }),
});
```

## 🧩 Bileşen Sistemi

### Genel Bileşenler

#### DataTable
```typescript
<DataTable
  columns={columns}
  data={data}
  loading={loading}
  pagination={{
    page: 1,
    pageSize: 25,
    total: 100
  }}
  onPageChange={handlePageChange}
  onRowClick={handleRowClick}
/>
```

#### FormBuilder
```typescript
<FormBuilder
  fields={formFields}
  onSubmit={handleSubmit}
  validationSchema={validationSchema}
  initialValues={initialValues}
/>
```

#### DynamicChart
```typescript
<DynamicChart
  type="line"
  data={chartData}
  options={chartOptions}
  height={400}
/>
```

### Layout Bileşenleri

- **AppLayout**: Ana layout wrapper
- **Sidebar**: Dinamik navigasyon menüsü
- **Header**: Üst bar ve kullanıcı menüsü
- **Breadcrumbs**: Sayfa yolu göstergesi

## 🔄 Dinamik Modül Sistemi

### Modül Kaydetme

```typescript
// Modül tanımı
const moduleDefinition: ModuleDefinition = {
  code: 'STOK_YONETIMI',
  name: 'Stok Yönetimi',
  version: '1.0.0',
  category: 'OPERASYON',
  icon: 'inventory',
  color: '#2196F3',
  status: 'ACTIVE',
  permissions: ['stok.urun.liste', 'stok.urun.ekle'],
  routes: [
    {
      path: '/stok/urunler',
      component: 'UrunListesi'
    }
  ],
  menuItems: [
    {
      title: 'Ürünler',
      path: '/stok/urunler',
      icon: 'inventory',
      permission: 'stok.urun.liste'
    }
  ]
};

ModuleRegistry.registerModule(moduleDefinition);
```

### Dinamik Bileşen Yükleme

```typescript
// Lazy loading ile bileşen yükleme
const StokYonetimiModule = lazy(() => 
  import('../modules/stok-yonetimi/StokYonetimiModule')
);

// Suspense ile sarmalama
<Suspense fallback={<CircularProgress />}>
  <StokYonetimiModule />
</Suspense>
```

### Yetki Kontrolü

```typescript
// Hook kullanımı
const { hasPermission, hasModuleAccess } = usePermissions();

if (!hasModuleAccess('STOK_YONETIMI')) {
  return <AccessDenied />;
}

if (!hasPermission('stok.urun.ekle')) {
  return <ReadOnlyView />;
}
```

## 🎯 Performance Optimizasyonu

### Code Splitting

```typescript
// Route-based splitting
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const StokYonetimiPage = lazy(() => import('./pages/StokYonetimi/StokYonetimiPage'));

// Component-based splitting
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));
```

### Memoization

```typescript
// React.memo kullanımı
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// useMemo hook'u
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// useCallback hook'u
const handleClick = useCallback((id: number) => {
  onItemClick(id);
}, [onItemClick]);
```

### Virtual Scrolling

```typescript
// Büyük listeler için virtual scrolling
<VirtualizedList
  height={400}
  itemCount={items.length}
  itemSize={50}
  renderItem={({ index, style }) => (
    <div style={style}>
      <ListItem data={items[index]} />
    </div>
  )}
/>
```

## 🧪 Test

### Test Türleri

- **Unit Tests**: Bileşen ve hook testleri
- **Integration Tests**: Sayfa ve flow testleri
- **E2E Tests**: Cypress ile end-to-end testler

### Test Araçları

- **Jest**: Test runner
- **React Testing Library**: Bileşen testleri
- **MSW**: API mocking
- **Cypress**: E2E testler

### Test Örnekleri

```typescript
// Bileşen testi
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/kullanıcı adı/i), {
      target: { value: 'testuser' }
    });
    
    fireEvent.change(screen.getByLabelText(/şifre/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
    });
  });
});

// Hook testi
describe('useAuth', () => {
  it('should return user data when authenticated', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          {children}
        </Provider>
      )
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});
```

## 🌐 Internationalization (i18n)

### Çoklu Dil Desteği

```typescript
// i18n konfigürasyonu
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: trTranslations },
      en: { translation: enTranslations }
    },
    lng: 'tr',
    fallbackLng: 'en'
  });

// Kullanım
const { t } = useTranslation();
return <h1>{t('welcome_message')}</h1>;
```

## 📱 PWA Özellikleri

### Service Worker

- Offline çalışma
- Cache stratejileri
- Background sync
- Push notifications

### Manifest

```json
{
  "name": "İşletme Yönetim Sistemi",
  "short_name": "ERP",
  "description": "Kapsamlı işletme yönetim çözümü",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1976d2",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🚀 Build ve Deployment

### Production Build

```bash
# Build oluştur
npm run build

# Build'i preview et
npm run preview

# Bundle analizi
npm run analyze
```

### Environment Variables

```bash
# .env.production
VITE_API_BASE_URL=https://api.isletme-yonetim.com
VITE_APP_NAME=İşletme Yönetim Sistemi
VITE_APP_VERSION=1.0.0
```

### Docker

```dockerfile
# Multi-stage build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Development Tools

### VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

### Browser DevTools

- React Developer Tools
- Redux DevTools
- Lighthouse
- Performance profiler

## 📚 Dokümantasyon

### Storybook

```bash
# Storybook başlat
npm run storybook

# Storybook build
npm run build-storybook
```

### Component Documentation

```typescript
// Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text']
    }
  }
};

export const Primary = {
  args: {
    variant: 'contained',
    children: 'Primary Button'
  }
};
```

## 🐛 Debugging

### Error Boundaries

```typescript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Development Debugging

```typescript
// Redux DevTools
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// React DevTools Profiler
<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

## 🤝 Katkıda Bulunma

### Kod Standartları

- ESLint + Prettier konfigürasyonu
- TypeScript strict mode
- Conventional Commits
- Husky pre-commit hooks

### Component Guidelines

1. Functional components kullanın
2. TypeScript prop types tanımlayın
3. Default props belirtin
4. Accessibility attributes ekleyin
5. Error handling implement edin

## 📞 Destek

Frontend geliştirme desteği için:
- GitHub Issues
- E-posta: frontend@isletme-yonetim.com
- Slack: #frontend-dev