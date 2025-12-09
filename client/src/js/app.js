// class KuroBarApp {
//     constructor() {
//         this.apiBase = '/api';
//         this.currentSection = 'home';
//         this.currentUser = null;
//         this.init();
//     }

//     init() {
//         this.setupEventListeners();
//         this.loadInitialData();
//         this.showSection('home');
//     }

//     setupEventListeners() {
//         document.querySelectorAll('.nav-link').forEach(link => {
//             link.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const section = link.dataset.section;
//                 this.showSection(section);
//             });
//         });

//         document.addEventListener('click', (e) => {
//             if (e.target.classList.contains('modal')) {
//                 this.ui.closeModal(e.target.id);
//             }
//         });

//         document.addEventListener('keydown', (e) => {
//             if (e.key === 'Escape') {
//                 document.querySelectorAll('.modal').forEach(modal => {
//                     if (modal.style.display === 'block') {
//                         this.ui.closeModal(modal.id);
//                     }
//                 });
//             }
//         });
//     }

//     showSection(sectionName) {
//         document.querySelectorAll('.section').forEach(section => {
//             section.classList.remove('active');
//         });

//         document.querySelectorAll('.nav-link').forEach(link => {
//             link.classList.remove('active');
//         });

//         const targetSection = document.getElementById(`${sectionName}-section`);
//         if (targetSection) {
//             targetSection.classList.add('active');
//         }

//         const targetLink = document.querySelector(`[data-section="${sectionName}"]`);
//         if (targetLink) {
//             targetLink.classList.add('active');
//         }

//         this.currentSection = sectionName;
//         this.loadSectionData(sectionName);
//     }

//     loadSectionData(sectionName) {
//         switch (sectionName) {
//             case 'profile':
//                 this.profile.loadProfile();
//                 break;
//             case 'booking':
//                 this.booking.loadBookings();
//                 break;
//             case 'places':
//                 this.places.loadPlaces();
//                 break;
//             case 'api':
//                 this.loadApiDocs();
//                 break;
//         }
//     }

//     async loadInitialData() {
//         try {
//             const response = await this.api.request('/health');
//             if (response.status === 'ok') {
//                 this.ui.showNotification('Kuro Bar API доступен', 'success');
//             }
//         } catch (error) {
//             this.ui.showNotification('Ошибка подключения к Kuro Bar API', 'error');
//         }
//     }

//     loadApiDocs() {
//     }

//     showModal(modalId) {
//         this.ui.showModal(modalId);
//     }

//     closeModal(modalId) {
//         this.ui.closeModal(modalId);
//     }

//     showNotification(message, type = 'info') {
//         this.ui.showNotification(message, type);
//     }

//     escapeHtml(text) {
//         return this.ui.escapeHtml(text);
//     }

//     formatDate(dateString) {
//         return this.ui.formatDate(dateString);
//     }
// }
