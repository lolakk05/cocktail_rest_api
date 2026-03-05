import { seedDatabase } from './seed';

async function main() {
  await seedDatabase();
}

main().catch((error) => {
  console.error('Error while running database seeds:', error);
  process.exitCode = 1;
});
