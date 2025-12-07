/*
===============================
    front-end
===============================
*/

const reservation = document.querySelector('.header__popup-reservation');
const openReservation = document.querySelector('.header__btn-reservation');
const closeReservation = document.querySelector('.header__popup-reservation--close');

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