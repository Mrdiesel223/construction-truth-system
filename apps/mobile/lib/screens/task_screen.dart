import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/task.dart'; // Need to create this model
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';

class TaskScreen extends StatefulWidget {
  const TaskScreen({super.key});

  @override
  State<TaskScreen> createState() => _TaskScreenState();
}

class _TaskScreenState extends State<TaskScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _tasks = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchTasks();
  }

  Future<void> _fetchTasks() async {
    final tasks = await _apiService.getMyTasks();
    setState(() {
      _tasks = tasks;
      _isLoading = false;
    });
  }

  Future<void> _handleTaskAction(int taskId, String status) async {
    if (status == 'PENDING') {
      await _apiService.startTask(taskId);
    } else if (status == 'IN_PROGRESS') {
      // Capture Proof
      final XFile? image = await ImagePicker().pickImage(source: ImageSource.camera);
      if (image == null) return;

      Position pos = await Geolocator.getCurrentPosition();
      await _apiService.endTask(taskId, pos.latitude, pos.longitude, image.path);
    }
    _fetchTasks();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Assigned Tasks')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _tasks.length,
              itemBuilder: (context, index) {
                final task = _tasks[index];
                return Card(
                  margin: const EdgeInsets.all(8),
                  child: ListTile(
                    title: Text(task['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('${task['site']} • Status: ${task['status']}'),
                    trailing: _buildActionButton(task),
                  ),
                );
              },
            ),
    );
  }

  Widget _buildActionButton(dynamic task) {
    if (task['status'] == 'COMPLETED') {
      return const Icon(Icons.check_circle, color: Colors.green);
    }
    return ElevatedButton(
      onPressed: () => _handleTaskAction(task['id'], task['status']),
      child: Text(task['status'] == 'PENDING' ? 'Start' : 'Finish'),
    );
  }
}
