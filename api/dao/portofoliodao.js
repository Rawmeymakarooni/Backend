// Gunakan singleton Prisma Client untuk menghindari error di Vercel
const { prisma } = require('../../prisma/client');

// Log untuk debugging koneksi di Vercel
if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
  console.log('PortofolioDAO: Menggunakan PrismaClient singleton');
}

const portofolioDao = {
  createPortofolioWithFurnitur: async (portoData, furniturList) => {
    // portoData: { uid, cover, judul, kategori, description }
    // furniturList: array of { nama_furnitur, foto_furnitur, keterangan_furnitur, jumlah }
    return await prisma.$transaction(async (tx) => {
      const porto = await tx.portofolio.create({
        data: portoData
      });
      if (furniturList && furniturList.length > 0) {
        await tx.furnitur.createMany({
          data: furniturList.map(f => ({ ...f, porto_id: porto.porto_id }))
        });
      }
      return porto;
    });
  },
};

module.exports = portofolioDao;
