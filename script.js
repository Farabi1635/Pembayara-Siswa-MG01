let dataPembayaran = JSON.parse(localStorage.getItem("pembayaran")) || [];

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Fungsi untuk menyimpan data ke localStorage
function simpanKeLocal() {
  localStorage.setItem("pembayaran", JSON.stringify(dataPembayaran));
}

// Fungsi untuk menambahkan pembayaran baru
function tambahPembayaran(event) {
  event.preventDefault();
  
  const nama = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value.trim();
  const triwulan = document.getElementById("triwulan").value;
  const jumlah = parseInt(document.getElementById("jumlah").value.trim());
  
  // Validasi input
  if (!nama || !kelas || !triwulan || !jumlah) {
    showNotification('Semua field harus diisi!', 'danger');
    return;
  }
  
  if (jumlah < 1000) {
    showNotification('Jumlah pembayaran minimal Rp1.000', 'danger');
    return;
  }
  
  // Cek duplikasi pembayaran
  const sudahAda = dataPembayaran.some(
    (item) => item.nama.toLowerCase() === nama.toLowerCase() && 
              item.kelas.toLowerCase() === kelas.toLowerCase() && 
              item.triwulan === triwulan
  );
  
  if (sudahAda) {
    showNotification('Siswa sudah membayar triwulan ini!', 'danger');
    return;
  }
  
  // Tambahkan pembayaran baru
  const pembayaran = { 
    nama, 
    kelas, 
    triwulan, 
    jumlah,
    tanggal: new Date().toISOString()
  };
  
  dataPembayaran.push(pembayaran);
  simpanKeLocal();
  tampilkanData();
  document.getElementById("formPembayaran").reset();
  
  showNotification('Pembayaran berhasil disimpan!');
}

// Fungsi untuk menampilkan semua data
function tampilkanData() {
  const tbody = document.querySelector("#tabelData tbody");
  tbody.innerHTML = "";
  
  let total = 0;
  
  if (dataPembayaran.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 20px;">
        <i class="fas fa-info-circle" style="color: #666; margin-right: 5px;"></i>
        Tidak ada data pembayaran
      </td>
    `;
    tbody.appendChild(row);
  } else {
    dataPembayaran.forEach((item, index) => {
      total += item.jumlah;
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.nama}</td>
        <td>${item.kelas}</td>
        <td>Triwulan ${item.triwulan}</td>
        <td>Rp${item.jumlah.toLocaleString('id-ID')}</td>
        <td>
          <button class="btn btn-sm btn-success" onclick="cetakBukti(${index})">
            <i class="fas fa-print"></i> Cetak
          </button>
          <button class="btn btn-sm btn-danger" onclick="hapusData(${index})">
            <i class="fas fa-trash-alt"></i> Hapus
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  document.getElementById("totalPembayaran").innerText = `Rp${total.toLocaleString('id-ID')}`;
  tampilkanRekapKelas();
}

// Fungsi untuk menghapus data
function hapusData(index) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    dataPembayaran.splice(index, 1);
    simpanKeLocal();
    tampilkanData();
    showNotification('Data berhasil dihapus!');
  }
}

// Fungsi untuk mencetak bukti pembayaran
function cetakBukti(index) {
  const data = dataPembayaran[index];
  const printArea = document.getElementById("printArea");
  
  const formattedDate = new Date(data.tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  printArea.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4361ee;">BUKTI PEMBAYARAN SPP</h2>
        <p style="color: #666;">SMP MANGUN JAYA 01</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <table style="width: 100%;">
          <tr>
            <td style="width: 40%; padding: 5px 0;">Nama Siswa</td>
            <td style="width: 60%; padding: 5px 0;"><strong>${data.nama}</strong></td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Kelas</td>
            <td style="padding: 5px 0;"><strong>${data.kelas}</strong></td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Triwulan</td>
            <td style="padding: 5px 0;"><strong>Triwulan ${data.triwulan}</strong></td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Jumlah Bayar</td>
            <td style="padding: 5px 0;"><strong>Rp${data.jumlah.toLocaleString('id-ID')}</strong></td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Tanggal Pembayaran</td>
            <td style="padding: 5px 0;"><strong>${formattedDate}</strong></td>
          </tr>
        </table>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-top: 50px;">
        <div style="text-align: center;">
          <p style="border-top: 1px solid #333; width: 200px; padding-top: 5px;">
            Orang Tua/Wali
          </p>
        </div>
        <div style="text-align: center;">
          <p style="border-top: 1px solid #333; width: 200px; padding-top: 5px;">
            Petugas
          </p>
        </div>
      </div>
    </div>
  `;
  
  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>Bukti Pembayaran - ${data.nama}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          @media print {
            @page { size: auto; margin: 0mm; }
          }
        </style>
      </head>
      <body onload="window.print();">
        ${printArea.innerHTML}
      </body>
    </html>
  `);
  win.document.close();
}

// Fungsi untuk menampilkan rekap per kelas
function tampilkanRekapKelas() {
  const rekap = {};
  
  // Hitung total per kelas
  dataPembayaran.forEach(item => {
    if (!rekap[item.kelas]) {
      rekap[item.kelas] = 0;
    }
    rekap[item.kelas] += item.jumlah;
  });
  
  // Tampilkan di tabel
  const tabel = document.getElementById("rekapKelas");
  tabel.innerHTML = `
    <thead>
      <tr>
        <th>Kelas</th>
        <th>Total Pembayaran</th>
        <th>Jumlah Siswa</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(rekap).map(([kelas, total]) => {
        const jumlahSiswa = dataPembayaran.filter(item => item.kelas === kelas).length;
        return `
          <tr>
            <td>${kelas}</td>
            <td>Rp${total.toLocaleString('id-ID')}</td>
            <td>${jumlahSiswa} siswa</td>
          </tr>
        `;
      }).join("")}
    </tbody>
  `;
  
  // Update chart
  tampilkanChartKelas(rekap);
}

// Fungsi untuk export ke Excel
function exportExcel() {
  if (dataPembayaran.length === 0) {
    showNotification('Tidak ada data untuk diexport!', 'danger');
    return;
  }
  
  // Format data untuk Excel
  const data = dataPembayaran.map((item, index) => ({
    No: index + 1,
    Nama: item.nama,
    Kelas: item.kelas,
    Triwulan: `Triwulan ${item.triwulan}`,
    "Jumlah Bayar": item.jumlah,
    "Tanggal Pembayaran": new Date(item.tanggal).toLocaleDateString('id-ID')
  }));
  
  // Tambahkan total
  const total = dataPembayaran.reduce((sum, item) => sum + item.jumlah, 0);
  data.push({
    No: '',
    Nama: '',
    Kelas: '',
    Triwulan: 'TOTAL',
    "Jumlah Bayar": total
  });
  
  // Buat worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Buat workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Pembayaran");
  
  // Export ke Excel
  XLSX.writeFile(workbook, `Rekap_Pembayaran_${new Date().toISOString().slice(0,10)}.xlsx`);
  showNotification('Data berhasil diexport ke Excel!');
}

// Fungsi untuk backup data
function backupData() {
  if (dataPembayaran.length === 0) {
    showNotification('Tidak ada data untuk dibackup!', 'danger');
    return;
  }
  
  const dataStr = JSON.stringify(dataPembayaran, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_pembayaran_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification('Backup data berhasil dibuat!');
}

// Fungsi untuk restore data
function restoreData() {
  const fileInput = document.getElementById("fileRestore");
  const file = fileInput.files[0];
  
  if (!file) {
    showNotification('Pilih file backup terlebih dahulu!', 'danger');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const json = JSON.parse(e.target.result);
      
      if (!Array.isArray(json)) {
        throw new Error("Format data tidak valid");
      }
      
      if (confirm(`Anda akan mengimpor ${json.length} data pembayaran. Lanjutkan?`)) {
        dataPembayaran = json;
        simpanKeLocal();
        tampilkanData();
        showNotification(`Berhasil mengimpor ${json.length} data pembayaran!`);
      }
    } catch (err) {
      showNotification('Gagal membaca file. Pastikan file backup valid.', 'danger');
      }
  };
  
  reader.onerror = function() {
    showNotification('Gagal membaca file.', 'danger');
  };
  
  reader.readAsText(file);
  fileInput.value = ''; // Reset input file
}

// Fungsi untuk menghapus semua data
function clearAllData() {
  if (dataPembayaran.length === 0) {
    showNotification('Tidak ada data untuk dihapus!', 'danger');
    return;
  }
  
  if (confirm('Apakah Anda yakin ingin menghapus SEMUA data pembayaran? Aksi ini tidak dapat dibatalkan!')) {
    dataPembayaran = [];
    simpanKeLocal();
    tampilkanData();
    showNotification('Semua data berhasil dihapus!', 'warning');
  }
}

// Inisialisasi aplikasi
document.getElementById("formPembayaran").addEventListener("submit", tambahPembayaran);
document.addEventListener("DOMContentLoaded", tampilkanData);