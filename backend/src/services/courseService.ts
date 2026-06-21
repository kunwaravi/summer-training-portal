import prisma from '../lib/prisma';
export const getAllCourses = async () => {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        select: {
          id: true,
          week: true,
          title: true,
          description: true
        },
        orderBy: {
          week: 'asc'
        }
      }
    }
  });

  return courses;
};

export const getModuleByWeek = async (courseId: string, week: number) => {
  const moduleRecord = await prisma.module.findFirst({
    where: {
      courseId,
      week
    },
    include: {
      topics: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });
  return moduleRecord;
};

export const getPublicCourseDetails = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        select: {
          id: true,
          week: true,
          title: true,
          description: true,
          topics: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: {
          week: 'asc'
        }
      }
    }
  });

  if (!course) return null;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    modules: course.modules.map(m => ({
      week: m.week,
      title: m.title,
      description: m.description,
      topicCount: m.topics.length,
      topics: m.topics
    }))
  };
};

export const createCourse = async (data: { id: string; title: string; description?: string; price?: number }) => {
  return await prisma.course.create({
    data: {
      id: data.id,
      title: data.title,
      description: data.description || '',
      price: data.price || 999
    }
  });
};

export const updateCourse = async (courseId: string, data: { title?: string; description?: string; price?: number }) => {
  return await prisma.course.update({
    where: { id: courseId },
    data
  });
};

export const deleteCourse = async (courseId: string) => {
  return await prisma.course.delete({ where: { id: courseId } });
};

export const createModule = async (courseId: string, data: { week: number; title: string; description?: string }) => {
  return await prisma.module.create({
    data: {
      courseId,
      week: data.week,
      title: data.title,
      description: data.description || ''
    }
  });
};

export const updateModule = async (moduleId: number, data: { week?: number; title?: string; description?: string }) => {
  return await prisma.module.update({
    where: { id: moduleId },
    data
  });
};

export const deleteModule = async (moduleId: number) => {
  return await prisma.module.delete({ where: { id: moduleId } });
};

export const createTopic = async (moduleId: number, data: { title: string; text: string; code?: string; note?: string; order?: number }) => {
  return await prisma.topic.create({
    data: {
      moduleId,
      title: data.title,
      text: data.text,
      code: data.code,
      note: data.note,
      order: data.order || 0
    }
  });
};

export const updateTopic = async (topicId: number, data: { title?: string; text?: string; code?: string; note?: string; order?: number }) => {
  return await prisma.topic.update({
    where: { id: topicId },
    data
  });
};

export const deleteTopic = async (topicId: number) => {
  return await prisma.topic.delete({ where: { id: topicId } });
};
