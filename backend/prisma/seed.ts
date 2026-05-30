import { PrismaClient } from '@prisma/client';
import { curriculum, quizzes } from '../src/lib/curriculumData';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const courseMetadata: Record<string, { title: string, description: string }> = {
  "C": {
    title: "C & Systems Programming for Hardware",
    description: "Learn the core foundations of procedural programming."
  },
  "C++": {
    title: "C++ & OOP for Embedded Systems",
    description: "Migrate to object-oriented paradigms and generic programming."
  },
  "IoT": {
    title: "IoT & Smart Interfacing Solutions",
    description: "Discover Internet of Things basics, sensory inputs, and network layering."
  },
  "Embedded": {
    title: "Embedded Systems & Real-Time OS",
    description: "Master embedded architectures and real-time operating systems."
  }
};

async function main() {
  console.log('Seeding relational curriculum database...');

  // Clean old contents in reverse order of dependencies
  await prisma.topic.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.module.deleteMany();
  // Don't delete courses if we want to upsert to keep relations intact, but doing so for clean slate
  await prisma.course.deleteMany();

  // Upsert Courses
  for (const [courseId, meta] of Object.entries(courseMetadata)) {
    const course = await prisma.course.create({
      data: {
        id: courseId,
        title: meta.title,
        description: meta.description,
        price: 999, // ₹999 for the certificate
        isPublished: true,
      }
    });

    console.log(`Upserted Course: ${course.id}`);

    // Seed Modules (Weeks) and Topics
    const courseWeeks = curriculum[courseId];
    if (courseWeeks) {
      for (const week of courseWeeks) {
        const module = await prisma.module.create({
          data: {
            courseId: courseId,
            week: week.week,
            title: week.title,
            description: week.description
          }
        });
        
        console.log(`Upserted Module: ${courseId} - Week ${week.week}`);

        for (let i = 0; i < week.topics.length; i++) {
          const topicData = week.topics[i];
          await prisma.topic.create({
            data: {
              moduleId: module.id,
              title: topicData.title,
              text: topicData.text,
              code: topicData.code || null,
              note: topicData.note || null,
              order: i
            }
          });
        }
        
        // Seed Quizzes
        const courseQuizzes = quizzes[courseId];
        if (courseQuizzes) {
          const weekQuiz = courseQuizzes.find(q => q.week === week.week);
          if (weekQuiz) {
            for (const question of weekQuiz.questions) {
              await prisma.quizQuestion.create({
                data: {
                  moduleId: module.id,
                  text: question.text,
                  options: JSON.stringify(question.options),
                  correctAnswer: question.correctAnswer
                }
              });
            }
            console.log(`Seeded Quizzes for: ${courseId} - Week ${week.week}`);
          }
        }
      }
    }
  }

  // Seed default admin account
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("FATAL ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be defined for seeding!");
    process.exit(1);
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Nexus Admin Staff',
        role: 'ADMIN',
        courseType: 'Embedded',
      },
    });
    console.log(`Admin user seeded: ${adminEmail}`);
  }

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
