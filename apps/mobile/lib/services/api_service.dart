import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/config.dart';

class ApiService {
  final _storage = const FlutterSecureStorage();

  Future<String?> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('${Config.baseUrl}/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _storage.write(key: 'token', value: data['token']);
      return data['token'];
    }
    return null;
  }

  Future<bool> logAttendance(String type, double lat, double lng) async {
    final token = await _storage.read(key: 'token');
    final response = await http.post(
      Uri.parse('${Config.baseUrl}/attendance'),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token ?? '',
      },
      body: jsonEncode({'type': type, 'lat': lat, 'lng': lng}),
    );

    return response.statusCode == 200;
  }

  Future<bool> createVisit(Map<String, dynamic> visitData) async {
    final token = await _storage.read(key: 'token');
    final response = await http.post(
      Uri.parse('${Config.baseUrl}/visits'),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token ?? '',
      },
      body: jsonEncode(visitData),
    );

    return response.statusCode == 200;
  }

  Future<void> logout() async {
    await _storage.delete(key: 'token');
  }

  Future<String?> getToken() async {
    return await _storage.read(key: 'token');
  }

  Future<List<dynamic>> getMyTasks() async {
    final token = await _storage.read(key: 'token');
    final response = await http.get(
      Uri.parse('${Config.baseUrl}/tasks/my'),
      headers: {'x-auth-token': token ?? ''},
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return [];
  }

  Future<bool> startTask(int taskId) async {
    final token = await _storage.read(key: 'token');
    final response = await http.post(
      Uri.parse('${Config.baseUrl}/tasks/$taskId/start'),
      headers: {'x-auth-token': token ?? ''},
    );
    return response.statusCode == 200;
  }

  Future<bool> endTask(int taskId, double lat, double lng, String fileUrl) async {
    final token = await _storage.read(key: 'token');
    final response = await http.post(
      Uri.parse('${Config.baseUrl}/tasks/$taskId/end'),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token ?? '',
      },
      body: jsonEncode({
        'lat': lat,
        'lng': lng,
        'fileUrl': fileUrl,
      }),
    );
    return response.statusCode == 200;
  }
}
