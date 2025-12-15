export const patterns = {
    name: /^[А-Яа-яA-Za-z\s]{2,30}$/,
    phone: /^[\+]?375[\s\-]?[\(]?(29|33|44|25)[\)]?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
    email: /^[a-zA-Z0-9._%+-]+@(gmail\.com|yandex\.ru|mail\.ru)$/
};

export const showError = (input) => {
    input.classList.add('_error');
};

export const removeError = (input) => {
    input.classList.remove('_error');
};

export const initReservationValidation = () => {
    const form = document.querySelector('.reservation__form');

    if (form) {
        form.addEventListener('submit', (event) => {
            let isFormValid = true;

            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');

            removeError(firstNameInput);
            removeError(lastNameInput);
            removeError(phoneInput);
            removeError(emailInput);

            if (!patterns.name.test(firstNameInput.value.trim())) {
                showError(firstNameInput);
                isFormValid = false;
            }

            if (!patterns.name.test(lastNameInput.value.trim())) {
                showError(lastNameInput);
                isFormValid = false;
            }

            if (!patterns.phone.test(phoneInput.value.trim())) {
                showError(phoneInput);
                isFormValid = false;
            }

            if (!patterns.email.test(emailInput.value.trim())) {
                showError(emailInput);
                isFormValid = false;
            }

            if (!isFormValid) {
                event.preventDefault();
            }
        });
    }
};