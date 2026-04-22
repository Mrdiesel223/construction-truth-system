class Visit {
  final int id;
  final String customerName;
  final String purpose;
  final String? notes;
  final String? imageUrl;
  final double lat;
  final double lng;
  final DateTime timestamp;

  Visit({
    required this.id,
    required this.customerName,
    required this.purpose,
    this.notes,
    this.imageUrl,
    required this.lat,
    required this.lng,
    required this.timestamp,
  });

  factory Visit.fromJson(Map<String, dynamic> json) {
    return Visit(
      id: json['id'],
      customerName: json['customerName'],
      purpose: json['purpose'],
      notes: json['notes'],
      imageUrl: json['imageUrl'],
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}
