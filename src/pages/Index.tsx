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

export default function Index() {
  const { currentPage } = useStore();

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
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
