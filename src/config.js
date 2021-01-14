if (typeof Map == 'undefined') {
  Map = {};
}

/**
 * Class for manage config
 */
Map.Config = class Config 
{
  /*
   * @property {Object}          communeLimit               Max numbers of commune visible
   */
  static communeLimit;

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
      Map.Config.communeLimit = content.COMMUNE_LIMIT;

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