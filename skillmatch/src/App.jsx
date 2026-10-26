import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import Footer from './components/layout/Footer'
import AppRoutes from './routes/AppRoutes'
import { isFirebaseConfigured } from './services/firebase'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Header />
        {!isFirebaseConfigured && (
          <div className="alert alert-warn" style={{ margin: 0, borderRadius: 0, textAlign: 'center' }}>
            ยังไม่ได้ตั้งค่า Firebase — สร้างไฟล์ <code>.env</code> ตาม <code>.env.example</code> แล้วรีสตาร์ท <code>npm run dev</code>
          </div>
        )}
        <AppRoutes />
        <Footer />
        <BottomNav />
      </AuthProvider>
    </ToastProvider>
  )
}
