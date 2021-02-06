if (typeof Map == 'undefined') {
  Map = {};
}

/**
 * Class of a Building
 */
Map.Building = class Building 
{
  /**
   * Create the building
   * @property {String}        building             Building URI
   * @property {String}        building             Building Label
   * @property {String}        wkt                  WTK Geom of the commune
   * @property {String}        types                String of types separate by ";"
   * @property {String}        subTypes             String of sub types separate by ";"
   * @property {Map}           buildingsIcons       building icons map
   */
  constructor(building, buildingLabel, wkt, types, subTypes, buildingsIcons) 
  {
    this.building = building;
    this.buildingLabel = buildingLabel;
    this.wkt = wkt;
    this.types = types.split(";");
    this.subTypes = subTypes.split(";");
    this.coords = Map.MapTransform.transformPoint(wkt);
    
    // Removes duplicate types and subTypes
    this.types.filter((value, index) => {
      return this.types.indexOf(value) === index;
    });
    this.subTypes.filter((value, index) => {
      return this.subTypes.indexOf(value) === index;
    });
    this.initIcon(buildingsIcons);
  }
  
  initIcon(buildingsIcons)
  {
    // get icon in main types
    this.icon = null;
    for (const key in Map.Config.buildingsIcons)
    {
      if(this.types.includes(key))
      {
        this.icon = buildingsIcons.get(key);
      }
    }
    // get icon in other types
    if(this.icon == null)
    {
      for (const key in Map.Config.buildingsIcons)
      {
        if(this.subTypes.includes(key))
        {
          this.icon = buildingsIcons.get(key);
        }
      }
    }
    if(this.icon == null)
    { 
      this.icon = buildingsIcons.get("default");
    }
  }
  
  /**
   * Display building in the map (draw marker)
   * @param {L.LayerGroup}        layerGroup           Display layer group
   */
  draw(layerGroup)
  {
    var marker = L.marker(this.coords, {icon: this.icon})
    .bindPopup("<a href='"+this.building+"' target='_blank'>" + this.buildingLabel + "</a>");
    
    layerGroup.addLayer(marker);
  }
}