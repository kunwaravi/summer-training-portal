-- Add the privacy opt-out "shareSolution" columns (issue #75) that were
-- missing from migration history. The schema has declared them since #75,
-- but no migration ever created them — so the live DB and fresh migrate
-- deploys lacked the column, and admin assignment/project listing 500'd on
-- PrismaClientKnownRequestError (column does not exist).

ALTER TABLE "AssignmentSubmission" ADD COLUMN "shareSolution" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ProjectSubmission" ADD COLUMN "shareSolution" BOOLEAN NOT NULL DEFAULT true;
