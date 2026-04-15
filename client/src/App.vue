<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Manajemen Buku (Vue + Express + Sequelize)</h2>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h5 class="card-title">{{ isEdit ? 'Edit Buku' : 'Tambah Buku Baru' }}</h5>
        <div class="row g-3">
          <div class="col-md-5">
            <input 
              v-model="form.title" 
              type="text" 
              class="form-control" 
              placeholder="Judul Buku"
            >
          </div>
          <div class="col-md-4">
            <input 
              v-model="form.author" 
              type="text" 
              class="form-control" 
              placeholder="Penulis"
            >
          </div>
          <div class="col-md-3">
            <button v-if="!isEdit" @click="createBook" class="btn btn-primary w-100">Simpan</button>
            <div v-else class="d-flex gap-2">
              <button @click="updateBook" class="btn btn-success w-100">Update</button>
              <button @click="cancelEdit" class="btn btn-secondary w-100">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover table-bordered bg-white">
        <thead class="table-dark">
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Penulis</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in books" :key="book.id">
            <td>{{ index + 1 }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td class="text-center">
              <button @click="editBook(book)" class="btn btn-warning btn-sm me-2">Edit</button>
              <button @click="deleteBook(book.id)" class="btn btn-danger btn-sm">Hapus</button>
            </td>
          </tr>
          <tr v-if="books.length === 0">
            <td colspan="4" class="text-center text-muted">Data kosong.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const books = ref([]);
const form = ref({ id: null, title: '', author: '' });
const isEdit = ref(false);

const API_URL = 'http://localhost:3000/books';

const fetchBooks = async () => {
  try {
    const response = await axios.get(API_URL);
    books.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
};

const createBook = async () => {
  if (!form.value.title || !form.value.author) return alert("Isi semua kolom!");
  try {
    await axios.post(API_URL, {
      title: form.value.title,
      author: form.value.author
    });
    resetForm();
    fetchBooks();
  } catch (error) {
    console.error("Gagal menambah buku:", error);
  }
};

const editBook = (book) => {
  isEdit.value = true;
  form.value = { ...book }; 
};

const updateBook = async () => {
  try {
    await axios.put(`${API_URL}/${form.value.id}`, {
      title: form.value.title,
      author: form.value.author
    });
    cancelEdit();
    fetchBooks();
  } catch (error) {
    console.error("Gagal mengupdate buku:", error);
  }
};

const deleteBook = async (id) => {
  if (confirm("Yakin ingin menghapus buku ini?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Gagal menghapus buku:", error);
    }
  }
};

const resetForm = () => {
  form.value = { id: null, title: '', author: '' };
};

const cancelEdit = () => {
  isEdit.value = false;
  resetForm();
};

onMounted(fetchBooks);
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>