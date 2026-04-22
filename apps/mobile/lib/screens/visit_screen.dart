import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import '../services/api_service.dart';

class VisitScreen extends StatefulWidget {
  const VisitScreen({super.key});

  @override
  State<VisitScreen> createState() => _VisitScreenState();
}

class _VisitScreenState extends State<VisitScreen> {
  final _formKey = GlobalKey<FormState>();
  final _customerNameController = TextEditingController();
  final _purposeController = TextEditingController();
  final _notesController = TextEditingController();
  File? _image;
  bool _isLoading = false;

  final ImagePicker _picker = ImagePicker();
  final ApiService _apiService = ApiService();

  Future<void> _pickImage() async {
    final XFile? pickedFile = await _picker.pickImage(source: ImageSource.camera, imageQuality: 50);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  Future<void> _submitVisit() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);

    try {
      // 1. Get Location
      Position position = await Geolocator.getCurrentPosition();

      // 2. Prepare Data
      // Note: In a real app, you'd upload the image to S3/Cloudinary first 
      // and send the URL. For now, we'll send a placeholder URL or the path.
      final visitData = {
        'customerName': _customerNameController.text,
        'purpose': _purposeController.text,
        'notes': _notesController.text,
        'lat': position.latitude,
        'lng': position.longitude,
        'imageUrl': _image?.path ?? '', // Placeholder logic
      };

      // 3. Call API
      final success = await _apiService.createVisit(visitData);

      if (mounted) {
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Visit recorded successfully!')),
          );
          Navigator.pop(context);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to record visit')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Customer Visit')),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextFormField(
                    controller: _customerNameController,
                    decoration: const InputDecoration(
                      labelText: 'Customer/Shop Name',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) => value!.isEmpty ? 'Please enter name' : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _purposeController,
                    decoration: const InputDecoration(
                      labelText: 'Purpose of Visit',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) => value!.isEmpty ? 'Please enter purpose' : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _notesController,
                    decoration: const InputDecoration(
                      labelText: 'Additional Notes',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 20),
                  GestureDetector(
                    onTap: _pickImage,
                    child: Container(
                      height: 200,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: _image == null
                          ? const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.camera_alt, size: 50, color: Colors.grey),
                                Text('Tap to Capture Photo'),
                              ],
                            )
                          : Image.file(_image!, fit: BoxFit.cover),
                    ),
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: _submitVisit,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Theme.of(context).primaryColor,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Submit Visit Entry', style: TextStyle(fontSize: 16)),
                  ),
                ],
              ),
            ),
          ),
    );
  }
}
