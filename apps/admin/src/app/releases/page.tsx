'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, 
  Download, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AppRelease {
  id: number;
  version: string;
  buildNumber: number;
  downloadUrl: string;
  mandatory: boolean;
  releaseNotes: string | null;
  createdAt: string;
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<AppRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [version, setVersion] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [mandatory, setMandatory] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState('');

  const fetchReleases = async () => {
    try {
      const res = await api.get('/releases');
      setReleases(res.data);
    } catch (err) {
      console.error('Failed to fetch releases', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDownloadUrl(res.data.url);
    } catch (err) {
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/releases', {
        version,
        buildNumber: parseInt(buildNumber),
        downloadUrl,
        mandatory,
        releaseNotes
      });
      setIsAdding(false);
      resetForm();
      fetchReleases();
    } catch (err) {
      alert('Failed to create release');
    }
  };

  const resetForm = () => {
    setVersion('');
    setBuildNumber('');
    setDownloadUrl('');
    setMandatory(false);
    setReleaseNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">App Releases</h1>
          <p className="text-slate-500">Manage mobile app versions and mandatory updates</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> New Release</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold mb-4">Create New Release</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Version Name (e.g. 1.0.1)</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Build Number (e.g. 2)</label>
                <input
                  required
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={buildNumber}
                  onChange={(e) => setBuildNumber(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="mandatory"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={mandatory}
                  onChange={(e) => setMandatory(e.target.checked)}
                />
                <label htmlFor="mandatory" className="text-sm font-medium text-slate-700">
                  This is a mandatory update
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">APK File</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    placeholder="Upload a file or enter URL..."
                    className="flex-1 px-4 py-2 border rounded-lg bg-slate-50 text-slate-500 text-sm"
                    value={downloadUrl}
                  />
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin text-slate-600" /> : <Upload className="w-5 h-5 text-slate-600" />}
                    <input type="file" className="hidden" accept=".apk" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Release Notes</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Publish Release
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Version</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Release Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Notes</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading releases...</td>
                </tr>
              ) : releases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No releases published yet</td>
                </tr>
              ) : (
                releases.map((release) => (
                  <tr key={release.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">v{release.version}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500">
                          build {release.buildNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {release.mandatory ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded-full uppercase">
                          <AlertCircle className="w-3 h-3" /> Mandatory
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Optional
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(release.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-slate-600 truncate">{release.releaseNotes || 'No notes'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={release.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-bold"
                      >
                        <Download className="w-4 h-4" /> APK
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
