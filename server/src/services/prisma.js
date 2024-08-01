const { PrismaClient } = require('@prisma/client');

// Database connection
const prismaService = new PrismaClient();

try {
  prismaService.$connect();
} catch (error) {
  throw Error(error);
}

module.exports = prismaService;
