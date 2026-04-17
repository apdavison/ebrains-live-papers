import {
  buildKGQuery,
  simpleProperty,
  linkProperty,
} from "ebrains-kg-query";

const FILTER_KEY_TO_KG_TYPE = {
  species: "Species",
  brain_region: "UBERONParcellation",
  cell_type: "CellType",
};

function buildRecordingActivityQuery(filters) {
  // Build studyTarget filter linkProperties for the DatasetVersion (isPartOf).
  // Each active filter adds a required, type-filtered studyTarget entry
  // so the KG only returns RecordingActivities whose parent DatasetVersion
  // has a matching study target.
  const datasetStudyTargetFilters = [];
  if (filters) {
    for (const [key, values] of Object.entries(filters)) {
      const kgType = FILTER_KEY_TO_KG_TYPE[key];
      if (kgType && values && values.length > 0) {
        for (const value of values) {
          datasetStudyTargetFilters.push(
            linkProperty("studyTarget", [simpleProperty("name")], {
              type: kgType,
              filter: value,
              required: true,
              expectSingle: true,
            })
          );
        }
      }
    }
  }

  const isPartOfStructure = [
    simpleProperty("@id"),
    simpleProperty("fullName"),
    simpleProperty("shortName"),
    ...datasetStudyTargetFilters,
  ];

  return buildKGQuery("RecordingActivity", [
    simpleProperty("@id"),
    simpleProperty("lookupLabel"),
    simpleProperty("internalIdentifier"),
    simpleProperty("startTime"),
    linkProperty(
      "studyTarget",
      [simpleProperty("@id"), simpleProperty("name"), simpleProperty("@type")],
      { expectSingle: false }
    ),
    linkProperty(
      "output",
      [
        simpleProperty("@id"),
        simpleProperty("name"),
        simpleProperty("contentDescription"),
        simpleProperty("IRI"),
      ],
      { expectSingle: false }
    ),
    linkProperty("isPartOf", isPartOfStructure),
    linkProperty(
      "device",
      [simpleProperty("@type"), simpleProperty("name")],
      { expectSingle: false }
    ),
  ]);
}

export { buildRecordingActivityQuery };
