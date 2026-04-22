class Task {
  final int id;
  final String title;
  final String status;
  final String site;

  Task({
    required this.id,
    required this.title,
    required this.status,
    required this.site,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      title: json['title'],
      status: json['status'],
      site: json['site'] ?? 'Unknown Site',
    );
  }
}
