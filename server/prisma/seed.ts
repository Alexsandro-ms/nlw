import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.create({
    data: {
      date: "2022-11-20T13:00:00.201Z",
      firstTeamCountryCode: "QA",
      secondTeamCountryCode: "EC"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-21T13:00:00.201Z",
      firstTeamCountryCode: "SN",
      secondTeamCountryCode: "NL"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-25T10:00:00.201Z",
      firstTeamCountryCode: "QA",
      secondTeamCountryCode: "SN"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-25T13:00:00.201Z",
      firstTeamCountryCode: "NL",
      secondTeamCountryCode: "EC"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-29T12:00:00.201Z",
      firstTeamCountryCode: "NL",
      secondTeamCountryCode: "QA"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-29T12:00:00.201Z",
      firstTeamCountryCode: "EC",
      secondTeamCountryCode: "SN"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-21T10:00:00.201Z",
      firstTeamCountryCode: "GB",
      secondTeamCountryCode: "IR"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-21T16:00:00.201Z",
      firstTeamCountryCode: "US",
      secondTeamCountryCode: "WL"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-25T07:00:00.201Z",
      firstTeamCountryCode: "WL",
      secondTeamCountryCode: "IR"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-25T16:00:00.201Z",
      firstTeamCountryCode: "GB",
      secondTeamCountryCode: "US"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-29T16:00:00.201Z",
      firstTeamCountryCode: "WL",
      secondTeamCountryCode: "GB"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-29T16:00:00.201Z",
      firstTeamCountryCode: "IR",
      secondTeamCountryCode: "US"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-22T07:00:00.201Z",
      firstTeamCountryCode: "AR",
      secondTeamCountryCode: "SA"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-22T13:00:00.201Z",
      firstTeamCountryCode: "MX",
      secondTeamCountryCode: "PL"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-26T10:00:00.201Z",
      firstTeamCountryCode: "PL",
      secondTeamCountryCode: "SA"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-26T16:00:00.201Z",
      firstTeamCountryCode: "AR",
      secondTeamCountryCode: "MX"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-30T16:00:00.201Z",
      firstTeamCountryCode: "PL",
      secondTeamCountryCode: "AR"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-30T16:00:00.201Z",
      firstTeamCountryCode: "SA",
      secondTeamCountryCode: "MX"
    }
  });
  await prisma.game.create({
    data: {
      date: "2022-11-22T10:00:00.201Z",
      firstTeamCountryCode: "DK",
      secondTeamCountryCode: "TN"
    }
  });
}
main();
