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
    this.queryManager = new Map.QueryManager();
    
    this.map = null;
    this.communeLayerGroup = new L.LayerGroup();
  }

  /**
   * Init the map
   */
  init()
  {
    let me = this;
    
    Map.Config.load(function()
    {
      me.map = L.map('map', {
        center: [48.856944, 2.35138],
        zoom: 12,
        layers: [me.communeLayerGroup]
      });
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(me.map);
      
      me.reloadCommunes();
      
      me.map.on("moveend", function(e)
      {
        me.reloadCommunes();
      });
      me.map.on("zoomend", function(e)
      {
        me.reloadCommunes();
      });
    });
  }
  
  /**
   * Reload displey of communes
   */
  reloadCommunes()
  {
    let me = this;
    
    let latDiff = me.map.getBounds().getNorthEast().lat - me.map.getCenter().lat;
    let longDiff = me.map.getBounds().getNorthEast().lng - me.map.getCenter().lng;
  
    let distance = (Math.abs(latDiff) + Math.abs(longDiff)) * 111.11;
    
    me.queryManager.getCommunesList(me.map.getCenter().lat, me.map.getCenter().lng, distance, function(communes)
    {
      me.communeLayerGroup.clearLayers();

      for(let i = 0; i < communes.length; i++)
      {
        communes[i].draw(me.communeLayerGroup);
      }
    });
  }
}