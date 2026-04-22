import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'database_service.dart';
import 'api_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/config.dart';

class SyncService {
  final _dbService = DatabaseService();
  final _apiService = ApiService();

  void startAutoSync() {
    Timer.periodic(const Duration(minutes: 10), (timer) async {
      final connectivityResult = await (Connectivity().checkConnectivity());
      if (connectivityResult != ConnectivityResult.none) {
        await syncPendingData();
      }
    });
  }

  Future<void> syncPendingData() async {
    final pings = await _dbService.getPendingPings();
    final token = await _apiService.getToken();

    if (token == null) return;

    for (var ping in pings) {
      try {
        final response = await http.post(
          Uri.parse('${Config.baseUrl}/location/ping'),
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: jsonEncode({
            'lat': ping['lat'],
            'lng': ping['lng'],
            'timestamp': ping['timestamp'],
          }),
        );

        if (response.statusCode == 200) {
          await _dbService.deletePing(ping['id']);
        }
      } catch (e) {
        print("Sync failed for ping ${ping['id']}: $e");
      }
    }
  }
}
