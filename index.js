
const API_URL = "http://136.116.226.198:3000/api/v1/notes";

document.addEventListener("DOMContentLoaded", () => {

  getNotes();
});

const formulir = document.querySelector("#user-form");

formulir.addEventListener("submit", async (e) => {
  e.preventDefault();

  const elemenName = document.querySelector("#name");
  const elemenEmail = document.querySelector("#email");

  const judul = elemenName.value.trim();
  const isi = elemenEmail.value.trim();
  const id = elemenName.dataset.id || "";

  if (!judul || !isi) return;

  try {
    if (id === "") {
      // Create Note - Menggunakan API_URL yang sudah didefinisikan
      await axios.post(API_URL, { judul, isi });
    } else {
      // Update Note
      await axios.put(`${API_URL}/${id}`, { judul, isi });
    }

    // Reset Form
    elemenName.dataset.id = "";
    elemenName.value = "";
    elemenEmail.value = "";

    getNotes(); // Refresh tabel
  } catch (error) {
    console.error("Gagal simpan:", error.response?.data || error.message);
    alert("Gagal menyambung ke Backend. Pastikan Firewall Port 3000 sudah dibuka!");
  }
});

async function getNotes() {
  try {
    const response = await axios.get(API_URL);
    const notes = response.data?.data || [];

    const table = document.querySelector("#table-user");
    let tampilan = "";
    let no = 1;

    notes.forEach(note => {
      tampilan += `
                <tr>
                    <td>${no++}</td>
                    <td class="name">${note.judul ?? "-"}</td>
                    <td class="email">${note.isi ?? "-"}</td>
                    <td><button data-id="${note.id}" class="btn-edit" type="button">Edit</button></td>
                    <td><button data-id="${note.id}" class="btn-hapus" type="button">Hapus</button></td>
                </tr>`;
    });

    table.innerHTML = tampilan;

    // Pasang ulang event listener setelah tabel dirender
    inisialisasiTombol();
  } catch (error) {
    console.error("Gagal ambil data:", error.message);
  }
}

function inisialisasiTombol() {
  // Event Hapus
  document.querySelectorAll(".btn-hapus").forEach((btn) => {
    btn.onclick = async () => {
      if (!confirm("Hapus catatan ini?")) return;
      try {
        await axios.delete(`${API_URL}/${btn.dataset.id}`);
        getNotes();
      } catch (error) { console.error(error); }
    };
  });

  // Event Edit
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.onclick = () => {
      const row = btn.closest("tr");
      const elemenName = document.querySelector("#name");
      const elemenEmail = document.querySelector("#email");

      elemenName.dataset.id = btn.dataset.id;
      elemenName.value = row.querySelector(".name").innerText;
      elemenEmail.value = row.querySelector(".email").innerText;
    };
  });
}