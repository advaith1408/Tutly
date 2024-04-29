import { db } from "@/lib/db";
import getCurrentUser from "./getCurrentUser";
import { getEnrolledCoursesById } from "./courses";

export const getAllAssignedAssignments = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.username) {
    return null;
  }

  const coursesWithAssignments = await db.course.findMany({
    where: {
      enrolledUsers: {
        some: {
          username: currentUser.username,
        },
      },
    },
    select: {
      id: true,
      classes: {
        select: {
          attachments: {
            where: {
              attachmentType: "ASSIGNMENT",
            },
            include: {
              class: true,
              submissions: {
                where: {
                  enrolledUser: {
                    username: currentUser.username,
                  },
                },
                include: {
                  points: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return coursesWithAssignments;
};

export const getAllAssignedAssignmentsByUserId = async (id: string) => {
  const courses = await getEnrolledCoursesById(id);

  const coursesWithAssignments = await db.course.findMany({
    where: {
      enrolledUsers: {
        some: {
          user: {
            id: id,
          },
        },
      },
    },
    select: {
      id: true,
      classes: {
        select: {
          attachments: {
            where: {
              attachmentType: "ASSIGNMENT",
            },
            include: {
              class: true,
              submissions: {
                where: {
                  enrolledUser: {
                    user:{
                      id: id
                    }
                  },
                },
                include: {
                  points: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return { courses, coursesWithAssignments } as any;
};

export const getAllMentorAssignments = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const coursesWithAssignments = await db.course.findMany({
    where: {
      enrolledUsers: {
        some: {
          assignedMentors: {
            some: {
              mentorId: currentUser.id,
            },
          },
        },
      },
    },
    select: {
      id: true,
      classes: {
        select: {
          attachments: {
            where: {
              attachmentType: "ASSIGNMENT",
            },
            select: {
              title: true,
              submissions: {
                where: {
                  enrolledUser: {
                    assignedMentors: {
                      some: {
                        mentorId: currentUser.id,
                      },
                    },
                  },
                },
                select: {
                  points: true,
                  enrolledUser: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const submissions = await db.submission.findMany({
    where: {
      enrolledUser: {
        assignedMentors: {
          some: {
            mentorId: currentUser.id,
          },
        },
      },
    },
    select: {
      points: true,
      enrolledUser: {
        include: {
          user: true,
        },
      },
    },
  });

  return {coursesWithAssignments,submissions} as any
};

export const getAllCreatedAssignments = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const coursesWithAssignments = await db.course.findMany({
    where: {
      createdById: currentUser.id,
    },
    select: {
      id: true,
      classes: {
        select: {
          attachments: {
            where: {
              attachmentType: "ASSIGNMENT",
            },
            include: {
              class: true,
              submissions: {
                where: {
                  enrolledUserId: currentUser.id,
                },
              },
            },
          },
        },
      },
    },
  });
  return coursesWithAssignments;
};

export const getAssignmentDetailsByUserId = async (
  id: string,
  userId: string
) => {
  const assignment = await db.attachment.findUnique({
    where: {
      id,
    },
    include: {
      class: {
        include: {
          course: true,
        },
      },
      submissions: {
        where: {
          enrolledUser: {
            user:{
              id: userId
            },
          },
        },
        include: {
          enrolledUser: {
            include: {
              submission: true,
            },
          },
          points: true,
        },
      },
    },
  });
  return assignment;
};

export const getAllAssignmentsByCourseId = async (id: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const coursesWithAssignments = await db.course.findMany({
    where: {
      id,
    },
    select: {
      id: true,
      classes: {
        select: {
          attachments: {
            where: {
              attachmentType: "ASSIGNMENT",
            },
            include: {
              class: true,
              submissions: {
                where: {
                  enrolledUserId: currentUser.id,
                },
              },
            },
          },
        },
      },
    },
  });

  return coursesWithAssignments;
};
