import { initReservationValidation } from './modules/formValidation.js';

const reservation = document.querySelector('.reservation');
const openReservation = document.querySelector('.header__btn-reservation');
const closeReservation = document.querySelector('.reservation__close');

const menu = document.querySelector('.menu');
const menuBtn = document.querySelector('.header__btn-menu');

const catalog = document.querySelector('.catalog');
const catalogGrid = document.getElementById('catalog-grid');
const filterButtons = document.querySelectorAll('.catalog__filter-btn');

// Базовый URL API бэкенда
const API_BASE = '/api';

initReservationValidation();

// Рендер одной карточки товара
const createProductCard = (product) => {
    const article = document.createElement('article');
    article.classList.add('catalog-item');
    article.dataset.category = product.category || 'all';

    const price = Number(product.price).toFixed(2);
    const imgSrc = `img/${product.image}`;

    article.innerHTML = `
        <div class="catalog-item__image">
            <img src="${imgSrc}" alt="${product.name ?? 'Coffee'}">
        </div>
        <div class="catalog-item__content">
            <div class="catalog-item__top">
                <h3 class="catalog-item__name">${product.name ?? ''}</h3>
                <span class="catalog-item__price">$${price}</span>
            </div>
            <p class="catalog-item__desc">${product.description ?? ''}</p>
            <button class="catalog-item__button">Order Now</button>
        </div>
    `;

    return article;
};

// Загрузка товаров из API
const loadProducts = async () => {
    if (!catalogGrid) return;

    try {
        const response = await fetch(`${API_BASE}/products`);

        if (!response.ok) {
            throw new Error(`Failed to load products: ${response.status}`);
        }

        const data = await response.json();
        const products = Array.isArray(data.products) ? data.products : [];

        catalogGrid.innerHTML = '';

        if (products.length === 0) {
            catalogGrid.innerHTML = '<p class="catalog__empty">No coffee items found.</p>';
            return;
        }

        products.forEach((product) => {
            const card = createProductCard(product);
            catalogGrid.appendChild(card);
        });

        // Обновляем список элементов для фильтрации после рендера
        setupFilters();
    } catch (error) {
        console.error('Error loading products:', error);
        if (catalogGrid) {
            catalogGrid.innerHTML = '<p class="catalog__error">Error loading menu. Please try again later.</p>';
        }
    }
};

// Фильтрация по категории
const filtercatalog = (category) => {
    if (!catalogGrid) return;

    const items = catalogGrid.querySelectorAll('.catalog-item');

    items.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || category === itemCategory) {
            item.style.display = 'flex';
            item.classList.remove('hide');
            item.classList.add('show');
        } else {
            item.style.display = 'none';
            item.classList.remove('show');
            item.classList.add('hide');
        }
    });
};

// Навешиваем обработчики на кнопки фильтра после рендера карточек
const setupFilters = () => {
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('catalog__filter-btn--active'));
            button.classList.add('catalog__filter-btn--active');
            const filterValue = button.getAttribute('data-filter');
            filtercatalog(filterValue);
        });
    });
};

openReservation.addEventListener('click', () => {
    reservation.showModal();
    document.body.classList.add('scroll-block');
});

closeReservation.addEventListener('click', () => {
    reservation.close();
    document.body.classList.remove('scroll-block');
});

reservation.addEventListener('click', ({ currentTarget, target }) => {
    if (target === currentTarget) {
        reservation.close()
        document.body.classList.remove('scroll-block');
    }
});

reservation.addEventListener('cancel', () => {
    document.body.classList.remove('scroll-block');
});

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('header__btn-menu--active');
    menu.classList.toggle('menu--active');
});

// Инициализируем фильтры и загружаем продукты только на странице меню,
// где есть секция каталога
if (catalog) {
    setupFilters();
    loadProducts();
}

/*
===============================
    back-end
===============================
*/

// const app = new KuroBarApp();
// app.api = new KuroBarApi(app);
// app.profile = new ProfileManager(app);
// app.places = new PlacesManager(app);
// app.booking = new BookingManager(app);
// app.ui = new UIManager(app);

// function showBookingForm() {
//     app.ui.showModal('booking-modal');
// }

// function showProfileForm() {
//     app.ui.showModal('profile-modal');
// }

// function closeModal(modalId) {
//     app.ui.closeModal(modalId);
// }

// function handleBookingSubmit(event) {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const bookingData = {
//         placeId: app.places.selectedPlaceId,
//         date: formData.get('date'),
//         startTime: formData.get('startTime'),
//         endTime: formData.get('endTime'),
//         guests: formData.get('guests'),
//         notes: formData.get('notes')
//     };
    
//     app.booking.createBooking(bookingData);
// }

// function handleProfileSubmit(event) {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const profileData = {
//         name: formData.get('name'),
//         email: formData.get('email'),
//         phone: formData.get('phone')
//     };
    
//     app.profile.updateProfile(profileData);
// }

// async function testEndpoint(endpoint) {
//     const responseContainer = document.getElementById('api-response');
//     responseContainer.innerHTML = '<div class="loading"></div> Загрузка...';
    
//     try {
//         const response = await app.api.request(endpoint);
//         responseContainer.textContent = JSON.stringify(response, null, 2);
//     } catch (error) {
//         responseContainer.textContent = `Ошибка: ${error.message}`;
//     }
// }