import { initReservationValidation } from './modules/formValidation.js';

const reservation = document.querySelector('.reservation');
const openReservation = document.querySelector('.header__btn-reservation');
const closeReservation = document.querySelector('.reservation__close');

const menu = document.querySelector('.menu');
const menuBtn = document.querySelector('.header__btn-menu');

const catalog = document.querySelector('.catalog');
const catalogBtn = document.querySelector('.header__btn-catalog');

const filterButtons = document.querySelectorAll('.catalog__filter-btn');
const catalogItems = document.querySelectorAll('.catalog-item');

initReservationValidation();

const filtercatalog = category => {
    catalogItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || category === itemCategory) {
            item.style.display = 'flex';
            item.classList.remove('hide');
            item.classList.add('show');
        } 
        else {
            item.style.display = 'none';
            item.classList.remove('show');
            item.classList.add('hide');
        }
    });
}

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

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('catalog__filter-btn--active'));
        button.classList.add('catalog__filter-btn--active');
        const filterValue = button.getAttribute('data-filter');
        filtercatalog(filterValue);
    });
});

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