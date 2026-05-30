import { PrismaClient } from '@prisma/client';
import { curriculum, quizzes } from '../src/lib/curriculumData';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding relational curriculum database...');

  // Clean old contents in reverse order of dependencies
  await prisma.topic.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  const courseIds = Object.keys(curriculum);

  for (const courseId of courseIds) {
    const courseWeeks = curriculum[courseId];
    
    let displayCourseName = "Advanced Computing Solutions";
    if (courseId === "C") displayCourseName = "C & Systems Programming for Hardware";
    else if (courseId === "C++") displayCourseName = "C++ & OOP for Embedded Systems";
    else if (courseId === "IoT") displayCourseName = "IoT & Smart Interfacing Solutions";
    else if (courseId === "Embedded") displayCourseName = "Embedded Systems & Real-Time OS";

    console.log(`Creating Course: ${courseId}`);
    const course = await prisma.course.create({
      data: {
        id: courseId,
        title: displayCourseName,
        description: `Master standard industrial skills in ${courseId} training tracks with verify-ready certification.`,
      },
    });

    for (const weekData of courseWeeks) {
      console.log(`  Creating Module for Week ${weekData.week}: ${weekData.title}`);
      const module = await prisma.module.create({
        data: {
          courseId: course.id,
          week: weekData.week,
          title: weekData.title,
          description: weekData.description,
        },
      });

      // Create Topics
      for (let i = 0; i < weekData.topics.length; i++) {
        const topicData = weekData.topics[i];
        await prisma.topic.create({
          data: {
            moduleId: module.id,
            title: topicData.title,
            text: topicData.text,
            code: topicData.code,
            note: topicData.note,
            order: i,
          },
        });
      }

      // Find quiz questions for this week
      const courseQuizzes = quizzes[courseId] || [];
      const weekQuiz = courseQuizzes.find(q => q.week === weekData.week);
      if (weekQuiz) {
        console.log(`    Creating ${weekQuiz.questions.length} quiz questions...`);
        for (const q of weekQuiz.questions) {
          await prisma.quizQuestion.create({
            data: {
              moduleId: module.id,
              text: q.text,
              options: JSON.stringify(q.options),
              correctAnswer: q.correctAnswer,
            },
          });
        }
      }
    }
  }

  // Seed default admin account
  const adminEmail = 'admin@nexus.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Nexus Admin Staff',
        role: 'ADMIN',
        courseType: 'Embedded',
      },
    });
    console.log('Admin user seeded: admin@nexus.com / admin123');
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
