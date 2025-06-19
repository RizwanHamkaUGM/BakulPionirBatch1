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
}

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}

let selectedProducts = {};
    

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
        const produkDipilih = Object.entries(selectedProducts).map(([nama, detail]) => ({
            nama,
            jumlah: detail.quantity,
        }));  
        

        // Validasi input tidak boleh kosong
        if (!nama || !nomor || !fakultas || !domisili || produkDipilih.length === 0 || !buktiBayarFile) {
            showErrorPopup("Harap isi semua data dan unggah bukti pembayaran.");
            return;
        }

        try {
            showLoading();
            // Upload gambar ke ImgBB
            const buktiBayarURL = await uploadToImgBB(buktiBayarFile);
            if (!buktiBayarURL) throw new Error("Gagal mengunggah gambar!");

            // Simpan data pesanan di Firestore
            const orderRef = window.doc(window.db, "BakulPionirBatch2", nama + "_" + Date.now());
            await window.setDoc(orderRef, {
                nama,
                nomor,
                fakultas,
                domisili,
                produk: produkDipilih,
                buktiPembayaran: buktiBayarURL,
                timestamp: window.serverTimestamp()
            });
            hideLoading();
            showSuccessPopup("https://chat.whatsapp.com/G1WXDNLlPV09JvHrwlfFNS");
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
        let cardes = card.querySelectorAll(".carde");
        cardes.forEach(carde => {
            carde.style.backgroundColor = selectedColor.text;
        });
        
        let cardeTexts = card.querySelectorAll(".carde-text");
        cardeTexts.forEach(text => {
            text.style.color = selectedColor.bg;
        });
        
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
    
    // Function to update the invoice
    function updateInvoice() {
        console.log("Updating invoice, selected products:", selectedProducts);
        
        const invoiceItemsDiv = document.getElementById('invoiceItems');
        const totalBayarSpan = document.getElementById('totalBayar');
        
        if (!invoiceItemsDiv || !totalBayarSpan) {
            console.error("Invoice elements not found!");
            return;
        }
        
        // Clear current invoice items
        invoiceItemsDiv.innerHTML = '';
        
        if (Object.keys(selectedProducts).length === 0) {
            // If no products selected, show message
            invoiceItemsDiv.innerHTML = '<p class="isi-card" style="color: black;">Belum ada produk yang dipilih</p>';
            totalBayarSpan.textContent = '0';
            return;
        }
        
        // Create table for invoice
        const table = document.createElement('table');
        table.className = 'invoice-table';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['Produk', 'Kuantitas', 'Harga'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add each product to the invoice table
        let totalPrice = 0;
        
        // Use a try-catch block to handle any potential errors
        try {
            for (const [productName, details] of Object.entries(selectedProducts)) {
                const row = document.createElement('tr');
                
                // Product name cell
                const nameCell = document.createElement('td');
                nameCell.textContent = productName;
                row.appendChild(nameCell);
                
                // Quantity cell with dropdown
                const quantityCell = document.createElement('td');
                const quantitySelect = document.createElement('select');
                quantitySelect.className = 'quantity-dropdown';
                
                // Add options 1-10
                for (let i = 1; i <= 10; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    if (i === details.quantity) {
                        option.selected = true;
                    }
                    quantitySelect.appendChild(option);
                }
                
                // Add event listener to quantity dropdown
                quantitySelect.dataset.product = productName; // Store product name in dataset
                quantitySelect.addEventListener('change', function() {
                    const prodName = this.dataset.product;
                    console.log(`Quantity changed for ${prodName} to ${this.value}`);
                    if (selectedProducts[prodName]) {
                        selectedProducts[prodName].quantity = parseInt(this.value);
                        updateInvoice();
                    }
                });
                
                quantityCell.appendChild(quantitySelect);
                row.appendChild(quantityCell);
                
                // Price cell
                const priceCell = document.createElement('td');
                const itemTotal = details.price * details.quantity;
                priceCell.textContent = formatRupiah(itemTotal);
                priceCell.className = 'price-cell';
                row.appendChild(priceCell);
                
                // Add to total
                totalPrice += itemTotal;
                
                tbody.appendChild(row);
            }
        } catch (err) {
            console.error("Error in invoice update:", err);
            invoiceItemsDiv.innerHTML = '<p class="isi-card">Terjadi kesalahan saat memperbarui invoice</p>';
        }
        
        table.appendChild(tbody);
        invoiceItemsDiv.appendChild(table);
        
        // Update total price - ensure we have a valid number
        totalBayarSpan.textContent = formatRupiah(totalPrice || 0).replace('Rp ', '');
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

