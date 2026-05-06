import { getAdminDb } from '@/lib/firebase-admin';
import { Metadata } from 'next';
import { CheckCircle2, Clock, Wrench, Package, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Track Repair | Unlimited IT Solutions',
  description: 'Check the status of your repair job in real time.',
  robots: { index: false, follow: false },
};

const STATUS_STEPS = [
  { key: 'received', label: 'Received', icon: Package },
  { key: 'diagnosing', label: 'Diagnosing', icon: AlertCircle },
  { key: 'repairing', label: 'Repairing', icon: Wrench },
  { key: 'awaiting-collection', label: 'Awaiting Collection', icon: Clock },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

async function getJob(jobId: string) {
  try {
    const doc = await getAdminDb().collection('repair-jobs').doc(jobId).get();
    if (!doc.exists) return null;
    const data = doc.data() as any;
    return {
      id: doc.id,
      device: data.device || 'Device',
      customerName: data.customerName || '',
      status: data.status || 'received',
      notes: data.notes || '',
      updatedAt: data.updatedAt?.toDate?.() ?? null,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  } catch {
    return null;
  }
}

export default async function TrackPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = await getJob(jobId);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-lg shadow-sm">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h1>
          <p className="text-gray-600">Double-check your job number or call <a href="tel:+27825569875" className="text-primary-600 hover:underline">082 556 9875</a>.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === job.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm text-gray-500">Job #{job.id}</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{job.device}</h1>
          {job.customerName && <p className="text-gray-600 mt-1">{job.customerName}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Status</h2>
          <ol className="space-y-4">
            {STATUS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <li key={step.key} className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-10 h-10 rounded-full ${isDone ? 'bg-green-500 text-white' : isCurrent ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className={`font-medium ${isCurrent ? 'text-primary-700' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                  {isCurrent && <span className="ml-auto text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">Current</span>}
                </li>
              );
            })}
          </ol>
        </div>

        {job.notes && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Technician notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.notes}</p>
          </div>
        )}

        {job.updatedAt && (
          <p className="text-xs text-gray-500 text-center">Last updated {job.updatedAt.toLocaleString('en-ZA')}</p>
        )}
      </div>
    </div>
  );
}
