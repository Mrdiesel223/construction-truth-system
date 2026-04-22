class Attendance {
  final int id;
  final String type;
  final double lat;
  final double lng;
  final DateTime timestamp;

  Attendance({
    required this.id,
    required this.type,
    required this.lat,
    required this.lng,
    required this.timestamp,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'],
      type: json['type'],
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}
