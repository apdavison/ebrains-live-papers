import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "./BlueNaaS.css";

const BLUENAAS_URL = "wss://bluenaas-single-cell-svc.apps.ebrains.eu/ws";

function BlueNaaS() {
  //{ modelURL }: { modelURL: string }) {
  const modelURL = 'https://data-proxy.ebrains.eu/api/v1/buckets/live-paper-2019-solinas-et-al/solinas_test_06.zip';

  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  const recorded_vectors = {
    TIME: "t",
    "soma(0.5)": "v",
    "branch[38](0.1)": "v_vec_base",
    "spine1_head[0]_v": "v_vec_spine1_01",
    "spine1_head[1]_v": "v_vec_spine1_02",
    "spine1_head[2]_v": "v_vec_spine1_03",
    "spine1_head[3]_v": "v_vec_spine1_04",
    "spine1_head[4]_v": "v_vec_spine1_05",
    "spine1_head[5]_v": "v_vec_spine1_06",
    "spine1_head[6]_v": "v_vec_spine1_07",
    "spine1_head[7]_v": "v_vec_spine1_08",
    "spine1_head[8]_v": "v_vec_spine1_09",
    "spine1_head[9]_v": "v_vec_spine1_10",
    "spine1_head[10]_v": "v_vec_spine1_11",
    "spine2_head[0]_v": "v_vec_spine2_01",
    "spine2_head[1]_v": "v_vec_spine2_02",
    "spine2_head[2]_v": "v_vec_spine2_03",
    "spine2_head[3]_v": "v_vec_spine2_04",
    "spine2_head[4]_v": "v_vec_spine2_05",
    "spine2_head[5]_v": "v_vec_spine2_06",
    theta1: "theta1",
    theta2: "theta2",
    theta3: "theta3",
    "spine1_head[0]_cai": "cai_vec_spine1_01",
    "spine1_head[1]_cai": "cai_vec_spine1_02",
    "spine1_head[2]_cai": "cai_vec_spine1_03",
    "spine1_head[3]_cai": "cai_vec_spine1_04",
    "spine1_head[4]_cai": "cai_vec_spine1_05",
    "spine1_head[5]_cai": "cai_vec_spine1_06",
    "spine1_head[6]_cai": "cai_vec_spine1_07",
    "spine1_head[7]_cai": "cai_vec_spine1_08",
    "spine1_head[8]_cai": "cai_vec_spine1_09",
    "spine1_head[9]_cai": "cai_vec_spine1_10",
    "spine1_head[10]_cai": "cai_vec_spine1_11",
    "spine2_head[0]_cai": "cai_vec_spine2_01",
    "spine2_head[1]_cai": "cai_vec_spine2_02",
    "spine2_head[2]_cai": "cai_vec_spine2_03",
    "spine2_head[3]_cai": "cai_vec_spine2_04",
    "spine2_head[4]_cai": "cai_vec_spine2_05",
    "spine2_head[5]_cai": "cai_vec_spine2_06",
  };

  const v_var = [
    "soma(0.5)",
    "branch[38](0.1)",
    "spine1_head[0]_v",
    "spine1_head[1]_v",
    "spine1_head[2]_v",
    "spine1_head[3]_v",
    "spine1_head[4]_v",
    "spine1_head[5]_v",
    "spine1_head[6]_v",
    "spine1_head[7]_v",
    "spine1_head[8]_v",
    "spine1_head[9]_v",
    "spine1_head[10]_v",
    "spine2_head[0]_v",
    "spine2_head[1]_v",
    "spine2_head[2]_v",
    "spine2_head[3]_v",
    "spine2_head[4]_v",
    "spine2_head[5]_v",
  ];

  const cai_var = [
    "theta1",
    "theta2",
    "theta3",
    "spine1_head[0]_cai",
    "spine1_head[1]_cai",
    "spine1_head[2]_cai",
    "spine1_head[3]_cai",
    "spine1_head[4]_cai",
    "spine1_head[5]_cai",
    "spine1_head[6]_cai",
    "spine1_head[7]_cai",
    "spine1_head[8]_cai",
    "spine1_head[9]_cai",
    "spine1_head[10]_cai",
    "spine2_head[0]_cai",
    "spine2_head[1]_cai",
    "spine2_head[2]_cai",
    "spine2_head[3]_cai",
    "spine2_head[4]_cai",
    "spine2_head[5]_cai",
  ];

  const margin = {
    l: 60,
    r: 25,
    b: 60,
    t: 35,
    pad: 15,
  };

  const layout_01 = {
    title: { text: "Voltage" },
    xaxis: { title: { text: "t (ms)" } },
    yaxis: { title: { text: "V (mV)" } },
    legend: { orientation: "v" },
    showlegend: true,
    margin: margin,
    autosize: false,
    width: 800,
  };

  const default_parameters = {
    panel: { nBPAP: 1, nstim: 70, FUNCTIONS: ["set_pulse()"] },
    tstop: 250,
  };

  useEffect(() => {
    console.log("loading bluenaas widget");
    const websocket = new WebSocket(BLUENAAS_URL);
    setWs(websocket);

    websocket.onopen = () => console.log("Connected to WebSocket server");
    websocket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    websocket.onclose = () => console.log("Disconnected from WebSocket server");

    // Cleanup on unmount
    return () => websocket.close();
  }, []);

  return (
    <div className="bluenaas-outer">
      <div id="plots" className="plots">
        <div className="row">
          <div className="col s9 center-text">
            <br />
            {/* <div id="plotlyChart_01"></div>
            <div id="plotlyChart_02"></div> */}
            <Plot
              data={[
                {
                  x: [1, 2, 3],
                  y: [2, 6, 3],
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                },
                { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
              ]}
              layout={layout_01}
            />
          </div>
          <div className="col s3">
            <div className="center-text">
              <h6>
                <strong>Settings</strong>
              </h6>
            </div>
            <div className="settings input-field col s12">
              Tstop
              <input
                type="number"
                id="tstop"
                step="1"
                min="0"
                value={default_parameters.tstop}
              />
            </div>
            <br />
            <div className="settings input-field col s12">
              nBPAP
              <input
                type="number"
                id="nbpap"
                step="0.1"
                min="0"
                value={default_parameters.panel.nBPAP}
              />
            </div>
            <br />
            <div className="settings input-field col s12">
              nStim
              <input
                type="number"
                id="nstim"
                step="1"
                min="0"
                value={default_parameters.panel.nstim}
              />
            </div>
            <p className="center-text">
              <strong>Set defaults</strong>
            </p>
            <div className="row justify-content-md-center">
              <button
                type="button"
                className="col s4 waves-effect waves-teal btn-flat"
                id="ltp11"
              >
                LTP11
              </button>
              <button
                type="button"
                className="col s4 waves-effect waves-teal btn-flat"
                id="ltp12"
              >
                LTP12
              </button>
              <button
                type="button"
                className="col s4 waves-effect waves-teal btn-flat"
                id="ltp14"
              >
                LTP14
              </button>
              <br />
              <br />
              <br />
              <button
                type="submit"
                className="col s12 waves-effect waves-light btn"
                id="run"
              >
                Run
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      {/* <div className="overlay" id="error-msg">
        <div className="loader-class">
          <div className="row center-text">
            An error occurred while connecting to the server
            <br />
            Please try again in a few seconds
          </div>
        </div>
      </div> */}

      {/* <div className="overlay" id="loader">
        <div className="loader-class">
          <div className="row center-text">
            Launching simulation. Please wait ...
            <div className="progress">
              <div className="indeterminate"></div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default BlueNaaS;

/*
var model_url = 'https://data-proxy.ebrains.eu/api/v1/buckets/live-paper-2019-solinas-et-al/solinas_test_06.zip';

var default_parameters = {'panel' : {'nBPAP':  1, 'nstim': 70,
    'FUNCTIONS':['set_pulse()']}, 'tstop' : 250}


var fadeinval = 1200;
var fadeoutval = 600;

$(document).ready(function () {


    $('#tstop').val(default_parameters['tstop']);
    $('#nbpap').val(default_parameters['panel']['nBPAP']);
    $('#nstim').val(default_parameters['panel']['nstim']);

    $("#ltp11").click(function(){
        set_default_params(250, 1, 70);
    });

    $("#ltp12").click(function(){
        set_default_params(250, 2, 50);
    });

    $("#ltp14").click(function(){
        set_default_params(250, 4, 25);
    });


    var plotlyChart_01 = document.getElementById("plotlyChart_01");
    var plotlyChart_02 = document.getElementById("plotlyChart_02");

    var margin = {
        l: 60,
        r: 25,
        b: 60,
        t: 35,
        pad: 15
    }

    var layout_01= {
        title: 'Voltage',
        xaxis:{title:'t (ms)'},
        yaxis:{title:'V (mV)'},
        legend: { "orientation":"v"},
        showlegend:true,
        margin: margin,
        autosize: false,
        width: 1000,
    };

    var layout_02= {
        title: 'Cai',
        xaxis:{title:'t (ms)'},
        yaxis:{title:'Cai (mM)'},
        legend: { "orientation":"v"},
        showlegend:true,
        margin: margin,
        autosize: false,
    };


    Plotly.newPlot(plotlyChart_01, [{x:[], y:[]}], layout_01, {displayModeBar: false}, {responsive: true});
    Plotly.newPlot(plotlyChart_02, [{x:[], y:[]}], layout_02, {displayModeBar: false}, {responsive: true});

    resize_plots();
    $(window).resize(function(){
        resize_plots();
    });
    $(".collapsible").click(function () {
        resize_plots();
    });

    $("#tstop,#nbpap,#nstim").keyup(validate_parameters)

    $("#tstop,#nbpap,#nstim").on("change", validate_parameters);

    $('#run').click(function() {
            default_parameters['tstop'] = parseFloat($('#tstop').val());
            default_parameters['panel']['nBPAP'] = parseFloat($('#nbpap').val());
            default_parameters['panel']['nstim'] = parseFloat($('#nstim').val());
            $('#error-msg').animate({opacity: 0}, 0);
            $('#plots').animate({opacity: 0}, fadeoutval);
            $('#loader').animate({opacity: 1}, fadeinval);
			var xmin = 100;
			var xmax = 180;
			layout_01['xaxis']['autorange'] = false;
			layout_01['xaxis']['range'] = [xmin, xmax];
			layout_02['xaxis']['autorange'] = false;
			layout_02['xaxis']['range'] = [xmin, xmax];
            var ws = new WebSocket('wss://bluenaas-single-cell-svc.apps.ebrains.eu/ws');
            ws.onerror = function(evt){ws_on_error(evt)}
            ws.onopen = function(){ws_on_open(ws, default_parameters)}
            ws.onmessage = function(evt){ws_on_message(ws, evt, layout_01, layout_02)}
    });

    $("#run").click();
});


// open websocket connection

function ws_on_open(ws, params){
    ws.send(JSON.stringify({'cmd': 'set_url', 'data': model_url}));
    ws.send(JSON.stringify({"cmd": 'set_params', "data": params}))
    ws.send(JSON.stringify({'cmd': 'run_simulation', 'data': recorded_vectors}))
}

// handle errors event

function ws_on_error(evt){
    console.log("entered in on error");
    $('#plots').animate({opacity: 0}, fadeoutval);
    $('#loader').animate({opacity: 0}, fadeoutval);
    const wait = time => new Promise(
        res => setTimeout(() => res(), time)
    );
    wait(fadeinval + fadeoutval)
        .then(() => $('#error-msg').animate({opacity: 1}, fadeinval));

}


// handle received message
function ws_on_message(ws, evt, layout_01, layout_02) {
    var received_msg = JSON.parse(evt.data);
    var time = received_msg["data"]["TIME"];
    var v_traces = [];
    var cai_traces = [];

    for (var i = 0; i < v_var.length; i++){

        v_traces.push({x:time, y:received_msg["data"][v_var[i]], mode: 'lines', name:v_var[i]})
    }

    for (var i = 0; i < cai_var.length; i++){
        var crr_cai = []
        if (cai_var[i]=="theta1" || cai_var[i]=="theta2" || cai_var[i] == "theta3"){
            for (var j = 0; j < time.length; j++){
                crr_cai.push(received_msg["data"][cai_var[i]][0]);
            }
        } else {
            crr_cai = received_msg["data"][cai_var[i]]
        }
        cai_traces.push({x:time, y:crr_cai, mode: 'lines', name:cai_var[i]})
    }

    Plotly.react(plotlyChart_01, v_traces, layout_01);
    Plotly.react(plotlyChart_02, cai_traces, layout_02);
    $('#error-msg').animate({opacity: 0}, 0);
    $('#plots').animate({opacity: 1}, fadeinval);
    $('#loader').animate({opacity: 0}, fadeoutval);
    ws.close();
}

function resize_plots(){
    var plotdiv = document.getElementById("collapsetitle");
    var plot_width = Math.trunc((plotdiv.offsetWidth-150)*0.75);

    var plotlyChart_01 = document.getElementById("plotlyChart_01");
    var plotlyChart_02 = document.getElementById("plotlyChart_02");

    var layout_01 = plotlyChart_01.layout;
    var layout_02= plotlyChart_02.layout;

    var data_01 = plotlyChart_01.data;
    var data_02= plotlyChart_02.data;

    layout_01["width"] = plot_width;
    layout_02["width"] = plot_width;

    Plotly.react(plotlyChart_01, data_01, layout_01);
    Plotly.react(plotlyChart_02, data_02, layout_02);
}

function validate_parameters(){
    var val_tstop=$('#tstop').val();
    var val_nbpap=$('#nbpap').val();
    var val_nstim=$('#nstim').val();
    if(val_tstop<0 || val_tstop>5000 || val_nbpap<0 || val_nbpap>500 || val_nstim<0 || val_nstim>500){
        $("#message").show();
        $("#run").attr("disabled", true);
    }
    else{
        $("#message").hide();
        $("#run").attr("disabled", false);
    }
}

function set_default_params(tstop=250, nbpap=1, nstim=70){
    $("#tstop").val(tstop);
    $("#nbpap").val(nbpap);
    $("#nstim").val(nstim);
}

*/
