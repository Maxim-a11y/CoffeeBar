// class PlacesManager {
//     constructor(app) {
//         this.app = app;
//         this.api = app.api;
//     }

//     async loadPlaces() {
//         try {
//             const response = await this.api.getPlaces();
//             this.renderPlaces(response.places || []);
//         } catch (error) {
//             this.app.showNotification('Ошибка загрузки мест', 'error');
//             console.error('Error loading places:', error);
//         }
//     }

//     renderPlaces(places) {
//         const container = document.getElementById('places-grid');
//         if (!container) return;

//         if (places.length === 0) {
//             container.innerHTML = '<p class="text-center">Места не найдены</p>';
//             return;
//         }

//         container.innerHTML = places.map(place => `
//             <div class="place-card">
//                 <div class="place-image">
//                     <i class="fas fa-chair"></i>
//                 </div>
//                 <div class="place-info">
//                     <h3>${this.app.escapeHtml(place.name)}</h3>
//                     <p class="place-description">${this.app.escapeHtml(place.description || 'Описание отсутствует')}</p>
//                     <div class="place-details">
//                         <span class="place-capacity">
//                             <i class="fas fa-users"></i> До ${place.capacity} человек
//                         </span>
//                         <span class="place-price">
//                             <i class="fas fa-ruble-sign"></i> ${place.pricePerHour}₽/час
//                         </span>
//                     </div>
//                     <div class="place-features">
//                         ${place.features ? place.features.map(feature => 
//                             `<span class="feature-tag">${this.app.escapeHtml(feature)}</span>`
//                         ).join('') : ''}
//                     </div>
//                 </div>
//                 <div class="place-actions">
//                     <button class="btn btn-primary" onclick="app.places.bookPlace(${place.id})">
//                         <i class="fas fa-calendar-plus"></i> Забронировать
//                     </button>
//                     <button class="btn btn-secondary" onclick="app.places.viewDetails(${place.id})">
//                         <i class="fas fa-info-circle"></i> Подробнее
//                     </button>
//                 </div>
//             </div>
//         `).join('');
//     }

//     async bookPlace(placeId) {
//         this.app.showModal('booking-modal');
//         this.selectedPlaceId = placeId;
//     }

//     async viewDetails(placeId) {
//         try {
//             const response = await this.api.getPlace(placeId);
//             this.showPlaceDetails(response);
//         } catch (error) {
//             this.app.showNotification('Ошибка загрузки деталей места', 'error');
//         }
//     }

//     showPlaceDetails(place) {
//         const modal = document.getElementById('place-details-modal');
//         if (!modal) return;

//         modal.innerHTML = `
//             <div class="modal-content">
//                 <div class="modal-header">
//                     <h3>${this.app.escapeHtml(place.name)}</h3>
//                     <span class="close" onclick="app.ui.closeModal('place-details-modal')">&times;</span>
//                 </div>
//                 <div class="place-details-content">
//                     <div class="place-image-large">
//                         <i class="fas fa-chair"></i>
//                     </div>
//                     <div class="place-info-detailed">
//                         <p><strong>Описание:</strong> ${this.app.escapeHtml(place.description || 'Описание отсутствует')}</p>
//                         <p><strong>Вместимость:</strong> До ${place.capacity} человек</p>
//                         <p><strong>Цена:</strong> ${place.pricePerHour}₽ за час</p>
//                         <p><strong>Особенности:</strong> ${place.features ? place.features.join(', ') : 'Нет'}</p>
//                     </div>
//                 </div>
//                 <div class="modal-actions">
//                     <button class="btn btn-primary" onclick="app.places.bookPlace(${place.id})">
//                         <i class="fas fa-calendar-plus"></i> Забронировать
//                     </button>
//                 </div>
//             </div>
//         `;
//         this.app.showModal('place-details-modal');
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
