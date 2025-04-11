document.getElementById("accountType").addEventListener("change", function () { const accountType = this.value.toLowerCase(); const cookie2fa = document.getElementById("tofaCook"); const fdType = document.getElementById("friendType");

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

document.getElementById("paymentForm").addEventListener("submit", function (e) { e.preventDefault();

const chatId = document.getElementById("chatId").value;
const accountType = document.getElementById("accountType").value;
const friendType = document.getElementById("friendType").value;
const tofaCook = document.getElementById("tofaCook").value;
const accountDate = document.getElementById("accountDate").value;
const paymentMethod = document.getElementById("paymentMethod").value;
const paymentNumber = document.getElementById("paymentNumber").value;

if (paymentMethod === "Binance") {
    if (paymentNumber.length < 6 || paymentNumber.length > 11) {
        alert("Binance ID অবশ্যই ৬ থেকে ১১ সংখ্যার মধ্যে হতে হবে।");
        return;
    }
} else if (paymentMethod === "Payeer") {
    if (!paymentNumber.startsWith("P") || paymentNumber.length < 8 || paymentNumber.length > 11) {
        alert("Payeer ID অবশ্যই বড় হাতের P দিয়ে শুরু হতে হবে এবং ৮ থেকে ১১ সংখ্যার মধ্যে হতে হবে।");
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
            window.location.href = "success.html";
        } else {
            alert("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("সার্ভার সমস্যার জন্য অনুরোধ পাঠানো যায়নি।");
    });

});

document.getElementById("paymentMethod").addEventListener("change", function () { const paymentMethod = this.value; const paymentNumberLabel = document.querySelector('label[for="paymentNumber"]');

if (paymentMethod === "Binance") {
    paymentNumberLabel.textContent = "Binance ID:";
    document.getElementById("paymentNumber").pattern = "\\d{6,10}";
} else if (paymentMethod === "Payeer") {
    paymentNumberLabel.textContent = "Payeer ID:";
    document.getElementById("paymentNumber").pattern = "P\\d{7,10}";
} else if (paymentMethod === "Rocket") {
    paymentNumberLabel.textContent = "Payment Number:";
    document.getElementById("paymentNumber").pattern = "01[0-9]{9,10}";
} else {
    paymentNumberLabel.textContent = "Payment Number:";
    document.getElementById("paymentNumber").pattern = "01[0-9]{9}";
}

});

const accountSelect = document.getElementById("paymentMethod"); const inputBox = document.getElementById("paymentNumber");

accountSelect.addEventListener("change", function() { const selectedAccount = accountSelect.value;

if (selectedAccount === "Payeer") { inputBox.placeholder = "Pxxxxxxxxxx"; } else if (selectedAccount === "Binance") { inputBox.placeholder = "idxxxxxxxx"; } else { inputBox.placeholder = "01xxxxxxxx"; } });
