import { createKGClient, uuidFromUri } from "ebrains-kg-query";
import { buildRecordingActivityQuery } from "./queries/recordings";

const KG_URL = "https://core.kg.ebrains.eu/v3";

const kgClient = createKGClient({
  kgUrl: KG_URL,
  defaultStage: "RELEASED",
});

const STIMULUS_TYPES = [
  "AuditoryStimulusType",
  "ElectricalStimulusType",
  "GustatoryStimulusType",
  "OlfactoryStimulusType",
  "OpticalStimulusType",
  "TactileStimulusType",
  "VisualStimulusType",
];

const DEVICE_TYPE_TO_MODALITY = {
  PipetteUsage: "patch clamp",
  ElectrodeUsage: "extracellular electrophysiology",
  ElectrodeArrayUsage: "multi-electrode extracellular electrophysiology",
};

function isTypeMatch(typeArray, typeName) {
  if (!typeArray) return false;
  return typeArray.some((t) => t.includes(typeName));
}

function deriveModality(devices) {
  if (!devices || devices.length === 0) return null;
  for (const device of devices) {
    if (device.type) {
      for (const [kgType, modality] of Object.entries(
        DEVICE_TYPE_TO_MODALITY
      )) {
        if (isTypeMatch(device.type, kgType)) {
          return modality;
        }
      }
    }
  }
  return null;
}

function deriveStimulusType(studyTargets) {
  const stimuli = studyTargets.filter((t) =>
    STIMULUS_TYPES.some((st) => isTypeMatch(t.type, st))
  );
  if (stimuli.length === 0) return null;
  return stimuli.map((s) => s.name).join(", ");
}

function transformToTraces(kgResults) {
  return kgResults.map((item) => {
    const studyTargets = item.studyTarget || [];
    const speciesTargets = studyTargets.filter((t) =>
      isTypeMatch(t.type, "Species")
    );
    const cellTypeTargets = studyTargets.filter((t) =>
      isTypeMatch(t.type, "CellType")
    );

    return {
      id: uuidFromUri(item.id),
      label: item.lookupLabel || item.internalIdentifier || "",
      modality: deriveModality(item.device),
      stimulation: deriveStimulusType(studyTargets),
      timestamp: item.startTime || null,
      species: speciesTargets.map((s) => s.name).join(", ") || null,
      cell_type: cellTypeTargets.map((c) => c.name).join(", ") || null,
      instances: (item.output || []).map((o) => ({
        description: o.contentDescription || o.name || "",
        location: o.IRI || "",
      })),
      view_url: item.isPartOf
        ? `https://search.kg.ebrains.eu/instances/${uuidFromUri(item.isPartOf.id)}`
        : null,
      parent_name:
        item.isPartOf?.fullName || item.isPartOf?.shortName || null,
      parent_id: item.isPartOf ? uuidFromUri(item.isPartOf.id) : null,
    };
  });
}

function buildCacheLabel(filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return "recordings";
  }
  const parts = Object.entries(filters)
    .filter(([, values]) => values && values.length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, values]) => `${key}=${values.sort().join(",")}`)
    .join("&");
  return parts ? `recordings:${parts}` : "recordings";
}

export async function fetchRecordings(token, filters) {
  const query = buildRecordingActivityQuery(filters);
  const cacheLabel = buildCacheLabel(filters);
  const results = await kgClient.getKGData(
    cacheLabel,
    query,
    { token }
  );
  return transformToTraces(results);
}
