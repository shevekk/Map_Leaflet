if (typeof Map == 'undefined') {
  Map = {};
}

/*
 * Map types
 */
Map.MapType = {
  COMMUNES: "Communes",
  BUILDINGS: "Bâtiments"
};

/**
 * Class of Map management
 */
Map.MapView = class MapView 
{
  /**
   * Display commune in the map (draw circle)
   * @property {Map.MapType}             type                   Type of the map
   * @property {L.map}                   map                    The leaflet Map 
   * @property {Map.QueryManager}        queryManager           Query Manager
   * @property {L.LayerGroup}            layerGroup             Display layer group
   * @property {Map}                     buildingsIcons         Buildings Icons
   */
  constructor()
  {
    this.type = Map.MapType.COMMUNES;
    this.map = null;
    this.queryManager = new Map.QueryManager();
    
    this.layerGroup = new L.LayerGroup();
    this.buildingsIcons = new Map();
    this.numLastLoad = 0;
    this.center = [45.758889, 4.841389];
  }
  
  /**
   * Init Icons from config
   */
  initIcons()
  {
    // Define icon params
    var LeafletBuildingsIcon = L.Icon.extend({
      options: {
          shadowUrl: 'img/fond_point.png', // Image
          iconSize:     [40, 40], // Size of icon
          shadowSize:   [40, 50], // Size of shadow
          iconAnchor:   [20, 50], // Position of icon
          shadowAnchor: [20, 50], // Position of shadow
          popupAnchor:  [0, -50] // popup text position
      }
    });

    this.buildingsIcons.set("default", new LeafletBuildingsIcon({iconUrl: 'img/marker.svg'}));
    for (const key in Map.Config.buildingsIcons)
    {
      this.buildingsIcons.set(key, new LeafletBuildingsIcon({iconUrl: Map.Config.buildingsIcons[key]}));
    }
  }
  
  /**
   * Initialize the Map
   */
  initMap()
  {
    let me = this;
    
    me.initIcons();
    
    me.map = L.map('map', {
      center: me.center,
      zoom: 12,
      layers: [me.layerGroup]
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(me.map);
    
    me.initUI();
    me.reloadData();
    
    me.map.on("moveend", function(e)
    {
      // calc distance beetween last loading point
      let latDiff = me.map.getCenter().lat - me.center[0];
      let longDiff = me.map.getCenter().lng - me.center[1];
      let distance = Math.abs(latDiff) + Math.abs(longDiff);
      
      let latScreenDiff = me.map.getBounds().getNorthEast().lat - me.map.getCenter().lat;
      let longScreenDiff = me.map.getBounds().getNorthEast().lng - me.map.getCenter().lng
      let distanceScreen = Math.abs(latScreenDiff) + Math.abs(longScreenDiff);
      
      if(distance >= distanceScreen/4)
      {
        me.reloadData();
        
        me.center[0] = me.map.getCenter().lat;
        me.center[1] = me.map.getCenter().lng;
      }
    });
    me.map.on("zoomend", function(e)
    {
      me.reloadData();
    });
    
    // Action of change map
    $(".selectMapRadio").change(function() 
    {
      me.layerGroup.clearLayers();
      
       me.type = $(this)[0].id;
       me.reloadData();
    });
  }
  
  /**
   * Initialialize UI of map selection
   */
  initUI()
  {
    var mapUI = L.control({position: 'topright'});
    mapUI.onAdd = function (map) 
    {
      var div = L.DomUtil.create('div', 'mapUI');
      div.innerHTML += '<div style="text-align:center;"><b>Cartes</b><div>';
      
      for (const property in Map.MapType) {
        div.innerHTML += '<input id="' + Map.MapType[property] + '" type="radio" name="selectMapRadio" class="selectMapRadio"/><label for="'+ Map.MapType[property] +'">' + Map.MapType[property] + '</label><br/>';
      }
      return div;
    };
    mapUI.addTo(this.map);
    $("#" + this.type).prop("checked", true);
  }
  
  /**
   * Reload data and display
   */
  reloadData()
  {
    let latDiff = this.map.getBounds().getNorthEast().lat - this.map.getCenter().lat;
    let longDiff = this.map.getBounds().getNorthEast().lng - this.map.getCenter().lng;
  
    let distance = (Math.abs(latDiff) + Math.abs(longDiff)) * 111.11;
    
    this.numLastLoad ++;
    
    if(this.type == Map.MapType.COMMUNES)
    {
      this.reloadCommunes(distance);
    }
    else if(this.type == Map.MapType.BUILDINGS)
    {
      if(this.map.getZoom() > Map.Config.buildingsMinZoom)
      {
        this.reloadBuilding(distance);
      }
    }
  }
  
  /**
   * Reload display of communes
   * @property {String}        distance      Maximum distance from data recovery
   */
  reloadCommunes(distance)
  {
    let me = this;
    let numLoad = this.numLastLoad;

    me.queryManager.getCommunesList(me.map.getCenter().lat, me.map.getCenter().lng, distance, function(communes)
    {
      if(numLoad == me.numLastLoad)
      {
        me.layerGroup.clearLayers();

        for(let i = 0; i < communes.length; i++)
        {
          communes[i].draw(me.layerGroup);
        }
      }
    });
  }
  
  /**
   * Reload display of building
   * @property {String}        distance      Maximum distance from data recovery
   */
  reloadBuilding(distance)
  {
    let me = this;
    let numLoad = this.numLastLoad;
    
    me.queryManager.getBuildingList(me.map.getCenter().lat, me.map.getCenter().lng, distance, me.buildingsIcons, function(buildings)
    {
      if(numLoad == me.numLastLoad)
      {
        me.layerGroup.clearLayers();

        for(let i = 0; i < buildings.length; i++)
        {
          buildings[i].draw(me.layerGroup);
        }
      }
    });
  }
}