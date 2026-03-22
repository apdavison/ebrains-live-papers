import type {
  BlueNaaSConfig,
  BlueNaaSDemoGridConfig,
  LinkButtonsConfig,
  TabbedCollapsibleConfig,
} from "../types";
import martinelloData from "../mocks/data/04ac2988-b717-469d-88ce-d54d02036eb1.json";
import mccauleyData from "../mocks/data/203d1466-8792-4b05-b546-09ee178387c3.json";
import solinasData from "../mocks/data/cb7e5f66-0984-4f0c-acad-6281be4bb5c9.json";
import miglioreData from "../mocks/data/c1573aeb-d139-42a2-a7fc-fd68319e428e.json";
import eyal2016Data from "../mocks/data/9c00022b-82be-435e-b23f-bf4ee4cacc28.json";
import lupascuData from "../mocks/data/93a5c03a-6995-47bc-af9f-4f0d85950d1d.json";
import hjorthData from "../mocks/data/67806cc2-84e0-4bb3-ae52-8cc3e5abf738.json";

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
export const miglioreButtonsConfig = extractConfig<LinkButtonsConfig>(miglioreData, "link-buttons");
export const eyalDemoGridConfig = extractConfig<BlueNaaSDemoGridConfig>(eyal2016Data, "bluenaas-demo-grid");
export const lupascuTabbedConfig = extractConfig<TabbedCollapsibleConfig>(lupascuData, "tabbed-collapsible");
export const hjorthTabbedConfig = extractConfig<TabbedCollapsibleConfig>(hjorthData, "tabbed-collapsible");
