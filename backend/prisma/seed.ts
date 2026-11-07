import runSeeders from "./seeders";

runSeeders({
  main: true,
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
