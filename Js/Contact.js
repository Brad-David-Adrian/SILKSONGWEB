class SumbmittedContact {
    constructor(name, email, message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }
};
    validate() ;{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.name || this.name.trim() === '') {
            return { valid: false, error: 'Name is required.' };
        }
        if (!this.email || !emailRegex.test(this.email)) {
            return { valid: false, error: 'A valid email is required.' };
        }
        if (!this.message || this.message.trim() === '') {
            return { valid: false, error: 'Message cannot be empty.' };
        }
        return { valid: true };
    };

    toJSON();{
        return {
            name: this.name,
            email: this.email,
            message: this.message
        };
    };

class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();

        const name = this.form.elements['name'].value;
        const email = this.form.elements['email'].value;
        const message = this.form.elements['message'].value;

        const contact = new SumbmittedContact(name, email, message);
        const validation = contact.validate();

        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact.toJSON())
            });

            if (response.ok) {
                alert('Message sent successfully!');
                this.form.reset();
            } else {
                alert('Failed to send message. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('An error occurred. Please try again later.');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('contactForm');
});