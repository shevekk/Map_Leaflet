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
    let me = this;
    
    let communes = [];
    
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
    
    me.execQuery(query, function(data) 
    {
      if(data == null)
      {
        callback([]);
      }
      else
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
      }
    });
  }
  
  /**
   * Get the building list from lat, long and distance
   * @param {Number}       lat            Center Latitude
   * @param {Number}       lng            Center Longitude
   * @param {Number}       distance       Max distance of buildings
   buildingsIcons
   * @param {function}     callback       The callback
   */
  getBuildingList(lat, lng, distance, buildingsIcons, callback)
  {
    let me = this;
    
    let buildings = [];
    /*
    SELECT ?building ?buildingLabel ?coords (GROUP_CONCAT(?type; SEPARATOR=";") as ?types) (GROUP_CONCAT(?subType; SEPARATOR=";") as ?subTypes)
    WHERE {
      ?building wdt:P31/wdt:P279 wd:Q41176 .
      ?building wdt:P31/wdt:P279 ?subType . 
      ?building wdt:P31 ?type . 
      ?building wdt:P625 ?coords.
      FILTER(geof:distance(?coords, "Point(4.841389 45.758889)") < 25)
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr,en". }
    }
    GROUP BY  ?building ?buildingLabel ?coords 
    */
    let query = `SELECT ?building ?buildingLabel ?coords (GROUP_CONCAT(?type; SEPARATOR=";") as ?types) (GROUP_CONCAT(?subType; SEPARATOR=";") as ?subTypes)
    WHERE {
      ?building wdt:P31/wdt:P279 wd:Q41176 .
      ?building wdt:P31/wdt:P279 ?subType . 
      ?building wdt:P31 ?type . 
      ?building wdt:P625 ?coords.
      FILTER(geof:distance(?coords, "Point(${lng} ${lat})") < ${distance})
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr,en". }
    }
    GROUP BY  ?building ?buildingLabel ?coords`;
      
    me.execQuery(query, function(data) 
    {
      if(data == null)
      {
        callback([]);
      }
      else
      {
        for(let i = 0; i < data.results.bindings.length; i++)
        {
          let building = data.results.bindings[i]["building"]["value"];
          let buildingLabel = data.results.bindings[i]["buildingLabel"]["value"];
          let coords = data.results.bindings[i]["coords"]["value"];
          let types = data.results.bindings[i]["types"]["value"];
          let subTypes = data.results.bindings[i]["subTypes"]["value"];
          
          buildings.push(new Map.Building(building, buildingLabel, coords, types, subTypes, buildingsIcons));
        }
        
        callback(buildings);
      }
    });
  }
  
  /**
   * Exec a query dans get result
   * @param {String}       query          The query string
   * @param {function}     callback       The callback
   */
  execQuery(query, callback)
  {
    let me = this;
    
    let endPoint = "https://query.wikidata.org/sparql";
    
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
      
      callback(null);
    });
    
    ajaxRequest.done(function(data)
    {
      callback(data);
    });
    
  }
}