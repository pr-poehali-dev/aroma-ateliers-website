import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import Icon from '@/components/ui/icon';

export default function Index() {
  const { currentPage, editMode, toggleEditMode } = useStore();

  const isProduct = currentPage.startsWith('product-');
  const productId = isProduct ? parseInt(currentPage.replace('product-', '')) : null;

  const isAdmin = currentPage === 'admin';

  const renderPage = () => {
    if (isAdmin) return <AdminPage />;
    if (currentPage === 'home') return <HomePage />;
    if (currentPage === 'catalog' || currentPage === 'wishlist') return <CatalogPage />;
    if (currentPage === 'checkout') return <CheckoutPage />;
    if (currentPage === 'profile') return <ProfilePage />;
    if (isProduct && productId) return <ProductPage productId={productId} />;
    return <HomePage />;
  };

  if (isAdmin) {
    return <>{renderPage()}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      {editMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-graphite text-cream px-5 py-3 shadow-xl rounded-sm animate-fade-in">
          <Icon name="Pencil" size={14} className="text-gold" />
          <span className="font-sans text-xs tracking-widest uppercase">Режим редактирования</span>
          <span className="text-warm-gray font-sans text-xs">— нажмите на текст или фото чтобы изменить</span>
          <button onClick={toggleEditMode} className="ml-2 text-warm-gray hover:text-cream transition-colors">
            <Icon name="X" size={14} />
          </button>
        </div>
      )}
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}