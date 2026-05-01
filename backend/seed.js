import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js'; 
import Entry from './models/Entry.js'; 

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const otnielUser = { username: 'otniel', email: 'otniel@gmail.com', password: 'Rein4th4n_*zkhiel' };
const otherUsers = [
  { username: 'BudiSetiawan', email: 'budi@gmail.com', password: 'Password123!' },
  { username: 'SitiAisyah', email: 'siti@gmail.com', password: 'Password123!' },
  { username: 'RudiHartono', email: 'rudi@gmail.com', password: 'Password123!' },
  { username: 'DewiLestari', email: 'dewi@gmail.com', password: 'Password123!' },
  { username: 'AndiWijaya', email: 'andi@gmail.com', password: 'Password123!' },
  { username: 'AgusPratama', email: 'agus@gmail.com', password: 'Password123!' },
  { username: 'NinaSafitri', email: 'nina@gmail.com', password: 'Password123!' },
  { username: 'EkoPurnomo', email: 'eko@gmail.com', password: 'Password123!' },
  { username: 'DianKartika', email: 'dian@gmail.com', password: 'Password123!' },
  { username: 'HeriSusanto', email: 'heri@gmail.com', password: 'Password123!' }
];

const users = [otnielUser, ...otherUsers];

const subCategories = ['Ungkapan', 'Deskripsi', 'Point', 'Narasi'];
const templates = ['Folio', 'Point-point'];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Entry.deleteMany({});
    console.log('Cleared existing database.');

    const hashedUsers = await Promise.all(users.map(async u => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));

    const savedUsers = await User.insertMany(hashedUsers);
    
    let entries = [];

    const otnielData = savedUsers.find(u => u.username === 'otniel');

    entries.push({ user: otnielData._id, type: 'ToDo', title: 'Proyek Skripsi', todos: [{ text: 'Bab 1', isCompleted: true }, { text: 'Bab 2', isCompleted: false }] });
    entries.push({ user: otnielData._id, type: 'ToDo', title: 'Belanja Mingguan', todos: [{ text: 'Beras', isCompleted: false }, { text: 'Telur', isCompleted: true }] });
    entries.push({ user: otnielData._id, type: 'ToDo', title: 'Rencana Liburan', todos: [{ text: 'Pesan Tiket', isCompleted: false }, { text: 'Pesan Hotel', isCompleted: false }] });
    entries.push({ user: otnielData._id, type: 'ToDo', title: 'Tugas Kuliah', todos: [{ text: 'Makalah Etika', isCompleted: false }] });

    entries.push({ user: otnielData._id, type: 'Diary', title: 'Masa Lalu', content: 'Hari ini saya teringat masa lalu.', subCategory: 'Ungkapan', isPublic: true, template: 'Folio' });
    entries.push({ user: otnielData._id, type: 'Diary', title: 'Pemikiran Pribadi', content: 'Terkadang saya merasa dunia ini bergerak terlalu cepat.', subCategory: 'Deskripsi', isPublic: false, template: 'Folio' });
    entries.push({ user: otnielData._id, type: 'Diary', title: 'Hari yang Cerah', content: 'Cuaca hari ini sangat bagus untuk bersepeda.', subCategory: 'Narasi', isPublic: true, template: 'Folio' });
    entries.push({ user: otnielData._id, type: 'Diary', title: 'Rencana Rahasia', content: 'Saya ingin memulai bisnis kecil-kecilan.', subCategory: 'Point', isPublic: false, template: 'Point-point' });

    const today = new Date();
    const d3 = new Date(today); d3.setDate(d3.getDate() + 3);
    const d7 = new Date(today); d7.setDate(d7.getDate() + 7);
    const d25 = new Date(today); d25.setDate(d25.getDate() + 25);
    const d35 = new Date(today); d35.setDate(d35.getDate() + 35);
    const d45 = new Date(today); d45.setDate(d45.getDate() + 45);

    entries.push({ user: otnielData._id, type: 'DueDate', title: 'Pembayaran Tagihan', calendarDate: d3.toISOString(), activity: 'Bayar Listrik', remindMeIn: '1 days' });
    entries.push({ user: otnielData._id, type: 'DueDate', title: 'Ujian Akhir', calendarDate: d7.toISOString(), activity: 'Ujian SBD', remindMeIn: '3 days' });
    entries.push({ user: otnielData._id, type: 'DueDate', title: 'Deadline Proyek', calendarDate: d25.toISOString(), activity: 'Website Launch', remindMeIn: '30 days before' });
    entries.push({ user: otnielData._id, type: 'DueDate', title: 'Ke Dokter Gigi', calendarDate: d35.toISOString(), activity: 'Pemeriksaan Rutin', remindMeIn: '7 days' });
    entries.push({ user: otnielData._id, type: 'DueDate', title: 'Perpanjang STNK', calendarDate: d45.toISOString(), activity: 'Bayar Pajak Mobil', remindMeIn: '30 days before' });

    savedUsers.forEach((userObj, index) => {
      if (userObj.username === 'otniel') return;
      entries.push({
        user: userObj._id,
        type: 'Diary',
        title: `Pikiran Kritis ${userObj.username}`,
        content: `Mendokumentasikan kejadian penting. Publik dari ${userObj.username}.`,
        subCategory: subCategories[index % subCategories.length],
        isPublic: true,
        template: templates[index % templates.length]
      });
    });

    await Entry.insertMany(entries);
    console.log('Database Seeding selesai!');
    process.exit(0);
  } catch (error) {
    console.error('Gagal melakukan Seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
