// class ProfileManager {
//     constructor(app) {
//         this.app = app;
//         this.api = app.api;
//     }

//     async loadProfile() {
//         try {
//             const response = await this.api.getProfile();
//             this.renderProfile(response);
//         } catch (error) {
//             this.app.showNotification('Ошибка загрузки профиля', 'error');
//             console.error('Error loading profile:', error);
//         }
//     }

//     renderProfile(profile) {
//         const container = document.getElementById('profile-content');
//         if (!container) return;

//         container.innerHTML = `
//             <div class="profile-card">
//                 <div class="profile-header">
//                     <div class="profile-avatar">
//                         <i class="fas fa-user"></i>
//                     </div>
//                     <div class="profile-info">
//                         <h2>${this.app.escapeHtml(profile.name || 'Гость')}</h2>
//                         <p><i class="fas fa-envelope"></i> ${this.app.escapeHtml(profile.email || 'Не указан')}</p>
//                         <p><i class="fas fa-phone"></i> ${this.app.escapeHtml(profile.phone || 'Не указан')}</p>
//                     </div>
//                 </div>
//                 <div class="profile-stats">
//                     <div class="stat-item">
//                         <span class="stat-number">${profile.totalBookings || 0}</span>
//                         <span class="stat-label">Всего бронирований</span>
//                     </div>
//                     <div class="stat-item">
//                         <span class="stat-number">${profile.activeBookings || 0}</span>
//                         <span class="stat-label">Активных бронирований</span>
//                     </div>
//                     <div class="stat-item">
//                         <span class="stat-number">${profile.totalSpent || 0}₽</span>
//                         <span class="stat-label">Потрачено в баре</span>
//                     </div>
//                 </div>
//                 <div class="profile-actions">
//                     <button class="btn btn-primary" onclick="app.profile.editProfile()">
//                         <i class="fas fa-edit"></i> Редактировать профиль
//                     </button>
//                     <button class="btn btn-secondary" onclick="app.profile.logout()">
//                         <i class="fas fa-sign-out-alt"></i> Выйти
//                     </button>
//                 </div>
//             </div>
//         `;
//     }

//     async updateProfile(profileData) {
//         try {
//             const response = await this.api.updateProfile(profileData);
//             this.app.showNotification('Профиль успешно обновлен', 'success');
//             this.app.closeModal('profile-modal');
//             this.loadProfile();
//             return response;
//         } catch (error) {
//             this.app.showNotification('Ошибка обновления профиля', 'error');
//             throw error;
//         }
//     }

//     async editProfile() {
//         this.app.showModal('profile-modal');
//     }

//     async logout() {
//         if (confirm('Вы уверены, что хотите выйти?')) {
//             this.app.currentUser = null;
//             this.app.showNotification('Вы вышли из системы', 'info');
//             this.app.showSection('home');
//         }
//     }
// }
