if (typeof Map == 'undefined') {
  Map = {};
}

/**
 * Class of a commune
 */
Map.Commune = class Commune 
{
  /*
   * Create the commune
   * @property {String}        commune           Commune URI
   * @property {String}        communeLabel      Commune Name
   * @property {String}        wkt               WTK Geom of the commune
   * @property {Number}        pop               Pop of the commune
   */
  constructor(commune, communeLabel, wkt, pop) 
  {
    this.commune = commune;
    this.communeLabel = communeLabel;
    this.wkt = wkt;
    this.pop = pop;
    this.coords = Map.MapTransform.transformPoint(wkt);
  }
  
  /*
   * Display commune in the map (draw circle)
   * @param {L.LayerGroup}        communeLayerGroup           Commune layer group
   */
  draw(communeLayerGroup)
  {
    var circle = L.circle(this.coords, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: Math.sqrt(this.pop) * 5
    })
    .bindPopup("<a href='"+this.commune+"' target='_blank'>" + this.communeLabel + "</a>");
    
    communeLayerGroup.addLayer(circle);
  }
}