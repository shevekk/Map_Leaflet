if (typeof Map == 'undefined') {
  Map = {};
}

/**
 * Class for manage config
 */
Map.Config = class Config 
{
  /**
   * @property {Number}          communeLimit                Max numbers of commune visible
   * @property {Object}          buildingsIcons              Icons of buildings
   * @property {Number}          buildingsMinZoom            Min zoom of building zoom
   */
  static communeLimit;
  static buildingsIcons;
  static buildingsMinZoom;

  constructor() 
  {

  }

  /**
   * Load config informations
   * @param {function}     callback       The callback
   */
  static load(callback)
  {
    let fileName = "config.json";
    
    let jqxhr = $.getJSON(fileName, null)
    .done(function(content)
    {
      Map.Config.communeLimit = content.COMMUNE_LIMIT
      Map.Config.buildingsIcons = content.BUILDINGS_ICONS;
      Map.Config.buildingsMinZoom = content.BUILDING_MIN_ZOOM;

      callback();
    })
    .fail(function(d, textStatus, error)
    {
      alert("Echec du chargement du fichier de configuration " + fileName);

      console.error("getJSON failed, status: " + textStatus + ", error: "+error);
    })
    .always(function()
    {

    });
  }
}