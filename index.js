let port = 3000;

const getApiBase = () => `http://localhost:${port}/api/v1/notes`;

document.addEventListener("DOMContentLoaded", () => {
  const inputPort = prompt(
    'Masukkan port Back-End\nPort default: 3000'
  );

  if (inputPort && inputPort.trim() !== "") {
    port = inputPort.trim();
  }

  getNotes();
});

const formulir = document.querySelector("#user-form");

formulir.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Tetap menggunakan ID selector lama sesuai HTML kamu
  const elemenName = document.querySelector("#name");
  const elemenEmail = document.querySelector("#email");

  const judul = elemenName.value.trim();
  const isi = elemenEmail.value.trim();
  const id = elemenName.dataset.id || "";

  if (!judul || !isi) return;

  try {
    if (id === "") {
      // Create Note
      await axios.post(getApiBase(), { judul, isi });
    } else {
      // Update Note
      await axios.put(`${getApiBase()}/${id}`, { judul, isi });
    }

    elemenName.dataset.id = "";
    elemenName.value = "";
    elemenEmail.value = "";

    getNotes();
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
});

async function getNotes() {
  try {
    const response = await axios.get(getApiBase());
    // Struktur response Sequelize: response.data.data
    const notes = response.data?.data || [];

    const table = document.querySelector("#table-user");
    let tampilan = "";
    let no = 1;

    for (const note of notes) {
      tampilan += tampilkanNote(no, note);
      no++;
    }

    table.innerHTML = tampilan;
    hapusNote();
    editNote();
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
}

function tampilkanNote(no, note) {
  return `
    <tr>
      <td>${no}</td>
      <td class="name">${note.judul ?? "-"}</td>
      <td class="email">${note.isi ?? "-"}</td>
      <td><button data-id="${note.id}" class="btn-edit" type="button">Edit</button></td>
      <td><button data-id="${note.id}" class="btn-hapus" type="button">Hapus</button></td>
    </tr>
  `;
}

function hapusNote() {
  const tombolHapus = document.querySelectorAll(".btn-hapus");

  tombolHapus.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Hapus catatan ini?")) return;

      try {
        await axios.delete(`${getApiBase()}/${id}`);
        getNotes();
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    });
  });
}

function editNote() {
  const tombolEdit = document.querySelectorAll(".btn-edit");

  tombolEdit.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const row = btn.closest("tr");
      const judul = row.querySelector(".name").innerText;
      const isi = row.querySelector(".email").innerText;

      const elemenName = document.querySelector("#name");
      const elemenEmail = document.querySelector("#email");

      elemenName.dataset.id = id;
      elemenName.value = judul;
      elemenEmail.value = isi;
    });
  });
}