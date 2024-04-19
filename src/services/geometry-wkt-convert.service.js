import WKT from 'ol/format/WKT';

export function geometryToWkt(feature){
    var format = new WKT();
    const _wkt = format.writeGeometry(feature.getGeometry(), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    console.log(_wkt);
    return _wkt;
  }