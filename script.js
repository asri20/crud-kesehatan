// =====================
// DATA MANAGEMENT
// =====================
let patients = JSON.parse(localStorage.getItem('patients')) || [];
let editId = null;

function saveToStorage() {
    localStorage.setItem('patients', JSON.stringify(patients));
}

function generateId() {
    return Date.now().toString();
}

// =====================
// RENDER TABLE
// =====================
function renderTable(data = patients) {
    const tbody = document.getElementById('table-body');
    const total = document.getElementById('total-pasien');

    total.textContent = `Total: ${data.length} pasien`;

    if (data.length === 0) {
        tbody.innerHTML = `<tr id="empty-row"><td colspan="7" class="empty">Belum ada data pasien</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((p, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${p.nama}</td>
            <td>${p.umur} tahun</td>
            <td>${p.jenis_kelamin}</td>
            <td>${p.diagnosa}</td>
            <td>${formatDate(p.tanggal)}</td>
            <td>
                <button class="btn-edit" onclick="editPatient('${p.id}')">✏️ Edit</button>
                <button class="btn-delete" onclick="deletePatient('${p.id}')">🗑️ Hapus</button>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

// =====================
// CREATE & UPDATE
// =====================
document.getElementById('patient-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        nama: document.getElementById('nama').value.trim(),
        umur: document.getElementById('umur').value,
        jenis_kelamin: document.getElementById('jenis_kelamin').value,
        diagnosa: document.getElementById('diagnosa').value.trim(),
        tanggal: document.getElementById('tanggal').value,
    };

    if (editId) {
        // UPDATE
        const idx = patients.findIndex(p => p.id === editId);
        patients[idx] = { ...patients[idx], ...data };
        showToast('✅ Data pasien berhasil diperbarui!');
        editId = null;
    } else {
        // CREATE
        data.id = generateId();
        patients.push(data);
        showToast('✅ Data pasien berhasil ditambahkan!');
    }

    saveToStorage();
    renderTable();
    resetForm();
});

// =====================
// EDIT
// =====================
function editPatient(id) {
    const p = patients.find(p => p.id === id);
    if (!p) return;

    editId = id;
    document.getElementById('nama').value = p.nama;
    document.getElementById('umur').value = p.umur;
    document.getElementById('jenis_kelamin').value = p.jenis_kelamin;
    document.getElementById('diagnosa').value = p.diagnosa;
    document.getElementById('tanggal').value = p.tanggal;

    document.getElementById('form-title').textContent = '✏️ Edit Data Pasien';
    document.getElementById('submit-btn').textContent = '💾 Update';
    document.getElementById('cancel-btn').style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================
// DELETE
// =====================
function deletePatient(id) {
    if (!confirm('Yakin ingin menghapus data pasien ini?')) return;
    patients = patients.filter(p => p.id !== id);
    saveToStorage();
    renderTable();
    showToast('🗑️ Data pasien berhasil dihapus!');
}

// =====================
// RESET FORM
// =====================
function resetForm() {
    document.getElementById('patient-form').reset();
    editId = null;
    document.getElementById('form-title').textContent = '➕ Tambah Data Pasien';
    document.getElementById('submit-btn').textContent = '💾 Simpan';
    document.getElementById('cancel-btn').style.display = 'none';
}

// =====================
// SEARCH
// =====================
document.getElementById('search').addEventListener('input', function() {
    const keyword = this.value.toLowerCase();
    const filtered = patients.filter(p =>
        p.nama.toLowerCase().includes(keyword) ||
        p.diagnosa.toLowerCase().includes(keyword)
    );
    renderTable(filtered);
});

// =====================
// TOAST NOTIFICATION
// =====================
function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Init
renderTable();