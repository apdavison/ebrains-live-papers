const collabList = [
  {
    project_id: "Stan-and-Ollie",
    permissions: {
      VIEW: true,
      UPDATE: true,
    },
  },
  {
    project_id: "the-flying-deuces",
    permissions: {
      VIEW: true,
      UPDATE: true,
    },
  },
  {
    project_id: "another-fine-mess",
    permissions: {
      VIEW: true,
      UPDATE: true,
    },
  },
];

const aboutApi = {
  about: "This is the EBRAINS Live Papers API",
  version: "1",
  status: "ok",
  datastore: "core.kg.ebrains.eu",
  build: {
    git: "2dbfacf5",
    target: "production",
    date: "2024-05-17T14:59:47+02:00",
  },
  links: {
    documentation: "/docs",
    metadata: "/about",
  },
};

const kgVocab = {
  brain_region: [
    "Ammon's horn",
    "CA1 alveus",
    "CA1 field of hippocampus",
    "CA1 stratum lacunosum moleculare",
    "CA1 stratum oriens",
    "CA1 stratum radiatum",
    "CA2 field of hippocampus",
    "CA2 stratum radiatum",
    "CA3 alveus",
    "CA3 field of hippocampus",
    "CA3 stratum radiatum",
    "ventral acoustic stria",
    "ventral amygdalofugal projection",
    "ventral anterior nucleus of thalamus",
    "ventral cochlear nucleus",
    "ventral external arcuate fiber bundle",
  ],
  species: ["Ovis aries", "Rattus norvegicus", "Sus scrofa domesticus", "Trachemys scripta elegans"],
  model_scope: ["network", "network: microcircuit", "single cell", "subcellular", "subcellular: ion channel"],
  cell_type: [
    "D1 receptor expressing neuron",
    "D2 receptor expressing neuron",
    "Purkinje cell",
    "aromatase expressing neuron",
    "astrocyte",
    "basket cell",
    "calbindin expressing neuron",
    "calretinin expressing neuron",
    "cerebellar interneuron",
    "cerebellum Golgi cell",
    "cerebellum basket cell",
    "cerebellum granule cell",
    "cerebellum stellate neuron",
  ],
  abstraction_level: [
    "algorithm",
    "cognitive modelling",
    "population modelling",
    "protein structure",
    "rate neurons",
    "spiking neurons",
    "statistical model",
    "systems biology",
  ],
  recording_modality: [
    "microstimulation",
    "microtome sectioning",
    "model-based stimulation artifact correction",
    "morphometric analysis",
    "morphometry",
    "motion capture",
    "motion correction",
    "movement tracking",
  ],
  test_type: ["network", "network: microcircuit", "single cell", "subcellular", "subcellular: ion channel"],
  score_type: ["mean squared error", "t-statistic", "z-score"],
  implementation_status: ["in development", "proposal", "published"],
  license: [
    "Apache License, Version 2.0",
    "The 3-Clause BSD License",
    "Creative Commons Attribution 4.0 International",
    "GNU General Public License v3.0 or later",
    "GNU Lesser General Public License v3.0 or later",
    "The MIT license",
  ],
  content_type: [
    "application/vnd.neuralensemble.pynn",
    "application/vnd.neuroml",
    "application/vnd.neuron-simulator+hoc",
    "application/vnd.neuron-simulator+python",
    "application/vnd.neuron.mod",
    "text/x-matlab",
    "text/x-python",
    "text/x-python.2",
    "text/x-python.3",
  ],
};

const modelDBvocab = {
  cellTypes: [
    "Dentate gyrus granule GLU cell",
    "Hippocampus CA1 pyramidal GLU cell",
    "Hippocampus CA3 pyramidal GLU cell",
    "Neostriatum medium spiny direct pathway GABA cell",
    "Substantia nigra pars compacta DA cell",
    "Thalamus geniculate nucleus/lateral principal GLU cell",
    "Thalamus reticular nucleus GABA cell",
    "Neocortex L5/6 pyramidal GLU cell",
    "Neocortex L2/3 pyramidal GLU cell",
    "Olfactory bulb main mitral GLU cell",
  ],
  modelTypes: [
    "Realistic Network",
    "Neuron or other electrically excitable cell",
    "Axon",
    "Synapse",
    "Channel/Receptor",
    "Dendrite",
    "Agent-based model",
    "Boolean network",
    "Network growth",
    "Spiking neural network",
  ],
  concepts: [
    "Long-QT",
    "Sleep",
    "Nociception",
    "Stuttering",
    "Delay",
    "Place cell/field",
    "Calcium dynamics",
    "Timothy Syndrome",
    "Aging/Alzheimer`s",
    "Schizophrenia",
    "Addiction",
    "Complementary and alternative medicine",
  ],
  environments: [
    "NEURON",
    "GENESIS",
    "NEST",
    "MATLAB",
    "Topographica",
    "PyNN",
    "LFPy",
    "NetPyNE",
    "Brian 2",
    "Snudda",
    "Arbor",
  ],
  regions: [
    "Neocortex",
    "Hippocampus",
    "Dentate gyrus",
    "Turtle cortex",
    "Olfactory cortex",
    "Olfactory bulb",
    "Thalamus",
    "Basal ganglia",
    "Cerebellum",
    "Barrel cortex",
    "Turtle vestibular system",
    "Globus pallidus externa (GPe)",
    "Mushroom body",
    "Optic lobe/Praying Mantis",
    "Visual cortex",
  ],
};

const neuromorphoVocab = {
  species: {
    field_name: "species",
    fields: [
      "mouse",
      "rat",
      "drosophila melanogaster",
      "human",
      "zebrafish",
      "monkey",
      "C. elegans",
      "Gorilla",
    ],
  },

  brainRegions: {
    // to-fix: see https://gitlab.ebrains.eu/live-papers/live-papers-platform/-/issues/1
    field_name: "brain_region_1",
    fields: [],
  },

  cellTypes: {
    // to-fix: see https://gitlab.ebrains.eu/live-papers/live-papers-platform/-/issues/1
    field_name: "cell_type_1",
    fields: [],
  },

  software: {
    field_name: "reconstruction_software",
    fields: ["Neurolucida", "Imaris", "Simple Neurite Tracer", "Custom", "NeuronJ", "TREES toolbox"],
  },

  protocols: {
    field_name: "protocol",
    fields: ["in vitro", "in vivo", "culture", "ex vivo", "in utero", "Not reported", "in ovo"],
  },
};

const biomodelsMetadata = {
  facets: [
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "1636",
          label: "Non-curated",
          value: "Non-curated",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "1073",
          label: "Manually curated",
          value: "Manually curated",
        },
      ],
      id: "curationstatus",
      label: "Curation status",
      total: 2,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "2481",
          label: "SBML",
          value: "SBML",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "61",
          label: "Python",
          value: "Python",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "45",
          label: "COMBINE archive",
          value: "COMBINE archive",
        },
      ],
      id: "modelformat",
      label: "Model format",
      total: 12,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "1662",
          label: "Ordinary differential equation model",
          value: "ordinary differential equation model",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "312",
          label: "Constraint-based model",
          value: "constraint-based model",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "38",
          label: "Computational model",
          value: "computational model",
        },
      ],
      id: "modellingapproach",
      label: "Modelling Approach",
      total: 33,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "124",
          label: "Immuno-oncology",
          value: "Immuno-oncology",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "88",
          label: "FROG",
          value: "FROG",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "87",
          label: "Machine Learning Model",
          value: "Machine Learning Model",
        },
      ],
      id: "submitter_keywords",
      label: "Model Tag",
      total: 10,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "846",
          label: "Homo sapiens",
          value: "9606",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "139",
          label: "Saccharomyces cerevisiae",
          value: "4932",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "117",
          label: "Mus musculus",
          value: "10090",
        },
      ],
      id: "TAXONOMY",
      label: "Organisms",
      total: 226,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "26",
          label: "Alzheimer's disease",
          value: "Alzheimer's disease",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "24",
          label: "COVID-19",
          value: "COVID-19",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "22",
          label: "Diabetes mellitus",
          value: "diabetes mellitus",
        },
      ],
      id: "disease",
      label: "Disease",
      total: 78,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "227",
          label: "cytoplasm",
          value: "GO:0005737",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "157",
          label: "nucleus",
          value: "GO:0005634",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "1",
          label: "negative regulation of osteoclast differentiation",
          value: "GO:0045671",
        },
      ],
      id: "GO",
      label: "GO",
      total: 2834,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "74",
          label: "Pyruvate kinase PKLR",
          value: "P30613",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "74",
          label: "Cytoplasmic aconitate hydratase",
          value: "P21399",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "39",
          label: "3-oxo-5-alpha-steroid 4-dehydrogenase 1",
          value: "P18405",
        },
      ],
      id: "UNIPROT",
      label: "UNIPROT",
      total: 18065,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "303",
          label: "ADP",
          value: "CHEBI:16761",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "287",
          label: "carbon dioxide",
          value: "CHEBI:16526",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "282",
          label: "glycerol",
          value: "CHEBI:17754",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "79",
          label: "tetracosanoic acid",
          value: "CHEBI:28866",
        },
      ],
      id: "CHEBI",
      label: "CHEBI",
      total: 12260,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "4",
          label: "CASP8",
          value: "ENSG00000064012",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "4",
          label: "NFKB2",
          value: "ENSG00000077150",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "4",
          label: "QSOX2",
          value: "ENSG00000165661",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "1",
          label: "POLR2D",
          value: "ENSG00000144231",
        },
      ],
      id: "ENSEMBL",
      label: "ENSEMBL",
      total: 15670,
    },
    {
      class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.Facet",
      facetValues: [
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "517",
          label: "Non Kinetic",
          value: "Non Kinetic",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "18",
          label: "Non Miriam",
          value: "Non Miriam",
        },
        {
          class: "uk.ac.ebi.ddi.ebe.ws.dao.model.common.FacetValue",
          count: "3",
          label: "Sbml Extended",
          value: "Sbml Extended",
        },
      ],
      id: "modelflag",
      label: "Model Flag",
      total: 3,
    },
  ],
  matches: 3101,
  models: [
    {
      format: "SBML",
      id: "MODEL1507180061",
      lastModified: "2015-07-28T23:00:00Z",
      name: "Sohn2012 - Genome-scale metabolic network of Schizosaccharomyces pombe (SpoMBEL1693)",
      submissionDate: "2015-07-17T23:00:00Z",
      submitter: "Nicolas Le Novère",
      url: "https://www.ebi.ac.uk/biomodels/MODEL1507180061",
    },
    {
      format: "SBML",
      id: "MODEL8687196544",
      lastModified: "2009-04-21T23:00:00Z",
      name: "Niederer2006_CardiacMyocyteRelaxation",
      submissionDate: "2009-04-21T23:00:00Z",
      submitter: "Vijayalakshmi Chelliah",
      url: "https://www.ebi.ac.uk/biomodels/MODEL8687196544",
    },
    {
      format: "MorpheusML",
      id: "MODEL2009210001",
      lastModified: "2021-10-11T23:00:00Z",
      name: "Mulberry2020 - Two-layered, self-organizing multicellular structure where all cells are of the same genotype",
      submissionDate: "2020-09-20T23:00:00Z",
      submitter: "Nicola Mulberry",
      url: "https://www.ebi.ac.uk/biomodels/MODEL2009210001",
    },
  ],
};

export {
  collabList,
  aboutApi,
  kgVocab,
  modelDBvocab,
  neuromorphoVocab
};
