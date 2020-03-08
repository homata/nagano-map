// Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoiaG9tYXRhIiwiYSI6ImNrN2lqdjFmcDAyeGwzZXJ3dm1pbzI0MDYifQ.KUJNUxQwLW6VMtj33N3JEA';

// Map Style
var map = new mapboxgl.Map({
  style: 'mapbox://styles/mapbox/streets-v11',
  container: "map",
  center: [138.188705, 36.643083],
  zoom: 14
});

// Map Data Load
map.on('load', function () {
    // GeoJSON Load
    map.addSource('nagano_hotel', {
        type: 'geojson',
        data: './nagano.geojson'
    });

    // setting style
    var point_list = [
        [ "nagano_hotel", "#FF0000", 'ホテル' ],
        [ "japanese_inn", "#00FF00", '旅館'   ],
        [ "venue",        "#0000FF", '施設'   ]
    ]

    // setting
    for (var ii=0; ii<point_list.length; ii++) {
        var point_id    = point_list[ii][0];
        var point_color = point_list[ii][1];
        var point_category = point_list[ii][2];

        map.addLayer({
            "id": point_id,
            "type": "circle",
            "source": "nagano_hotel",
            "layout": {},
            "paint": {
                'circle-color': point_color,
                'circle-radius': 6,
                'circle-opacity': 0.8,
                'circle-stroke-color': '#444444',
                'circle-stroke-width': 1
            },
            'filter': ['==', 'category', point_category]
        });

        map.on('click', point_id, function (e) {
            var coordinates = e.lngLat;

            // 属性設定
            var description =
                '名前: ' + e.features[0].properties.name + '<br>' +
                /*'Name: ' + e.features[0].properties.name_e + '<br>' + */
                '住所: ' + e.features[0].properties.address + '<br>' +
                '電話番号(TEL): ' + e.features[0].properties.tel;
            var url = e.features[0].properties.url;
            if (url != null && url != "null") {
                description += '<br>URL: ' + "<a href=\"" + url + "\">" + url + "</a>";
            } 
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });
        // カーソルON,OFF
        map.on('mouseenter', point_id, function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', point_id, function () {
            map.getCanvas().style.cursor = '';
        });
    }

});

// show control
map.addControl(new mapboxgl.NavigationControl());