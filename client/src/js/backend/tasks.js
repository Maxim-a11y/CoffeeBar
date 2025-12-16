// class BookingManager {
//     constructor(app) {
//         this.app = app;
//         this.api = app.api;
//     }

//     async loadBookings() {
//         try {
//             const response = await this.api.getBookings();
//             this.renderBookings(response.bookings || []);
//         } catch (error) {
//             this.app.showNotification('Ошибка загрузки бронирований', 'error');
//             console.error('Error loading bookings:', error);
//         }
//     }

//     renderBookings(bookings) {
//         const container = document.getElementById('bookings-list');
//         if (!container) return;

//         if (bookings.length === 0) {
//             container.innerHTML = '<p class="text-center">У вас нет бронирований</p>';
//             return;
//         }

//         container.innerHTML = bookings.map(booking => `
//             <div class="booking-item">
//                 <div class="booking-info">
//                     <h4>${this.app.escapeHtml(booking.placeName || 'Место')}</h4>
//                     <p><i class="fas fa-calendar"></i> ${this.app.formatDate(booking.date)}</p>
//                     <p><i class="fas fa-clock"></i> ${booking.startTime} - ${booking.endTime}</p>
//                     <p><i class="fas fa-users"></i> ${booking.guests} гостей</p>
//                     <div class="booking-meta">
//                         <span class="booking-status status-${booking.status}">${this.getStatusText(booking.status)}</span>
//                         <span class="booking-price">${booking.totalPrice}₽</span>
//                     </div>
//                 </div>
//                 <div class="booking-actions">
//                     ${booking.status === 'active' ? `
//                         <button class="btn btn-secondary" onclick="app.booking.editBooking(${booking.id})">
//                             <i class="fas fa-edit"></i> Изменить
//                         </button>
//                         <button class="btn btn-error" onclick="app.booking.cancelBooking(${booking.id})">
//                             <i class="fas fa-times"></i> Отменить
//                         </button>
//                     ` : ''}
//                 </div>
//             </div>
//         `).join('');
//     }

//     getStatusText(status) {
//         const statuses = {
//             pending: 'Ожидает подтверждения',
//             confirmed: 'Подтверждено',
//             active: 'Активно',
//             completed: 'Завершено',
//             cancelled: 'Отменено'
//         };
//         return statuses[status] || status;
//     }

//     async createBooking(bookingData) {
//         try {
//             const response = await this.api.createBooking(bookingData);
//             this.app.showNotification('Бронирование успешно создано', 'success');
//             this.app.closeModal('booking-modal');
//             this.loadBookings();
//             return response;
//         } catch (error) {
//             this.app.showNotification('Ошибка создания бронирования', 'error');
//             throw error;
//         }
//     }

//     async editBooking(bookingId) {
//         this.app.showNotification('Функция редактирования бронирования в разработке', 'warning');
//     }

//     async cancelBooking(bookingId) {
//         if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
//             return;
//         }

//         try {
//             await this.api.cancelBooking(bookingId);
//             this.app.showNotification('Бронирование отменено', 'success');
//             this.loadBookings();
//         } catch (error) {
//             this.app.showNotification('Ошибка отмены бронирования', 'error');
//             throw error;
//         }
//     }

//     async checkAvailability(placeId, date, time) {
//         try {
//             const response = await this.api.checkAvailability(placeId, date, time);
//             return response.available;
//         } catch (error) {
//             console.error('Error checking availability:', error);
//             return false;
//         }
//     }
// }
