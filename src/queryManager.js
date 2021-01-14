if (typeof Map == 'undefined') {
  Map = {};
}

/**
 * Manage creation of queries
 */
Map.QueryManager = class QueryManager 
{
  constructor() 
  {
    
  }

  /**
   * Get the commune list from lat, long and distance
   * @param {Number}       lat            Center Latitude
   * @param {Number}       lng            Center Longitude
   * @param {Number}       distance       Max distance of communes
   * @param {function}     callback       The callback
   */
  getCommunesList(lat, lng, distance, callback)
  {
    let communes = [];
    
    let endPoint = "https://query.wikidata.org/sparql";
    
    let query = `SELECT ?commune ?communeLabel ?pop ?coords
    {
      ?commune wdt:P31 wd:Q484170 .
      ?commune wdt:P1082 ?pop.
      ?commune wdt:P625 ?coords.
      FILTER(geof:distance(?coords, "Point(${lng} ${lat})") < ${distance})
      
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr,en". }
    } 
    ORDER BY DESC(?pop)
    LIMIT ${Map.Config.communeLimit}`;
	  
	  let queryURL = endPoint + "?" + "query="+encodeURIComponent(query) + "&format=json";
    
    // launch the query
    let ajaxRequest = $.ajax({
      url:queryURL,
      dataType: 'json'
    });

    ajaxRequest.fail(function(error)
    {
      console.log("EndPoint : " + endPoint);
      console.log("Query : " + query);

      alert("Echec de la récupération des données");
      
      callback([]);
    });
    
    ajaxRequest.done(function(data)
    {
      for(let i = 0; i < data.results.bindings.length; i++)
      {
        let commune = data.results.bindings[i]["commune"]["value"];
        let communeLabel = data.results.bindings[i]["communeLabel"]["value"];
        let pop = data.results.bindings[i]["pop"]["value"];
        let coords = data.results.bindings[i]["coords"]["value"];
        
        communes.push(new Map.Commune(commune, communeLabel, coords, pop));
      }
      
      callback(communes);
    });
  }
}