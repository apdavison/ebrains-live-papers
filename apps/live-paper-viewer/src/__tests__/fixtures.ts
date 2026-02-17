import type { BlueNaaSConfig } from "../types";
import martinelloData from "../mocks/data/04ac2988-b717-469d-88ce-d54d02036eb1.json";
import mccauleyData from "../mocks/data/203d1466-8792-4b05-b546-09ee178387c3.json";
import solinasData from "../mocks/data/cb7e5f66-0984-4f0c-acad-6281be4bb5c9.json";

interface MockLivePaper {
  sections: { data: { config?: Record<string, unknown> }[] }[];
}

function extractConfig(data: MockLivePaper): BlueNaaSConfig {
  for (const section of data.sections) {
    for (const item of section.data) {
      if (item.config) {
        return item.config as unknown as BlueNaaSConfig;
      }
    }
  }
  throw new Error("No BlueNaaSConfig found in mock data");
}

export const martinelloConfig = extractConfig(martinelloData);
export const mccauleyConfig = extractConfig(mccauleyData);
export const solinasConfig = extractConfig(solinasData);
