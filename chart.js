let chartKelas = null;

function tampilkanChartKelas(dataRekap) {
  const ctx = document.getElementById("chartKelas").getContext("2d");
  
  // Sort data by kelas name
  const sortedEntries = Object.entries(dataRekap).sort((a, b) => a[0].localeCompare(b[0]));
  
  const labels = sortedEntries.map(([kelas]) => kelas);
  const data = sortedEntries.map(([, total]) => total);
  
  // Hapus chart lama jika ada
  if (chartKelas) {
    chartKelas.destroy();
  }
  
  // Buat chart baru
  chartKelas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Pembayaran per Kelas',
        data: data,
        backgroundColor: '#4361ee',
        borderColor: '#3a0ca3',
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Rp${context.raw.toLocaleString('id-ID')}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'Rp' + value.toLocaleString('id-ID');
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}