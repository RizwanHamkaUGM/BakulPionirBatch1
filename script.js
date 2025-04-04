function showErrorPopup(message) {
    document.getElementById("errorMessage").textContent = message;
    document.getElementById("errorPopup").style.display = "block";
}

function closeErrorPopup() {
    document.getElementById("errorPopup").style.display = "none";
}

function showSuccessPopup(link) {
    document.getElementById("waLink").innerHTML = `<a href="${link}" target="_blank">Masuk Grup WhatsApp</a>`;
    document.getElementById("successPopup").style.display = "block";
}

function closeSuccessPopup() {
    document.getElementById("successPopup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const submitCard = document.getElementById("submitCard");

    submitCard.addEventListener("click", async function () {
        const nama = document.getElementById("namaInput").value.trim();
        const nomor = document.getElementById("nomorInput").value.trim();
        const fakultas = document.getElementById("fakultas").value;
        const domisili = document.getElementById("domisiliInput").value.trim();
        const produkCheckboxes = document.querySelectorAll("input[name='produk']:checked");
        const buktiBayarFile = document.getElementById("buktiBayarInput").files[0];

        // Ambil produk yang dipilih
        const produkDipilih = Array.from(produkCheckboxes).map(checkbox => checkbox.value);

        // Validasi input tidak boleh kosong
        if (!nama || !nomor || !fakultas || !domisili || produkDipilih.length === 0 || !buktiBayarFile) {
            showErrorPopup("Harap isi semua data dan unggah bukti pembayaran.");
            return;
        }

        try {
            // Upload gambar ke ImgBB
            const buktiBayarURL = await uploadToImgBB(buktiBayarFile);
            if (!buktiBayarURL) throw new Error("Gagal mengunggah gambar!");

            // Simpan data pesanan di Firestore
            const orderRef = window.doc(window.db, "orders", nama + "_" + Date.now());
            await window.setDoc(orderRef, {
                nama,
                nomor,
                fakultas,
                domisili,
                produk: produkDipilih,
                buktiPembayaran: buktiBayarURL,
                timestamp: window.serverTimestamp()
            });

            showSuccessPopup("https://chat.whatsapp.com/HiVQu0FtPKe50p4IaWnoln");
            // Reset form setelah berhasil dikirim
            document.getElementById("namaInput").value = "";
            document.getElementById("nomorInput").value = "";
            document.getElementById("fakultas").value = "";
            document.getElementById("domisiliInput").value = "";
            document.getElementById("buktiBayarInput").value = "";
            produkCheckboxes.forEach(checkbox => (checkbox.checked = false));
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            alert("Gagal mengirim pesanan. Silakan coba lagi.");
        }
    });

    async function uploadToImgBB(file) {
        const apiKey = "37d116ae15604008c48ca23ecd80123a"; // Ganti dengan API Key dari ImgBB
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            return data.success ? data.data.url : null;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");

    let colors = [
        { bg: "#b18850", text: "#f9e81e" },
        { bg: "#0295ff", text: "#8ce2f3" },
        { bg: "#47edbd", text: "#0f4e4d" },
        { bg: "#bbc41d", text: "#147931" },
        { bg: "#e42f90", text: "#ffb9fb" },
        { bg: "#ccb4f0", text: "#644fac" }
    ];

    let colorIndex = 0;

    function shuffleColors() {
        for (let i = colors.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
        }
    }

    shuffleColors();

    cards.forEach((card, index) => {
        let randomLeft = window.innerWidth <= 430 
            ? -5 + Math.random() * 20 
            : -40 + Math.random() * 80; // Left diatur biar geser dikit 

        let randomRotate = -1.2 + Math.random() * 2.4;
        let selectedColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;

        card.style.marginTop = index === 0 ? "15px" : "35px"; // Jarak antar kartu biar ga numpuk
        card.style.marginLeft = `${randomLeft}px`;
        card.style.backgroundColor = selectedColor.bg;
        card.style.transform = `rotate(${randomRotate}deg)`;

        let title = card.querySelector(".judul-card");
        if (title) {
            title.style.color = selectedColor.text;
        }
    });

    // Tambahin jarak bawah setelah kartu terakhir
    const spacer = document.getElementById("spacer");
    spacer.style.marginTop = "50px";
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".carde").forEach(card => {
        card.addEventListener("click", function() {
            let checkbox = this.querySelector("input[type='checkbox']");
            checkbox.checked = !checkbox.checked;
            this.classList.toggle("selected", checkbox.checked);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    for (let i = 0; i < 3; i++) { // Ulang background secara dinamis
        let bg = document.createElement("div");
        bg.classList.add("parallax-bg");
        bg.style.top = `${i * 100}%`; // Mengatur posisi agar terlihat menyambung
        document.body.appendChild(bg);
    }
    window.addEventListener("scroll", function () {
        let bg = document.querySelector(".parallax-bg");
        let scrollY = window.scrollY;
        bg.style.transform = `translateY(${-scrollY * 0.3}px)`; // Perbaiki arah gerakan
    });
    
});
