// class KuroBarApi {
//     constructor(app) {
//         this.app = app;
//         this.apiBase = '/api';
//     }

//     async request(endpoint, options = {}) {
//         const url = `${this.apiBase}${endpoint}`;
//         const defaultOptions = {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         };

//         const config = { ...defaultOptions, ...options };

//         try {
//             const response = await fetch(url, config);
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error('API request failed:', error);
//             throw error;
//         }
//     }

//     async getProfile() {
//         return await this.request('/profile');
//     }

//     async updateProfile(userData) {
//         return await this.request('/profile', {
//             method: 'PUT',
//             body: JSON.stringify(userData)
//         });
//     }

//     async login(credentials) {
//         return await this.request('/auth', {
//             method: 'POST',
//             body: JSON.stringify(credentials)
//         });
//     }

//     async register(userData) {
//         return await this.request('/register', {
//             method: 'POST',
//             body: JSON.stringify(userData)
//         });
//     }

//     async getPlaces() {
//         return await this.request('/places');
//     }

//     async getPlace(placeId) {
//         return await this.request(`/places/${placeId}`);
//     }

//     async getBookings() {
//         return await this.request('/bookings');
//     }

//     async createBooking(bookingData) {
//         return await this.request('/bookings', {
//             method: 'POST',
//             body: JSON.stringify(bookingData)
//         });
//     }

//     async updateBooking(bookingId, bookingData) {
//         return await this.request(`/bookings/${bookingId}`, {
//             method: 'PUT',
//             body: JSON.stringify(bookingData)
//         });
//     }

//     async cancelBooking(bookingId) {
//         return await this.request(`/bookings/${bookingId}`, {
//             method: 'DELETE'
//         });
//     }

//     async checkAvailability(placeId, date, time) {
//         return await this.request(`/places/${placeId}/availability?date=${date}&time=${time}`);
//     }

//     async checkHealth() {
//         return await this.request('/health');
//     }
// }
