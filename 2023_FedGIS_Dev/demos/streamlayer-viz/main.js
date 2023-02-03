require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/StreamLayer",
  "esri/geometry/Polygon",
  "esri/Graphic",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/portal/Portal",
  "esri/identity/OAuthInfo",
  "esri/identity/IdentityManager",
  "esri/portal/PortalQueryParams"
], function (Map, MapView, StreamLayer, Polygon, Graphic, Legend, Expand,
             Portal, OAuthInfo, esriId, PortalQueryParams) {
  var streamLayer, streamLayerView;

  const template = {    
    title: "Flight {callsign}",
    content: "<b>Speed</b>: {speed}mph<br /><b>Heading</b>: {heading}°"
  };
  const map = new Map({
    basemap: "gray-vector"
  });
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-121.899736, 36.576766],
    zoom: 11
  });

/*   const info = new OAuthInfo({
    // Swap this ID out with registered application ID
    appId: "zKt2XDys4Tn2lUwy",
    // Uncomment the next line and update if using your own portal
    portalUrl: "https://runtimecoretest.maps.arcgis.com/",
    // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
    authNamespace: "portal_oauth_inline",
    flowType: "auto", // default that uses two-step flow
    popup: false
  }); */
  
  //esriId.registerOAuthInfos([info]);

  var legend = new Legend({
    view: view,
    container: document.createElement("div")
  });

  var expand = new Expand({
    view: view,
    content: legend
  });

  view.ui.add(expand, "top-left");

  view.ui.add("streamLayerDiv", "top-right");
  view.ui.add("toggle-snippet", "top-right");


  // Connect click events to UI buttons
  const toggleLayerButton = document.getElementById("toggleStreamLayerButton");

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
  /*****************************************************************
   * Functions to apply or remove FeatureEffect from StreamLayerView
   *****************************************************************/
  var geometryFilterButton = document.getElementById("toggleGeometryDefinitionButton");
  geometryFilterButton.addEventListener("click", function () {
    // set the effect to null if user clicks clear button
    if (streamLayerView.effect) {
      streamLayerView.effect = null;
      view.graphics.removeAll();
      geometryFilterButton.innerHTML = "Apply spatial filter";
    } else {
      // apply an effect to the layer view if user clicks apply button
      geometryFilterButton.innerHTML = "Clear spatial filter";
      streamLayerView.effect = {
        filter: {
          geometry: view.extent.clone().expand(0.8)
        },
        excludedEffect: "grayscale(100%) opacity(30%)"
      };
      view.graphics.removeAll();
      view.graphics.add(
        new Graphic({
          geometry: view.extent.clone().expand(0.8),
          symbol: {
            type: "simple-fill",
            style: "none",
            outline: {
              color: [5, 112, 176],
              width: 2
            }
          }
        })
      );
    }
  });

  function addStreamLayer() {
    // URL to stream service
    var svcUrl = document.getElementById("streamUrlText").value;
    var inputElements = document.getElementsByClassName("additionalStreams");

    // Construct Stream Layer
    streamLayer = new StreamLayer({
      url: svcUrl,
      popupTemplate: template,
      purgeOptions: {
        displayCount: 10000
      },
      renderer: {
        type: "simple",
        symbol: {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          url: "./plane-16.svg",
          height: "32px",
          width: "32px"
        },
        visualVariables: [{
          type: "rotation",
          field: "heading",
          rotationType: "geographic"
        },
        {
          type: "color",
          field: "speed",
          stops: [
            {
              value: 0,
              color: "#5edbcd"
            },
            {
              value: 500,
              color: "#a104c9"
            }
          ]
        }
        ]
      }
    });
    map.add(streamLayer);
    for (var i = 0; i < inputElements.length; i++) {
      var addstreamLayer = new StreamLayer({
        url: inputElements[i].value,
        popupTemplate: template,
        purgeOptions: {
          displayCount: 10000
        },
        renderer: {
          type: "simple",
          symbol: {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "./plane-16.svg",
            height: "32px",
            width: "32px"
          },
          visualVariables: [{
            type: "rotation",
            field: "heading",
            rotationType: "geographic"
          },
          {
            type: "color",
            field: "speed",
            stops: [
              {
                value: 0,
                color: "#5edbcd"
              },
              {
                value: 500,
                color: "#a104c9"
              }
            ]
          }
          ]
        }
      });
      map.add(addstreamLayer);
    }
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
    geometryFilterButton.classList.remove("esri-button--disabled");
  }

  function processDisconnect() {
    toggleLayerButton.value = "Add stream layer";
    geometryFilterButton.classList.add("esri-button--disabled");
    geometryFilterButton.innerHTML = "Apply spatial filter";
  }
});
function addInputStream() {
  var element = document.getElementById("streamUrlText");
  var newElement = '<input class="esri-input esri-feature-form__input additionalStreams" type="text"/>';
  element.insertAdjacentHTML( 'afterend', newElement )
}