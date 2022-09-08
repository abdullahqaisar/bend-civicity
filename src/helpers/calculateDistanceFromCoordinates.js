module.exports.calculateDistance = function (lat1, lon1, lat2, lon2) {
      var radius = 6371;
      var dLat = deg2rad(lat2 - lat1);
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = radius * c;
      return d;
    }
    
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    