import type { BlueNaaSConfig, BlueNaaSLaunchButtonsConfig, BlueNaaSDemoGridConfig } from "../types";
import martinelloData from "../mocks/data/04ac2988-b717-469d-88ce-d54d02036eb1.json";
import mccauleyData from "../mocks/data/203d1466-8792-4b05-b546-09ee178387c3.json";
import solinasData from "../mocks/data/cb7e5f66-0984-4f0c-acad-6281be4bb5c9.json";
import miglioreData from "../mocks/data/c1573aeb-d139-42a2-a7fc-fd68319e428e.json";
import eyal2016Data from "../mocks/data/9c00022b-82be-435e-b23f-bf4ee4cacc28.json";

interface MockLivePaper {
  sections: { data: { type?: string; config?: Record<string, unknown> }[] }[];
}

function extractConfig<T>(data: MockLivePaper, type?: string): T {
  for (const section of data.sections) {
    for (const item of section.data) {
      if (item.config && (!type || item.type === type)) {
        return item.config as unknown as T;
      }
    }
  }
  throw new Error(`No config found in mock data${type ? ` for type ${type}` : ""}`);
}

export const martinelloConfig = extractConfig<BlueNaaSConfig>(martinelloData);
export const mccauleyConfig = extractConfig<BlueNaaSConfig>(mccauleyData);
export const solinasConfig = extractConfig<BlueNaaSConfig>(solinasData);
export const miglioreButtonsConfig = extractConfig<BlueNaaSLaunchButtonsConfig>(miglioreData, "bluenaas-launch-buttons");
export const eyalDemoGridConfig = extractConfig<BlueNaaSDemoGridConfig>(eyal2016Data, "bluenaas-demo-grid");
