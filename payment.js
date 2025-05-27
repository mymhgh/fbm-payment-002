// পেমেন্ট মেথড কনফিগারেশন
const paymentMethods = {
    Bkash: { name: "Bkash", pattern: "^01[0-9]{9}$", placeholder: "01XXXXXXXXX", label: "Bkash Number" },
    Nagad: { name: "Nagad", pattern: "^01[0-9]{9,10}$", placeholder: "01XXXXXXXXX", label: "Nagad Number" },
    Rocket: { name: "Rocket", pattern: "^01[0-9]{9}$", placeholder: "01XXXXXXXXX", label: "Rocket Number" },
    Binance: { name: "Binance", pattern: "^\\d{6,11}$", placeholder: "ID1042457700", label: "Binance ID" }
};

let savedPayments = [];

// সুন্দর ছোট অ্যালার্ট ফাংশন
function showAlert(icon, title, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '300px',
        padding: '0.5rem',
        customClass: {
            popup: 'mini-alert-popup',
            title: 'mini-alert-title',
            icon: 'mini-alert-icon'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icon,
        title: title,
        text: message
    })
}

// DOM কন্টেন্ট লোড হওয়ার পর
document.addEventListener('DOMContentLoaded', function() {
    // একাউন্ট টাইপ পরিবর্তন হ্যান্ডলার
    document.getElementById("accountType").addEventListener("change", function() {
        const accountType = this.value.toLowerCase();
        const tofaCook = document.getElementById("tofaCook");
        const friendType = document.getElementById("friendType");

        if (["gmail", "instagram"].includes(accountType)) {
            friendType.disabled = true;
            friendType.required = false;
            tofaCook.disabled = true;
            tofaCook.required = false;
            friendType.value = "";
            tofaCook.value = "";
        } else {
            friendType.disabled = false;
            friendType.required = true;
            tofaCook.disabled = false;
            tofaCook.required = true;
        }
    });

    // পেমেন্ট মেথড সিলেক্ট চেঞ্জ হ্যান্ডলার
    document.getElementById('paymentMethodSelect').addEventListener('change', function() {
        const method = this.value;
        const input = document.getElementById('paymentNumberInput');
        
        if (paymentMethods[method]) {
            input.placeholder = paymentMethods[method].placeholder;
            input.setAttribute('data-method', method);
        } else {
            input.placeholder = "Enter payment number";
            input.removeAttribute('data-method');
        }
    });

    // অ্যাড পেমেন্ট বাটন ক্লিক হ্যান্ডলার
    document.getElementById('addPaymentBtn').addEventListener('click', function() {
        const methodSelect = document.getElementById('paymentMethodSelect');
        const numberInput = document.getElementById('paymentNumberInput');
        
        const method = methodSelect.value;
        const number = numberInput.value.trim();

        // ভ্যালিডেশন
        if (!method) {
            showAlert('error', 'Required', 'Please select payment method');
            return;
        }

        if (!number) {
            showAlert('error', 'Required', 'Please enter payment number');
            return;
        }

        const regex = new RegExp(paymentMethods[method].pattern);
        if (!regex.test(number)) {
            showAlert('warning', 'Invalid', `Please enter valid ${paymentMethods[method].label}`);
            return;
        }

        // পেমেন্ট লিস্টে যোগ
        savedPayments.push({
            method: paymentMethods[method].name,
            number: number
        });

        // UI আপডেট
        renderSavedPayments();
        
        // ইনপুট রিসেট
        methodSelect.value = "";
        numberInput.value = "";
    });

    // ফর্ম সাবমিশন হ্যান্ডলার
    document.getElementById("paymentForm").addEventListener("submit", function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
});

// সেভ করা পেমেন্ট দেখানো
function renderSavedPayments() {
    const container = document.getElementById('savedPayments');
    container.innerHTML = '';
    
    if (savedPayments.length === 0) {
        container.innerHTML = '<div class="no-payments">No payment methods added yet</div>';
        return;
    }

    savedPayments.forEach((payment, index) => {
        const paymentEl = document.createElement('div');
        paymentEl.className = 'saved-item';
        paymentEl.innerHTML = `
            <span>${payment.method}: <strong>${payment.number}</strong></span>
            <button class="delete-btn" data-index="${index}" title="Delete">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(paymentEl);
    });

    // ডিলিট বাটন ইভেন্ট
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            savedPayments.splice(index, 1);
            renderSavedPayments();
            showAlert('success', 'Removed', 'Payment method deleted');
        });
    });
}

// ফর্ম সাবমিশন হ্যান্ডলার
function handleFormSubmission() {
    if (savedPayments.length === 0) {
        showAlert('error', 'Required', 'Please add at least one payment method');
        return;
    }

    const formData = {
        chatId: document.getElementById("chatId").value,
        accountType: document.getElementById("accountType").value,
        friendType: document.getElementById("friendType").value,
        tofaCook: document.getElementById("tofaCook").value,
        accountDate: document.getElementById("accountDate").value,
        payments: savedPayments
    };

    // টেলিগ্রাম মেসেজ ফরম্যাট
    const message = `
        Payment Request:
        - User ID: ${formData.chatId}
        - Account Type: ${formData.accountType}
        - Friend Type: ${formData.friendType}
        - 2FA-Cook: ${formData.tofaCook}
        - Work Date: ${formData.accountDate}
        - Payment Methods:
        ${formData.payments.map(p => `• ${p.method}: ${p.number}`).join('\n')}
    `;

    const botToken = "8069445943:AAGN3UX_B2oc8tgeofdu6kdexjRVC2Srsvo";
    const chatIdForBot = "-1002314597186";
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatIdForBot}&text=${encodeURIComponent(message)}`;

   fetch(url)
        .then(response => {
            if (response.ok) {
                // মাল্টিপল পেমেন্ট মেথডের ক্ষেত্রে multiple.html পেজে রিডাইরেক্ট
                if (savedPayments.length > 1) {
                    window.location.href = "payment-request-page/multiple.html";
                } 
                // একক পেমেন্ট মেথডের ক্ষেত্রে আগের মতো
                else {
                    const primaryMethod = savedPayments[0].method.toLowerCase();
                    let successPage = "success.html";
                    
                    if (primaryMethod.includes("bkash")) successPage = "payment-request-page/bkash.html";
                    else if (primaryMethod.includes("binance")) successPage = "payment-request-page/binance.html";
                    else if (primaryMethod.includes("nagad")) successPage = "payment-request-page/nagad.html";
                    else if (primaryMethod.includes("rocket")) successPage = "payment-request-page/rocket.html";
                    
                    window.location.href = successPage;
                }
            } else {
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showAlert('error', 'Server Error', 'Failed to send request due to server error.');
        });
                                                    }
