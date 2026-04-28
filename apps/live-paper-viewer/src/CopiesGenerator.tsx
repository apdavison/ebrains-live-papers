import { useState } from "react";
import Plot from "react-plotly.js";
import type { CopiesGeneratorConfig } from "./types";
import "./CopiesGenerator.css";

type Status = "idle" | "loading" | "ready";

interface CopyData {
  name: string;
  type?: string;
  spike_times_sim: Record<string, string[]>;
}

function randomColor(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function CopiesGenerator({ config }: { config: CopiesGeneratorConfig }) {
  const [sourceAll, setSourceAll] = useState(true);
  const [typeId, setTypeId] = useState(config.neuronTypes[0].id);
  const [quantity, setQuantity] = useState(config.defaultQuantity);
  const [status, setStatus] = useState<Status>("idle");
  const [selectedCopies, setSelectedCopies] = useState<Record<string, CopyData> | null>(null);
  const [showPlots, setShowPlots] = useState(false);

  const neuronType = config.neuronTypes.find((t) => t.id === typeId)!;
  const group = neuronType.group === "pyramidal" ? config.pyramidal : config.interneuron;
  const url = sourceAll ? group.allUrl : group.classifiedUrl;

  async function handleGetCopies() {
    setStatus("loading");
    setShowPlots(false);
    try {
      const res = await fetch(url);
      const data: Record<string, CopyData> = await res.json();

      let pool = data;
      if (neuronType.typeFilter) {
        pool = Object.fromEntries(
          Object.entries(data).filter(([, v]) => v.type === neuronType.typeFilter)
        );
      }

      const keys = Object.keys(pool);
      const selectedKeys = new Set<string>();
      const limit = Math.min(quantity, keys.length);
      while (selectedKeys.size < limit) {
        selectedKeys.add(keys[Math.floor(Math.random() * keys.length)]);
      }

      const selected = Object.fromEntries([...selectedKeys].map((k) => [k, pool[k]]));
      setSelectedCopies(selected);
      setStatus("ready");
    } catch {
      setStatus("idle");
    }
  }

  function buildTraces(level: string): Plotly.Data[] {
    if (!selectedCopies) return [];
    const boundary = group.boundaries[level];
    const colors = Object.keys(selectedCopies).map(() => randomColor());

    const copyTraces: Plotly.Data[] = Object.values(selectedCopies).map((copy, i) => {
      const spikeTimes = copy.spike_times_sim[level].map(parseFloat);
      return {
        x: spikeTimes,
        y: Array.from({ length: spikeTimes.length }, (_, j) => j + 1),
        mode: "lines+markers",
        marker: { color: colors[i] },
        type: "scatter",
      };
    });

    return [
      { x: boundary.x, y: boundary.yMax, mode: "lines", marker: { color: "gray" }, type: "scatter", name: "Bound" },
      ...copyTraces,
      { x: boundary.x, y: boundary.yMin, mode: "lines", marker: { color: "gray" }, type: "scatter", name: "Bound" },
    ];
  }

  function handleDownload() {
    if (!selectedCopies) return;
    const blobUrl = URL.createObjectURL(
      new Blob([JSON.stringify(selectedCopies)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "Copies.json";
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  const maxCount = sourceAll ? neuronType.maxAll : neuronType.maxClassified;

  return (
    <div className="copies-gen">
      <div className="copies-gen__controls">
        <p><strong>Select database source</strong></p>
        <p>
          <label>
            <input
              type="radio"
              name="copies-gen-source"
              checked={sourceAll}
              onChange={() => setSourceAll(true)}
            />
            <span> All copies</span>
          </label>
        </p>
        <p>
          <label>
            <input
              type="radio"
              name="copies-gen-source"
              checked={!sourceAll}
              onChange={() => setSourceAll(false)}
            />
            <span> Classified copies</span>
          </label>
        </p>

        <p><strong>Select neuron type</strong></p>
        {config.neuronTypes.map((t) => (
          <p key={t.id}>
            <label>
              <input
                type="radio"
                name="copies-gen-type"
                checked={typeId === t.id}
                onChange={() => setTypeId(t.id)}
              />
              <span> {t.label} (max {(sourceAll ? t.maxAll : t.maxClassified).toLocaleString()})</span>
            </label>
          </p>
        ))}

        <p><strong>Define the number of copies</strong></p>
        <p>
          <input
            type="number"
            value={quantity}
            min={1}
            max={maxCount}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v > 0) setQuantity(v);
            }}
            className="copies-gen__quantity"
          />
        </p>

        <p>
          <button
            className="app-btn"
            onClick={handleGetCopies}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Retrieving…" : "Get Copies"}
          </button>
        </p>
        {status === "ready" && (
          <p className="copies-gen__status">Copies retrieved</p>
        )}

        <p>
          <button
            className="app-btn"
            onClick={() => setShowPlots(true)}
            disabled={status !== "ready"}
          >
            Plot copies
          </button>
        </p>

        <p>
          <button
            className="app-btn"
            onClick={handleDownload}
            disabled={status !== "ready"}
          >
            Download JSON file
          </button>
        </p>
      </div>

      {showPlots && selectedCopies && (
        <div className="copies-gen__plots">
          {config.stimulusLevels.map((level) => (
            <div key={level} className="copies-gen__plot">
              <Plot
                data={buildTraces(String(level))}
                layout={{
                  title: { text: `<b># Spike Times @${level}pA</b>` },
                  xaxis: { title: { text: "<b>time (ms)</b>" } },
                  yaxis: { title: { text: "<b># spikes</b>" } },
                  showlegend: false,
                  autosize: true,
                  margin: { l: 60, r: 25, b: 60, t: 50 },
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: "100%", height: "350px" }}
                useResizeHandler
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CopiesGenerator;
