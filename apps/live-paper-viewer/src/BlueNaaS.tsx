import { useState, useCallback } from "react";
import Plot from "react-plotly.js";
import type { BlueNaaSConfig } from "./types";
import "./BlueNaaS.css";

const BLUENAAS_REMOTE = "wss://bluenaas-single-cell-svc.apps.ebrains.eu/ws";
const BLUENAAS_URL = import.meta.env.DEV
  ? `ws://${window.location.host}/ws`
  : BLUENAAS_REMOTE;

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: number
): Record<string, unknown> {
  const result = structuredClone(obj);
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current: Record<string, unknown> = result;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = parts[parts.length - 1];
  current[lastKey] = value;
  return result;
}

type Status = "idle" | "loading" | "error" | "ready";

function BlueNaaS({ config }: { config: BlueNaaSConfig }) {
  const [parameterValues, setParameterValues] = useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(
      config.parameterFields.map((f) => [f.id, f.default])
    )
  );
  const [status, setStatus] = useState<Status>("idle");
  const [plotData, setPlotData] = useState<Plotly.Data[][]>(
    () => config.charts.map(() => [])
  );
  const [persistentPlots, setPersistentPlots] = useState(false);
  const [parametersEnabled, setParametersEnabled] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [customSwitchState, setCustomSwitchState] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      (config.switches ?? [])
        .filter((s) => s.id !== "persistent-plots" && s.id !== "reset-set")
        .map((s) => [s.id, false])
    )
  );

  const validate = useCallback(() => {
    for (const field of config.parameterFields) {
      const val = parameterValues[field.id];
      if (val < field.min || val > field.max) {
        return `Please select a value for ${field.label} between ${field.min} and ${field.max}`;
      }
    }
    return null;
  }, [parameterValues, config.parameterFields]);

  const handleParameterChange = useCallback(
    (id: string, value: number) => {
      setParameterValues((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  const applyPreset = useCallback(
    (values: Record<string, number>) => {
      setParameterValues((prev) => ({ ...prev, ...values }));
    },
    []
  );

  const runSimulation = useCallback(() => {
    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setStatus("loading");

    let params = structuredClone(config.defaultParameters);

    // Apply parameter overrides from active custom switches
    for (const sw of config.switches ?? []) {
      if (sw.onParameters && customSwitchState[sw.id]) {
        Object.assign(params, structuredClone(sw.onParameters));
      }
    }

    if (parametersEnabled) {
      for (const field of config.parameterFields) {
        params = setNestedValue(
          params as Record<string, unknown>,
          field.path,
          parameterValues[field.id]
        );
      }
    }

    const ws = new WebSocket(BLUENAAS_URL);

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ cmd: "set_url", data: config.modelURL }));
      ws.send(JSON.stringify({ cmd: "set_params", data: params }));
      ws.send(
        JSON.stringify({
          cmd: "run_simulation",
          data: config.recordedVectors,
        })
      );
    };

    ws.onmessage = (evt) => {
      const received = JSON.parse(evt.data);
      const data = received.data;
      const time: number[] = data["TIME"];

      const newPlotData = config.charts.map((chart) => {
        const traces: Plotly.Data[] = chart.variables.map((varName) => ({
          x: time,
          y: data[varName] as number[],
          mode: "lines" as const,
          name: varName,
        }));
        return traces;
      });

      setPlotData((prev) => {
        if (persistentPlots) {
          return prev.map((existing, i) => [
            ...existing,
            ...newPlotData[i],
          ]);
        }
        return newPlotData;
      });

      setStatus("ready");
      ws.close();
    };
  }, [
    config,
    customSwitchState,
    parameterValues,
    parametersEnabled,
    persistentPlots,
    validate,
  ]);

  const margin = { l: 60, r: 25, b: 60, t: 35, pad: 15 };

  const hasPersistentPlotsSwitch = config.switches?.some(
    (s) => s.id === "persistent-plots"
  );
  const hasResetSetSwitch = config.switches?.some(
    (s) => s.id === "reset-set"
  );

  return (
    <div className="bluenaas-outer">
      <div className="plots">
        <div className="row">
          {config.charts.map((chart, i) => (
            <div
              key={chart.title}
              className={`col s${Math.floor(12 / config.charts.length)}`}
            >
              <Plot
                data={plotData[i]}
                layout={{
                  title: { text: chart.title },
                  xaxis: { title: { text: chart.xaxis } },
                  yaxis: { title: { text: chart.yaxis } },
                  legend: { orientation: "v" },
                  showlegend: true,
                  margin,
                  autosize: true,
                }}
                useResizeHandler
                style={{ width: "100%", height: "450px" }}
              />
            </div>
          ))}
        </div>
      </div>

      {status === "loading" && (
        <div className="overlay" style={{ opacity: 1, zIndex: 10 }}>
          <div className="loader-class">
            <div className="row center-text">
              Launching simulation. Please wait ...
              <div className="progress">
                <div className="indeterminate"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="overlay" style={{ opacity: 1, zIndex: 10 }}>
          <div className="loader-class">
            <div className="row center-text">
              An error occurred while connecting to the server
              <br />
              Please try again in a few seconds
            </div>
          </div>
        </div>
      )}

      <div className="divider" />
      <h6>
        <strong>Settings</strong>
      </h6>
      <div style={{ overflowX: "auto" }}>
        <table className="centered">
          <tbody>
            <tr>
              {config.parameterFields.map((field) => (
                <td key={field.id}>
                  <span dangerouslySetInnerHTML={{ __html: field.label }} />
                  <div className="settings input-field col s12">
                    <input
                      type="number"
                      id={field.id}
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      value={parameterValues[field.id]}
                      disabled={!parametersEnabled && hasResetSetSwitch}
                      onChange={(e) =>
                        handleParameterChange(
                          field.id,
                          parseFloat(e.target.value)
                        )
                      }
                      style={{ minWidth: "55px" }}
                    />
                  </div>
                </td>
              ))}

              {hasResetSetSwitch && (
                <td>
                  <div className="switch">
                    <label>
                      <input
                        type="checkbox"
                        checked={parametersEnabled}
                        onChange={(e) =>
                          setParametersEnabled(e.target.checked)
                        }
                      />
                      <span className="lever" />
                      <br />
                      Reset/Set
                      <br />
                      parameters
                    </label>
                  </div>
                </td>
              )}

              {hasPersistentPlotsSwitch && (
                <>
                  <th
                    style={{
                      border: "1px solid #e2e2e2",
                      borderLeft: "none",
                    }}
                  />
                  <td>
                    <div className="switch">
                      <label>
                        <input
                          type="checkbox"
                          checked={persistentPlots}
                          onChange={(e) =>
                            setPersistentPlots(e.target.checked)
                          }
                        />
                        <span className="lever" />
                        <br />
                        Persistent
                        <br />
                        plots
                      </label>
                    </div>
                  </td>
                </>
              )}

              {config.switches
                ?.filter(
                  (s) =>
                    s.id !== "persistent-plots" && s.id !== "reset-set"
                )
                .map((sw) => (
                  <td key={sw.id}>
                    <div className="switch">
                      <label>
                        <input
                          type="checkbox"
                          checked={customSwitchState[sw.id] ?? false}
                          onChange={(e) =>
                            setCustomSwitchState((prev) => ({
                              ...prev,
                              [sw.id]: e.target.checked,
                            }))
                          }
                        />
                        <span className="lever" />
                        <br />
                        {sw.label}
                      </label>
                    </div>
                  </td>
                ))}

              <th
                style={{
                  border: "1px solid #e2e2e2",
                  borderRight: "none",
                }}
              />
              <td>
                <button
                  type="submit"
                  className="waves-effect waves-light btn"
                  onClick={runSimulation}
                  style={{ margin: "6px", width: "120px" }}
                >
                  Run
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {validationError && (
        <label style={{ color: "red" }}>{validationError}</label>
      )}

      {config.presets && config.presets.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <strong>Set defaults</strong>
          <div className="row" style={{ justifyContent: "center" }}>
            {config.presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="col s4 waves-effect waves-teal btn-flat"
                onClick={() => applyPreset(preset.values)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BlueNaaS;
