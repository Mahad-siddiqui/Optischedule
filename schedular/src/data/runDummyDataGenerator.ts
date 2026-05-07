import { generateDummyData, writeDummyData } from "./dummyDataGenerator";

const data = generateDummyData();
writeDummyData(data);

console.log(`Generated ${data.requirements.length} session requirements in generated-data/.`);
