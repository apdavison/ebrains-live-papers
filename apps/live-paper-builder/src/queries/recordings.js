import {
  buildKGQuery,
  simpleProperty as S,
  linkProperty as L,
  reverseLinkProperty as R
} from "ebrains-kg-query";

// const FILTER_KEY_TO_KG_TYPE = {
//   species: "Species",
//   brain_region: "UBERONParcellation",
//   cell_type: "CellType",
// };

function buildRecordingActivityQuery(filters) {
  //const datasetStudyTargetFilters = [];
  const speciesFilter = {};
  let useSpeciesFilter = false;
  const brainRegionFilter = {};
  let useBrainRegionFilter = false;
  const cellTypeFilter = {};
  let useCellTypeFilter = false;
  if (filters) {
    console.log(filters);
    if (filters.species) {
      speciesFilter.filter = filters.species[0];
      speciesFilter.required = true;
      useSpeciesFilter = true;
    }
    if (filters.brain_region) {
      brainRegionFilter.filter = filters.brain_region[0];
      brainRegionFilter.required = true;
      useBrainRegionFilter = true;
    }
    if (filters.cell_type) {
      cellTypeFilter.filter = filters.cell_type[0];
      cellTypeFilter.required = true;
      useCellTypeFilter = true;
    }
  }

  return buildKGQuery("RecordingActivity", [
    S("@id"),
    S("lookupLabel"),
    S("internalIdentifier"),
    S("startTime"),
    L(
      "studyTarget",
      [S("@id"), S("name"), S("@type")],
      { expectSingle: false }
    ),
    L(
      "output",
      [
        S("@id"),
        S("name"),
        S("contentDescription"),
        S("IRI"),
        L("format/name")
      ],
      { expectSingle: false }
    ),
    L(
      "isPartOf",
      [
        S("@id"),
        S("fullName"),
        S("shortName"),
      ]
    ),
    L(
      "device",
      [S("@type"), S("name")],
      { expectSingle: false }
    ),
    L(
      "input",  // TissueSampleState (patched cell)
      [
        S("@id"),
        S("lookupLabel"),
        L(
           "descendedFrom",   // TissueSampleState (slice)
           [
              S("lookupLabel"),
              L(
                "descendedFrom",   // SubjectState
                [
                  S("@id"),
                  S("lookupLabel"),
                  R(
                    "isStudiedStateOf",   // Subject
                    "studiedState",
                    [
                      S("@id"),
                      S("lookupLabel"),
                      L("species/species/name", [], speciesFilter)
                    ],
                    {required: useSpeciesFilter}
                 )
               ],
               {required: useSpeciesFilter}
             ),
             R(
              "isStudiedStateOf",   // TissueSample (slice)
              "studiedState",
              [
                S("@id"),
                S("lookupLabel"),
                L("anatomicalLocation/name", [], brainRegionFilter)   // todo: add typeFilter
              ],
              {required: useBrainRegionFilter}
            )
           ],
           {required: useSpeciesFilter || useBrainRegionFilter}
        ),
        R(
          "isStudiedStateOf",   // TissueSample (cell)
          "studiedState",
          [
            S("@id"),
            S("lookupLabel"),
            L("anatomicalLocation/name", [], cellTypeFilter) // todo: add typeFilter
          ],
          {required: useCellTypeFilter}
        )
      ],
      { expectSingle: false, required: useSpeciesFilter || useCellTypeFilter || useBrainRegionFilter }
    )
  ]);
}

//   return buildKGQuery("RecordingActivity", [
//     S("@id"),
//     S("lookupLabel"),
//     S("internalIdentifier"),
//     S("startTime"),
//     L(
//       "studyTarget",
//       [S("@id"), S("name"), S("@type")],
//       { expectSingle: false }
//     ),
//     L(
//       "output",
//       [
//         S("@id"),
//         S("name"),
//         S("contentDescription"),
//         S("IRI"),
//         L("format/name")
//       ],
//       { expectSingle: false }
//     ),
//     L(
//       "isPartOf",
//       [
//         S("@id"),
//         S("fullName"),
//         S("shortName"),
//         ...datasetStudyTargetFilters,
//       ],
//       {required: true}),
//     L(
//       "device",
//       [S("@type"), S("name")],
//       { expectSingle: false }
//     ),
//   ]);
// }



export { buildRecordingActivityQuery };
