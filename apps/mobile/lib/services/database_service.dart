import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'truth_system.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE offline_pings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL,
            lng REAL,
            timestamp TEXT
          )
        ''');
        await db.execute('''
          CREATE TABLE offline_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customerName TEXT,
            purpose TEXT,
            notes TEXT,
            lat REAL,
            lng REAL,
            imagePath TEXT,
            timestamp TEXT
          )
        ''');
      },
    );
  }

  Future<void> savePing(double lat, double lng) async {
    final db = await database;
    await db.insert('offline_pings', {
      'lat': lat,
      'lng': lng,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  Future<List<Map<String, dynamic>>> getPendingPings() async {
    final db = await database;
    return await db.query('offline_pings');
  }

  Future<void> deletePing(int id) async {
    final db = await database;
    await db.delete('offline_pings', where: 'id = ?', whereArgs: [id]);
  }
}
