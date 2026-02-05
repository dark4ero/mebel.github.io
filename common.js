// common.js - Общие функции для всех страниц сайта Nexus Furniture

// Объект для работы с localStorage
const StorageManager = {
    // Ключи для localStorage
    KEYS: {
        CART: 'nexus_furniture_cart',
        FAVORITES: 'nexus_furniture_favorites'
    },

    // Работа с корзиной
    getCart: () => {
        const cart = localStorage.getItem(StorageManager.KEYS.CART);
        return cart ? JSON.parse(cart) : [];
    },

    saveCart: (cart) => {
        localStorage.setItem(StorageManager.KEYS.CART, JSON.stringify(cart));
    },

    addToCart: (productId, quantity = 1) => {
        const cart = StorageManager.getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity });
        }
        
        StorageManager.saveCart(cart);
        return cart;
    },

    updateCartItem: (productId, quantity) => {
        const cart = StorageManager.getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (quantity <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = quantity;
            }
            
            StorageManager.saveCart(cart);
        }
        
        return cart;
    },

    removeFromCart: (productId) => {
        const cart = StorageManager.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        StorageManager.saveCart(updatedCart);
        return updatedCart;
    },

    clearCart: () => {
        localStorage.removeItem(StorageManager.KEYS.CART);
    },

    getCartTotalItems: () => {
        const cart = StorageManager.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Работа с избранным
    getFavorites: () => {
        const favorites = localStorage.getItem(StorageManager.KEYS.FAVORITES);
        return favorites ? JSON.parse(favorites) : [];
    },

    saveFavorites: (favorites) => {
        localStorage.setItem(StorageManager.KEYS.FAVORITES, JSON.stringify(favorites));
    },

    addToFavorites: (productId) => {
        const favorites = StorageManager.getFavorites();
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            StorageManager.saveFavorites(favorites);
        }
        return favorites;
    },

    removeFromFavorites: (productId) => {
        const favorites = StorageManager.getFavorites();
        const updatedFavorites = favorites.filter(id => id !== productId);
        StorageManager.saveFavorites(updatedFavorites);
        return updatedFavorites;
    },

    toggleFavorite: (productId) => {
        const favorites = StorageManager.getFavorites();
        const isFavorite = favorites.includes(productId);
        
        if (isFavorite) {
            return StorageManager.removeFromFavorites(productId);
        } else {
            return StorageManager.addToFavorites(productId);
        }
    },

    isFavorite: (productId) => {
        const favorites = StorageManager.getFavorites();
        return favorites.includes(productId);
    },

    getFavoritesCount: () => {
        return StorageManager.getFavorites().length;
    }
};

// Общие функции для UI
const CommonFunctions = {
    // Форматирование цены
    formatPrice: (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    },

    // Получение названия категории
    getCategoryName: (categoryId) => {
        const categories = {
            'sofas': 'Диваны',
            'chairs': 'Стулья',
            'tables': 'Столы',
            'beds': 'Кровати',
            'wardrobes': 'Шкафы',
            'shelves': 'Полки'
        };
        
        return categories[categoryId] || categoryId;
    },

    // Обновление счетчиков в шапке
    updateHeaderCounters: () => {
        const cartCount = StorageManager.getCartTotalItems();
        const favoritesCount = StorageManager.getFavoritesCount();
        
        const cartBadge = document.getElementById('cartCount');
        const favoritesBadge = document.getElementById('favoritesCount');
        
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
        }
        
        if (favoritesBadge) {
            favoritesBadge.textContent = favoritesCount;
            favoritesBadge.style.display = favoritesCount > 0 ? 'flex' : 'none';
        }
    },

    // Показать уведомление
    showNotification: (message, type = 'success') => {
        // Создаем элемент уведомления, если его нет
        let notificationContainer = document.getElementById('notificationContainer');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notificationContainer';
            document.body.appendChild(notificationContainer);
        }
        
        // Создаем уведомление
        const notificationId = 'notification-' + Date.now();
        const icons = {
            success: 'fas fa-check-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle'
        };
        
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="document.getElementById('${notificationId}').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }, 5000);
    },

    // Инициализация мобильного меню
    initMobileMenu: () => {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');
        
        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Закрытие меню при клике на ссылку
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
            
            // Закрытие меню при клике вне его области
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    },

    // Подсветка активной ссылки в навигации
    highlightActiveNavLink: () => {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
        
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    // Инициализация всех общих функций
    init: () => {
        CommonFunctions.updateHeaderCounters();
        CommonFunctions.initMobileMenu();
        CommonFunctions.highlightActiveNavLink();
        
        // Слушаем изменения в localStorage для синхронизации между вкладками
        window.addEventListener('storage', (e) => {
            if (e.key === StorageManager.KEYS.CART || e.key === StorageManager.KEYS.FAVORITES) {
                CommonFunctions.updateHeaderCounters();
            }
        });
    }
};

// Данные о товарах (могут быть расширены или загружены с сервера)
const productsData = [
    {
        id: 1,
        name: 'Диван "Модерн" серый',
        category: 'sofas',
        price: 34990,
        originalPrice: 42990,
        image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: ['new', 'popular']
    },
    {
        id: 2,
        name: 'Кожаное кресло "Престиж"',
        category: 'chairs',
        price: 21990,
        originalPrice: 25990,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: ['sale']
    },
    {
        id: 3,
        name: 'Деревянный обеденный стол',
        category: 'tables',
        price: 28990,
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: ['new']
    },
    {
        id: 4,
        name: 'Двухспальная кровать "Люкс"',
        category: 'beds',
        price: 45990,
        originalPrice: 54990,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: ['sale', 'popular']
    },
    {
        id: 5,
        name: 'Шкаф-купе 3-х створчатый',
        category: 'wardrobes',
        price: 38990,
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: []
    },
    {
        id: 6,
        name: 'Комод "Скандинавия" белый',
        category: 'wardrobes',
        price: 15990,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: ['new']
    },
    {
        id: 7,
        name: 'Стул барный деревянный',
        category: 'chairs',
        price: 8990,
        originalPrice: 10990,
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: ['sale']
    },
    {
        id: 8,
        name: 'Компьютерный стол "Офис"',
        category: 'tables',
        price: 12990,
        image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        badges: ['popular']
    }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', CommonFunctions.init);