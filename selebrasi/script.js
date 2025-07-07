function showErrorPopup(message) {
    document.getElementById("errorMessage").textContent = message;
    document.getElementById("errorPopup").style.display = "block";
}

function closeErrorPopup() {
    document.getElementById("errorPopup").style.display = "none";
}

function showSuccessPopup(link) {
    document.getElementById("waLink").innerHTML = `<a href="${link}" target="_blank">(WAJIB) Klik Untuk Masuk Grup WhatsApp</a>`;
    document.getElementById("successPopup").style.display = "block";
}

function closeSuccessPopup() {
    document.getElementById("successPopup").style.display = "none";
    location.reload();
}

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}

let selectedProducts = {};
let isDiscountApplied = false;
let appliedReferralCode = null;
let discountPercentage = 0;

document.addEventListener("DOMContentLoaded", function () {
    const submitCard = document.getElementById("submitCard");
    const checkReferralBtn = document.getElementById('checkReferralBtn');
    if (checkReferralBtn) {
        checkReferralBtn.addEventListener('click', checkReferralCode);
    }
    submitCard.addEventListener("click", async function () {
            const nama = document.getElementById("namaInput").value.trim();
            const nomor = document.getElementById("nomorInput").value.trim();
            const fakultas = document.getElementById("fakultas").value;
            const domisili = document.getElementById("domisiliInput").value.trim();
            const instagram = document.getElementById("instagramInput").value.trim();
            const produkCheckboxes = document.querySelectorAll("input[name='produk']:checked");
            const buktiBayarFile = document.getElementById("buktiBayarInput").files[0];
            // HAPUS BARIS INI -> const referral = document.getElementById("referralInput").value.trim();

            const produkDipilih = Object.entries(selectedProducts).map(([nama, detail]) => ({
                nama,
                jumlah: detail.quantity,
            }));  

            if (!nama) {
                showErrorPopup("Harap isi nama Anda.");
                return;
            }
            else if (!nomor) {
                showErrorPopup("Harap isi nomor Anda.");
                return;
            }
            else if (!fakultas) {
                showErrorPopup("Harap isi fakultas Anda.");
                return;
            }
            else if (!domisili) {
                showErrorPopup("Harap isi domisili Anda.");
                return;
            }
            else if (produkDipilih.length === 0) {
                showErrorPopup("Harap pilih minimal satu produk.");
                return;
            }
            else if (!buktiBayarFile) {
                showErrorPopup("Harap unggah bukti pembayaran Anda.");
                return;
            }

            try {
                showLoading();
                const buktiBayarURL = await uploadToImgBB(buktiBayarFile);
                if (!buktiBayarURL) throw new Error("Gagal mengunggah gambar!");

                const orderRef = window.doc(window.db, "BakulPionirBatch2", nama + "_" + Date.now());
                await window.setDoc(orderRef, {
                    nama,
                    nomor,
                    fakultas,
                    domisili,
                    instagram: instagram,
                    produk: produkDipilih,
                    buktiPembayaran: buktiBayarURL,
                    // GANTI `kodeReferral: referral` DENGAN BARIS DI BAWAH INI
                    kodeReferral: appliedReferralCode, 
                    timestamp: window.serverTimestamp()
                });
                hideLoading();
                showSuccessPopup("https://chat.whatsapp.com/G1WXDNLlPV09JvHrwlfFNS");
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
document.addEventListener('DOMContentLoaded', function () {

    // --- Fungsionalitas untuk Collapsible Payment ---
    const collapsibles = document.querySelectorAll(".collapsible");

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.padding = "0 18px"; // Kembali ke padding 0 saat ditutup
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.padding = "15px 18px"; // Tambahkan padding saat dibuka
            }
        });
    });

    // --- Fungsionalitas untuk Indikator Upload File ---
    const fileInput = document.getElementById('buktiBayarInput');
    const fileLabel = document.getElementById('fileLabel');
    const fileLabelText = fileLabel.querySelector('.text');
    const fileLabelIcon = fileLabel.querySelector('.icon');

    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            // File dipilih
            fileLabelText.textContent = `File Terpilih: ${this.files[0].name}`;
            fileLabelIcon.innerHTML = '✅'; // Ganti ikon menjadi centang
            fileLabel.classList.add('file-chosen');
        } else {
            // Tidak ada file yang dipilih (atau dibatalkan)
            fileLabelText.textContent = 'Pilih file kamu :D';
            fileLabelIcon.innerHTML = '📥'; // Kembalikan ikon semula
            fileLabel.classList.remove('file-chosen');
        }
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");

    let colors = [
        { bg: "#e0ebff", text: "#4e4ebe" }
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
            ? 0 + Math.random() * 0 
            : 0 + Math.random() * 0; // Left diatur biar geser dikit 

        let randomRotate = 0 + Math.random() * 0;
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
        let textbox = card.querySelector(".deskripsi-singkat")
        if (textbox) {
            textbox.style.backgroundColor = selectedColor.text;
        }
        let selectDropdown = card.querySelector(".select-dropdown")
        if (selectDropdown) {
            selectDropdown.style.backgroundColor = selectedColor.text;
        }
        // let cardes = card.querySelectorAll(".carde");
        // cardes.forEach(carde => {
        //     carde.style.backgroundColor = selectedColor.text;
        // });
        
        // let cardeTexts = card.querySelectorAll(".carde-text");
        // cardeTexts.forEach(text => {
        //     text.style.color = selectedColor.bg;
        // });
        
    });

    

    // Tambahin jarak bawah setelah kartu terakhir
    const spacer = document.getElementById("spacer");
    spacer.style.marginTop = "50px";
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".carde").forEach(card => {
        card.addEventListener("click", function(e) {
            // Hindari klik pada elemen input (biar gak double toggle)
            if (e.target.tagName.toLowerCase() === "input") return;

            const checkbox = this.querySelector("input[type='checkbox']");
            if (checkbox) {
                checkbox.click(); // Ini akan trigger event 'change'
            }
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

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - Invoice script starting");
    
    // Define products with their prices
    const products = {
        "Bundle Sultan Sejati": 85000,
        "Bundle Paket Lengkap": 60000,
        "Bundle Stylish": 75000,
        "Bundle Eksekutif Pionir" : 40000,
        "Bundle Starter" : 45000,
        "Bundle Pejuang Hemat" : 35000,
        "Caping Warna" : 30000,
        "Caping Polos" : 27000,
        "Lanyard" : 22000,
        "Dasi" : 17000,
        "Totebag" : 45000,
        "Sticker" : 8000
    };
    
    // Initialize selected products object to track selections

    // Get all product checkboxes
    const bundleSultan = document.getElementById('bundleSultan');
    const bundleLengkap = document.getElementById('bundleLengkap');
    const bundleStylish = document.getElementById('bundleStylish');
    const bundleEksekutif = document.getElementById('bundleEksekutifPionir');
    const bundleStarter = document.getElementById('bundleStarter');
    const bundlePejuangHemat = document.getElementById('bundlePejuangHemat');
    const caping = document.getElementById('caping');
    const capingPolos = document.getElementById('capingPolos');
    const lanyard = document.getElementById('lanyard');
    const dasi = document.getElementById('dasi');
    const totebag = document.getElementById('totebag');
    const sticker = document.getElementById('sticker');

    
    console.log("Checkboxes found:", bundleSultan, bundleLengkap, bundleStylish, bundleEksekutifPionir);
    
    // Add event listeners to checkboxes
    if (bundleSultan) {
        bundleSultan.addEventListener('change', function() {
            console.log("Sultan checkbox changed:", this.checked);
            handleProductSelection("Bundle Sultan Sejati", this.checked);
        });
    }
    
    if (bundleLengkap) {
        bundleLengkap.addEventListener('change', function() {
            console.log("Lengkap checkbox changed:", this.checked);
            handleProductSelection("Bundle Paket Lengkap", this.checked);
        });
    }
    
    if (bundleStylish) {
        bundleStylish.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Bundle Stylish", this.checked);
        });
    }
    
    if (bundleEksekutif) {
        bundleEksekutif.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Bundle Eksekutif Pionir", this.checked);
        });
    }
    if (bundleStarter) {
        bundleStarter.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Bundle Starter", this.checked);
        });
    }
    if (bundlePejuangHemat) {
        bundlePejuangHemat.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Bundle Pejuang Hemat", this.checked);
        });
    }
    if (caping) {
        caping.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Caping Warna", this.checked);
        });
    }
    if (capingPolos) {
        capingPolos.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Caping Polos", this.checked);
        });
    }
    if (lanyard) {
        lanyard.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Lanyard", this.checked);
        });
    }
    if (dasi) {
        dasi.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Dasi", this.checked);
        });
    }
    if (totebag) {
        totebag.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Totebag", this.checked);
        });
    }
    if (sticker) {
        sticker.addEventListener('change', function() {
            console.log("Stylish checkbox changed:", this.checked);
            handleProductSelection("Sticker", this.checked);
        });
    }
    
    // Handle product selection/deselection
    function handleProductSelection(productName, isChecked) {
        console.log(`Handling product selection: ${productName}, checked: ${isChecked}`);
        
        if (isChecked) {
            // Add product to selected products
            selectedProducts[productName] = {
                quantity: 1,
                price: products[productName]
            };
        } else {
            // Remove product from selected products
            delete selectedProducts[productName];
        }
        
        // Update invoice
        updateInvoice();
    }
    

    
    // Helper function to format price as Rupiah
    function formatRupiah(number) {
        return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Initial invoice setup
    updateInvoice();
    
    console.log("Invoice script setup complete");
});

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll('.card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;

            if (entry.isIntersecting) {
                el.classList.add('visible');
                observer.unobserve(el); // unobserve biar animasi cuma sekali
            }
        });
    }, {
        threshold: 0.01
    });

    cards.forEach(card => {
        observer.observe(card);
    });
});

// Letakkan kode ini di dalam salah satu event listener DOMContentLoaded yang sudah ada
document.addEventListener("DOMContentLoaded", function () {
    
    // ... (kode observer dan lainnya yang sudah ada di file Anda) ...
    
    // PANGGIL FUNGSI UNTUK MEMBUAT PARTIKEL BUNGA
    createFlowerParticles();
});


// INI ADALAH FUNGSI BARU UNTUK MEMBUAT PARTIKEL BUNGA
function createFlowerParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    const particleCount = 20;
    const positions = []; // Untuk menyimpan posisi bunga yang sudah ada

    for (let i = 0; i < particleCount; i++) {
        const flower = document.createElement('img');
        flower.src = 'bunga.png';
        flower.classList.add('particle-flower');

        // Ukuran acak (antara 20px hingga 60px)
        const size = Math.random() * 40 + 20;
        flower.style.width = `${size}px`;
        flower.style.height = `${size}px`;

        let left, top;
        let attempts = 0;
        let isOverlapping;

        // Coba cari posisi yang tidak menumpuk maksimal 50 kali percobaan
        do {
            left = Math.random() * 100;
            top = 100 - Math.random() * 70;
            isOverlapping = positions.some(pos => {
                const dx = Math.abs(pos.left - left);
                const dy = Math.abs(pos.top - top);
                return dx < 6 && dy < 10; // minimal jarak dalam vw/vh
            });
            attempts++;
        } while (isOverlapping && attempts < 50);

        // Simpan posisi yang sudah aman
        positions.push({ left, top });

        // Set posisi
        flower.style.left = `${left}vw`;
        flower.style.top = `${top}vh`;

        // Durasi dan delay animasi acak
        const duration = Math.random() * 10 + 5;
        flower.style.animationDuration = `${duration}s`;
        const delay = Math.random() * 5;
        flower.style.animationDelay = `${delay}s`;

        container.appendChild(flower);
    }
}
/* ADD THIS TO THE END OF YOUR script.js FILE */

document.addEventListener("DOMContentLoaded", function () {
    // Select all product checkboxes
    const productCheckboxes = document.querySelectorAll(".carde input[type='checkbox']");

    productCheckboxes.forEach(checkbox => {
        // Listen for changes (checked or unchecked)
        checkbox.addEventListener('change', function() {
            // Find the closest parent '.carde' element
            const parentCarde = this.closest('.carde');

            if (parentCarde) {
                // Toggle the '.selected' class on the parent card
                // based on whether the checkbox is currently checked.
                // If this.checked is true, it adds the class.
                // If this.checked is false, it removes the class.
                parentCarde.classList.toggle('selected', this.checked);
            }
        });
    });
});

/* TAMBAHKAN KODE INI DI AKHIR FILE script.js ANDA */

document.addEventListener('DOMContentLoaded', function() {
    // Ambil semua elemen gambar di dalam halaman
    const semuaGambar = document.querySelectorAll('img');

    // Lakukan perulangan untuk setiap gambar
    semuaGambar.forEach(function(gambar) {
        // Tambahkan event listener untuk 'contextmenu' (event klik kanan)
        gambar.addEventListener('contextmenu', function(e) {
            // Mencegah aksi default (yaitu menampilkan menu klik kanan)
            e.preventDefault();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const checkReferralBtn = document.getElementById('checkReferralBtn');
    if(checkReferralBtn) {
        checkReferralBtn.addEventListener('click', checkReferralCode);
    }
});

// ==========================================================
// === SALIN SEMUA KODE DI DALAM BLOK INI UNTUK FITUR REFERRAL ===
// ==========================================================

/**
 * Memperbarui tampilan invoice/ringkasan pesanan.
 * Fungsi ini sekarang global dan bisa diakses dari mana saja.
 */
function updateInvoice() {
    const invoiceItemsDiv = document.getElementById('invoiceItems');
    const totalBayarSpan = document.getElementById('totalBayar');

    if (!invoiceItemsDiv || !totalBayarSpan) {
        console.error("Elemen invoice tidak ditemukan!");
        return;
    }

    invoiceItemsDiv.innerHTML = '';
    if (Object.keys(selectedProducts).length === 0) {
        invoiceItemsDiv.innerHTML = '<p class="isi-card" style="color: black; text-align: center; padding: 20px 0;">Belum ada produk yang dipilih</p>';
        totalBayarSpan.textContent = '0';
        return;
    }

    const table = document.createElement('table');
    table.className = 'invoice-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Produk', 'Kuantitas', 'Harga'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    let subtotal = 0;

    for (const [productName, details] of Object.entries(selectedProducts)) {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = productName;
        row.appendChild(nameCell);

        const quantityCell = document.createElement('td');
        const quantitySelect = document.createElement('select');
        quantitySelect.className = 'quantity-dropdown';
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === details.quantity) option.selected = true;
            quantitySelect.appendChild(option);
        }
        quantitySelect.dataset.product = productName;
        quantitySelect.addEventListener('change', function() {
            if (selectedProducts[this.dataset.product]) {
                selectedProducts[this.dataset.product].quantity = parseInt(this.value);
                updateInvoice();
            }
        });
        quantityCell.appendChild(quantitySelect);
        row.appendChild(quantityCell);

        const priceCell = document.createElement('td');
        const itemTotal = details.price * details.quantity;
        priceCell.textContent = 'Rp ' + itemTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        priceCell.className = 'price-cell';
        row.appendChild(priceCell);
        
        subtotal += itemTotal;
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    const tfoot = document.createElement('tfoot');
    let finalTotal = subtotal;

    // If discount is applied, add the dynamic discount row
    if (isDiscountApplied && subtotal > 0) {
        const discountAmount = subtotal * (discountPercentage / 100);
        finalTotal = subtotal - discountAmount;
        
        const discountRow = tfoot.insertRow();
        discountRow.className = 'invoice-discount-row';
        const discountLabelCell = discountRow.insertCell();
        discountLabelCell.colSpan = 2;
        discountLabelCell.textContent = `Diskon Referral (${discountPercentage}%)`;
        
        const discountValueCell = discountRow.insertCell();
        discountValueCell.className = 'price-cell';
        discountValueCell.textContent = `- Rp ${discountAmount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    }
    
    table.appendChild(tfoot);
    invoiceItemsDiv.appendChild(table);

    totalBayarSpan.textContent = finalTotal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


/**
 * Memverifikasi kode referral ke Firebase.
 */
async function checkReferralCode() {
    const referralInput = document.getElementById('referralInput');
    const code = referralInput.value.trim().toUpperCase();
    const statusEl = document.getElementById('referralStatus');
    const checkBtn = document.getElementById('checkReferralBtn');

    if (!code) {
        statusEl.textContent = "Kolom kode referral tidak boleh kosong.";
        statusEl.className = 'error';
        return;
    }

    showLoading();
    try {
        // Handle special "BKL" codes first
        if (code.startsWith("BKL") && code.length >= 5) {
            const potentialDiscount = parseInt(code.substring(3, 5), 10);

            // Check if the characters after BKL are valid numbers
            if (!isNaN(potentialDiscount) && potentialDiscount > 0) {
                const referralQuery = window.query(
                    window.collection(window.db, "KodeReferral"),
                    window.where("Kode referralnya", "==", code),
                    window.where("TelahDigunakan", "==", false) // Ensure the code has not been used
                );
                const querySnapshot = await window.getDocs(referralQuery);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0]; // Get the first (and only) document
                    isDiscountApplied = true;
                    appliedReferralCode = code;
                    discountPercentage = potentialDiscount;

                    // Mark the code as used in Firestore
                    const docRef = window.doc(window.db, "KodeReferral", doc.id);
                    await window.updateDoc(docRef, {
                        TelahDigunakan: true
                    });

                    statusEl.textContent = `Kode valid! Diskon ${discountPercentage}% telah diterapkan.`;
                    statusEl.className = 'success';
                    referralInput.disabled = true;
                    checkBtn.disabled = true;

                } else {
                    statusEl.textContent = "Kode BKL tidak valid atau sudah pernah digunakan.";
                    statusEl.className = 'error';
                }
            } else {
                 statusEl.textContent = "Format kode BKL tidak valid.";
                 statusEl.className = 'error';
            }

        // Fallback to the original logic for other codes
        } else {
            const referralQuery = window.collection(window.db, "KodeReferral");
            const querySnapshot = await window.getDocs(referralQuery);
            let codeIsValid = false;

            querySnapshot.forEach((doc) => {
                if (doc.data()["Kode referralnya"] && doc.data()["Kode referralnya"].toUpperCase() === code) {
                    codeIsValid = true;
                }
            });

            if (codeIsValid) {
                isDiscountApplied = true;
                appliedReferralCode = code;
                discountPercentage = 5; // Default 5% for old codes
                statusEl.textContent = "Kode valid! Diskon 5% telah diterapkan.";
                statusEl.className = 'success';
                referralInput.disabled = true;
                checkBtn.disabled = true;
            } else {
                statusEl.textContent = "Kode referral tidak valid atau tidak ditemukan.";
                statusEl.className = 'error';
            }
        }
        
        updateInvoice();

    } catch (error) {
        console.error("Error checking referral code: ", error);
        statusEl.textContent = "Gagal memverifikasi kode. Periksa koneksi Anda.";
        statusEl.className = 'error';
    } finally {
        hideLoading();
    }
}

// ==========================================================
// === AKHIR DARI BLOK KODE REFERRAL ==========================
// ==========================================================