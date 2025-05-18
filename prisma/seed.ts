import { PrismaClient } from '@prisma/client';
import { createUser } from '../tests/utils/factories/userFactory';
import { createPost } from '../tests/utils/factories/postFactory';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const user1 = await prisma.user.create({
    data: createUser({
      email: 'john@example.com',
      name: 'John Doe',
      password: 'hashed_password123',
    }),
  });

  const user2 = await prisma.user.create({
    data: createUser({
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: 'hashed_password456',
    }),
  });

  // Create test posts
  await prisma.post.create({
    data: createPost({
      title: 'First Post',
      content: 'This is the first post content',
      published: true,
      authorId: user1.id,
    }),
  });

  await prisma.post.create({
    data: createPost({
      title: 'Second Post',
      content: 'This is the second post content',
      published: false,
      authorId: user2.id,
    }),
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
