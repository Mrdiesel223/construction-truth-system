import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';

class UpdateManager {
  static final ApiService _apiService = ApiService();

  static Future<void> checkForUpdates(BuildContext context) async {
    try {
      final latestRelease = await _apiService.getLatestRelease();
      if (latestRelease == null) return;

      final packageInfo = await PackageInfo.fromPlatform();
      final currentBuildNumber = int.parse(packageInfo.buildNumber);
      final latestBuildNumber = latestRelease['buildNumber'] as int;

      if (latestBuildNumber > currentBuildNumber) {
        if (context.mounted) {
          _showUpdateDialog(
            context, 
            latestRelease['version'], 
            latestRelease['downloadUrl'], 
            latestRelease['mandatory'] ?? false,
            latestRelease['releaseNotes'] ?? ''
          );
        }
      }
    } catch (e) {
      debugPrint('Check for updates error: $e');
    }
  }

  static void _showUpdateDialog(
    BuildContext context, 
    String version, 
    String url, 
    bool mandatory,
    String notes
  ) {
    showDialog(
      context: context,
      barrierDismissible: !mandatory,
      builder: (context) => PopScope(
        canPop: !mandatory,
        child: AlertDialog(
          title: Text('Update Available (v$version)'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('A new version of the app is available. Please update to continue using all features.'),
              if (notes.isNotEmpty) ...[
                const SizedBox(height: 12),
                const Text('What\'s New:', style: TextStyle(fontWeight: FontWeight.bold)),
                Text(notes),
              ],
            ],
          ),
          actions: [
            if (!mandatory)
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Later'),
              ),
            ElevatedButton(
              onPressed: () async {
                final uri = Uri.parse(url);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              child: const Text('Update Now'),
            ),
          ],
        ),
      ),
    );
  }
}
