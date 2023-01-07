import { prisma } from "../prisma-client";
import { CreateUserAdmin } from "./create-user-admin";

const main = async () => {
  const createUserAdmin = new CreateUserAdmin();
  await createUserAdmin.run();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    // eslint-disable-next-line no-console
    console.error("SEED ERROR: ", error);
    await prisma.$disconnect();
    process.exit(1);
  });
