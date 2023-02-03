require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/StreamLayer",
  "esri/geometry/Polygon",
  "esri/Graphic",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/symbols/WebStyleSymbol"
], function (Map, MapView, StreamLayer, Polygon, Graphic, Legend, Expand, WebStyleSymbol) {
  var streamLayer, streamLayerView;

  const map = new Map({
    basemap: "satellite"
  });
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-121.899736, 36.576766],
    zoom: 11
  });

  var legend = new Legend({
    view: view,
    container: document.createElement("div")
  });

  var expand = new Expand({
    view: view,
    content: legend
  });

  const template = {    
    title: "Flight {callsign}",
    content: "<b>Speed</b>: {speed}mph<br /><b>Heading</b>: {heading}°"
  };

  view.ui.add(expand, "top-left");

  view.ui.add("streamLayerDiv", "top-right");
  view.ui.add("toggle-snippet", "top-right");

  // Connect click events to UI buttons
  const toggleLayerButton = document.getElementById("toggleStreamLayerButton");
  const clearFilterButton = document.getElementById("clearFilterButton");
  clearFilterButton.addEventListener("click", function () {
    streamLayerView.filter = null;
  });
  const altitudeFilterSelect = document.getElementById("attribute-filter-select");
  altitudeFilterSelect.onchange = filterChanged;

  function filterChanged() {
    let filterValue;
    switch (altitudeFilterSelect.value) {
      case "-1":
        filterValue = null;
        break;
      case "10000":
        filterValue = "altitude_baro >= 10000";
        break;
      case "6000":
        filterValue = "altitude_baro >= 6000";
        break;
      case "3000":
        filterValue = "altitude_baro >= 3000";
        break;
      case "2999":
        filterValue = "altitude_baro < 3000";
        break;
    }
    streamLayerView.filter = {
      where: filterValue
    };
  }

  /*************************************************
   * Functions to add and remove Stream Layer
   *************************************************/
  toggleLayerButton.addEventListener("click", function () {
    if (streamLayer) {
      map.remove(streamLayer);
      streamLayer.destroy();
      streamLayer = null;
      view.graphics.removeAll();
      processDisconnect();
    } else {
      addStreamLayer();
    }
  });

  function addStreamLayer() {
    // URL to stream service
    var svcUrl = document.getElementById("streamUrlText").value;
    const webStyleSymbol = new WebStyleSymbol({
      name: "Airplane_Large_Passenger",
      styleName: "EsriRealisticTransportationStyle"
    });
    // Construct Stream Layer
    streamLayer = new StreamLayer({
      url: svcUrl,
      popupTemplate: template,
      elevationInfo: {
        mode: "absolute-height",
        featureExpressionInfo: {
          expression: "$feature.altitude_baro"
        },
        unit: "feet"
      },
      purgeOptions: {
        displayCount: 10000
      },
      renderer: {
        type: "simple",
        symbol: webStyleSymbol,
        visualVariables: [{
          type: "rotation",
          field: "heading",
          rotationType: "geographic"
        },
        {
          type: "size",
          field: "altitude_baro",
          axis: "height",
          stops: [{
            value: 6100,
            size: 1000,
          },
          {
            value: 10000,
            size: 5000
          }
          ]
        }
        ]
      }
    });
    map.add(streamLayer);
    // When graphics controller created, register listeners for events
    view.whenLayerView(streamLayer).then(function (layerView) {
      streamLayerView = layerView;
      processConnect();
      layerView.watch("connectionStatus", function (value) {
        if (value === "connected") {
          processConnect();
        } else {
          processDisconnect();
        }
      });
    });
  }
  /*********************************************************
   * Stream layer event handlers
   *********************************************************/
  function processConnect() {
    toggleLayerButton.value = "Remove stream layer";    
    clearFilterButton.classList.remove("esri-button--disabled");
  }

  function processDisconnect() {
    toggleLayerButton.value = "Add stream layer";
    clearFilterButton.classList.add("esri-button--disabled");
  }
});