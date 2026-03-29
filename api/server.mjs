var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";

// src/app/routes/index.ts
import { Router as Router10 } from "express";

// src/app/module/admin/admin.route.ts
import { Router } from "express";

// src/app/module/admin/admin.controller.ts
import status2 from "http-status";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/admin/admin.service.ts
import status from "http-status";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Account {\n  id                    String    @id @default(uuid())\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@map("account")\n}\n\nmodel Category {\n  id          String  @id @default(uuid())\n  name        String  @unique\n  description String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  ideas Idea[]\n\n  @@map("categories")\n}\n\nmodel Comment {\n  id      String @id @default(uuid())\n  content String\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  ideaId String\n  idea   Idea   @relation(fields: [ideaId], references: [id])\n\n  parentId String?\n  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id])\n  replies  Comment[] @relation("CommentReplies")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("comments")\n}\n\nenum IdeaStatus {\n  DRAFT\n  UNDER_REVIEW\n  APPROVED\n  REJECTED\n}\n\nmodel Idea {\n  id               String     @id @default(uuid())\n  title            String\n  problemStatement String\n  proposedSolution String\n  description      String\n  images           String[]\n  isPaid           Boolean    @default(false)\n  price            Float?\n  status           IdeaStatus @default(DRAFT)\n  adminFeedback    String?\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  authorId String\n  author   User   @relation(fields: [authorId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  votes    Vote[]\n  comments Comment[]\n  payments Payment[]\n\n  @@map("ideas")\n}\n\nmodel Newsletter {\n  id    String @id @default(uuid())\n  email String @unique\n\n  createdAt DateTime @default(now())\n\n  @@map("newsletters")\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n}\n\nmodel Payment {\n  id              String        @id @default(uuid())\n  amount          Float\n  stripeSessionId String        @unique\n  status          PaymentStatus @default(PENDING)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  ideaId String?\n  idea   Idea?   @relation(fields: [ideaId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@map("payments")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Session {\n  id        String   @id @default(uuid())\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("session")\n}\n\nenum Role {\n  MEMBER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  DEACTIVATED\n}\n\nmodel User {\n  id            String     @id @default(uuid())\n  name          String\n  email         String     @unique\n  emailVerified Boolean    @default(false)\n  image         String?\n  password      String?\n  role          Role       @default(MEMBER)\n  status        UserStatus @default(ACTIVE)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  sessions Session[]\n  accounts Account[]\n  ideas    Idea[]\n  votes    Vote[]\n  comments Comment[]\n  payments Payment[]\n\n  @@map("users")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@map("verification")\n}\n\nenum VoteType {\n  UPVOTE\n  DOWNVOTE\n}\n\nmodel Vote {\n  id       String   @id @default(uuid())\n  voteType VoteType\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  ideaId String\n  idea   Idea   @relation(fields: [ideaId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@unique([userId, ideaId])\n  @@map("votes")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ideas","kind":"object","type":"Idea","relationName":"CategoryToIdea"}],"dbName":"categories"},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CommentToUser"},{"name":"ideaId","kind":"scalar","type":"String"},{"name":"idea","kind":"object","type":"Idea","relationName":"CommentToIdea"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"comments"},"Idea":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"problemStatement","kind":"scalar","type":"String"},{"name":"proposedSolution","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"isPaid","kind":"scalar","type":"Boolean"},{"name":"price","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"IdeaStatus"},{"name":"adminFeedback","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToIdea"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"IdeaToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"votes","kind":"object","type":"Vote","relationName":"IdeaToVote"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToIdea"},{"name":"payments","kind":"object","type":"Payment","relationName":"IdeaToPayment"}],"dbName":"ideas"},"Newsletter":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"newsletters"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"ideaId","kind":"scalar","type":"String"},{"name":"idea","kind":"object","type":"Idea","relationName":"IdeaToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"ideas","kind":"object","type":"Idea","relationName":"IdeaToUser"},{"name":"votes","kind":"object","type":"Vote","relationName":"UserToVote"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"}],"dbName":"users"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Vote":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"voteType","kind":"enum","type":"VoteType"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToVote"},{"name":"ideaId","kind":"scalar","type":"String"},{"name":"idea","kind":"object","type":"Idea","relationName":"IdeaToVote"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"votes"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","ideas","_count","category","author","idea","votes","parent","replies","comments","payments","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","data","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","create","update","Account.upsertOne","Account.deleteOne","Account.deleteMany","having","_min","_max","Account.groupBy","Account.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","Comment.groupBy","Comment.aggregate","Idea.findUnique","Idea.findUniqueOrThrow","Idea.findFirst","Idea.findFirstOrThrow","Idea.findMany","Idea.createOne","Idea.createMany","Idea.createManyAndReturn","Idea.updateOne","Idea.updateMany","Idea.updateManyAndReturn","Idea.upsertOne","Idea.deleteOne","Idea.deleteMany","_avg","_sum","Idea.groupBy","Idea.aggregate","Newsletter.findUnique","Newsletter.findUniqueOrThrow","Newsletter.findFirst","Newsletter.findFirstOrThrow","Newsletter.findMany","Newsletter.createOne","Newsletter.createMany","Newsletter.createManyAndReturn","Newsletter.updateOne","Newsletter.updateMany","Newsletter.updateManyAndReturn","Newsletter.upsertOne","Newsletter.deleteOne","Newsletter.deleteMany","Newsletter.groupBy","Newsletter.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Vote.findUnique","Vote.findUniqueOrThrow","Vote.findFirst","Vote.findFirstOrThrow","Vote.findMany","Vote.createOne","Vote.createMany","Vote.createManyAndReturn","Vote.updateOne","Vote.updateMany","Vote.updateManyAndReturn","Vote.upsertOne","Vote.deleteOne","Vote.deleteMany","Vote.groupBy","Vote.aggregate","AND","OR","NOT","id","VoteType","voteType","userId","ideaId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","identifier","value","expiresAt","updatedAt","name","email","emailVerified","image","password","Role","role","UserStatus","status","every","some","none","token","ipAddress","userAgent","amount","stripeSessionId","PaymentStatus","title","problemStatement","proposedSolution","description","images","isPaid","price","IdeaStatus","adminFeedback","categoryId","authorId","has","hasEvery","hasSome","content","parentId","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","userId_ideaId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "hwVZoAERAwAA2wIAILgBAADnAgAwuQEAAAcAELoBAADnAgAwuwEBAAAAAb4BAQCkAgAhwAFAAKUCACHPAUAApQIAIdQBAQC2AgAh8gEBAKQCACHzAQEApAIAIfQBAQC2AgAh9QEBALYCACH2AQEAtgIAIfcBQADoAgAh-AFAAOgCACH5AQEAtgIAIQEAAAABACAMAwAA2wIAILgBAADpAgAwuQEAAAMAELoBAADpAgAwuwEBAKQCACG-AQEApAIAIcABQAClAgAhzgFAAKUCACHPAUAApQIAIdwBAQCkAgAh3QEBALYCACHeAQEAtgIAIQMDAADCBAAg3QEAAPcCACDeAQAA9wIAIAwDAADbAgAguAEAAOkCADC5AQAAAwAQugEAAOkCADC7AQEAAAABvgEBAKQCACHAAUAApQIAIc4BQAClAgAhzwFAAKUCACHcAQEAAAAB3QEBALYCACHeAQEAtgIAIQMAAAADACABAAAEADACAAAFACARAwAA2wIAILgBAADnAgAwuQEAAAcAELoBAADnAgAwuwEBAKQCACG-AQEApAIAIcABQAClAgAhzwFAAKUCACHUAQEAtgIAIfIBAQCkAgAh8wEBAKQCACH0AQEAtgIAIfUBAQC2AgAh9gEBALYCACH3AUAA6AIAIfgBQADoAgAh-QEBALYCACEIAwAAwgQAINQBAAD3AgAg9AEAAPcCACD1AQAA9wIAIPYBAAD3AgAg9wEAAPcCACD4AQAA9wIAIPkBAAD3AgAgAwAAAAcAIAEAAAgAMAIAAAEAIBYIAADmAgAgCQAA2wIAIAsAALwCACAOAAC9AgAgDwAAvgIAILgBAADjAgAwuQEAAAoAELoBAADjAgAwuwEBAKQCACHAAUAApQIAIc8BQAClAgAh2AEAAOUC6gEi4gEBAKQCACHjAQEApAIAIeQBAQCkAgAh5QEBAKQCACHmAQAAygIAIOcBIAC1AgAh6AEIAOQCACHqAQEAtgIAIesBAQCkAgAh7AEBAKQCACEHCAAAxQQAIAkAAMIEACALAACVBAAgDgAAlgQAIA8AAJcEACDoAQAA9wIAIOoBAAD3AgAgFggAAOYCACAJAADbAgAgCwAAvAIAIA4AAL0CACAPAAC-AgAguAEAAOMCADC5AQAACgAQugEAAOMCADC7AQEAAAABwAFAAKUCACHPAUAApQIAIdgBAADlAuoBIuIBAQCkAgAh4wEBAKQCACHkAQEApAIAIeUBAQCkAgAh5gEAAMoCACDnASAAtQIAIegBCADkAgAh6gEBALYCACHrAQEApAIAIewBAQCkAgAhAwAAAAoAIAEAAAsAMAIAAAwAIAMAAAAKACABAAALADACAAAMACABAAAACgAgCgMAANsCACAKAADeAgAguAEAAOECADC5AQAAEAAQugEAAOECADC7AQEApAIAIb0BAADiAr0BIr4BAQCkAgAhvwEBAKQCACHAAUAApQIAIQIDAADCBAAgCgAAwwQAIAsDAADbAgAgCgAA3gIAILgBAADhAgAwuQEAABAAELoBAADhAgAwuwEBAAAAAb0BAADiAr0BIr4BAQCkAgAhvwEBAKQCACHAAUAApQIAIfoBAADgAgAgAwAAABAAIAEAABEAMAIAABIAIA4DAADbAgAgCgAA3gIAIAwAAN8CACANAAC9AgAguAEAAN0CADC5AQAAFAAQugEAAN0CADC7AQEApAIAIb4BAQCkAgAhvwEBAKQCACHAAUAApQIAIc8BQAClAgAh8AEBAKQCACHxAQEAtgIAIQUDAADCBAAgCgAAwwQAIAwAAMQEACANAACWBAAg8QEAAPcCACAOAwAA2wIAIAoAAN4CACAMAADfAgAgDQAAvQIAILgBAADdAgAwuQEAABQAELoBAADdAgAwuwEBAAAAAb4BAQCkAgAhvwEBAKQCACHAAUAApQIAIc8BQAClAgAh8AEBAKQCACHxAQEAtgIAIQMAAAAUACABAAAVADACAAAWACABAAAAFAAgAwAAABQAIAEAABUAMAIAABYAIAEAAAAUACAMAwAA2wIAIAoAANwCACC4AQAA2AIAMLkBAAAbABC6AQAA2AIAMLsBAQCkAgAhvgEBAKQCACG_AQEAtgIAIcABQAClAgAh2AEAANoC4gEi3wEIANkCACHgAQEApAIAIQMDAADCBAAgCgAAwwQAIL8BAAD3AgAgDAMAANsCACAKAADcAgAguAEAANgCADC5AQAAGwAQugEAANgCADC7AQEAAAABvgEBAKQCACG_AQEAtgIAIcABQAClAgAh2AEAANoC4gEi3wEIANkCACHgAQEAAAABAwAAABsAIAEAABwAMAIAAB0AIAEAAAAKACABAAAAEAAgAQAAABQAIAEAAAAbACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAbACABAAAcADACAAAdACABAAAAAwAgAQAAAAcAIAEAAAAKACABAAAAEAAgAQAAABQAIAEAAAAbACABAAAAAQAgAwAAAAcAIAEAAAgAMAIAAAEAIAMAAAAHACABAAAIADACAAABACADAAAABwAgAQAACAAwAgAAAQAgDgMAAMEEACC7AQEAAAABvgEBAAAAAcABQAAAAAHPAUAAAAAB1AEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAABARUAADAAIA27AQEAAAABvgEBAAAAAcABQAAAAAHPAUAAAAAB1AEBAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wFAAAAAAfgBQAAAAAH5AQEAAAABARUAADIAMAEVAAAyADAOAwAAwAQAILsBAQDtAgAhvgEBAO0CACHAAUAA7wIAIc8BQADvAgAh1AEBAPwCACHyAQEA7QIAIfMBAQDtAgAh9AEBAPwCACH1AQEA_AIAIfYBAQD8AgAh9wFAAP0DACH4AUAA_QMAIfkBAQD8AgAhAgAAAAEAIBUAADUAIA27AQEA7QIAIb4BAQDtAgAhwAFAAO8CACHPAUAA7wIAIdQBAQD8AgAh8gEBAO0CACHzAQEA7QIAIfQBAQD8AgAh9QEBAPwCACH2AQEA_AIAIfcBQAD9AwAh-AFAAP0DACH5AQEA_AIAIQIAAAAHACAVAAA3ACACAAAABwAgFQAANwAgAwAAAAEAIBwAADAAIB0AADUAIAEAAAABACABAAAABwAgCgcAAL0EACAiAAC_BAAgIwAAvgQAINQBAAD3AgAg9AEAAPcCACD1AQAA9wIAIPYBAAD3AgAg9wEAAPcCACD4AQAA9wIAIPkBAAD3AgAgELgBAADUAgAwuQEAAD4AELoBAADUAgAwuwEBAJgCACG-AQEAmAIAIcABQACaAgAhzwFAAJoCACHUAQEAqAIAIfIBAQCYAgAh8wEBAJgCACH0AQEAqAIAIfUBAQCoAgAh9gEBAKgCACH3AUAA1QIAIfgBQADVAgAh-QEBAKgCACEDAAAABwAgAQAAPQAwIQAAPgAgAwAAAAcAIAEAAAgAMAIAAAEAIAkGAAC7AgAguAEAANMCADC5AQAARAAQugEAANMCADC7AQEAAAABwAFAAKUCACHPAUAApQIAIdABAQAAAAHlAQEAtgIAIQEAAABBACABAAAAQQAgCQYAALsCACC4AQAA0wIAMLkBAABEABC6AQAA0wIAMLsBAQCkAgAhwAFAAKUCACHPAUAApQIAIdABAQCkAgAh5QEBALYCACECBgAAlAQAIOUBAAD3AgAgAwAAAEQAIAEAAEUAMAIAAEEAIAMAAABEACABAABFADACAABBACADAAAARAAgAQAARQAwAgAAQQAgBgYAALwEACC7AQEAAAABwAFAAAAAAc8BQAAAAAHQAQEAAAAB5QEBAAAAAQEVAABJACAFuwEBAAAAAcABQAAAAAHPAUAAAAAB0AEBAAAAAeUBAQAAAAEBFQAASwAwARUAAEsAMAYGAACyBAAguwEBAO0CACHAAUAA7wIAIc8BQADvAgAh0AEBAO0CACHlAQEA_AIAIQIAAABBACAVAABOACAFuwEBAO0CACHAAUAA7wIAIc8BQADvAgAh0AEBAO0CACHlAQEA_AIAIQIAAABEACAVAABQACACAAAARAAgFQAAUAAgAwAAAEEAIBwAAEkAIB0AAE4AIAEAAABBACABAAAARAAgBAcAAK8EACAiAACxBAAgIwAAsAQAIOUBAAD3AgAgCLgBAADSAgAwuQEAAFcAELoBAADSAgAwuwEBAJgCACHAAUAAmgIAIc8BQACaAgAh0AEBAJgCACHlAQEAqAIAIQMAAABEACABAABWADAhAABXACADAAAARAAgAQAARQAwAgAAQQAgAQAAABYAIAEAAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACALAwAArQMAIAoAAK4DACAMAACxAwAgDQAArwMAILsBAQAAAAG-AQEAAAABvwEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAfEBAQAAAAEBFQAAXwAgB7sBAQAAAAG-AQEAAAABvwEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAfEBAQAAAAEBFQAAYQAwARUAAGEAMAEAAAAUACALAwAAqwMAIAoAAKADACAMAAChAwAgDQAAogMAILsBAQDtAgAhvgEBAO0CACG_AQEA7QIAIcABQADvAgAhzwFAAO8CACHwAQEA7QIAIfEBAQD8AgAhAgAAABYAIBUAAGUAIAe7AQEA7QIAIb4BAQDtAgAhvwEBAO0CACHAAUAA7wIAIc8BQADvAgAh8AEBAO0CACHxAQEA_AIAIQIAAAAUACAVAABnACACAAAAFAAgFQAAZwAgAQAAABQAIAMAAAAWACAcAABfACAdAABlACABAAAAFgAgAQAAABQAIAQHAACsBAAgIgAArgQAICMAAK0EACDxAQAA9wIAIAq4AQAA0QIAMLkBAABvABC6AQAA0QIAMLsBAQCYAgAhvgEBAJgCACG_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_AQEAAAABwAFAAAAAAdgBAAAA4gEC3wEIAAAAAeABAQAAAAEBFQAAqAEAMAEVAACoAQAwAQAAAAoAIAkDAADYAwAgCgAAkgMAILsBAQDtAgAhvgEBAO0CACG_AQEA_AIAIcABQADvAgAh2AEAAJAD4gEi3wEIAI8DACHgAQEA7QIAIQIAAAAdACAVAACsAQAgB7sBAQDtAgAhvgEBAO0CACG_AQEA_AIAIcABQADvAgAh2AEAAJAD4gEi3wEIAI8DACHgAQEA7QIAIQIAAAAbACAVAACuAQAgAgAAABsAIBUAAK4BACABAAAACgAgAwAAAB0AIBwAAKYBACAdAACsAQAgAQAAAB0AIAEAAAAbACAGBwAAnQQAICIAAKAEACAjAACfBAAgVAAAngQAIFUAAKEEACC_AQAA9wIAIAq4AQAAwAIAMLkBAAC2AQAQugEAAMACADC7AQEAmAIAIb4BAQCYAgAhvwEBAKgCACHAAUAAmgIAIdgBAADCAuIBIt8BCADBAgAh4AEBAJgCACEDAAAAGwAgAQAAtQEAMCEAALYBACADAAAAGwAgAQAAHAAwAgAAHQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAAnAQAILsBAQAAAAG-AQEAAAABwAFAAAAAAc4BQAAAAAHPAUAAAAAB3AEBAAAAAd0BAQAAAAHeAQEAAAABARUAAL4BACAIuwEBAAAAAb4BAQAAAAHAAUAAAAABzgFAAAAAAc8BQAAAAAHcAQEAAAAB3QEBAAAAAd4BAQAAAAEBFQAAwAEAMAEVAADAAQAwCQMAAJsEACC7AQEA7QIAIb4BAQDtAgAhwAFAAO8CACHOAUAA7wIAIc8BQADvAgAh3AEBAO0CACHdAQEA_AIAId4BAQD8AgAhAgAAAAUAIBUAAMMBACAIuwEBAO0CACG-AQEA7QIAIcABQADvAgAhzgFAAO8CACHPAUAA7wIAIdwBAQDtAgAh3QEBAPwCACHeAQEA_AIAIQIAAAADACAVAADFAQAgAgAAAAMAIBUAAMUBACADAAAABQAgHAAAvgEAIB0AAMMBACABAAAABQAgAQAAAAMAIAUHAACYBAAgIgAAmgQAICMAAJkEACDdAQAA9wIAIN4BAAD3AgAgC7gBAAC_AgAwuQEAAMwBABC6AQAAvwIAMLsBAQCYAgAhvgEBAJgCACHAAUAAmgIAIc4BQACaAgAhzwFAAJoCACHcAQEAmAIAId0BAQCoAgAh3gEBAKgCACEDAAAAAwAgAQAAywEAMCEAAMwBACADAAAAAwAgAQAABAAwAgAABQAgEwQAALkCACAFAAC6AgAgBgAAuwIAIAsAALwCACAOAAC9AgAgDwAAvgIAILgBAAC0AgAwuQEAANIBABC6AQAAtAIAMLsBAQAAAAHAAUAApQIAIc8BQAClAgAh0AEBAKQCACHRAQEAAAAB0gEgALUCACHTAQEAtgIAIdQBAQC2AgAh1gEAALcC1gEi2AEAALgC2AEiAQAAAM8BACABAAAAzwEAIBMEAAC5AgAgBQAAugIAIAYAALsCACALAAC8AgAgDgAAvQIAIA8AAL4CACC4AQAAtAIAMLkBAADSAQAQugEAALQCADC7AQEApAIAIcABQAClAgAhzwFAAKUCACHQAQEApAIAIdEBAQCkAgAh0gEgALUCACHTAQEAtgIAIdQBAQC2AgAh1gEAALcC1gEi2AEAALgC2AEiCAQAAJIEACAFAACTBAAgBgAAlAQAIAsAAJUEACAOAACWBAAgDwAAlwQAINMBAAD3AgAg1AEAAPcCACADAAAA0gEAIAEAANMBADACAADPAQAgAwAAANIBACABAADTAQAwAgAAzwEAIAMAAADSAQAgAQAA0wEAMAIAAM8BACAQBAAAjAQAIAUAAI0EACAGAACOBAAgCwAAjwQAIA4AAJAEACAPAACRBAAguwEBAAAAAcABQAAAAAHPAUAAAAAB0AEBAAAAAdEBAQAAAAHSASAAAAAB0wEBAAAAAdQBAQAAAAHWAQAAANYBAtgBAAAA2AECARUAANcBACAKuwEBAAAAAcABQAAAAAHPAUAAAAAB0AEBAAAAAdEBAQAAAAHSASAAAAAB0wEBAAAAAdQBAQAAAAHWAQAAANYBAtgBAAAA2AECARUAANkBADABFQAA2QEAMBAEAAD_AgAgBQAAgAMAIAYAAIEDACALAACCAwAgDgAAgwMAIA8AAIQDACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHQAQEA7QIAIdEBAQDtAgAh0gEgAPsCACHTAQEA_AIAIdQBAQD8AgAh1gEAAP0C1gEi2AEAAP4C2AEiAgAAAM8BACAVAADcAQAgCrsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdABAQDtAgAh0QEBAO0CACHSASAA-wIAIdMBAQD8AgAh1AEBAPwCACHWAQAA_QLWASLYAQAA_gLYASICAAAA0gEAIBUAAN4BACACAAAA0gEAIBUAAN4BACADAAAAzwEAIBwAANcBACAdAADcAQAgAQAAAM8BACABAAAA0gEAIAUHAAD4AgAgIgAA-gIAICMAAPkCACDTAQAA9wIAINQBAAD3AgAgDbgBAACmAgAwuQEAAOUBABC6AQAApgIAMLsBAQCYAgAhwAFAAJoCACHPAUAAmgIAIdABAQCYAgAh0QEBAJgCACHSASAApwIAIdMBAQCoAgAh1AEBAKgCACHWAQAAqQLWASLYAQAAqgLYASIDAAAA0gEAIAEAAOQBADAhAADlAQAgAwAAANIBACABAADTAQAwAgAAzwEAIAm4AQAAowIAMLkBAADrAQAQugEAAKMCADC7AQEAAAABwAFAAKUCACHMAQEApAIAIc0BAQCkAgAhzgFAAKUCACHPAUAApQIAIQEAAADoAQAgAQAAAOgBACAJuAEAAKMCADC5AQAA6wEAELoBAACjAgAwuwEBAKQCACHAAUAApQIAIcwBAQCkAgAhzQEBAKQCACHOAUAApQIAIc8BQAClAgAhAAMAAADrAQAgAQAA7AEAMAIAAOgBACADAAAA6wEAIAEAAOwBADACAADoAQAgAwAAAOsBACABAADsAQAwAgAA6AEAIAa7AQEAAAABwAFAAAAAAcwBAQAAAAHNAQEAAAABzgFAAAAAAc8BQAAAAAEBFQAA8AEAIAa7AQEAAAABwAFAAAAAAcwBAQAAAAHNAQEAAAABzgFAAAAAAc8BQAAAAAEBFQAA8gEAMAEVAADyAQAwBrsBAQDtAgAhwAFAAO8CACHMAQEA7QIAIc0BAQDtAgAhzgFAAO8CACHPAUAA7wIAIQIAAADoAQAgFQAA9QEAIAa7AQEA7QIAIcABQADvAgAhzAEBAO0CACHNAQEA7QIAIc4BQADvAgAhzwFAAO8CACECAAAA6wEAIBUAAPcBACACAAAA6wEAIBUAAPcBACADAAAA6AEAIBwAAPABACAdAAD1AQAgAQAAAOgBACABAAAA6wEAIAMHAAD0AgAgIgAA9gIAICMAAPUCACAJuAEAAKICADC5AQAA_gEAELoBAACiAgAwuwEBAJgCACHAAUAAmgIAIcwBAQCYAgAhzQEBAJgCACHOAUAAmgIAIc8BQACaAgAhAwAAAOsBACABAAD9AQAwIQAA_gEAIAMAAADrAQAgAQAA7AEAMAIAAOgBACABAAAAEgAgAQAAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIAcDAADyAgAgCgAA8wIAILsBAQAAAAG9AQAAAL0BAr4BAQAAAAG_AQEAAAABwAFAAAAAAQEVAACGAgAgBbsBAQAAAAG9AQAAAL0BAr4BAQAAAAG_AQEAAAABwAFAAAAAAQEVAACIAgAwARUAAIgCADAHAwAA8AIAIAoAAPECACC7AQEA7QIAIb0BAADuAr0BIr4BAQDtAgAhvwEBAO0CACHAAUAA7wIAIQIAAAASACAVAACLAgAgBbsBAQDtAgAhvQEAAO4CvQEivgEBAO0CACG_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_AQEAqAIAIcABQACaAgAh2AEAAMIC4gEi3wEIAMECACHgAQEAmAIAIQ0HAACcAgAgIgAAxgIAICMAAMYCACBUAADGAgAgVQAAxgIAIMEBCAAAAAHCAQgAAAAEwwEIAAAABMQBCAAAAAHFAQgAAAABxgEIAAAAAccBCAAAAAHIAQgAxQIAIQcHAACcAgAgIgAAxAIAICMAAMQCACDBAQAAAOIBAsIBAAAA4gEIwwEAAADiAQjIAQAAwwLiASIHBwAAnAIAICIAAMQCACAjAADEAgAgwQEAAADiAQLCAQAAAOIBCMMBAAAA4gEIyAEAAMMC4gEiBMEBAAAA4gECwgEAAADiAQjDAQAAAOIBCMgBAADEAuIBIg0HAACcAgAgIgAAxgIAICMAAMYCACBUAADGAgAgVQAAxgIAIMEBCAAAAAHCAQgAAAAEwwEIAAAABMQBCAAAAAHFAQgAAAABxgEIAAAAAccBCAAAAAHIAQgAxQIAIQjBAQgAAAABwgEIAAAABMMBCAAAAATEAQgAAAABxQEIAAAAAcYBCAAAAAHHAQgAAAAByAEIAMYCACEGuAEAAMcCADC5AQAAngEAELoBAADHAgAwuwEBAJgCACHAAUAAmgIAIdEBAQCYAgAhBrgBAADIAgAwuQEAAIsBABC6AQAAyAIAMLsBAQCkAgAhwAFAAKUCACHRAQEApAIAIRG4AQAAyQIAMLkBAACFAQAQugEAAMkCADC7AQEAmAIAIcABQACaAgAhzwFAAJoCACHYAQAAzALqASLiAQEAmAIAIeMBAQCYAgAh5AEBAJgCACHlAQEAmAIAIeYBAADKAgAg5wEgAKcCACHoAQgAywIAIeoBAQCoAgAh6wEBAJgCACHsAQEAmAIAIQTBAQEAAAAF7QEBAAAAAe4BAQAAAATvAQEAAAAEDQcAALACACAiAADQAgAgIwAA0AIAIFQAANACACBVAADQAgAgwQEIAAAAAcIBCAAAAAXDAQgAAAAFxAEIAAAAAcUBCAAAAAHGAQgAAAABxwEIAAAAAcgBCADPAgAhBwcAAJwCACAiAADOAgAgIwAAzgIAIMEBAAAA6gECwgEAAADqAQjDAQAAAOoBCMgBAADNAuoBIgcHAACcAgAgIgAAzgIAICMAAM4CACDBAQAAAOoBAsIBAAAA6gEIwwEAAADqAQjIAQAAzQLqASIEwQEAAADqAQLCAQAAAOoBCMMBAAAA6gEIyAEAAM4C6gEiDQcAALACACAiAADQAgAgIwAA0AIAIFQAANACACBVAADQAgAgwQEIAAAAAcIBCAAAAAXDAQgAAAAFxAEIAAAAAcUBCAAAAAHGAQgAAAABxwEIAAAAAcgBCADPAgAhCMEBCAAAAAHCAQgAAAAFwwEIAAAABcQBCAAAAAHFAQgAAAABxgEIAAAAAccBCAAAAAHIAQgA0AIAIQq4AQAA0QIAMLkBAABvABC6AQAA0QIAMLsBAQCYAgAhvgEBAJgCACG_AQEAmAIAIcABQACaAgAhzwFAAJoCACHwAQEAmAIAIfEBAQCoAgAhCLgBAADSAgAwuQEAAFcAELoBAADSAgAwuwEBAJgCACHAAUAAmgIAIc8BQACaAgAh0AEBAJgCACHlAQEAqAIAIQkGAAC7AgAguAEAANMCADC5AQAARAAQugEAANMCADC7AQEApAIAIcABQAClAgAhzwFAAKUCACHQAQEApAIAIeUBAQC2AgAhELgBAADUAgAwuQEAAD4AELoBAADUAgAwuwEBAJgCACG-AQEAmAIAIcABQACaAgAhzwFAAJoCACHUAQEAqAIAIfIBAQCYAgAh8wEBAJgCACH0AQEAqAIAIfUBAQCoAgAh9gEBAKgCACH3AUAA1QIAIfgBQADVAgAh-QEBAKgCACELBwAAsAIAICIAANcCACAjAADXAgAgwQFAAAAAAcIBQAAAAAXDAUAAAAAFxAFAAAAAAcUBQAAAAAHGAUAAAAABxwFAAAAAAcgBQADWAgAhCwcAALACACAiAADXAgAgIwAA1wIAIMEBQAAAAAHCAUAAAAAFwwFAAAAABcQBQAAAAAHFAUAAAAABxgFAAAAAAccBQAAAAAHIAUAA1gIAIQjBAUAAAAABwgFAAAAABcMBQAAAAAXEAUAAAAABxQFAAAAAAcYBQAAAAAHHAUAAAAAByAFAANcCACEMAwAA2wIAIAoAANwCACC4AQAA2AIAMLkBAAAbABC6AQAA2AIAMLsBAQCkAgAhvgEBAKQCACG_AQEAtgIAIcABQAClAgAh2AEAANoC4gEi3wEIANkCACHgAQEApAIAIQjBAQgAAAABwgEIAAAABMMBCAAAAATEAQgAAAABxQEIAAAAAcYBCAAAAAHHAQgAAAAByAEIAMYCACEEwQEAAADiAQLCAQAAAOIBCMMBAAAA4gEIyAEAAMQC4gEiFQQAALkCACAFAAC6AgAgBgAAuwIAIAsAALwCACAOAAC9AgAgDwAAvgIAILgBAAC0AgAwuQEAANIBABC6AQAAtAIAMLsBAQCkAgAhwAFAAKUCACHPAUAApQIAIdABAQCkAgAh0QEBAKQCACHSASAAtQIAIdMBAQC2AgAh1AEBALYCACHWAQAAtwLWASLYAQAAuALYASL7AQAA0gEAIPwBAADSAQAgGAgAAOYCACAJAADbAgAgCwAAvAIAIA4AAL0CACAPAAC-AgAguAEAAOMCADC5AQAACgAQugEAAOMCADC7AQEApAIAIcABQAClAgAhzwFAAKUCACHYAQAA5QLqASLiAQEApAIAIeMBAQCkAgAh5AEBAKQCACHlAQEApAIAIeYBAADKAgAg5wEgALUCACHoAQgA5AIAIeoBAQC2AgAh6wEBAKQCACHsAQEApAIAIfsBAAAKACD8AQAACgAgDgMAANsCACAKAADeAgAgDAAA3wIAIA0AAL0CACC4AQAA3QIAMLkBAAAUABC6AQAA3QIAMLsBAQCkAgAhvgEBAKQCACG_AQEApAIAIcABQAClAgAhzwFAAKUCACHwAQEApAIAIfEBAQC2AgAhGAgAAOYCACAJAADbAgAgCwAAvAIAIA4AAL0CACAPAAC-AgAguAEAAOMCADC5AQAACgAQugEAAOMCADC7AQEApAIAIcABQAClAgAhzwFAAKUCACHYAQAA5QLqASLiAQEApAIAIeMBAQCkAgAh5AEBAKQCACHlAQEApAIAIeYBAADKAgAg5wEgALUCACHoAQgA5AIAIeoBAQC2AgAh6wEBAKQCACHsAQEApAIAIfsBAAAKACD8AQAACgAgEAMAANsCACAKAADeAgAgDAAA3wIAIA0AAL0CACC4AQAA3QIAMLkBAAAUABC6AQAA3QIAMLsBAQCkAgAhvgEBAKQCACG_AQEApAIAIcABQAClAgAhzwFAAKUCACHwAQEApAIAIfEBAQC2AgAh-wEAABQAIPwBAAAUACACvgEBAAAAAb8BAQAAAAEKAwAA2wIAIAoAAN4CACC4AQAA4QIAMLkBAAAQABC6AQAA4QIAMLsBAQCkAgAhvQEAAOICvQEivgEBAKQCACG_AQEApAIAIcABQAClAgAhBMEBAAAAvQECwgEAAAC9AQjDAQAAAL0BCMgBAACfAr0BIhYIAADmAgAgCQAA2wIAIAsAALwCACAOAAC9AgAgDwAAvgIAILgBAADjAgAwuQEAAAoAELoBAADjAgAwuwEBAKQCACHAAUAApQIAIc8BQAClAgAh2AEAAOUC6gEi4gEBAKQCACHjAQEApAIAIeQBAQCkAgAh5QEBAKQCACHmAQAAygIAIOcBIAC1AgAh6AEIAOQCACHqAQEAtgIAIesBAQCkAgAh7AEBAKQCACEIwQEIAAAAAcIBCAAAAAXDAQgAAAAFxAEIAAAAAcUBCAAAAAHGAQgAAAABxwEIAAAAAcgBCADQAgAhBMEBAAAA6gECwgEAAADqAQjDAQAAAOoBCMgBAADOAuoBIgsGAAC7AgAguAEAANMCADC5AQAARAAQugEAANMCADC7AQEApAIAIcABQAClAgAhzwFAAKUCACHQAQEApAIAIeUBAQC2AgAh-wEAAEQAIPwBAABEACARAwAA2wIAILgBAADnAgAwuQEAAAcAELoBAADnAgAwuwEBAKQCACG-AQEApAIAIcABQAClAgAhzwFAAKUCACHUAQEAtgIAIfIBAQCkAgAh8wEBAKQCACH0AQEAtgIAIfUBAQC2AgAh9gEBALYCACH3AUAA6AIAIfgBQADoAgAh-QEBALYCACEIwQFAAAAAAcIBQAAAAAXDAUAAAAAFxAFAAAAAAcUBQAAAAAHGAUAAAAABxwFAAAAAAcgBQADXAgAhDAMAANsCACC4AQAA6QIAMLkBAAADABC6AQAA6QIAMLsBAQCkAgAhvgEBAKQCACHAAUAApQIAIc4BQAClAgAhzwFAAKUCACHcAQEApAIAId0BAQC2AgAh3gEBALYCACEAAAABgAIBAAAAAQGAAgAAAL0BAgGAAkAAAAABBRwAAIAFACAdAACGBQAg_QEAAIEFACD-AQAAhQUAIIMCAADPAQAgBRwAAP4EACAdAACDBQAg_QEAAP8EACD-AQAAggUAIIMCAAAMACADHAAAgAUAIP0BAACBBQAggwIAAM8BACADHAAA_gQAIP0BAAD_BAAggwIAAAwAIAAAAAAAAAABgAIgAAAAAQGAAgEAAAABAYACAAAA1gECAYACAAAA2AECCxwAAIAEADAdAACFBAAw_QEAAIEEADD-AQAAggQAMP8BAACDBAAggAIAAIQEADCBAgAAhAQAMIICAACEBAAwgwIAAIQEADCEAgAAhgQAMIUCAACHBAAwCxwAAPMDADAdAAD4AwAw_QEAAPQDADD-AQAA9QMAMP8BAAD2AwAggAIAAPcDADCBAgAA9wMAMIICAAD3AwAwgwIAAPcDADCEAgAA-QMAMIUCAAD6AwAwCxwAAL4DADAdAADDAwAw_QEAAL8DADD-AQAAwAMAMP8BAADBAwAggAIAAMIDADCBAgAAwgMAMIICAADCAwAwgwIAAMIDADCEAgAAxAMAMIUCAADFAwAwCxwAALIDADAdAAC3AwAw_QEAALMDADD-AQAAtAMAMP8BAAC1AwAggAIAALYDADCBAgAAtgMAMIICAAC2AwAwgwIAALYDADCEAgAAuAMAMIUCAAC5AwAwCxwAAJUDADAdAACaAwAw_QEAAJYDADD-AQAAlwMAMP8BAACYAwAggAIAAJkDADCBAgAAmQMAMIICAACZAwAwgwIAAJkDADCEAgAAmwMAMIUCAACcAwAwCxwAAIUDADAdAACKAwAw_QEAAIYDADD-AQAAhwMAMP8BAACIAwAggAIAAIkDADCBAgAAiQMAMIICAACJAwAwgwIAAIkDADCEAgAAiwMAMIUCAACMAwAwBwoAAJQDACC7AQEAAAABvwEBAAAAAcABQAAAAAHYAQAAAOIBAt8BCAAAAAHgAQEAAAABAgAAAB0AIBwAAJMDACADAAAAHQAgHAAAkwMAIB0AAJEDACABFQAA_QQAMAwDAADbAgAgCgAA3AIAILgBAADYAgAwuQEAABsAELoBAADYAgAwuwEBAAAAAb4BAQCkAgAhvwEBALYCACHAAUAApQIAIdgBAADaAuIBIt8BCADZAgAh4AEBAAAAAQIAAAAdACAVAACRAwAgAgAAAI0DACAVAACOAwAgCrgBAACMAwAwuQEAAI0DABC6AQAAjAMAMLsBAQCkAgAhvgEBAKQCACG_AQEAtgIAIcABQAClAgAh2AEAANoC4gEi3wEIANkCACHgAQEApAIAIQq4AQAAjAMAMLkBAACNAwAQugEAAIwDADC7AQEApAIAIb4BAQCkAgAhvwEBALYCACHAAUAApQIAIdgBAADaAuIBIt8BCADZAgAh4AEBAKQCACEGuwEBAO0CACG_AQEA_AIAIcABQADvAgAh2AEAAJAD4gEi3wEIAI8DACHgAQEA7QIAIQWAAggAAAABhgIIAAAAAYcCCAAAAAGIAggAAAABiQIIAAAAAQGAAgAAAOIBAgcKAACSAwAguwEBAO0CACG_AQEA_AIAIcABQADvAgAh2AEAAJAD4gEi3wEIAI8DACHgAQEA7QIAIQccAAD4BAAgHQAA-wQAIP0BAAD5BAAg_gEAAPoEACCBAgAACgAgggIAAAoAIIMCAAAMACAHCgAAlAMAILsBAQAAAAG_AQEAAAABwAFAAAAAAdgBAAAA4gEC3wEIAAAAAeABAQAAAAEDHAAA-AQAIP0BAAD5BAAggwIAAAwAIAkKAACuAwAgDAAAsQMAIA0AAK8DACC7AQEAAAABvwEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAfEBAQAAAAECAAAAFgAgHAAAsAMAIAMAAAAWACAcAACwAwAgHQAAnwMAIAEVAAD3BAAwDgMAANsCACAKAADeAgAgDAAA3wIAIA0AAL0CACC4AQAA3QIAMLkBAAAUABC6AQAA3QIAMLsBAQAAAAG-AQEApAIAIb8BAQCkAgAhwAFAAKUCACHPAUAApQIAIfABAQCkAgAh8QEBALYCACECAAAAFgAgFQAAnwMAIAIAAACdAwAgFQAAngMAIAq4AQAAnAMAMLkBAACdAwAQugEAAJwDADC7AQEApAIAIb4BAQCkAgAhvwEBAKQCACHAAUAApQIAIc8BQAClAgAh8AEBAKQCACHxAQEAtgIAIQq4AQAAnAMAMLkBAACdAwAQugEAAJwDADC7AQEApAIAIb4BAQCkAgAhvwEBAKQCACHAAUAApQIAIc8BQAClAgAh8AEBAKQCACHxAQEAtgIAIQa7AQEA7QIAIb8BAQDtAgAhwAFAAO8CACHPAUAA7wIAIfABAQDtAgAh8QEBAPwCACEJCgAAoAMAIAwAAKEDACANAACiAwAguwEBAO0CACG_AQEA7QIAIcABQADvAgAhzwFAAO8CACHwAQEA7QIAIfEBAQD8AgAhBRwAAOkEACAdAAD1BAAg_QEAAOoEACD-AQAA9AQAIIMCAAAMACAHHAAA5wQAIB0AAPIEACD9AQAA6AQAIP4BAADxBAAggQIAABQAIIICAAAUACCDAgAAFgAgCxwAAKMDADAdAACnAwAw_QEAAKQDADD-AQAApQMAMP8BAACmAwAggAIAAJkDADCBAgAAmQMAMIICAACZAwAwgwIAAJkDADCEAgAAqAMAMIUCAACcAwAwCQMAAK0DACAKAACuAwAgDQAArwMAILsBAQAAAAG-AQEAAAABvwEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAQIAAAAWACAcAACsAwAgAwAAABYAIBwAAKwDACAdAACqAwAgARUAAPAEADACAAAAFgAgFQAAqgMAIAIAAACdAwAgFQAAqQMAIAa7AQEA7QIAIb4BAQDtAgAhvwEBAO0CACHAAUAA7wIAIc8BQADvAgAh8AEBAO0CACEJAwAAqwMAIAoAAKADACANAACiAwAguwEBAO0CACG-AQEA7QIAIb8BAQDtAgAhwAFAAO8CACHPAUAA7wIAIfABAQDtAgAhBRwAAOsEACAdAADuBAAg_QEAAOwEACD-AQAA7QQAIIMCAADPAQAgCQMAAK0DACAKAACuAwAgDQAArwMAILsBAQAAAAG-AQEAAAABvwEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAQMcAADrBAAg_QEAAOwEACCDAgAAzwEAIAMcAADpBAAg_QEAAOoEACCDAgAADAAgBBwAAKMDADD9AQAApAMAMP8BAACmAwAggwIAAJkDADAJCgAArgMAIAwAALEDACANAACvAwAguwEBAAAAAb8BAQAAAAHAAUAAAAABzwFAAAAAAfABAQAAAAHxAQEAAAABAxwAAOcEACD9AQAA6AQAIIMCAAAWACAFCgAA8wIAILsBAQAAAAG9AQAAAL0BAr8BAQAAAAHAAUAAAAABAgAAABIAIBwAAL0DACADAAAAEgAgHAAAvQMAIB0AALwDACABFQAA5gQAMAsDAADbAgAgCgAA3gIAILgBAADhAgAwuQEAABAAELoBAADhAgAwuwEBAAAAAb0BAADiAr0BIr4BAQCkAgAhvwEBAKQCACHAAUAApQIAIfoBAADgAgAgAgAAABIAIBUAALwDACACAAAAugMAIBUAALsDACAIuAEAALkDADC5AQAAugMAELoBAAC5AwAwuwEBAKQCACG9AQAA4gK9ASK-AQEApAIAIb8BAQCkAgAhwAFAAKUCACEIuAEAALkDADC5AQAAugMAELoBAAC5AwAwuwEBAKQCACG9AQAA4gK9ASK-AQEApAIAIb8BAQCkAgAhwAFAAKUCACEEuwEBAO0CACG9AQAA7gK9ASK_AQEA7QIAIcABQADvAgAhBQoAAPECACC7AQEA7QIAIb0BAADuAr0BIr8BAQDtAgAhwAFAAO8CACEFCgAA8wIAILsBAQAAAAG9AQAAAL0BAr8BAQAAAAHAAUAAAAABEQgAAO8DACALAADwAwAgDgAA8QMAIA8AAPIDACC7AQEAAAABwAFAAAAAAc8BQAAAAAHYAQAAAOoBAuIBAQAAAAHjAQEAAAAB5AEBAAAAAeUBAQAAAAHmAQAA7gMAIOcBIAAAAAHoAQgAAAAB6gEBAAAAAesBAQAAAAECAAAADAAgHAAA7QMAIAMAAAAMACAcAADtAwAgHQAAywMAIAEVAADlBAAwFggAAOYCACAJAADbAgAgCwAAvAIAIA4AAL0CACAPAAC-AgAguAEAAOMCADC5AQAACgAQugEAAOMCADC7AQEAAAABwAFAAKUCACHPAUAApQIAIdgBAADlAuoBIuIBAQCkAgAh4wEBAKQCACHkAQEApAIAIeUBAQCkAgAh5gEAAMoCACDnASAAtQIAIegBCADkAgAh6gEBALYCACHrAQEApAIAIewBAQCkAgAhAgAAAAwAIBUAAMsDACACAAAAxgMAIBUAAMcDACARuAEAAMUDADC5AQAAxgMAELoBAADFAwAwuwEBAKQCACHAAUAApQIAIc8BQAClAgAh2AEAAOUC6gEi4gEBAKQCACHjAQEApAIAIeQBAQCkAgAh5QEBAKQCACHmAQAAygIAIOcBIAC1AgAh6AEIAOQCACHqAQEAtgIAIesBAQCkAgAh7AEBAKQCACERuAEAAMUDADC5AQAAxgMAELoBAADFAwAwuwEBAKQCACHAAUAApQIAIc8BQAClAgAh2AEAAOUC6gEi4gEBAKQCACHjAQEApAIAIeQBAQCkAgAh5QEBAKQCACHmAQAAygIAIOcBIAC1AgAh6AEIAOQCACHqAQEAtgIAIesBAQCkAgAh7AEBAKQCACENuwEBAO0CACHAAUAA7wIAIc8BQADvAgAh2AEAAMoD6gEi4gEBAO0CACHjAQEA7QIAIeQBAQDtAgAh5QEBAO0CACHmAQAAyAMAIOcBIAD7AgAh6AEIAMkDACHqAQEA_AIAIesBAQDtAgAhAoACAQAAAASKAgEAAAAFBYACCAAAAAGGAggAAAABhwIIAAAAAYgCCAAAAAGJAggAAAABAYACAAAA6gECEQgAAMwDACALAADNAwAgDgAAzgMAIA8AAM8DACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHYAQAAygPqASLiAQEA7QIAIeMBAQDtAgAh5AEBAO0CACHlAQEA7QIAIeYBAADIAwAg5wEgAPsCACHoAQgAyQMAIeoBAQD8AgAh6wEBAO0CACEFHAAA2AQAIB0AAOMEACD9AQAA2QQAIP4BAADiBAAggwIAAEEAIAscAADkAwAwHQAA6AMAMP0BAADlAwAw_gEAAOYDADD_AQAA5wMAIIACAAC2AwAwgQIAALYDADCCAgAAtgMAMIMCAAC2AwAwhAIAAOkDADCFAgAAuQMAMAscAADbAwAwHQAA3wMAMP0BAADcAwAw_gEAAN0DADD_AQAA3gMAIIACAACZAwAwgQIAAJkDADCCAgAAmQMAMIMCAACZAwAwhAIAAOADADCFAgAAnAMAMAscAADQAwAwHQAA1AMAMP0BAADRAwAw_gEAANIDADD_AQAA0wMAIIACAACJAwAwgQIAAIkDADCCAgAAiQMAMIMCAACJAwAwhAIAANUDADCFAgAAjAMAMAcDAADaAwAguwEBAAAAAb4BAQAAAAHAAUAAAAAB2AEAAADiAQLfAQgAAAAB4AEBAAAAAQIAAAAdACAcAADZAwAgAwAAAB0AIBwAANkDACAdAADXAwAgARUAAOEEADACAAAAHQAgFQAA1wMAIAIAAACNAwAgFQAA1gMAIAa7AQEA7QIAIb4BAQDtAgAhwAFAAO8CACHYAQAAkAPiASLfAQgAjwMAIeABAQDtAgAhBwMAANgDACC7AQEA7QIAIb4BAQDtAgAhwAFAAO8CACHYAQAAkAPiASLfAQgAjwMAIeABAQDtAgAhBRwAANwEACAdAADfBAAg_QEAAN0EACD-AQAA3gQAIIMCAADPAQAgBwMAANoDACC7AQEAAAABvgEBAAAAAcABQAAAAAHYAQAAAOIBAt8BCAAAAAHgAQEAAAABAxwAANwEACD9AQAA3QQAIIMCAADPAQAgCQMAAK0DACAMAACxAwAgDQAArwMAILsBAQAAAAG-AQEAAAABwAFAAAAAAc8BQAAAAAHwAQEAAAAB8QEBAAAAAQIAAAAWACAcAADjAwAgAwAAABYAIBwAAOMDACAdAADiAwAgARUAANsEADACAAAAFgAgFQAA4gMAIAIAAACdAwAgFQAA4QMAIAa7AQEA7QIAIb4BAQDtAgAhwAFAAO8CACHPAUAA7wIAIfABAQDtAgAh8QEBAPwCACEJAwAAqwMAIAwAAKEDACANAACiAwAguwEBAO0CACG-AQEA7QIAIcABQADvAgAhzwFAAO8CACHwAQEA7QIAIfEBAQD8AgAhCQMAAK0DACAMAACxAwAgDQAArwMAILsBAQAAAAG-AQEAAAABwAFAAAAAAc8BQAAAAAHwAQEAAAAB8QEBAAAAAQUDAADyAgAguwEBAAAAAb0BAAAAvQECvgEBAAAAAcABQAAAAAECAAAAEgAgHAAA7AMAIAMAAAASACAcAADsAwAgHQAA6wMAIAEVAADaBAAwAgAAABIAIBUAAOsDACACAAAAugMAIBUAAOoDACAEuwEBAO0CACG9AQAA7gK9ASK-AQEA7QIAIcABQADvAgAhBQMAAPACACC7AQEA7QIAIb0BAADuAr0BIr4BAQDtAgAhwAFAAO8CACEFAwAA8gIAILsBAQAAAAG9AQAAAL0BAr4BAQAAAAHAAUAAAAABEQgAAO8DACALAADwAwAgDgAA8QMAIA8AAPIDACC7AQEAAAABwAFAAAAAAc8BQAAAAAHYAQAAAOoBAuIBAQAAAAHjAQEAAAAB5AEBAAAAAeUBAQAAAAHmAQAA7gMAIOcBIAAAAAHoAQgAAAAB6gEBAAAAAesBAQAAAAEBgAIBAAAABAMcAADYBAAg_QEAANkEACCDAgAAQQAgBBwAAOQDADD9AQAA5QMAMP8BAADnAwAggwIAALYDADAEHAAA2wMAMP0BAADcAwAw_wEAAN4DACCDAgAAmQMAMAQcAADQAwAw_QEAANEDADD_AQAA0wMAIIMCAACJAwAwDLsBAQAAAAHAAUAAAAABzwFAAAAAAdQBAQAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBQAAAAAH4AUAAAAAB-QEBAAAAAQIAAAABACAcAAD_AwAgAwAAAAEAIBwAAP8DACAdAAD-AwAgARUAANcEADARAwAA2wIAILgBAADnAgAwuQEAAAcAELoBAADnAgAwuwEBAAAAAb4BAQCkAgAhwAFAAKUCACHPAUAApQIAIdQBAQC2AgAh8gEBAKQCACHzAQEApAIAIfQBAQC2AgAh9QEBALYCACH2AQEAtgIAIfcBQADoAgAh-AFAAOgCACH5AQEAtgIAIQIAAAABACAVAAD-AwAgAgAAAPsDACAVAAD8AwAgELgBAAD6AwAwuQEAAPsDABC6AQAA-gMAMLsBAQCkAgAhvgEBAKQCACHAAUAApQIAIc8BQAClAgAh1AEBALYCACHyAQEApAIAIfMBAQCkAgAh9AEBALYCACH1AQEAtgIAIfYBAQC2AgAh9wFAAOgCACH4AUAA6AIAIfkBAQC2AgAhELgBAAD6AwAwuQEAAPsDABC6AQAA-gMAMLsBAQCkAgAhvgEBAKQCACHAAUAApQIAIc8BQAClAgAh1AEBALYCACHyAQEApAIAIfMBAQCkAgAh9AEBALYCACH1AQEAtgIAIfYBAQC2AgAh9wFAAOgCACH4AUAA6AIAIfkBAQC2AgAhDLsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdQBAQD8AgAh8gEBAO0CACHzAQEA7QIAIfQBAQD8AgAh9QEBAPwCACH2AQEA_AIAIfcBQAD9AwAh-AFAAP0DACH5AQEA_AIAIQGAAkAAAAABDLsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdQBAQD8AgAh8gEBAO0CACHzAQEA7QIAIfQBAQD8AgAh9QEBAPwCACH2AQEA_AIAIfcBQAD9AwAh-AFAAP0DACH5AQEA_AIAIQy7AQEAAAABwAFAAAAAAc8BQAAAAAHUAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAEHuwEBAAAAAcABQAAAAAHOAUAAAAABzwFAAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAQIAAAAFACAcAACLBAAgAwAAAAUAIBwAAIsEACAdAACKBAAgARUAANYEADAMAwAA2wIAILgBAADpAgAwuQEAAAMAELoBAADpAgAwuwEBAAAAAb4BAQCkAgAhwAFAAKUCACHOAUAApQIAIc8BQAClAgAh3AEBAAAAAd0BAQC2AgAh3gEBALYCACECAAAABQAgFQAAigQAIAIAAACIBAAgFQAAiQQAIAu4AQAAhwQAMLkBAACIBAAQugEAAIcEADC7AQEApAIAIb4BAQCkAgAhwAFAAKUCACHOAUAApQIAIc8BQAClAgAh3AEBAKQCACHdAQEAtgIAId4BAQC2AgAhC7gBAACHBAAwuQEAAIgEABC6AQAAhwQAMLsBAQCkAgAhvgEBAKQCACHAAUAApQIAIc4BQAClAgAhzwFAAKUCACHcAQEApAIAId0BAQC2AgAh3gEBALYCACEHuwEBAO0CACHAAUAA7wIAIc4BQADvAgAhzwFAAO8CACHcAQEA7QIAId0BAQD8AgAh3gEBAPwCACEHuwEBAO0CACHAAUAA7wIAIc4BQADvAgAhzwFAAO8CACHcAQEA7QIAId0BAQD8AgAh3gEBAPwCACEHuwEBAAAAAcABQAAAAAHOAUAAAAABzwFAAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAQQcAACABAAw_QEAAIEEADD_AQAAgwQAIIMCAACEBAAwBBwAAPMDADD9AQAA9AMAMP8BAAD2AwAggwIAAPcDADAEHAAAvgMAMP0BAAC_AwAw_wEAAMEDACCDAgAAwgMAMAQcAACyAwAw_QEAALMDADD_AQAAtQMAIIMCAAC2AwAwBBwAAJUDADD9AQAAlgMAMP8BAACYAwAggwIAAJkDADAEHAAAhQMAMP0BAACGAwAw_wEAAIgDACCDAgAAiQMAMAAAAAAAAAAAAAUcAADRBAAgHQAA1AQAIP0BAADSBAAg_gEAANMEACCDAgAAzwEAIAMcAADRBAAg_QEAANIEACCDAgAAzwEAIAAAAAAAAAAAAAAAAAAFHAAAzAQAIB0AAM8EACD9AQAAzQQAIP4BAADOBAAggwIAAM8BACADHAAAzAQAIP0BAADNBAAggwIAAM8BACAAAAAAAAALHAAAswQAMB0AALcEADD9AQAAtAQAMP4BAAC1BAAw_wEAALYEACCAAgAAwgMAMIECAADCAwAwggIAAMIDADCDAgAAwgMAMIQCAAC4BAAwhQIAAMUDADARCQAAqwQAIAsAAPADACAOAADxAwAgDwAA8gMAILsBAQAAAAHAAUAAAAABzwFAAAAAAdgBAAAA6gEC4gEBAAAAAeMBAQAAAAHkAQEAAAAB5QEBAAAAAeYBAADuAwAg5wEgAAAAAegBCAAAAAHqAQEAAAAB7AEBAAAAAQIAAAAMACAcAAC7BAAgAwAAAAwAIBwAALsEACAdAAC6BAAgARUAAMsEADACAAAADAAgFQAAugQAIAIAAADGAwAgFQAAuQQAIA27AQEA7QIAIcABQADvAgAhzwFAAO8CACHYAQAAygPqASLiAQEA7QIAIeMBAQDtAgAh5AEBAO0CACHlAQEA7QIAIeYBAADIAwAg5wEgAPsCACHoAQgAyQMAIeoBAQD8AgAh7AEBAO0CACERCQAAqgQAIAsAAM0DACAOAADOAwAgDwAAzwMAILsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdgBAADKA-oBIuIBAQDtAgAh4wEBAO0CACHkAQEA7QIAIeUBAQDtAgAh5gEAAMgDACDnASAA-wIAIegBCADJAwAh6gEBAPwCACHsAQEA7QIAIREJAACrBAAgCwAA8AMAIA4AAPEDACAPAADyAwAguwEBAAAAAcABQAAAAAHPAUAAAAAB2AEAAADqAQLiAQEAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gEAAO4DACDnASAAAAAB6AEIAAAAAeoBAQAAAAHsAQEAAAABBBwAALMEADD9AQAAtAQAMP8BAAC2BAAggwIAAMIDADAAAAAFHAAAxgQAIB0AAMkEACD9AQAAxwQAIP4BAADIBAAggwIAAM8BACADHAAAxgQAIP0BAADHBAAggwIAAM8BACAIBAAAkgQAIAUAAJMEACAGAACUBAAgCwAAlQQAIA4AAJYEACAPAACXBAAg0wEAAPcCACDUAQAA9wIAIAcIAADFBAAgCQAAwgQAIAsAAJUEACAOAACWBAAgDwAAlwQAIOgBAAD3AgAg6gEAAPcCACAFAwAAwgQAIAoAAMMEACAMAADEBAAgDQAAlgQAIPEBAAD3AgAgAgYAAJQEACDlAQAA9wIAIA8EAACMBAAgBgAAjgQAIAsAAI8EACAOAACQBAAgDwAAkQQAILsBAQAAAAHAAUAAAAABzwFAAAAAAdABAQAAAAHRAQEAAAAB0gEgAAAAAdMBAQAAAAHUAQEAAAAB1gEAAADWAQLYAQAAANgBAgIAAADPAQAgHAAAxgQAIAMAAADSAQAgHAAAxgQAIB0AAMoEACARAAAA0gEAIAQAAP8CACAGAACBAwAgCwAAggMAIA4AAIMDACAPAACEAwAgFQAAygQAILsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdABAQDtAgAh0QEBAO0CACHSASAA-wIAIdMBAQD8AgAh1AEBAPwCACHWAQAA_QLWASLYAQAA_gLYASIPBAAA_wIAIAYAAIEDACALAACCAwAgDgAAgwMAIA8AAIQDACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHQAQEA7QIAIdEBAQDtAgAh0gEgAPsCACHTAQEA_AIAIdQBAQD8AgAh1gEAAP0C1gEi2AEAAP4C2AEiDbsBAQAAAAHAAUAAAAABzwFAAAAAAdgBAAAA6gEC4gEBAAAAAeMBAQAAAAHkAQEAAAAB5QEBAAAAAeYBAADuAwAg5wEgAAAAAegBCAAAAAHqAQEAAAAB7AEBAAAAAQ8EAACMBAAgBQAAjQQAIAsAAI8EACAOAACQBAAgDwAAkQQAILsBAQAAAAHAAUAAAAABzwFAAAAAAdABAQAAAAHRAQEAAAAB0gEgAAAAAdMBAQAAAAHUAQEAAAAB1gEAAADWAQLYAQAAANgBAgIAAADPAQAgHAAAzAQAIAMAAADSAQAgHAAAzAQAIB0AANAEACARAAAA0gEAIAQAAP8CACAFAACAAwAgCwAAggMAIA4AAIMDACAPAACEAwAgFQAA0AQAILsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdABAQDtAgAh0QEBAO0CACHSASAA-wIAIdMBAQD8AgAh1AEBAPwCACHWAQAA_QLWASLYAQAA_gLYASIPBAAA_wIAIAUAAIADACALAACCAwAgDgAAgwMAIA8AAIQDACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHQAQEA7QIAIdEBAQDtAgAh0gEgAPsCACHTAQEA_AIAIdQBAQD8AgAh1gEAAP0C1gEi2AEAAP4C2AEiDwUAAI0EACAGAACOBAAgCwAAjwQAIA4AAJAEACAPAACRBAAguwEBAAAAAcABQAAAAAHPAUAAAAAB0AEBAAAAAdEBAQAAAAHSASAAAAAB0wEBAAAAAdQBAQAAAAHWAQAAANYBAtgBAAAA2AECAgAAAM8BACAcAADRBAAgAwAAANIBACAcAADRBAAgHQAA1QQAIBEAAADSAQAgBQAAgAMAIAYAAIEDACALAACCAwAgDgAAgwMAIA8AAIQDACAVAADVBAAguwEBAO0CACHAAUAA7wIAIc8BQADvAgAh0AEBAO0CACHRAQEA7QIAIdIBIAD7AgAh0wEBAPwCACHUAQEA_AIAIdYBAAD9AtYBItgBAAD-AtgBIg8FAACAAwAgBgAAgQMAIAsAAIIDACAOAACDAwAgDwAAhAMAILsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdABAQDtAgAh0QEBAO0CACHSASAA-wIAIdMBAQD8AgAh1AEBAPwCACHWAQAA_QLWASLYAQAA_gLYASIHuwEBAAAAAcABQAAAAAHOAUAAAAABzwFAAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAQy7AQEAAAABwAFAAAAAAc8BQAAAAAHUAQEAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAEFuwEBAAAAAcABQAAAAAHPAUAAAAAB0AEBAAAAAeUBAQAAAAECAAAAQQAgHAAA2AQAIAS7AQEAAAABvQEAAAC9AQK-AQEAAAABwAFAAAAAAQa7AQEAAAABvgEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAfEBAQAAAAEPBAAAjAQAIAUAAI0EACAGAACOBAAgCwAAjwQAIA4AAJAEACC7AQEAAAABwAFAAAAAAc8BQAAAAAHQAQEAAAAB0QEBAAAAAdIBIAAAAAHTAQEAAAAB1AEBAAAAAdYBAAAA1gEC2AEAAADYAQICAAAAzwEAIBwAANwEACADAAAA0gEAIBwAANwEACAdAADgBAAgEQAAANIBACAEAAD_AgAgBQAAgAMAIAYAAIEDACALAACCAwAgDgAAgwMAIBUAAOAEACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHQAQEA7QIAIdEBAQDtAgAh0gEgAPsCACHTAQEA_AIAIdQBAQD8AgAh1gEAAP0C1gEi2AEAAP4C2AEiDwQAAP8CACAFAACAAwAgBgAAgQMAIAsAAIIDACAOAACDAwAguwEBAO0CACHAAUAA7wIAIc8BQADvAgAh0AEBAO0CACHRAQEA7QIAIdIBIAD7AgAh0wEBAPwCACHUAQEA_AIAIdYBAAD9AtYBItgBAAD-AtgBIga7AQEAAAABvgEBAAAAAcABQAAAAAHYAQAAAOIBAt8BCAAAAAHgAQEAAAABAwAAAEQAIBwAANgEACAdAADkBAAgBwAAAEQAIBUAAOQEACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHQAQEA7QIAIeUBAQD8AgAhBbsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdABAQDtAgAh5QEBAPwCACENuwEBAAAAAcABQAAAAAHPAUAAAAAB2AEAAADqAQLiAQEAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gEAAO4DACDnASAAAAAB6AEIAAAAAeoBAQAAAAHrAQEAAAABBLsBAQAAAAG9AQAAAL0BAr8BAQAAAAHAAUAAAAABCgMAAK0DACAKAACuAwAgDAAAsQMAILsBAQAAAAG-AQEAAAABvwEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAfEBAQAAAAECAAAAFgAgHAAA5wQAIBIIAADvAwAgCQAAqwQAIAsAAPADACAPAADyAwAguwEBAAAAAcABQAAAAAHPAUAAAAAB2AEAAADqAQLiAQEAAAAB4wEBAAAAAeQBAQAAAAHlAQEAAAAB5gEAAO4DACDnASAAAAAB6AEIAAAAAeoBAQAAAAHrAQEAAAAB7AEBAAAAAQIAAAAMACAcAADpBAAgDwQAAIwEACAFAACNBAAgBgAAjgQAIAsAAI8EACAPAACRBAAguwEBAAAAAcABQAAAAAHPAUAAAAAB0AEBAAAAAdEBAQAAAAHSASAAAAAB0wEBAAAAAdQBAQAAAAHWAQAAANYBAtgBAAAA2AECAgAAAM8BACAcAADrBAAgAwAAANIBACAcAADrBAAgHQAA7wQAIBEAAADSAQAgBAAA_wIAIAUAAIADACAGAACBAwAgCwAAggMAIA8AAIQDACAVAADvBAAguwEBAO0CACHAAUAA7wIAIc8BQADvAgAh0AEBAO0CACHRAQEA7QIAIdIBIAD7AgAh0wEBAPwCACHUAQEA_AIAIdYBAAD9AtYBItgBAAD-AtgBIg8EAAD_AgAgBQAAgAMAIAYAAIEDACALAACCAwAgDwAAhAMAILsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdABAQDtAgAh0QEBAO0CACHSASAA-wIAIdMBAQD8AgAh1AEBAPwCACHWAQAA_QLWASLYAQAA_gLYASIGuwEBAAAAAb4BAQAAAAG_AQEAAAABwAFAAAAAAc8BQAAAAAHwAQEAAAABAwAAABQAIBwAAOcEACAdAADzBAAgDAAAABQAIAMAAKsDACAKAACgAwAgDAAAoQMAIBUAAPMEACC7AQEA7QIAIb4BAQDtAgAhvwEBAO0CACHAAUAA7wIAIc8BQADvAgAh8AEBAO0CACHxAQEA_AIAIQoDAACrAwAgCgAAoAMAIAwAAKEDACC7AQEA7QIAIb4BAQDtAgAhvwEBAO0CACHAAUAA7wIAIc8BQADvAgAh8AEBAO0CACHxAQEA_AIAIQMAAAAKACAcAADpBAAgHQAA9gQAIBQAAAAKACAIAADMAwAgCQAAqgQAIAsAAM0DACAPAADPAwAgFQAA9gQAILsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdgBAADKA-oBIuIBAQDtAgAh4wEBAO0CACHkAQEA7QIAIeUBAQDtAgAh5gEAAMgDACDnASAA-wIAIegBCADJAwAh6gEBAPwCACHrAQEA7QIAIewBAQDtAgAhEggAAMwDACAJAACqBAAgCwAAzQMAIA8AAM8DACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHYAQAAygPqASLiAQEA7QIAIeMBAQDtAgAh5AEBAO0CACHlAQEA7QIAIeYBAADIAwAg5wEgAPsCACHoAQgAyQMAIeoBAQD8AgAh6wEBAO0CACHsAQEA7QIAIQa7AQEAAAABvwEBAAAAAcABQAAAAAHPAUAAAAAB8AEBAAAAAfEBAQAAAAESCAAA7wMAIAkAAKsEACALAADwAwAgDgAA8QMAILsBAQAAAAHAAUAAAAABzwFAAAAAAdgBAAAA6gEC4gEBAAAAAeMBAQAAAAHkAQEAAAAB5QEBAAAAAeYBAADuAwAg5wEgAAAAAegBCAAAAAHqAQEAAAAB6wEBAAAAAewBAQAAAAECAAAADAAgHAAA-AQAIAMAAAAKACAcAAD4BAAgHQAA_AQAIBQAAAAKACAIAADMAwAgCQAAqgQAIAsAAM0DACAOAADOAwAgFQAA_AQAILsBAQDtAgAhwAFAAO8CACHPAUAA7wIAIdgBAADKA-oBIuIBAQDtAgAh4wEBAO0CACHkAQEA7QIAIeUBAQDtAgAh5gEAAMgDACDnASAA-wIAIegBCADJAwAh6gEBAPwCACHrAQEA7QIAIewBAQDtAgAhEggAAMwDACAJAACqBAAgCwAAzQMAIA4AAM4DACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHYAQAAygPqASLiAQEA7QIAIeMBAQDtAgAh5AEBAO0CACHlAQEA7QIAIeYBAADIAwAg5wEgAPsCACHoAQgAyQMAIeoBAQD8AgAh6wEBAO0CACHsAQEA7QIAIQa7AQEAAAABvwEBAAAAAcABQAAAAAHYAQAAAOIBAt8BCAAAAAHgAQEAAAABEggAAO8DACAJAACrBAAgDgAA8QMAIA8AAPIDACC7AQEAAAABwAFAAAAAAc8BQAAAAAHYAQAAAOoBAuIBAQAAAAHjAQEAAAAB5AEBAAAAAeUBAQAAAAHmAQAA7gMAIOcBIAAAAAHoAQgAAAAB6gEBAAAAAesBAQAAAAHsAQEAAAABAgAAAAwAIBwAAP4EACAPBAAAjAQAIAUAAI0EACAGAACOBAAgDgAAkAQAIA8AAJEEACC7AQEAAAABwAFAAAAAAc8BQAAAAAHQAQEAAAAB0QEBAAAAAdIBIAAAAAHTAQEAAAAB1AEBAAAAAdYBAAAA1gEC2AEAAADYAQICAAAAzwEAIBwAAIAFACADAAAACgAgHAAA_gQAIB0AAIQFACAUAAAACgAgCAAAzAMAIAkAAKoEACAOAADOAwAgDwAAzwMAIBUAAIQFACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHYAQAAygPqASLiAQEA7QIAIeMBAQDtAgAh5AEBAO0CACHlAQEA7QIAIeYBAADIAwAg5wEgAPsCACHoAQgAyQMAIeoBAQD8AgAh6wEBAO0CACHsAQEA7QIAIRIIAADMAwAgCQAAqgQAIA4AAM4DACAPAADPAwAguwEBAO0CACHAAUAA7wIAIc8BQADvAgAh2AEAAMoD6gEi4gEBAO0CACHjAQEA7QIAIeQBAQDtAgAh5QEBAO0CACHmAQAAyAMAIOcBIAD7AgAh6AEIAMkDACHqAQEA_AIAIesBAQDtAgAh7AEBAO0CACEDAAAA0gEAIBwAAIAFACAdAACHBQAgEQAAANIBACAEAAD_AgAgBQAAgAMAIAYAAIEDACAOAACDAwAgDwAAhAMAIBUAAIcFACC7AQEA7QIAIcABQADvAgAhzwFAAO8CACHQAQEA7QIAIdEBAQDtAgAh0gEgAPsCACHTAQEA_AIAIdQBAQD8AgAh1gEAAP0C1gEi2AEAAP4C2AEiDwQAAP8CACAFAACAAwAgBgAAgQMAIA4AAIMDACAPAACEAwAguwEBAO0CACHAAUAA7wIAIc8BQADvAgAh0AEBAO0CACHRAQEA7QIAIdIBIAD7AgAh0wEBAPwCACHUAQEA_AIAIdYBAAD9AtYBItgBAAD-AtgBIgEDAAIHBAYDBQkBBg0EBwAMCyMHDiQIDyUKAQMAAgYHAAsIAAUJAAILEwcOFwgPHgoCBg4EBwAGAQYPAAIDAAIKAAQFAwACBwAJCgAEDBgIDRkIAQ0aAAIDAAIKHwQDCyAADiEADyIABgQmAAUnAAYoAAspAA4qAA8rAAABAwACAQMAAgMHABEiABIjABMAAAADBwARIgASIwATAAADBwAYIgAZIwAaAAAAAwcAGCIAGSMAGgMDAAIKAAQMZAgDAwACCgAEDGoIAwcAHyIAICMAIQAAAAMHAB8iACAjACECCAAFCQACAggABQkAAgUHACYiACkjACpUACdVACgAAAAAAAUHACYiACkjACpUACdVACgAAAADBwAwIgAxIwAyAAAAAwcAMCIAMSMAMgIDAAIKqwEEAgMAAgqxAQQFBwA3IgA6IwA7VAA4VQA5AAAAAAAFBwA3IgA6IwA7VAA4VQA5AQMAAgEDAAIDBwBAIgBBIwBCAAAAAwcAQCIAQSMAQgAAAwcARyIASCMASQAAAAMHAEciAEgjAEkAAAADBwBPIgBQIwBRAAAAAwcATyIAUCMAUQIDAAIKAAQCAwACCgAEAwcAViIAVyMAWAAAAAMHAFYiAFcjAFgQAgERLAESLQETLgEULwEWMQEXMw0YNA4ZNgEaOA0bOQ8eOgEfOwEgPA0kPxAlQBQmQgUnQwUoRgUpRwUqSAUrSgUsTA0tTRUuTwUvUQ0wUhYxUwUyVAUzVQ00WBc1WRs2Wgg3Wwg4XAg5XQg6Xgg7YAg8Yg09Yxw-Zgg_aA1AaR1BawhCbAhDbQ1EcB5FcSJGcgRHcwRIdARJdQRKdgRLeARMeg1NeyNOfQRPfw1QgAEkUYEBBFKCAQRTgwENVoYBJVeHAStYiQEsWYoBLFqNASxbjgEsXI8BLF2RASxekwENX5QBLWCWASxhmAENYpkBLmOaASxkmwEsZZwBDWafAS9noAEzaKEBCmmiAQpqowEKa6QBCmylAQptpwEKbqkBDW-qATRwrQEKca8BDXKwATVzsgEKdLMBCnW0AQ12twE2d7gBPHi5AQN5ugEDersBA3u8AQN8vQEDfb8BA37BAQ1_wgE9gAHEAQOBAcYBDYIBxwE-gwHIAQOEAckBA4UBygENhgHNAT-HAc4BQ4gB0AECiQHRAQKKAdQBAosB1QECjAHWAQKNAdgBAo4B2gENjwHbAUSQAd0BApEB3wENkgHgAUWTAeEBApQB4gEClQHjAQ2WAeYBRpcB5wFKmAHpAUuZAeoBS5oB7QFLmwHuAUucAe8BS50B8QFLngHzAQ2fAfQBTKAB9gFLoQH4AQ2iAfkBTaMB-gFLpAH7AUulAfwBDaYB_wFOpwGAAlKoAYECB6kBggIHqgGDAgerAYQCB6wBhQIHrQGHAgeuAYkCDa8BigJTsAGMAgexAY4CDbIBjwJUswGQAge0AZECB7UBkgINtgGVAlW3AZYCWQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  CommentScalarFieldEnum: () => CommentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  IdeaScalarFieldEnum: () => IdeaScalarFieldEnum,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NewsletterScalarFieldEnum: () => NewsletterScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  VoteScalarFieldEnum: () => VoteScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.6.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Account: "Account",
  Category: "Category",
  Comment: "Comment",
  Idea: "Idea",
  Newsletter: "Newsletter",
  Payment: "Payment",
  Session: "Session",
  User: "User",
  Verification: "Verification",
  Vote: "Vote"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CommentScalarFieldEnum = {
  id: "id",
  content: "content",
  userId: "userId",
  ideaId: "ideaId",
  parentId: "parentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var IdeaScalarFieldEnum = {
  id: "id",
  title: "title",
  problemStatement: "problemStatement",
  proposedSolution: "proposedSolution",
  description: "description",
  images: "images",
  isPaid: "isPaid",
  price: "price",
  status: "status",
  adminFeedback: "adminFeedback",
  categoryId: "categoryId",
  authorId: "authorId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NewsletterScalarFieldEnum = {
  id: "id",
  email: "email",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  stripeSessionId: "stripeSessionId",
  status: "status",
  userId: "userId",
  ideaId: "ideaId",
  createdAt: "createdAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  password: "password",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VoteScalarFieldEnum = {
  id: "id",
  voteType: "voteType",
  userId: "userId",
  ideaId: "ideaId",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/module/admin/admin.service.ts
var getAllIdeas = async (query) => {
  const {
    status: ideaStatus,
    searchTerm,
    page = "1",
    limit = "10"
  } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  const where = {};
  if (ideaStatus) {
    where.status = ideaStatus;
  }
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNum,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true, image: true }
        },
        _count: { select: { votes: true, comments: true } }
      }
    }),
    prisma.idea.count({ where })
  ]);
  return {
    data: ideas,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage: Math.ceil(total / limitNum)
    }
  };
};
var approveIdea = async (ideaId) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new AppError_default(status.NOT_FOUND, "Idea not found");
  }
  if (idea.status !== "UNDER_REVIEW") {
    throw new AppError_default(status.BAD_REQUEST, "Only ideas under review can be approved");
  }
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: "APPROVED", adminFeedback: null },
    include: {
      category: true,
      author: { select: { id: true, name: true, email: true } }
    }
  });
  return updated;
};
var rejectIdea = async (ideaId, feedback) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new AppError_default(status.NOT_FOUND, "Idea not found");
  }
  if (idea.status !== "UNDER_REVIEW") {
    throw new AppError_default(status.BAD_REQUEST, "Only ideas under review can be rejected");
  }
  if (!feedback || feedback.trim().length === 0) {
    throw new AppError_default(status.BAD_REQUEST, "Feedback is required when rejecting an idea");
  }
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: "REJECTED", adminFeedback: feedback },
    include: {
      category: true,
      author: { select: { id: true, name: true, email: true } }
    }
  });
  return updated;
};
var changeIdeaStatus = async (ideaId, newStatus, feedback) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new AppError_default(status.NOT_FOUND, "Idea not found");
  }
  if (newStatus === "REJECTED" && (!feedback || feedback.trim().length === 0)) {
    throw new AppError_default(status.BAD_REQUEST, "Feedback is required when changing status to REJECTED");
  }
  const data = { status: newStatus };
  if (newStatus !== "REJECTED") {
    data.adminFeedback = null;
  } else {
    data.adminFeedback = feedback;
  }
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data,
    include: {
      category: true,
      author: { select: { id: true, name: true, email: true } }
    }
  });
  return updated;
};
var deleteIdea = async (ideaId) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new AppError_default(status.NOT_FOUND, "Idea not found");
  }
  await prisma.vote.deleteMany({ where: { ideaId } });
  await prisma.comment.deleteMany({ where: { ideaId } });
  await prisma.payment.deleteMany({ where: { ideaId } });
  await prisma.idea.delete({ where: { id: ideaId } });
  return { message: "Idea and all related data deleted successfully" };
};
var getAllUsers = async (query) => {
  const { searchTerm, role, status: userStatus, page = "1", limit = "10" } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  const where = {};
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (role) {
    where.role = role;
  }
  if (userStatus) {
    where.status = userStatus;
  }
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        createdAt: true,
        _count: { select: { ideas: true, comments: true } }
      }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data: users,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage: Math.ceil(total / limitNum)
    }
  };
};
var updateUserStatus = async (userId, newStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(status.NOT_FOUND, "User not found");
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
  return updated;
};
var updateUserRole = async (userId, newRole) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(status.NOT_FOUND, "User not found");
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true, status: true }
  });
  return updated;
};
var getDashboardStats = async () => {
  const [
    totalUsers,
    totalIdeas,
    approvedIdeas,
    pendingIdeas,
    rejectedIdeas,
    totalCategories,
    recentIdeas,
    payments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.idea.count(),
    prisma.idea.count({ where: { status: "APPROVED" } }),
    prisma.idea.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.idea.count({ where: { status: "REJECTED" } }),
    prisma.category.count(),
    prisma.idea.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true } }
      }
    }),
    prisma.payment.findMany({
      where: { status: "COMPLETED" },
      select: { amount: true }
    })
  ]);
  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  return {
    totalUsers,
    totalIdeas,
    totalRevenue,
    totalCategories,
    statusCounts: {
      APPROVED: approvedIdeas,
      UNDER_REVIEW: pendingIdeas,
      REJECTED: rejectedIdeas
    },
    recentIdeas
  };
};
var AdminService = {
  getAllIdeas,
  approveIdea,
  rejectIdea,
  changeIdeaStatus,
  deleteIdea,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getDashboardStats
};

// src/app/module/admin/admin.controller.ts
var getAllIdeas2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllIdeas(req.query);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Ideas retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var approveIdea2 = catchAsync(async (req, res) => {
  const result = await AdminService.approveIdea(req.params.id);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Idea approved successfully",
    data: result
  });
});
var rejectIdea2 = catchAsync(async (req, res) => {
  const { feedback } = req.body;
  const result = await AdminService.rejectIdea(req.params.id, feedback);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Idea rejected with feedback",
    data: result
  });
});
var deleteIdea2 = catchAsync(async (req, res) => {
  const result = await AdminService.deleteIdea(req.params.id);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result
  });
});
var changeIdeaStatus2 = catchAsync(async (req, res) => {
  const { status: newStatus, feedback } = req.body;
  const result = await AdminService.changeIdeaStatus(req.params.id, newStatus, feedback);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: `Idea status changed to ${newStatus}`,
    data: result
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const { status: newStatus } = req.body;
  const result = await AdminService.updateUserStatus(req.params.id, newStatus);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: `User ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`,
    data: result
  });
});
var updateUserRole2 = catchAsync(async (req, res) => {
  const { role } = req.body;
  const result = await AdminService.updateUserRole(req.params.id, role);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "User role updated successfully",
    data: result
  });
});
var getDashboardStats2 = catchAsync(async (_req, res) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result
  });
});
var AdminController = {
  getAllIdeas: getAllIdeas2,
  approveIdea: approveIdea2,
  rejectIdea: rejectIdea2,
  deleteIdea: deleteIdea2,
  changeIdeaStatus: changeIdeaStatus2,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  updateUserRole: updateUserRole2,
  getDashboardStats: getDashboardStats2
};

// src/app/middleware/checkAuth.ts
import status4 from "http-status";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/config/env.ts
import dotenv from "dotenv";
import status3 from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "DATABASE_URL",
    "FRONTEND_URL",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "STRIPE_SECRET_KEY",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status3.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
    EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
    EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
    EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
    EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
  };
};
var envVars = loadEnvVariables();

// src/app/lib/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "MEMBER"
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE"
      }
    }
  },
  secret: envVars.BETTER_AUTH_SECRET,
  baseURL: envVars.BETTER_AUTH_URL,
  trustedOrigins: [envVars.FRONTEND_URL],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    callbackURL: envVars.FRONTEND_URL,
    cookiePrefix: "better-auth",
    useSecureCookies: true,
    // Mandatory for SameSite=None
    crossSubDomainCookies: {
      enabled: false
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  }
});
var SALT_ROUNDS = 12;
var hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};
var comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
var generateToken = (payload) => {
  return jwt.sign(payload, envVars.JWT_SECRET, {
    expiresIn: envVars.JWT_EXPIRES_IN
  });
};

// src/app/middleware/checkAuth.ts
import { fromNodeHeaders } from "better-auth/node";
var checkAuth = (...requiredRoles) => {
  return async (req, _res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });
      if (!session || !session.user) {
        throw new AppError_default(status4.UNAUTHORIZED, "You are not authorized. Please login.");
      }
      const userRole = session.user.role || "MEMBER";
      if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        throw new AppError_default(status4.FORBIDDEN, "You do not have permission to perform this action.");
      }
      req.user = {
        userId: session.user.id,
        role: userRole,
        email: session.user.email
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/admin/admin.validation.ts
import z from "zod";
var rejectIdeaValidation = z.object({
  feedback: z.string({ error: "Feedback is required when rejecting an idea" }).min(5, "Feedback must be at least 5 characters")
});
var updateUserStatusValidation = z.object({
  status: z.enum(["ACTIVE", "DEACTIVATED"], { error: "Status is required" })
});
var updateUserRoleValidation = z.object({
  role: z.enum(["MEMBER", "ADMIN"], { error: "Role is required" })
});
var AdminValidation = {
  rejectIdeaValidation,
  updateUserStatusValidation,
  updateUserRoleValidation
};

// src/app/module/admin/admin.route.ts
var router = Router();
router.use(checkAuth("ADMIN"));
router.get("/dashboard", AdminController.getDashboardStats);
router.get("/ideas", AdminController.getAllIdeas);
router.patch("/ideas/:id/approve", AdminController.approveIdea);
router.patch("/ideas/:id/reject", validateRequest(AdminValidation.rejectIdeaValidation), AdminController.rejectIdea);
router.patch("/ideas/:id/status", AdminController.changeIdeaStatus);
router.delete("/ideas/:id", AdminController.deleteIdea);
router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id/status", validateRequest(AdminValidation.updateUserStatusValidation), AdminController.updateUserStatus);
router.patch("/users/:id/role", validateRequest(AdminValidation.updateUserRoleValidation), AdminController.updateUserRole);
var AdminRoutes = router;

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/app/module/auth/auth.controller.ts
import status6 from "http-status";

// src/app/module/auth/auth.service.ts
import status5 from "http-status";
var register = async (payload) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new AppError_default(status5.CONFLICT, "User with this email already exists");
  }
  const hashedPassword = await hashPassword(payload.password);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      image: payload.profileImage ?? null
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true,
      createdAt: true
    }
  });
  const token = generateToken({
    userId: user.id,
    role: user.role,
    email: user.email
  });
  return { user, token };
};
var login = async (payload) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "No user found with this email");
  }
  if (user.status === "DEACTIVATED") {
    throw new AppError_default(status5.FORBIDDEN, "Your account has been deactivated. Contact admin.");
  }
  const isPasswordMatch = await comparePassword(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError_default(status5.UNAUTHORIZED, "Invalid credentials");
  }
  const token = generateToken({
    userId: user.id,
    role: user.role,
    email: user.email
  });
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      image: user.image
    },
    token
  };
};
var getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  return user;
};
var changePassword = async (userId, payload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  const isPasswordMatch = await comparePassword(payload.currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new AppError_default(status5.UNAUTHORIZED, "Current password is incorrect");
  }
  const hashedPassword = await hashPassword(payload.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
  return { message: "Password changed successfully" };
};
var AuthService = {
  register,
  login,
  getMe,
  changePassword
};

// src/app/module/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "Registration successful",
    data: result
  });
});
var login2 = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Login successful",
    data: result
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const result = await AuthService.getMe(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req.user.userId, req.body);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var AuthController = {
  register: register2,
  login: login2,
  getMe: getMe2,
  changePassword: changePassword2
};

// src/app/module/auth/auth.validation.ts
import z2 from "zod";
var registerValidation = z2.object({
  name: z2.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters"),
  email: z2.string({ error: "Email is required" }).email("Invalid email format"),
  password: z2.string({ error: "Password is required" }).min(6, "Password must be at least 6 characters"),
  profileImage: z2.string().url().optional()
});
var loginValidation = z2.object({
  email: z2.string({ error: "Email is required" }).email("Invalid email format"),
  password: z2.string({ error: "Password is required" })
});
var changePasswordValidation = z2.object({
  currentPassword: z2.string({ error: "Current password is required" }),
  newPassword: z2.string({ error: "New password is required" }).min(6, "Password must be at least 6 characters")
});
var AuthValidation = {
  registerValidation,
  loginValidation,
  changePasswordValidation
};

// src/app/module/auth/auth.route.ts
var router2 = Router2();
router2.post("/register", validateRequest(AuthValidation.registerValidation), AuthController.register);
router2.post("/login", validateRequest(AuthValidation.loginValidation), AuthController.login);
router2.get("/me", checkAuth("MEMBER", "ADMIN"), AuthController.getMe);
router2.patch("/change-password", checkAuth("MEMBER", "ADMIN"), validateRequest(AuthValidation.changePasswordValidation), AuthController.changePassword);
var AuthRoutes = router2;

// src/app/module/category/category.route.ts
import { Router as Router3 } from "express";

// src/app/module/category/category.controller.ts
import status8 from "http-status";

// src/app/module/category/category.service.ts
import status7 from "http-status";
var createCategory = async (payload) => {
  const existing = await prisma.category.findUnique({ where: { name: payload.name } });
  if (existing) {
    throw new AppError_default(status7.CONFLICT, "Category with this name already exists");
  }
  const category = await prisma.category.create({ data: payload });
  return category;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { ideas: true }
      }
    }
  });
  return categories;
};
var updateCategory = async (id, payload) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError_default(status7.NOT_FOUND, "Category not found");
  }
  if (payload.name && payload.name !== category.name) {
    const existing = await prisma.category.findUnique({ where: { name: payload.name } });
    if (existing) {
      throw new AppError_default(status7.CONFLICT, "Category with this name already exists");
    }
  }
  const updated = await prisma.category.update({ where: { id }, data: payload });
  return updated;
};
var deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError_default(status7.NOT_FOUND, "Category not found");
  }
  const ideaCount = await prisma.idea.count({ where: { categoryId: id } });
  if (ideaCount > 0) {
    throw new AppError_default(status7.BAD_REQUEST, `Cannot delete category. ${ideaCount} ideas are using this category.`);
  }
  await prisma.category.delete({ where: { id } });
  return { message: "Category deleted successfully" };
};
var CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};

// src/app/module/category/category.controller.ts
var createCategory2 = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (_req, res) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const result = await CategoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Category updated successfully",
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  const result = await CategoryService.deleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Category deleted successfully",
    data: result
  });
});
var CategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/app/module/category/category.validation.ts
import z3 from "zod";
var createCategoryValidation = z3.object({
  name: z3.string({ error: "Category name is required" }).min(2, "Name must be at least 2 characters"),
  description: z3.string().optional()
});
var updateCategoryValidation = z3.object({
  name: z3.string().min(2, "Name must be at least 2 characters").optional(),
  description: z3.string().optional()
});
var CategoryValidation = {
  createCategoryValidation,
  updateCategoryValidation
};

// src/app/module/category/category.route.ts
var router3 = Router3();
router3.get("/", CategoryController.getAllCategories);
router3.post("/", checkAuth("ADMIN"), validateRequest(CategoryValidation.createCategoryValidation), CategoryController.createCategory);
router3.patch("/:id", checkAuth("ADMIN"), validateRequest(CategoryValidation.updateCategoryValidation), CategoryController.updateCategory);
router3.delete("/:id", checkAuth("ADMIN"), CategoryController.deleteCategory);
var CategoryRoutes = router3;

// src/app/module/idea/idea.route.ts
import { Router as Router4 } from "express";

// src/app/module/idea/idea.controller.ts
import status10 from "http-status";

// src/app/module/idea/idea.service.ts
import status9 from "http-status";
var createIdea = async (authorId, payload) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) {
    throw new AppError_default(status9.NOT_FOUND, "Category not found");
  }
  if (payload.isPaid && (!payload.price || payload.price <= 0)) {
    throw new AppError_default(status9.BAD_REQUEST, "Price is required for paid ideas and must be greater than 0");
  }
  const idea = await prisma.idea.create({
    data: {
      title: payload.title,
      problemStatement: payload.problemStatement,
      proposedSolution: payload.proposedSolution,
      description: payload.description,
      images: payload.images || [],
      isPaid: payload.isPaid || false,
      price: payload.isPaid ? payload.price : null,
      categoryId: payload.categoryId,
      authorId,
      status: "DRAFT"
    },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  });
  return idea;
};
var getAllApprovedIdeas = async (query) => {
  const {
    searchTerm,
    category,
    isPaid,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "10",
    minVotes,
    author
  } = query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;
  const where = {
    status: "APPROVED"
  };
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { problemStatement: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (category) {
    where.categoryId = category;
  }
  if (isPaid !== void 0) {
    where.isPaid = isPaid === "true";
  }
  if (author) {
    where.authorId = author;
  }
  let orderBy = { createdAt: "desc" };
  const validSortBy = sortBy && sortBy !== "" ? sortBy : "createdAt";
  const validSortOrder = sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc";
  if (validSortBy === "votes") {
    orderBy = { votes: { _count: validSortOrder } };
  } else if (validSortBy === "comments") {
    orderBy = { comments: { _count: validSortOrder } };
  } else {
    orderBy = { [validSortBy]: validSortOrder };
  }
  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, image: true }
        },
        _count: {
          select: { votes: true, comments: true }
        },
        votes: {
          select: { voteType: true }
        }
      }
    }),
    prisma.idea.count({ where })
  ]);
  const ideasWithVoteCount = ideas.map((idea) => {
    const upvotes = idea.votes.filter((v) => v.voteType === "UPVOTE").length;
    const downvotes = idea.votes.filter((v) => v.voteType === "DOWNVOTE").length;
    const { votes, ...rest } = idea;
    return {
      ...rest,
      upvotes,
      downvotes,
      netVotes: upvotes - downvotes
    };
  });
  let filteredIdeas = ideasWithVoteCount;
  if (minVotes) {
    const minVotesNum = parseInt(minVotes, 10);
    filteredIdeas = ideasWithVoteCount.filter((idea) => idea.upvotes >= minVotesNum);
  }
  return {
    data: filteredIdeas,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage: Math.ceil(total / limitNum)
    }
  };
};
var getIdeaById = async (id, userId) => {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, email: true, image: true }
      },
      votes: {
        select: { id: true, voteType: true, userId: true }
      },
      comments: {
        where: { parentId: null },
        include: {
          user: {
            select: { id: true, name: true, image: true }
          },
          replies: {
            include: {
              user: {
                select: { id: true, name: true, image: true }
              },
              replies: {
                include: {
                  user: {
                    select: { id: true, name: true, image: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: { votes: true, comments: true }
      }
    }
  });
  if (!idea) {
    throw new AppError_default(status9.NOT_FOUND, "Idea not found");
  }
  if (idea.isPaid && idea.authorId !== userId) {
    if (!userId) {
      return {
        id: idea.id,
        title: idea.title,
        category: idea.category,
        author: idea.author,
        isPaid: idea.isPaid,
        price: idea.price,
        status: idea.status,
        createdAt: idea.createdAt,
        isPaidContent: true,
        message: "This is a paid idea. Please purchase to view full content."
      };
    }
    const payment = await prisma.payment.findFirst({
      where: {
        userId,
        ideaId: id,
        status: "COMPLETED"
      }
    });
    if (!payment) {
      return {
        id: idea.id,
        title: idea.title,
        category: idea.category,
        author: idea.author,
        isPaid: idea.isPaid,
        price: idea.price,
        status: idea.status,
        createdAt: idea.createdAt,
        isPaidContent: true,
        message: "This is a paid idea. Please purchase to view full content."
      };
    }
  }
  const upvotes = idea.votes.filter((v) => v.voteType === "UPVOTE").length;
  const downvotes = idea.votes.filter((v) => v.voteType === "DOWNVOTE").length;
  const userVote = userId ? idea.votes.find((v) => v.userId === userId) : null;
  return {
    ...idea,
    upvotes,
    downvotes,
    netVotes: upvotes - downvotes,
    userVote: userVote ? userVote.voteType : null,
    isPaidContent: false
  };
};
var getMyIdeas = async (authorId, query) => {
  const { status: ideaStatus, page = "1", limit = "10" } = query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;
  const where = { authorId };
  if (ideaStatus) {
    where.status = ideaStatus;
  }
  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNum,
      include: {
        category: true,
        _count: { select: { votes: true, comments: true } }
      }
    }),
    prisma.idea.count({ where })
  ]);
  return {
    data: ideas,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage: Math.ceil(total / limitNum)
    }
  };
};
var updateIdea = async (id, authorId, payload) => {
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) {
    throw new AppError_default(status9.NOT_FOUND, "Idea not found");
  }
  if (idea.authorId !== authorId) {
    throw new AppError_default(status9.FORBIDDEN, "You can only edit your own ideas");
  }
  if (idea.status !== "DRAFT" && idea.status !== "REJECTED") {
    throw new AppError_default(status9.BAD_REQUEST, "You can only edit ideas that are in Draft or Rejected status");
  }
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!category) {
      throw new AppError_default(status9.NOT_FOUND, "Category not found");
    }
  }
  if (payload.isPaid && (!payload.price || payload.price <= 0)) {
    throw new AppError_default(status9.BAD_REQUEST, "Price is required for paid ideas");
  }
  const updateData = { ...payload };
  if (idea.status === "REJECTED") {
    updateData.status = "DRAFT";
    updateData.adminFeedback = null;
  }
  const updated = await prisma.idea.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      author: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  });
  return updated;
};
var deleteIdea3 = async (id, authorId) => {
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) {
    throw new AppError_default(status9.NOT_FOUND, "Idea not found");
  }
  if (idea.authorId !== authorId) {
    throw new AppError_default(status9.FORBIDDEN, "You can only delete your own ideas");
  }
  if (idea.status !== "DRAFT" && idea.status !== "REJECTED") {
    throw new AppError_default(status9.BAD_REQUEST, "You can only delete ideas that are in Draft or Rejected status");
  }
  await prisma.idea.delete({ where: { id } });
  return { message: "Idea deleted successfully" };
};
var submitForReview = async (id, authorId) => {
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) {
    throw new AppError_default(status9.NOT_FOUND, "Idea not found");
  }
  if (idea.authorId !== authorId) {
    throw new AppError_default(status9.FORBIDDEN, "You can only submit your own ideas");
  }
  if (idea.status !== "DRAFT") {
    throw new AppError_default(status9.BAD_REQUEST, "Only draft ideas can be submitted for review");
  }
  const updated = await prisma.idea.update({
    where: { id },
    data: { status: "UNDER_REVIEW" },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  });
  return updated;
};
var getTopVotedIdeas = async (limitNum = 3) => {
  const ideas = await prisma.idea.findMany({
    where: { status: "APPROVED" },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, image: true }
      },
      votes: {
        select: { voteType: true }
      },
      _count: {
        select: { votes: true, comments: true }
      }
    }
  });
  const ideasWithVotes = ideas.map((idea) => {
    const upvotes = idea.votes.filter((v) => v.voteType === "UPVOTE").length;
    const downvotes = idea.votes.filter((v) => v.voteType === "DOWNVOTE").length;
    const { votes, ...rest } = idea;
    return { ...rest, upvotes, downvotes, netVotes: upvotes - downvotes };
  });
  ideasWithVotes.sort((a, b) => b.netVotes - a.netVotes);
  return ideasWithVotes.slice(0, limitNum);
};
var getUserStats = async (authorId) => {
  const [totalIdeas, approvedIdeas, pendingIdeas] = await Promise.all([
    prisma.idea.count({ where: { authorId } }),
    prisma.idea.count({ where: { authorId, status: "APPROVED" } }),
    prisma.idea.count({ where: { authorId, status: "UNDER_REVIEW" } })
  ]);
  return { totalIdeas, approvedIdeas, pendingIdeas };
};
var IdeaService = {
  createIdea,
  getAllApprovedIdeas,
  getIdeaById,
  getMyIdeas,
  updateIdea,
  deleteIdea: deleteIdea3,
  submitForReview,
  getTopVotedIdeas,
  getUserStats
};

// src/app/module/idea/idea.controller.ts
var createIdea2 = catchAsync(async (req, res) => {
  const result = await IdeaService.createIdea(req.user.userId, req.body);
  sendResponse(res, {
    httpStatusCode: status10.CREATED,
    success: true,
    message: "Idea created successfully",
    data: result
  });
});
var getAllApprovedIdeas2 = catchAsync(async (req, res) => {
  const result = await IdeaService.getAllApprovedIdeas(req.query);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Ideas retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getIdeaById2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await IdeaService.getIdeaById(req.params.id, userId);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Idea retrieved successfully",
    data: result
  });
});
var getMyIdeas2 = catchAsync(async (req, res) => {
  const result = await IdeaService.getMyIdeas(req.user.userId, req.query);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "My ideas retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateIdea2 = catchAsync(async (req, res) => {
  const result = await IdeaService.updateIdea(req.params.id, req.user.userId, req.body);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Idea updated successfully",
    data: result
  });
});
var deleteIdea4 = catchAsync(async (req, res) => {
  const result = await IdeaService.deleteIdea(req.params.id, req.user.userId);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result
  });
});
var submitForReview2 = catchAsync(async (req, res) => {
  const result = await IdeaService.submitForReview(req.params.id, req.user.userId);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Idea submitted for review successfully",
    data: result
  });
});
var getTopVotedIdeas2 = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 3;
  const result = await IdeaService.getTopVotedIdeas(limit);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Top voted ideas retrieved successfully",
    data: result
  });
});
var getUserStats2 = catchAsync(async (req, res) => {
  const result = await IdeaService.getUserStats(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "User stats retrieved successfully",
    data: result
  });
});
var IdeaController = {
  createIdea: createIdea2,
  getAllApprovedIdeas: getAllApprovedIdeas2,
  getIdeaById: getIdeaById2,
  getMyIdeas: getMyIdeas2,
  updateIdea: updateIdea2,
  deleteIdea: deleteIdea4,
  submitForReview: submitForReview2,
  getTopVotedIdeas: getTopVotedIdeas2,
  getUserStats: getUserStats2
};

// src/app/module/idea/idea.validation.ts
import z4 from "zod";
var createIdeaValidation = z4.object({
  title: z4.string({ error: "Title is required" }).min(5, "Title must be at least 5 characters"),
  problemStatement: z4.string({ error: "Problem statement is required" }).min(10, "Problem statement must be at least 10 characters"),
  proposedSolution: z4.string({ error: "Proposed solution is required" }).min(10, "Proposed solution must be at least 10 characters"),
  description: z4.string({ error: "Description is required" }).min(20, "Description must be at least 20 characters"),
  images: z4.array(z4.string().url()).optional().default([]),
  isPaid: z4.boolean().optional().default(false),
  price: z4.number().positive("Price must be positive").optional(),
  categoryId: z4.string({ error: "Category is required" })
});
var updateIdeaValidation = z4.object({
  title: z4.string().min(5, "Title must be at least 5 characters").optional(),
  problemStatement: z4.string().min(10).optional(),
  proposedSolution: z4.string().min(10).optional(),
  description: z4.string().min(20).optional(),
  images: z4.array(z4.string().url()).optional(),
  isPaid: z4.boolean().optional(),
  price: z4.number().positive("Price must be positive").optional().nullable(),
  categoryId: z4.string().optional()
});
var IdeaValidation = {
  createIdeaValidation,
  updateIdeaValidation
};

// src/app/middleware/optionalAuth.ts
import { fromNodeHeaders as fromNodeHeaders2 } from "better-auth/node";
var optionalAuth = async (req, _res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders2(req.headers)
    });
    if (session && session.user) {
      req.user = {
        userId: session.user.id,
        role: session.user.role || "MEMBER",
        email: session.user.email
      };
    }
  } catch {
  }
  next();
};

// src/app/module/idea/idea.route.ts
var router4 = Router4();
router4.get("/", IdeaController.getAllApprovedIdeas);
router4.get("/top-voted", IdeaController.getTopVotedIdeas);
router4.get("/:id", optionalAuth, IdeaController.getIdeaById);
router4.get("/user/stats", checkAuth("MEMBER", "ADMIN"), IdeaController.getUserStats);
router4.get("/user/my-ideas", checkAuth("MEMBER", "ADMIN"), IdeaController.getMyIdeas);
router4.post("/", checkAuth("MEMBER", "ADMIN"), validateRequest(IdeaValidation.createIdeaValidation), IdeaController.createIdea);
router4.patch("/:id", checkAuth("MEMBER", "ADMIN"), validateRequest(IdeaValidation.updateIdeaValidation), IdeaController.updateIdea);
router4.delete("/:id", checkAuth("MEMBER", "ADMIN"), IdeaController.deleteIdea);
router4.patch("/:id/submit", checkAuth("MEMBER", "ADMIN"), IdeaController.submitForReview);
var IdeaRoutes = router4;

// src/app/module/vote/vote.route.ts
import { Router as Router5 } from "express";

// src/app/module/vote/vote.controller.ts
import status12 from "http-status";

// src/app/module/vote/vote.service.ts
import status11 from "http-status";
var toggleVote = async (userId, ideaId, voteType) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new AppError_default(status11.NOT_FOUND, "Idea not found");
  }
  if (idea.status !== "APPROVED") {
    throw new AppError_default(status11.BAD_REQUEST, "You can only vote on approved ideas");
  }
  const existingVote = await prisma.vote.findUnique({
    where: { userId_ideaId: { userId, ideaId } }
  });
  if (existingVote) {
    if (existingVote.voteType === voteType) {
      await prisma.vote.delete({
        where: { id: existingVote.id }
      });
      return { message: "Vote removed", action: "removed" };
    } else {
      const updated = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType }
      });
      return { message: `Vote changed to ${voteType}`, action: "switched", vote: updated };
    }
  }
  const vote = await prisma.vote.create({
    data: { userId, ideaId, voteType }
  });
  return { message: `Successfully ${voteType.toLowerCase()}d`, action: "created", vote };
};
var removeVote = async (userId, ideaId) => {
  const existingVote = await prisma.vote.findUnique({
    where: { userId_ideaId: { userId, ideaId } }
  });
  if (!existingVote) {
    throw new AppError_default(status11.NOT_FOUND, "You have not voted on this idea");
  }
  await prisma.vote.delete({ where: { id: existingVote.id } });
  return { message: "Vote removed successfully" };
};
var VoteService = {
  toggleVote,
  removeVote
};

// src/app/module/vote/vote.controller.ts
var toggleVote2 = catchAsync(async (req, res) => {
  const { voteType } = req.body;
  const result = await VoteService.toggleVote(req.user.userId, req.params.ideaId, voteType);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: result.message,
    data: result
  });
});
var removeVote2 = catchAsync(async (req, res) => {
  const result = await VoteService.removeVote(req.user.userId, req.params.ideaId);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Vote removed successfully",
    data: result
  });
});
var VoteController = {
  toggleVote: toggleVote2,
  removeVote: removeVote2
};

// src/app/module/vote/vote.route.ts
var router5 = Router5();
router5.post("/:ideaId/vote", checkAuth("MEMBER", "ADMIN"), VoteController.toggleVote);
router5.delete("/:ideaId/vote", checkAuth("MEMBER", "ADMIN"), VoteController.removeVote);
var VoteRoutes = router5;

// src/app/module/comment/comment.route.ts
import { Router as Router6 } from "express";

// src/app/module/comment/comment.controller.ts
import status14 from "http-status";

// src/app/module/comment/comment.service.ts
import status13 from "http-status";
var createComment = async (userId, ideaId, payload) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new AppError_default(status13.NOT_FOUND, "Idea not found");
  }
  if (idea.status !== "APPROVED") {
    throw new AppError_default(status13.BAD_REQUEST, "You can only comment on approved ideas");
  }
  if (payload.parentId) {
    const parentComment = await prisma.comment.findUnique({ where: { id: payload.parentId } });
    if (!parentComment) {
      throw new AppError_default(status13.NOT_FOUND, "Parent comment not found");
    }
    if (parentComment.ideaId !== ideaId) {
      throw new AppError_default(status13.BAD_REQUEST, "Parent comment does not belong to this idea");
    }
  }
  const comment = await prisma.comment.create({
    data: {
      content: payload.content,
      userId,
      ideaId,
      parentId: payload.parentId || null
    },
    include: {
      user: {
        select: { id: true, name: true, image: true }
      }
    }
  });
  return comment;
};
var getCommentsByIdeaId = async (ideaId) => {
  const comments = await prisma.comment.findMany({
    where: { ideaId, parentId: null },
    include: {
      user: {
        select: { id: true, name: true, image: true }
      },
      replies: {
        include: {
          user: {
            select: { id: true, name: true, image: true }
          },
          replies: {
            include: {
              user: {
                select: { id: true, name: true, image: true }
              },
              replies: {
                include: {
                  user: {
                    select: { id: true, name: true, image: true }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return comments;
};
var updateComment = async (commentId, userId, payload) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(status13.NOT_FOUND, "Comment not found");
  }
  if (comment.userId !== userId) {
    throw new AppError_default(status13.FORBIDDEN, "You can only edit your own comments");
  }
  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { content: payload.content },
    include: {
      user: {
        select: { id: true, name: true, image: true }
      }
    }
  });
  return updated;
};
var deleteComment = async (commentId, userId, userRole) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(status13.NOT_FOUND, "Comment not found");
  }
  if (userRole !== "ADMIN" && comment.userId !== userId) {
    throw new AppError_default(status13.FORBIDDEN, "You can only delete your own comments");
  }
  await deleteCommentWithReplies(commentId);
  return { message: "Comment deleted successfully" };
};
var deleteCommentWithReplies = async (commentId) => {
  const replies = await prisma.comment.findMany({ where: { parentId: commentId } });
  for (const reply of replies) {
    await deleteCommentWithReplies(reply.id);
  }
  await prisma.comment.delete({ where: { id: commentId } });
};
var CommentService = {
  createComment,
  getCommentsByIdeaId,
  updateComment,
  deleteComment
};

// src/app/module/comment/comment.controller.ts
var createComment2 = catchAsync(async (req, res) => {
  const result = await CommentService.createComment(req.user.userId, req.params.ideaId, req.body);
  sendResponse(res, {
    httpStatusCode: status14.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result
  });
});
var getCommentsByIdeaId2 = catchAsync(async (req, res) => {
  const result = await CommentService.getCommentsByIdeaId(req.params.ideaId);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result
  });
});
var updateComment2 = catchAsync(async (req, res) => {
  const result = await CommentService.updateComment(req.params.id, req.user.userId, req.body);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Comment updated successfully",
    data: result
  });
});
var deleteComment2 = catchAsync(async (req, res) => {
  const result = await CommentService.deleteComment(req.params.id, req.user.userId, req.user.role);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result
  });
});
var CommentController = {
  createComment: createComment2,
  getCommentsByIdeaId: getCommentsByIdeaId2,
  updateComment: updateComment2,
  deleteComment: deleteComment2
};

// src/app/module/comment/comment.validation.ts
import z5 from "zod";
var createCommentValidation = z5.object({
  content: z5.string({ error: "Comment content is required" }).min(1, "Comment cannot be empty"),
  parentId: z5.string().uuid().optional()
});
var updateCommentValidation = z5.object({
  content: z5.string({ error: "Comment content is required" }).min(1, "Comment cannot be empty")
});
var CommentValidation = {
  createCommentValidation,
  updateCommentValidation
};

// src/app/module/comment/comment.route.ts
var router6 = Router6();
router6.get("/ideas/:ideaId", CommentController.getCommentsByIdeaId);
router6.post("/ideas/:ideaId", checkAuth("MEMBER", "ADMIN"), validateRequest(CommentValidation.createCommentValidation), CommentController.createComment);
router6.patch("/:id", checkAuth("MEMBER", "ADMIN"), validateRequest(CommentValidation.updateCommentValidation), CommentController.updateComment);
router6.delete("/:id", checkAuth("MEMBER", "ADMIN"), CommentController.deleteComment);
var CommentRoutes = router6;

// src/app/module/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/app/module/payment/payment.controller.ts
import status16 from "http-status";

// src/app/module/payment/payment.service.ts
import status15 from "http-status";
import Stripe from "stripe";

// src/app/module/email/email.service.ts
import nodemailer from "nodemailer";
var sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER_SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER_SMTP_PORT),
    secure: Number(envVars.EMAIL_SENDER_SMTP_PORT) === 465,
    // true for 465, false for other ports
    auth: {
      user: envVars.EMAIL_SENDER_SMTP_USER,
      pass: envVars.EMAIL_SENDER_SMTP_PASS
    }
  });
  await transporter.sendMail({
    from: `"${envVars.EMAIL_SENDER_SMTP_FROM}" <${envVars.EMAIL_SENDER_SMTP_USER}>`,
    to,
    subject,
    html
  });
};
var EmailService = {
  sendEmail
};

// src/app/module/email/email.template.ts
var contactEmailTemplate = (name, email, message) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #171717; line-height: 1.5; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; }
        .logo { font-size: 20px; font-weight: 800; border-bottom: 2px solid #10b981; display: inline-block; margin-bottom: 40px; }
        h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 24px; }
        .content { margin-bottom: 40px; }
        .field { margin-bottom: 24px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #737373; letter-spacing: 0.05em; display: block; margin-bottom: 4px; }
        .value { font-size: 15px; color: #171717; }
        .message-box { background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #f0f0f0; margin-top: 10px; }
        .footer { font-size: 12px; color: #a3a3a3; border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">EcoSpark</div>
        <h1>New Message Received</h1>
        <div class="content">
            <div class="field">
                <span class="label">SENDER</span>
                <span class="value"><b>${name}</b> &lt;${email}&gt;</span>
            </div>
            <div class="field">
                <span class="label">MESSAGE</span>
                <div class="message-box">${message}</div>
            </div>
        </div>
        <div class="footer">
            Sent from your website contact form. &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} EcoSpark.
        </div>
    </div>
</body>
</html>
`;
var paymentSuccessTemplate = (name, amount, itemName, transactionId) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #171717; line-height: 1.5; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; }
        .logo { font-size: 20px; font-weight: 800; border-bottom: 2px solid #10b981; display: inline-block; margin-bottom: 40px; }
        h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 8px; color: #10b981; }
        p { margin-bottom: 24px; color: #525252; }
        .receipt { background: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #f0f0f0; margin-bottom: 32px; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #e5e5e5; padding-bottom: 8px; }
        .receipt-row:last-child { border: none; margin-bottom: 0; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #737373; }
        .value { font-size: 14px; font-weight: 600; text-align: right; }
        .footer { font-size: 12px; color: #a3a3a3; border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 40px; }
        .btn { display: inline-block; background: #171717; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">EcoSpark</div>
        <h1>Payment Successful!</h1>
        <p>Hi ${name}, thank you for your purchase. Your payment for <b>${itemName}</b> has been processed successfully.</p>
        
        <div class="receipt">
            <div class="receipt-row">
                <span class="label">Item</span>
                <span class="value">${itemName}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Amount Paid</span>
                <span class="value">$${amount.toFixed(2)}</span>
            </div>
            <div class="receipt-row">
                <span class="label">Transaction ID</span>
                <span class="value" style="font-family: monospace; font-size: 12px;">${transactionId}</span>
            </div>
        </div>

        <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">View in Dashboard</a>

        <div class="footer">
            You received this email because of your recent purchase on EcoSpark Hub. &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} EcoSpark.
        </div>
    </div>
</body>
</html>
`;
var EmailTemplate = {
  contactEmailTemplate,
  paymentSuccessTemplate
};

// src/app/module/payment/payment.service.ts
var stripe = new Stripe(envVars.STRIPE_SECRET_KEY);
var createCheckoutSession = async (userId, ideaId, isProPlan) => {
  let amount = 0;
  let name = "";
  let description = "";
  let metadata = { userId };
  if (isProPlan) {
    amount = 15;
    name = "EcoSpark Pro Plan";
    description = "Unlimited idea submissions & advanced analytics";
    metadata.type = "PLAN_UPGRADE";
    metadata.planName = "Pro";
  } else if (ideaId) {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { author: { select: { name: true } } }
    });
    if (!idea) {
      throw new AppError_default(status15.NOT_FOUND, "Idea not found");
    }
    if (!idea.isPaid || !idea.price) {
      throw new AppError_default(status15.BAD_REQUEST, "This idea is free. No payment needed.");
    }
    if (idea.authorId === userId) {
      throw new AppError_default(status15.BAD_REQUEST, "You cannot purchase your own idea.");
    }
    const existingPayment = await prisma.payment.findFirst({
      where: { userId, ideaId, status: "COMPLETED" }
    });
    if (existingPayment) {
      throw new AppError_default(status15.BAD_REQUEST, "You have already purchased this idea.");
    }
    amount = idea.price;
    name = idea.title;
    description = `Access to paid idea by ${idea.author.name}`;
    metadata.ideaId = ideaId;
  } else {
    throw new AppError_default(status15.BAD_REQUEST, "Please provide an ideaId or select a plan.");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name,
            description
          },
          unit_amount: Math.round(amount * 100)
          // Convert to cents
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/payment-cancel`,
    metadata
  });
  await prisma.payment.create({
    data: {
      amount,
      stripeSessionId: session.id,
      status: "PENDING",
      userId,
      ideaId: ideaId ?? void 0
    }
  });
  return { sessionId: session.id, url: session.url };
};
var verifyPayment = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const payment = await prisma.payment.findUnique({
    where: { stripeSessionId: sessionId }
  });
  if (!payment) {
    throw new AppError_default(status15.NOT_FOUND, "Payment record not found");
  }
  if (session.payment_status === "paid") {
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED" },
      include: { user: true, idea: true }
    });
    const itemName = updatedPayment.idea?.title || "EcoSpark Pro Plan";
    const html = EmailTemplate.paymentSuccessTemplate(
      updatedPayment.user.name || "User",
      updatedPayment.amount,
      itemName,
      updatedPayment.stripeSessionId
    );
    const recipientEmail = session.customer_details?.email || updatedPayment.user.email;
    await EmailService.sendEmail(
      recipientEmail,
      `Receipt for your purchase: ${itemName}`,
      html
    );
    return { status: "COMPLETED", message: "Payment verified and email sent" };
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" }
    });
    return { status: "FAILED", message: "Payment not completed" };
  }
};
var getMyPayments = async (userId) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    include: {
      idea: {
        select: { id: true, title: true, isPaid: true, price: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return payments;
};
var checkAccess = async (userId, ideaId) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    throw new AppError_default(status15.NOT_FOUND, "Idea not found");
  }
  if (!idea.isPaid) {
    return { hasAccess: true, reason: "free" };
  }
  if (idea.authorId === userId) {
    return { hasAccess: true, reason: "author" };
  }
  const payment = await prisma.payment.findFirst({
    where: { userId, ideaId, status: "COMPLETED" }
  });
  if (payment) {
    return { hasAccess: true, reason: "purchased" };
  }
  return { hasAccess: false, reason: "not_purchased", price: idea.price };
};
var PaymentService = {
  createCheckoutSession,
  verifyPayment,
  getMyPayments,
  checkAccess
};

// src/app/module/payment/payment.controller.ts
var createCheckoutSession2 = catchAsync(async (req, res) => {
  const { ideaId, isProPlan } = req.body;
  const result = await PaymentService.createCheckoutSession(req.user.userId, ideaId, isProPlan);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Checkout session created successfully",
    data: result
  });
});
var verifyPayment2 = catchAsync(async (req, res) => {
  const result = await PaymentService.verifyPayment(req.params.sessionId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: result.message,
    data: result
  });
});
var getMyPayments2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getMyPayments(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result
  });
});
var checkAccess2 = catchAsync(async (req, res) => {
  const result = await PaymentService.checkAccess(req.user.userId, req.params.ideaId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Access check completed",
    data: result
  });
});
var PaymentController = {
  createCheckoutSession: createCheckoutSession2,
  verifyPayment: verifyPayment2,
  getMyPayments: getMyPayments2,
  checkAccess: checkAccess2
};

// src/app/module/payment/payment.route.ts
var router7 = Router7();
router7.post("/create-checkout", checkAuth("MEMBER", "ADMIN"), PaymentController.createCheckoutSession);
router7.get("/verify/:sessionId", checkAuth("MEMBER", "ADMIN"), PaymentController.verifyPayment);
router7.get("/my-payments", checkAuth("MEMBER", "ADMIN"), PaymentController.getMyPayments);
router7.get("/check-access/:ideaId", checkAuth("MEMBER", "ADMIN"), PaymentController.checkAccess);
var PaymentRoutes = router7;

// src/app/module/newsletter/newsletter.route.ts
import { Router as Router8 } from "express";

// src/app/module/newsletter/newsletter.controller.ts
import status18 from "http-status";

// src/app/module/newsletter/newsletter.service.ts
import status17 from "http-status";
var subscribe = async (email) => {
  const existing = await prisma.newsletter.findUnique({ where: { email } });
  if (existing) {
    throw new AppError_default(status17.CONFLICT, "This email is already subscribed to the newsletter");
  }
  const subscription = await prisma.newsletter.create({
    data: { email }
  });
  return subscription;
};
var getAllSubscribers = async () => {
  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" }
  });
  return subscribers;
};
var NewsletterService = {
  subscribe,
  getAllSubscribers
};

// src/app/module/newsletter/newsletter.controller.ts
var subscribe2 = catchAsync(async (req, res) => {
  const result = await NewsletterService.subscribe(req.body.email);
  sendResponse(res, {
    httpStatusCode: status18.CREATED,
    success: true,
    message: "Successfully subscribed to newsletter",
    data: result
  });
});
var getAllSubscribers2 = catchAsync(async (_req, res) => {
  const result = await NewsletterService.getAllSubscribers();
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Subscribers retrieved successfully",
    data: result
  });
});
var NewsletterController = {
  subscribe: subscribe2,
  getAllSubscribers: getAllSubscribers2
};

// src/app/module/newsletter/newsletter.validation.ts
import z6 from "zod";
var subscribeValidation = z6.object({
  email: z6.string({ error: "Email is required" }).email("Invalid email format")
});
var NewsletterValidation = {
  subscribeValidation
};

// src/app/module/newsletter/newsletter.route.ts
var router8 = Router8();
router8.post("/subscribe", validateRequest(NewsletterValidation.subscribeValidation), NewsletterController.subscribe);
router8.get("/subscribers", checkAuth("ADMIN"), NewsletterController.getAllSubscribers);
var NewsletterRoutes = router8;

// src/app/module/contact/contact.route.ts
import { Router as Router9 } from "express";

// src/app/module/contact/contact.controller.ts
import status20 from "http-status";

// src/app/module/contact/contact.service.ts
import status19 from "http-status";
var handleContactInquiry = async (payload) => {
  const { name, email, message } = payload;
  if (!name || !email || !message) {
    throw new AppError_default(status19.BAD_REQUEST, "All fields (name, email, message) are required.");
  }
  const html = EmailTemplate.contactEmailTemplate(name, email, message);
  await EmailService.sendEmail(
    envVars.EMAIL_SENDER_SMTP_USER,
    // Send to the admin
    `New Contact Inquiry from ${name}`,
    html
  );
  return { message: "Your message has been sent successfully. We will get back to you shortly!" };
};
var ContactService = {
  handleContactInquiry
};

// src/app/module/contact/contact.controller.ts
var handleContactInquiry2 = catchAsync(async (req, res) => {
  const result = await ContactService.handleContactInquiry(req.body);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: result.message
  });
});
var ContactController = {
  handleContactInquiry: handleContactInquiry2
};

// src/app/module/contact/contact.route.ts
var router9 = Router9();
router9.post("/", ContactController.handleContactInquiry);
var ContactRoutes = router9;

// src/app/routes/index.ts
var router10 = Router10();
router10.use("/auth", AuthRoutes);
router10.use("/categories", CategoryRoutes);
router10.use("/ideas", IdeaRoutes);
router10.use("/votes", VoteRoutes);
router10.use("/comments", CommentRoutes);
router10.use("/payments", PaymentRoutes);
router10.use("/newsletter", NewsletterRoutes);
router10.use("/admin", AdminRoutes);
router10.use("/contact", ContactRoutes);
var IndexRoutes = router10;

// src/app.ts
import cors from "cors";

// src/app/middleware/globalErrorHandler.ts
import status23 from "http-status";
import z7 from "zod";

// src/app/errorHelpers/handlePrismaErrors.ts
import status21 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status21.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status21.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status21.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status21.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status21.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status21.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status21.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status21.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status21.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status21.INTERNAL_SERVER_ERROR;
  }
  return status21.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status21.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status21.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status21.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status21.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/errorHelpers/handleZodError.ts
import status22 from "http-status";
var handleZodError = (err) => {
  const statusCode = status22.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  console.error("Global Error Handler:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let errorSources = [];
  let statusCode = status23.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z7.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status23.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status24 from "http-status";
var notFound = (req, res) => {
  res.status(status24.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
var app = express();
var allowedOrigins = [
  envVars.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:5000",
  "https://eco-spark-client.vercel.app",
  "https://eco-spark-server.vercel.app"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/eco-spark-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));
app.use("/api/v1", IndexRoutes);
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "EcoSpark API is running.....",
    version: "1.0.0"
  });
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 5e3;
var server_default = app_default;
if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await prisma.$connect();
      console.log("Connected to the database successfully");
      app_default.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      console.error("Error starting the server:", error);
      await prisma.$disconnect();
      process.exit(1);
    }
  };
  startServer();
}
export {
  server_default as default
};
