// Gunakan singleton Prisma Client untuk menghindari error di Vercel
const { prisma } = require('../../prisma/client');

// Log untuk debugging koneksi di Vercel
if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
  console.log('RequestStatusDAO: Menggunakan PrismaClient singleton');
}

const requestStatusDao = {
  createRequest: async (userId, statement) => {
    return await prisma.requestStatus.create({
      data: {
        userId,
        requestStatement: statement,
        approvalStatus: false,
      },
    });
  },
  findPendingRequestByUser: async (userId) => {
    return await prisma.requestStatus.findFirst({
      where: {
        userId,
        approvalStatus: false,
      },
    });
  },
  getAllRequests: async () => {
    return await prisma.requestStatus.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  updateApprovalStatus: async (id, status) => {
    return await prisma.requestStatus.update({
      where: { id },
      data: { approvalStatus: status },
    });
  },
};

module.exports = requestStatusDao;
