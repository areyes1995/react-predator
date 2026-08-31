// ──────────────────────────────────────────────
// KnowledgeBaseView — Base de Conocimiento del Proyecto
// Gestiona documentos para alimentar el motor IA (RAG).
//
// Este componente usa estados locales para simular operaciones.
// En producción, los endpoints del backend (NestJS + PostgreSQL
// con pgvector) reemplazarían las simulaciones:
//
//   - GET    /api/knowledge-base/documents   → lista documentos
//   - POST   /api/knowledge-base/documents   → sube documento
//   - DELETE /api/knowledge-base/documents/:id → elimina documento
//   - POST   /api/knowledge-base/documents/:id/reindex → re-indexa
//   - GET    /api/knowledge-base/faq         → lista FAQs manuales
//   - POST   /api/knowledge-base/faq         → crea FAQ manual
//   - PUT    /api/knowledge-base/faq/:id     → actualiza FAQ
//   - DELETE /api/knowledge-base/faq/:id      → elimina FAQ
// ──────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react'
import {
  BookOpen,
  FileText,
  Upload,
  X,
  Trash2,
  RefreshCw,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileClock,
  Database,
  Layers,
  ArrowUpCircle,
} from 'lucide-react'

import { KpiCard } from '../../../components/charts'
import { Expandable, SectionTitle, ViewHeader, SearchFilter, StatusBadge, FormModal, Breadcrumbs } from '../../../components/ui'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

type UploadStatus = 'indexed' | 'processing' | 'error'

interface KnowledgeDocument {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  status: UploadStatus
}

interface FaqItem {
  id: string
  question: string
  answer: string
}

const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'text/markdown', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const EXTENSIONS = 'PDF, TXT, MD, DOCX'

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusColor(status: UploadStatus): string {
  switch (status) {
    case 'indexed':
      return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
    case 'processing':
      return 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
    case 'error':
      return 'text-rose-400 bg-rose-400/10 border border-rose-400/20'
  }
}

function statusLabel(status: UploadStatus): string {
  switch (status) {
    case 'indexed': return 'Indexado'
    case 'processing': return 'Procesando'
    case 'error': return 'Error'
  }
}

/* ──────────────────────────────────────────────
   Mock initial data
   ────────────────────────────────────────────── */

const MOCK_DOCUMENTS: KnowledgeDocument[] = [
  { id: '1', fileName: 'especificacion_tecnica.pdf', fileSize: 2450000, fileType: 'application/pdf', uploadedAt: '2025-08-15T10:30:00Z', status: 'indexed' },
  { id: '2', fileName: 'plan_projectile.txt', fileSize: 125000, fileType: 'text/plain', uploadedAt: '2025-08-20T14:15:00Z', status: 'indexed' },
  { id: '3', fileName: 'referencias_academicas.md', fileSize: 890000, fileType: 'text/markdown', uploadedAt: '2025-08-25T09:45:00Z', status: 'processing' },
  { id: '4', fileName: 'datos_experimentales.xlsx', fileSize: 3200000, fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadedAt: '2025-08-28T16:20:00Z', status: 'error' },
]

const MOCK_FAQS: FaqItem[] = [
  { id: '1', question: '¿Cuál es el alcance del proyecto?', answer: 'El proyecto busca desarrollar un prototipo de stand interactivo con asistencia de IA mediante RAG.' },
  { id: '2', question: '¿Qué tecnologías se utilizan?', answer: 'Se utiliza NestJS para el backend, React para el frontend, y PostgreSQL con pgvector para el almacenamiento vectorial.' },
]

/* ──────────────────────────────────────────────
   KpiCard override — reuse existing component
   ────────────────────────────────────────────── */

/* ──────────────────────────────────────────────
   KnowledgeBaseView — Main component
   ────────────────────────────────────────────── */

export default function KnowledgeBaseView() {
  const { t } = useAppTranslation()
  const [activeTab, setActiveTab] = useState<'documents' | 'upload' | 'faq'>('documents')

  /* ── Documents state ── */
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(MOCK_DOCUMENTS)
  const [searchDoc, setSearchDoc] = useState('')

  /* ── Upload state ── */
  const [dragOver, setDragOver] = useState(false)
  const [uploadFile, setUploadFile] = useState<KnowledgeDocument | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── FAQ state ── */
  const [faqs, setFaqs] = useState<FaqItem[]>(MOCK_FAQS)
  const [openFaqModal, setOpenFaqModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)

  /* ── Filtered documents ── */
  const filteredDocs = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchDoc.toLowerCase()),
  )

  /* ── Metrics ── */
  const totalDocs = documents.length
  const indexedDocs = documents.filter(d => d.status === 'indexed').length
  const processingDocs = documents.filter(d => d.status === 'processing').length
  const vectorSyncPercent = totalDocs > 0 ? Math.round((indexedDocs / totalDocs) * 100) : 100
  const totalTokens = documents.reduce((acc, d) => acc + d.fileSize, 0)
  const estimatedChunks = Math.floor(totalTokens / 256) // ~256 bytes per chunk (mock estimate)

  /* ── Upload handlers ── */
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|txt|md|docx)$/i)) {
      setUploadError('Tipo de archivo no soportado. Formatos: PDF, TXT, MD, DOCX.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`El archivo excede el límite de ${MAX_FILE_SIZE / (1024 * 1024)} MB.`)
      return
    }
    setUploadError(null)
    setUploadFile({
      id: `mock-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      status: 'processing',
    })
    setUploadDone(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0] || null
    handleFileSelect(file)
  }, [handleFileSelect])

  const handleUpload = useCallback(async () => {
    if (!uploadFile) return
    setUploading(true)
    setUploadError(null)

    // ⚠️ BACKEND ENDPOINT: POST /api/knowledge-base/documents
    // await api.post('/knowledge-base/documents', { file: uploadFile })
    await new Promise(r => setTimeout(r, 1500))

    const newDoc: KnowledgeDocument = {
      id: `kb-${Date.now()}`,
      fileName: uploadFile.fileName,
      fileSize: uploadFile.fileSize,
      fileType: uploadFile.fileType,
      uploadedAt: new Date().toISOString(),
      status: 'indexed',
    }
    setDocuments(prev => [...prev, newDoc])
    setUploading(false)
    setUploadDone(true)
    setUploadFile(null)
  }, [uploadFile])

  const handleReindex = useCallback((id: string) => {
    // ⚠️ BACKEND ENDPOINT: POST /api/knowledge-base/documents/:id/reindex
    setDocuments(prev =>
      prev.map(d => d.id === id ? { ...d, status: 'processing' as UploadStatus } : d),
    )
    setTimeout(() => {
      setDocuments(prev =>
        prev.map(d => d.id === id ? { ...d, status: 'indexed' as UploadStatus } : d),
      )
    }, 2000)
  }, [])

  const handleDelete = useCallback((id: string) => {
    // ⚠️ BACKEND ENDPOINT: DELETE /api/knowledge-base/documents/:id
    setDocuments(prev => prev.filter(d => d.id !== id))
  }, [])

  /* ── FAQ handlers ── */
  const handleSaveFaq = useCallback((q: string, a: string) => {
    if (editingFaq) {
      // ⚠️ BACKEND ENDPOINT: PUT /api/knowledge-base/faq/:id
      setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, question: q, answer: a } : f))
    } else {
      // ⚠️ BACKEND ENDPOINT: POST /api/knowledge-base/faq
      setFaqs(prev => [...prev, { id: `faq-${Date.now()}`, question: q, answer: a }])
    }
    setOpenFaqModal(false)
    setEditingFaq(null)
  }, [editingFaq])

  const handleDeleteFaq = useCallback((id: string) => {
    // ⚠️ BACKEND ENDPOINT: DELETE /api/knowledge-base/faq/:id
    setFaqs(prev => prev.filter(f => f.id !== id))
  }, [])

  /* ──────────────────────────────────────────────
     Render
     ────────────────────────────────────────────── */

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <ViewHeader
        title="Base de Conocimiento del Proyecto"
        subtitle="Carga documentos y configura datos para entrenar al avatar virtual de tu stand."
      />

      {/* ── Content area ── */}
      <div className="flex-1 overflow-auto px-4 lg:px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <KpiCard
              label="Documentos Ingeridos"
              value={totalDocs}
              hint={`${indexedDocs} indexados · ${processingDocs} en proceso`}
              icon={<FileText className="w-4 h-4" />}
              accentClass="text-[var(--text-muted)]"
            />
            <KpiCard
              label="Vectorización"
              value={vectorSyncPercent}
              suffix="%"
              hint={vectorSyncPercent === 100 ? '100% Sincronizado' : `${processingDocs} documentos pendientes`}
              icon={<Database className="w-4 h-4" />}
              accentClass={vectorSyncPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}
            />
            <KpiCard
              label="Tokens / Fragmentos"
              value={estimatedChunks}
              suffix=""
              hint={`~${(totalTokens / 1024).toFixed(0)}K tokens estimados`}
              icon={<Layers className="w-4 h-4" />}
              accentClass="text-[var(--text-muted)]"
            />
          </div>

          {/* ── Tabs ── */}
          <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-panel)]">
            <div className="flex border-b border-[var(--border)]">
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-5 py-3 text-sm font-medium transition ${
                  activeTab === 'documents'
                    ? 'text-[var(--text-primary)] border-b-2 border-[#f2a93b] bg-[var(--bg-surface-soft)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Documentos Cargados
                </span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-5 py-3 text-sm font-medium transition ${
                  activeTab === 'upload'
                    ? 'text-[var(--text-primary)] border-b-2 border-[#f2a93b] bg-[var(--bg-surface-soft)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Cargar Documento
                </span>
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-5 py-3 text-sm font-medium transition ${
                  activeTab === 'faq'
                    ? 'text-[var(--text-primary)] border-b-2 border-[#f2a93b] bg-[var(--bg-surface-soft)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Conocimiento Directo
                </span>
              </button>
            </div>

            <div className="p-5">
              {/* ── Tab: Documents Table ── */}
              {activeTab === 'documents' && (
                <div>
                  {/* Search bar */}
                  <div className="mb-4">
                    <div className="relative max-w-sm">
                      <input
                        value={searchDoc}
                        onChange={e => setSearchDoc(e.target.value)}
                        placeholder="Buscar documentos..."
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-active)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-muted)] transition"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)]">
                          <th className="text-left text-[var(--text-muted)] font-medium py-2.5 px-3">Archivo</th>
                          <th className="text-left text-[var(--text-muted)] font-medium py-2.5 px-3">Tamaño</th>
                          <th className="text-left text-[var(--text-muted)] font-medium py-2.5 px-3 hidden sm:table-cell">Fecha</th>
                          <th className="text-left text-[var(--text-muted)] font-medium py-2.5 px-3">Estado</th>
                          <th className="text-right text-[var(--text-muted)] font-medium py-2.5 px-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocs.map(doc => (
                          <tr key={doc.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-surface-soft)] transition">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                                <span className="text-[var(--text-secondary)] truncate">{doc.fileName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[var(--text-muted)] tabular-nums">{formatSize(doc.fileSize)}</td>
                            <td className="py-3 px-3 text-[var(--text-muted)] hidden sm:table-cell">{formatDate(doc.uploadedAt)}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(doc.status)}`}>
                                {doc.status === 'indexed' && <CheckCircle2 className="w-3 h-3" />}
                                {doc.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                                {doc.status === 'error' && <AlertCircle className="w-3 h-3" />}
                                {statusLabel(doc.status)}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-end gap-1">
                                {doc.status === 'indexed' && (
                                  <button
                                    onClick={() => handleReindex(doc.id)}
                                    className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition"
                                    title="Re-indexar documento"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                )}
                                {doc.status === 'error' && (
                                  <button
                                    onClick={() => handleReindex(doc.id)}
                                    className="rounded-lg p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition"
                                    title="Reintentar procesamiento"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(doc.id)}
                                  className="rounded-lg p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition"
                                  title="Eliminar documento"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredDocs.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-12 text-[var(--text-muted)] text-sm">
                              {searchDoc ? 'No se encontraron documentos que coincidan.' : 'No hay documentos cargados aún.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Nota RAG ── */}
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-soft)] p-3.5">
                    <ArrowUpCircle className="w-4 h-4 shrink-0 text-[#f2a93b]" />
                    <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                      <strong>Nota:</strong> Los documentos indexados alimentan el motor RAG del avatar virtual. 
                      Cada archivo se fragmenta en chunks de ~256 tokens y se almacena en pgvector para búsqueda semántica. 
                      Los documentos en estado "Error" deben ser re-indexados manualmente.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Tab: Upload ── */}
              {activeTab === 'upload' && (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => {
                      e.preventDefault()
                      setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                      dragOver
                        ? 'border-[#f2a93b] bg-[#f2a93b]/5 scale-[1.01]'
                        : 'border-[var(--border-active)] bg-[var(--bg-surface)] hover:border-[#f2a93b]/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.txt,.md,.docx,application/pdf,text/plain,text/markdown,.docx"
                      onChange={e => handleFileSelect(e.target.files?.[0] || null)}
                    />
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--bg-panel)] border border-[var(--border-active)]">
                      <Upload className="w-6 h-6 text-[#f2a93b]" strokeWidth={2} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                      {dragOver ? 'Suelta el archivo aquí' : 'Arrastra y suelta o haz clic para seleccionar'}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Formatos: {EXTENSIONS} · Máximo {MAX_FILE_SIZE / (1024 * 1024)} MB
                    </p>
                  </div>

                  {/* Selected file preview */}
                  {uploadFile && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--border-active)] bg-[var(--bg-surface)] p-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/25 to-orange-500/10 text-amber-300 border border-amber-400/30">
                        <FileText className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{uploadFile.fileName}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{formatSize(uploadFile.fileSize)} · {uploadFile.fileType}</p>
                      </div>
                      <button
                        onClick={() => { setUploadFile(null); setUploadDone(false) }}
                        className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"
                        title="Remover archivo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {uploadError}
                    </div>
                  )}

                  {uploadDone && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Documento cargado y procesado correctamente.
                    </div>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile || uploading}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f2a93b] to-[#d18e2a] px-5 py-2.5 text-sm font-semibold text-[#121316] shadow-[0_4px_16px_rgba(242,169,59,0.3)] transition hover:shadow-[0_4px_24px_rgba(242,169,59,0.45)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" strokeWidth={2} />
                        {uploadFile ? `Subir ${uploadFile.fileName}` : 'Selecciona un archivo'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ── Tab: FAQ / Direct Knowledge ── */}
              {activeTab === 'faq' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[var(--text-secondary)]">
                      Añade preguntas y respuestas manuales para conocimiento rápido sin necesidad de subir documentos.
                    </p>
                    <button
                      onClick={() => {
                        setEditingFaq(null)
                        setOpenFaqModal(true)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Nueva FAQ
                    </button>
                  </div>

                  <div className="space-y-2">
                    {faqs.map(faq => (
                      <div key={faq.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface-soft)] p-4 transition hover:border-[var(--border-active)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">{faq.question}</h4>
                            <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingFaq(faq)
                                setOpenFaqModal(true)
                              }}
                              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition"
                              title="Editar FAQ"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="rounded-lg p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition"
                              title="Eliminar FAQ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {faqs.length === 0 && (
                      <div className="text-center py-10 text-[var(--text-muted)] text-sm">
                        No hay FAQs creadas. Haz clic en "Nueva FAQ" para agregar conocimiento manual.
                      </div>
                    )}
                  </div>

                  {/* ── Nota FAQ ── */}
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-soft)] p-3.5">
                    <BookOpen className="w-4 h-4 shrink-0 text-[#f2a93b]" />
                    <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                      <strong>Conocimiento Directo:</strong> Las FAQs se almacenan como pares de texto y se embeben junto con los chunks de documentos. 
                      Este conocimiento tiene prioridad en la búsqueda RAG sobre documentos genéricos. Útil para preguntas frecuentes del stand.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FAQ Modal ── */}
        {openFaqModal && (
          <FaqModal
            faq={editingFaq}
            onClose={() => {
              setOpenFaqModal(false)
              setEditingFaq(null)
            }}
            onSave={handleSaveFaq}
          />
        )}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   FaqModal — Simple modal for creating/editing FAQs
   ────────────────────────────────────────────── */

function FaqModal({
  faq,
  onClose,
  onSave,
}: {
  faq: FaqItem | null
  onClose: () => void
  onSave: (question: string, answer: string) => void
}) {
  const [question, setQuestion] = useState(faq?.question ?? '')
  const [answer, setAnswer] = useState(faq?.answer ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {faq ? 'Editar Conocimiento' : 'Nuevo Conocimiento Directo'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Pregunta</label>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="¿Cuál es el alcance del proyecto?"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-active)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-muted)] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Respuesta</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Describe la respuesta aquí..."
              rows={4}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-active)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-muted)] transition resize-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (question.trim() && answer.trim()) onSave(question.trim(), answer.trim())
            }}
            disabled={!question.trim() || !answer.trim()}
            className="rounded-lg bg-gradient-to-r from-[#f2a93b] to-[#d18e2a] px-4 py-2 text-xs font-semibold text-[#121316] shadow-[0_4px_16px_rgba(242,169,59,0.3)] transition hover:shadow-[0_4px_24px_rgba(242,169,59,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {faq ? 'Guardar Cambios' : 'Crear FAQ'}
          </button>
        </div>
      </div>
    </div>
  )
}
