import { vi } from "vitest";
import axios from "axios";

import {
  collabList,
  aboutApi,
  kgVocab,
  modelDBvocab,
  neuromorphoVocab,
  biomodelsMetadata
} from "./mockData";

vi.mock("axios");

axios.CancelToken.source.mockResolvedValue({token: "MOCKCANCELTOKEN"});

axios.get.mockImplementation((url, config) => {
  switch (url) {
    case "https://model-validation-api.apps.ebrains.eu/projects?only_editable=true":
      return new Promise(() => {
        return collabList;
      });
    case "https://live-papers-api.apps.tc.humanbrainproject.eu":
      return new Promise(() => {
        return aboutApi;
      });
    case "https://model-validation-api.apps.ebrains.eu/vocab/":
      return new Promise(() => {
        return kgVocab;
      });
    case "https://corsproxy.apps.tc.humanbrainproject.eu/http://modeldb.science/api/v1/regions/name":
      return new Promise(() => {
        return modelDBvocab.regions;
      });
    case "https://corsproxy.apps.tc.humanbrainproject.eu/http://modeldb.science/api/v1/celltypes/name":
      return new Promise(() => {
        return modelDBvocab.cellTypes;
      });
    case "https://corsproxy.apps.tc.humanbrainproject.eu/http://modeldb.science/api/v1/modeltypes/name":
      return new Promise(() => {
        return modelDBvocab.modelTypes;
      });
    case "https://corsproxy.apps.tc.humanbrainproject.eu/http://modeldb.science/api/v1/modelconcepts/name":
      return new Promise(() => {
        return modelDBvocab.concepts;
      });
    case "https://corsproxy.apps.tc.humanbrainproject.eu/http://modeldb.science/api/v1/simenvironments/name":
      return new Promise(() => {
        return modelDBvocab.environments;
      });
    case "https://neuromorpho.org/api/neuron/fields/species":
      return new Promise(() => {
        return neuromorphoVocab.species;
      });
    case "https://neuromorpho.org/api/neuron/fields/brain_region_1":
      return new Promise(() => {
        return neuromorphoVocab.brainRegions;
      });
    case "https://neuromorpho.org/api/neuron/fields/cell_type_1":
      return new Promise(() => {
        return neuromorphoVocab.cellTypes;
      });
    case "https://neuromorpho.org/api/neuron/fields/reconstruction_software":
      return new Promise(() => {
        return neuromorphoVocab.software;
      });
    case "https://neuromorpho.org/api/neuron/fields/protocol":
      return new Promise(() => {
        return neuromorphoVocab.protocols;
      });
    case "https://corsproxy.apps.tc.humanbrainproject.eu/https://www.ebi.ac.uk/biomodels/search?query=*%3A*&format=json":
      return new Promise(() => {
        return biomodelsMetadata;
      });
    default:
      throw `Unexpected URL: ${url}`;
  }
});
