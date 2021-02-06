if (typeof Map == 'undefined') {
  Map = {};
}

/**
 * Main class 
 */
Map.Main = class Main 
{
  /*
   * Display commune in the map (draw circle)
   * @property {Map.QueryManager}        queryManager           Query Manager
   * @property {L.map}                   map                    The leaflet Map 
   * @property {L.LayerGroup}            communeLayerGroup      Commune layer group
   */
  constructor() 
  {
    this.map = new Map.MapView();
  }

  /**
   * Init the map
   */
  init()
  {
    let me = this;
    
    Map.Config.load(function()
    {
      me.map.initMap();
    });
  }
}