// একাউন্ট টাইপ পরিবর্তন হ্যান্ডলার
document.getElementById("accountType").addEventListener("change", function () {
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

// পেমেন্ট ফর্ম সাবমিশন হ্যান্ডলার
document.getElementById("paymentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const chatId = document.getElementById("chatId").value;
    const accountType = document.getElementById("accountType").value;
    const friendType = document.getElementById("friendType").value;
    const tofaCook = document.getElementById("tofaCook").value;
    const accountDate = document.getElementById("accountDate").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const paymentNumber = document.getElementById("paymentNumber").value;

    // ভ্যালিডেশন চেক
    if (paymentMethod === "Binance") {
        if (!/^\d{6,11}$/.test(paymentNumber)) {
            alert("Binance ID অবশ্যই ৬ থেকে ১১ সংখ্যার মধ্যে হতে হবে।");
            return;
        }
    } else if (paymentMethod === "Payeer") {
        if (!/^P\d{7,11}$/.test(paymentNumber)) {
            alert("Payeer ID অবশ্যই বড় হাতের P দিয়ে শুরু হতে হবে এবং ৮ থেকে ১২ সংখ্যার মধ্যে হতে হবে।");
            return;
        }
    }

    const botToken = "8069445943:AAGN3UX_B2oc8tgeofdu6kdexjRVC2Srsvo";
    const chatIdForBot = "-1002314597186";

    const message = `
        পেমেন্ট রিকুয়েস্ট:
        - Chat ID: ${chatId}
        - Account Type: ${accountType}
        - Friend Type: ${friendType}
        - 2FA-Cook: ${tofaCook}
        - Account Date: ${accountDate}
        - Payment Method: ${paymentMethod}
        - Payment Number: ${paymentNumber}
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatIdForBot}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then((response) => {
            if (response.ok) {
                const paymentMethod = document.getElementById("paymentMethod").value.toLowerCase();
                let successPage = "success.html";
                
                if (paymentMethod.includes("bkash")) {
                    successPage = "payment-request-page/bkash.html";
                } else if (paymentMethod.includes("binance")) {
                    successPage = "payment-request-page/binance.html";
                } else if (paymentMethod.includes("nagad")) {
                    successPage = "payment-request-page/nagad.html";
                } else if (paymentMethod.includes("rocket")) {
                    successPage = "payment-request-page/rocket.html";
                } else if (paymentMethod.includes("payeer")) {
                    successPage = "payment-request-page/payeer.html";
                }
                
                window.location.href = successPage;
            } else {
                alert("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("সার্ভার সমস্যার জন্য অনুরোধ পাঠানো যায়নি।");
        });
});

// পেমেন্ট মেথড পরিবর্তন হ্যান্ডলার
document.getElementById("paymentMethod").addEventListener("change", function () {
    const paymentMethod = this.value;
    const paymentNumberLabel = document.querySelector('label[for="paymentNumber"]');
    const paymentNumberInput = document.getElementById("paymentNumber");

    if (paymentMethod === "Binance") {
        paymentNumberLabel.textContent = "Binance ID:";
        paymentNumberInput.pattern = "\\d{6,11}";
        paymentNumberInput.placeholder = "idxxxxxxxx";
    } else if (paymentMethod === "Payeer") {
        paymentNumberLabel.textContent = "Payeer ID:";
        paymentNumberInput.pattern = "P\\d{7,11}";
        paymentNumberInput.placeholder = "Pxxxxxxxxxx";
    } else if (paymentMethod === "Rocket") {
        paymentNumberLabel.textContent = "Payment Number:";
        paymentNumberInput.pattern = "01[0-9]{9,10}";
        paymentNumberInput.placeholder = "01xxxxxxxx";
    } else {
        paymentNumberLabel.textContent = "Payment Number:";
        paymentNumberInput.pattern = "01[0-9]{9}";
        paymentNumberInput.placeholder = "01xxxxxxxx";
    }
});
