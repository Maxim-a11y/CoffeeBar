// class UIManager {
//     constructor(app) {
//         this.app = app;
//     }

//     showModal(modalId) {
//         const modal = document.getElementById(modalId);
//         if (modal) {
//             modal.style.display = 'block';
//             document.body.style.overflow = 'hidden';
//         }
//     }

//     closeModal(modalId) {
//         const modal = document.getElementById(modalId);
//         if (modal) {
//             modal.style.display = 'none';
//             document.body.style.overflow = 'auto';
            
//             const form = modal.querySelector('form');
//             if (form) {
//                 form.reset();
//             }
//         }
//     }

//     showNotification(message, type = 'info') {
//         const container = document.getElementById('notifications');
//         const notification = document.createElement('div');
//         notification.className = `notification ${type}`;
//         notification.innerHTML = `
//             <div style="display: flex; align-items: center; gap: 0.5rem;">
//                 <i class="fas fa-${this.getNotificationIcon(type)}"></i>
//                 <span>${this.escapeHtml(message)}</span>
//             </div>
//         `;

//         container.appendChild(notification);

//         setTimeout(() => {
//             if (notification.parentNode) {
//                 notification.parentNode.removeChild(notification);
//             }
//         }, 5000);
//     }

//     getNotificationIcon(type) {
//         const icons = {
//             success: 'check-circle',
//             error: 'exclamation-circle',
//             warning: 'exclamation-triangle',
//             info: 'info-circle'
//         };
//         return icons[type] || 'info-circle';
//     }

//     escapeHtml(text) {
//         const div = document.createElement('div');
//         div.textContent = text;
//         return div.innerHTML;
//     }

//     formatDate(dateString) {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('ru-RU', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     }
// }
