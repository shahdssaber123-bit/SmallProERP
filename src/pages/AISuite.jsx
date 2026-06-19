import React, { useState } from 'react';
import AIChatBot from '@/components/AIChatBot';
import { Upload } from 'lucide-react';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { Button, Card, DataTable, DetailGrid, ErrorBanner, Field, Input, Modal, PageHeader, Select, SyncButton, Textarea, date, idText } from '@/components/erp/ErpKit';

const ALLOWED_INSIGHT_TYPES = ['Full', 'Revenue', 'LowStock', 'TopCustomers'];

export default function AISuite() {
  const { data, loading, syncAllSystemData, generateInsight, uploadOcr, getInsightDetails, getOcrDetails } = useErp();
  const [tab, setTab] = useState('insights');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ InsightType: 'Full', FromDate: '', ToDate: '' });
  const [file, setFile] = useState(null);
  const { addToast } = useToast();

  const generate = async () => {
    setErr('');

    if (!ALLOWED_INSIGHT_TYPES.includes(form.InsightType)) {
      const msg = `Invalid InsightType "${form.InsightType}". Valid values: ${ALLOWED_INSIGHT_TYPES.join(', ')}`;
      setErr(msg);
      addToast(msg, 'warning');
      return;
    }

    const res = await generateInsight({
      InsightType: form.InsightType,
      FromDate: form.FromDate || null,
      ToDate: form.ToDate || null
    });

    if (!res.success) { setErr(res.error); addToast(res.error, 'error'); }
    else { addToast('AI insight generated successfully.', 'success'); setModal(null); }
  };

  const upload = async () => {
    setErr('');

    if (!file) {
      const msg = 'Choose an image or PDF first.';
      setErr(msg);
      addToast(msg, 'warning');
      return;
    }

    const res = await uploadOcr(file);

    if (!res.success) { setErr(res.error); addToast(res.error, 'error'); }
    else {
      addToast('OCR file uploaded successfully.', 'success');
      setFile(null);
      setModal(null);
    }
  };

  const showInsight = async (r) => {
    const fresh = await getInsightDetails(r);
    setSelected(fresh);
    setModal({ mode: 'insightDetails' });
  };

  const showOcr = async (r) => {
    const fresh = await getOcrDetails(r);
    setSelected(fresh);
    setModal({ mode: 'ocrDetails' });
  };

  return (
    <>
      <PageHeader
        title="AI Suite & OCR"
        subtitle="Generate insights and review OCR results"
        actions={
          <>
            <SyncButton loading={loading.global} onClick={syncAllSystemData} />
            <Button onClick={() => setModal({ mode: 'generate' })}>Generate AI Insight</Button>
            <Button variant="secondary" onClick={() => setModal({ mode: 'upload' })}>
              <Upload className="h-4 w-4" /> Upload OCR
            </Button>
          </>
        }
      />

      <ErrorBanner message={err} />

      <div className="mb-5 flex gap-2">
        <Button variant={tab === 'insights' ? 'primary' : 'secondary'} onClick={() => setTab('insights')}>
          AI Insights
        </Button>
        <Button variant={tab === 'ocr' ? 'primary' : 'secondary'} onClick={() => setTab('ocr')}>
          OCR Results
        </Button>
      </div>

      {tab === 'insights' && (
        <DataTable
          loading={loading.insights}
          rows={data.insights}
          columns={[
            { key: 'insightLogId', label: 'ID', render: (r) => idText(r.insightLogId) },
            { key: 'insightType', label: 'Type' },
            { key: 'insightText', label: 'Text', render: (r) => <span>{String(r.insightText || '').slice(0, 140)}...</span> },
            { key: 'createdAt', label: 'Created', render: (r) => date(r.createdAt) },
            { key: 'actions', label: 'Actions', render: (r) => <Button variant="secondary" onClick={() => showInsight(r)}>Details</Button> }
          ]}
        />
      )}

      {tab === 'ocr' && (
        <DataTable
          loading={loading.ocrResults}
          rows={data.ocrResults}
          columns={[
            { key: 'ocrResultId', label: 'ID', render: (r) => idText(r.ocrResultId) },
            { key: 'imagePath', label: 'Image' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Created', render: (r) => date(r.createdAt) },
            { key: 'actions', label: 'Actions', render: (r) => <Button variant="secondary" onClick={() => showOcr(r)}>Details</Button> }
          ]}
        />
      )}

      <Modal
        open={modal?.mode === 'generate'}
        title="Generate AI Insight"
        subtitle="Choose the insight type and date range"
        onClose={() => setModal(null)}
      >
        <div className="grid gap-4">
          <Field label="InsightType">
            <Select
              value={form.InsightType}
              onChange={(e) => setForm({ ...form, InsightType: e.target.value })}
            >
              <option value="Full">Full</option>
              <option value="Revenue">Revenue</option>
              <option value="LowStock">LowStock</option>
              <option value="TopCustomers">TopCustomers</option>
            </Select>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="FromDate">
              <Input
                type="date"
                value={form.FromDate}
                onChange={(e) => setForm({ ...form, FromDate: e.target.value })}
              />
            </Field>
            <Field label="ToDate">
              <Input
                type="date"
                value={form.ToDate}
                onChange={(e) => setForm({ ...form, ToDate: e.target.value })}
              />
            </Field>
          </div>


          <div className="flex justify-end">
            <Button onClick={generate}>Send</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={modal?.mode === 'upload'}
        title="Upload OCR"
        subtitle="Upload an image or PDF for OCR"
        onClose={() => setModal(null)}
      >
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded-2xl border p-4"
          />
          <p className="text-sm text-slate-500">Selected: {file?.name || '—'}</p>
          <Button onClick={upload}>Upload</Button>
        </div>
      </Modal>

      <Modal open={modal?.mode === 'insightDetails'} title="AI Insight Details" onClose={() => setModal(null)} size="max-w-5xl">
        <DetailGrid
          items={[
            { label: 'ID', value: idText(selected?.insightLogId) },
            { label: 'Type', value: selected?.insightType },
            { label: 'From', value: date(selected?.fromDate) },
            { label: 'To', value: date(selected?.toDate) },
            { label: 'Created', value: date(selected?.createdAt) }
          ]}
        />
        <Textarea readOnly value={selected?.insightText || ''} className="mt-6 min-h-[260px]" />
      </Modal>

      <Modal open={modal?.mode === 'ocrDetails'} title="OCR Result Details" onClose={() => setModal(null)} size="max-w-5xl">
        <DetailGrid
          items={[
            { label: 'ID', value: idText(selected?.ocrResultId) },
            { label: 'Status', value: selected?.status },
            { label: 'Image', value: selected?.imagePath },
            { label: 'Created', value: date(selected?.createdAt) }
          ]}
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="font-black">Raw Text</h3>
            <pre className="mt-3 whitespace-pre-wrap text-sm">{selected?.rawText || '—'}</pre>
          </Card>
          <Card className="p-4">
            <h3 className="font-black">Extracted Data</h3>
            <pre className="mt-3 whitespace-pre-wrap text-sm">{JSON.stringify(selected?.extractedData || {}, null, 2)}</pre>
          </Card>
        </div>
       </Modal>
      <AIChatBot />
    </>
  );
}