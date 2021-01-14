if (typeof Map == 'undefined') {
  Map = {};
}

/**
 * Menage map transformation and format change 
 */
Map.MapTransform = class MapTransform 
{
  constructor() 
  {

  }
  
  /*
   * Transform a WKT point to coordinates array with lat and long
   * @param {String}     wkt       The WTK point geom
   * @return {Number[]}            Pontual Coordinates (latitude and longitude)
   */
  static transformPoint(wkt)
  {
    let str = wkt.replace('Point(', '').replace(')', '');
    let coords = str.split(' ');
    coords = coords.reverse();
    
    return coords;
  }
}