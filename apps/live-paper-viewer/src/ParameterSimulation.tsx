import { useState, useMemo, Fragment } from "react";
import { compile } from "mathjs";
import Plot from "react-plotly.js";
import type { ParameterSimulationConfig } from "./types";
import "./ParameterSimulation.css";

type ParamValues = Record<string, number>;

function ParameterSimulation({ config }: { config: ParameterSimulationConfig }) {
  const defaults = useMemo(
    () => Object.fromEntries(config.parameters.map((p) => [p.id, p.default])),
    [config]
  );

  const compiled = useMemo(() => compile(config.formula), [config.formula]);

  function computeTrace(vals: ParamValues): Plotly.Data {
    const x = Array.from({ length: config.timeSteps }, (_, i) => i);
    const y = x.map((t) => {
      try {
        const v = compiled.evaluate({ ...vals, t }) as number;
        return isFinite(v) ? v : 0;
      } catch {
        return 0;
      }
    });
    return { x, y, type: "scatter", mode: "lines" };
  }

  const [editMode, setEditMode] = useState(false);
  const [persistent, setPersistent] = useState(false);
  const [inputValues, setInputValues] = useState<ParamValues>(defaults);
  const [traces, setTraces] = useState<Plotly.Data[]>(() => [
    computeTrace(defaults),
  ]);

  function handleEditToggle(checked: boolean) {
    setEditMode(checked);
    if (!checked) setInputValues(defaults);
  }

  function handleChange(id: string, raw: string) {
    const num = parseFloat(raw);
    if (!isNaN(num)) setInputValues((prev) => ({ ...prev, [id]: num }));
  }

  function handlePlot() {
    const newTrace = computeTrace(inputValues);
    setTraces((prev) => (persistent ? [...prev, newTrace] : [newTrace]));
  }

  // Pair parameters for 2-column layout
  const pairs: (typeof config.parameters)[] = [];
  for (let i = 0; i < config.parameters.length; i += 2) {
    pairs.push(config.parameters.slice(i, i + 2));
  }

  return (
    <div className="param-sim">
      <div className="param-sim__layout">
        <div className="param-sim__chart">
          <Plot
            data={traces}
            layout={{
              xaxis: { title: { text: config.xAxisLabel } },
              yaxis: { title: { text: config.yAxisLabel } },
              showlegend: false,
              margin: { l: 60, r: 25, b: 60, t: 35, pad: 15 },
              autosize: true,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%", height: "300px" }}
            useResizeHandler
          />
        </div>
        <div className="param-sim__controls">
          <table className="param-sim__table">
            <tbody>
              {pairs.map((pair, i) => (
                <tr key={i}>
                  {pair.map((p) => (
                    <Fragment key={p.id}>
                      <td
                        className="param-sim__label"
                        dangerouslySetInnerHTML={{ __html: p.labelHtml }}
                      />
                      <td>
                        <input
                          type="number"
                          value={inputValues[p.id] ?? p.default}
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          disabled={!editMode}
                          onChange={(e) => handleChange(p.id, e.target.value)}
                          className="param-sim__input"
                        />
                      </td>
                    </Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="param-sim__switches">
            <div className="switch param-sim__switch">
              <label>
                <input
                  type="checkbox"
                  checked={editMode}
                  onChange={(e) => handleEditToggle(e.target.checked)}
                />
                <span className="lever" />
                <span className="param-sim__switch-label">
                  Reset/Set
                  <br />
                  parameters
                </span>
              </label>
            </div>
            <div className="switch param-sim__switch">
              <label>
                <input
                  type="checkbox"
                  checked={persistent}
                  onChange={(e) => setPersistent(e.target.checked)}
                />
                <span className="lever" />
                <span className="param-sim__switch-label">
                  Persistent
                  <br />
                  plots
                </span>
              </label>
            </div>
          </div>

          <div className="param-sim__actions">
            <button
              className="waves-effect waves-light btn"
              onClick={handlePlot}
            >
              Plot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParameterSimulation;
