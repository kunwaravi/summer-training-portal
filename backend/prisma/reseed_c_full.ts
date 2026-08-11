import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { cSections, cFinalExam } from './content/c';
import { cTopicQuizzes } from './content/c_topic_quizzes';

dotenv.config();

const prisma = new PrismaClient();

/**
 * Full-replace reseed for the C & Systems Programming course (issue #92).
 *
 * Replaces the machine-generated template content (near-duplicate quizzes from
 * seed.ts) with the deep, hand-written GfG-style curriculum in content/c.ts:
 *   - 20 modules (weeks) with original teaching topics
 *   - Per-topic quiz questions attached to each topic (required by the
 *     frontend topic-lock flow — every topic must have its own quiz or the
 *     "Start Topic Quiz" 404s and locks all later topics)
 *   - Section-level chapter quizzes (module-level, no topicId)
 *   - A real 15-question final exam (replaces the 50 near-identical templates)
 *
 * Modules themselves are preserved (so admin module edits + Challenge records
 * survive); only the leaf nodes (topics + quiz questions + final exam) for the
 * C course are rebuilt. Idempotent: safe to run multiple times.
 */

const COURSE_ID = 'C';

async function main() {
  console.log('--- FULL RE-SEED: C & Systems Programming (deep curriculum) ---');

  // Ensure the course exists without clobbering admin edits.
  let course = await prisma.course.findUnique({ where: { id: COURSE_ID } });
  if (!course) {
    course = await prisma.course.create({
      data: {
        id: COURSE_ID,
        title: 'C & Systems Programming for Hardware',
        description:
          'Master procedural programming, memory management, and systems-level C from first principles — with deep, original lessons, working code, and real practice quizzes.',
        price: 699,
        isPublished: true,
      },
    });
    console.log(`Created Course: ${COURSE_ID}`);
  } else {
    console.log(`Course ${COURSE_ID} already exists (id ${course.id}).`);
  }

  let totalTopics = 0;
  let totalTopicQuizzes = 0;
  let totalChapterQuizzes = 0;

  for (const section of cSections) {
    const week = section.week;

    // Find-or-create the module (preserving id, so Challenge links stay valid).
    let moduleRecord = await prisma.module.findUnique({
      where: { courseId_week: { courseId: COURSE_ID, week } },
    });
    if (!moduleRecord) {
      moduleRecord = await prisma.module.create({
        data: {
          courseId: COURSE_ID,
          week,
          title: section.title,
          description: section.description,
        },
      });
    } else if (moduleRecord.title !== section.title || moduleRecord.description !== section.description) {
      moduleRecord = await prisma.module.update({
        where: { id: moduleRecord.id },
        data: { title: section.title, description: section.description },
      });
    }

    // Full-replace the leaf nodes for this module: old template topics +
    // quizzes are removed, new deep content is created.
    await prisma.quizQuestion.deleteMany({ where: { moduleId: moduleRecord.id } });
    await prisma.topic.deleteMany({ where: { moduleId: moduleRecord.id } });

    // Create topics and attach their per-topic quizzes (topic-lock flow).
    for (let i = 0; i < section.topics.length; i++) {
      const topic = section.topics[i];
      const topicRecord = await prisma.topic.create({
        data: {
          moduleId: moduleRecord.id,
          title: topic.title,
          text: topic.text,
          code: topic.code,
          note: topic.note,
          order: i,
        },
      });
      totalTopics++;

      const topicQuizzes = cTopicQuizzes[topic.title];
      if (!topicQuizzes) {
        console.warn(`  ⚠  No topic quiz map entry for: "${topic.title}" (week ${week})`);
        continue;
      }
      for (const q of topicQuizzes) {
        await prisma.quizQuestion.create({
          data: {
            moduleId: moduleRecord.id,
            topicId: topicRecord.id,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
          },
        });
        totalTopicQuizzes++;
      }
    }

    // Create the section-level chapter quiz (module-level, no topicId).
    for (const q of section.quizzes) {
      await prisma.quizQuestion.create({
        data: {
          moduleId: moduleRecord.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
        },
      });
      totalChapterQuizzes++;
    }

    console.log(
      `✅ Week ${week}: "${section.title}" → ${section.topics.length} topics, ` +
        `${section.quizzes.length} chapter quizzes`
    );
  }

  // Replace the final exam: 50 near-identical templates → 15 distinct questions.
  const oldExam = await prisma.finalExamQuestion.deleteMany({ where: { courseId: COURSE_ID } });
  for (const q of cFinalExam) {
    await prisma.finalExamQuestion.create({
      data: {
        courseId: COURSE_ID,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
      },
    });
  }

  console.log(`\n--- C RE-SEED COMPLETE ---`);
  console.log(`Modules rebuilt:   ${cSections.length}`);
  console.log(`Topics created:    ${totalTopics}`);
  console.log(`Topic quizzes:     ${totalTopicQuizzes} (per-topic, topic-lock flow)`);
  console.log(`Chapter quizzes:   ${totalChapterQuizzes} (module-level)`);
  console.log(`Final exam:        replaced ${oldExam.count} template questions → ${cFinalExam.length} distinct`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
