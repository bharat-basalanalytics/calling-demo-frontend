'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import moment from 'moment'
import toast from 'react-hot-toast'

import {
  useListCallLogsMutation,
  useGetAssistantsQuery,
  useTriggerCallMutation
} from '@/store'
import Button from '@/components/ui/Button'

// ─── Constants ────────────────────────────────────────────────────────────────

const DATE_RANGE = {
  all: 'all',
  today: 'today',
  thisWeek: 'thisWeek',
  thisMonth: 'thisMonth'
}

const CALL_LOGS_COLUMNS = [
  'Date & time',
  'Receiver name',
  'Receiver phone',
  'Assistant',
  'Call ID',
  'Duration'
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateRangeFor (range) {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)

  if (range === DATE_RANGE.today) {
    start.setHours(0, 0, 0, 0)
    return [start, end]
  }
  if (range === DATE_RANGE.thisWeek) {
    const day = start.getDay()
    start.setDate(start.getDate() - day + (day === 0 ? -6 : 1))
    start.setHours(0, 0, 0, 0)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return [start, end]
  }
  if (range === DATE_RANGE.thisMonth) {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    end.setMonth(end.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)
    return [start, end]
  }
  return [start, end]
}

function formatCallIdPreview (callId) {
  if (!callId) return '—'
  return callId.length > 14 ? `${callId.slice(0, 14)}…` : callId
}

function formatDuration (seconds) {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}m ${s}s`
}

async function copyText (text, successMessage) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.success(successMessage)
  } catch {
    toast.error('Could not copy')
  }
}

function findOverflowScrollParent (node) {
  if (typeof window === 'undefined' || !node) return null
  let el = node.parentElement
  while (el && el !== document.body) {
    const { overflowY } = window.getComputedStyle(el)
    if (/(auto|scroll|overlay)/.test(overflowY)) return el
    el = el.parentElement
  }
  return document.documentElement
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

// const SUCCESS_REASONS = ['customer-ended-call', 'assistant-ended-call', 'silence-timed-out']

// function CallStatusBadge ({ status, endedReason }) {
//   const label = endedReason || status || 'unknown'

//   let modifier = 'grey'
//   if (endedReason) {
//     modifier = SUCCESS_REASONS.includes(endedReason) ? 'green' : 'red'
//   } else if (status === 'in-progress' || status === 'queued') {
//     modifier = 'orange'
//   }

//   return (
//     <span className={`call-logs__status-badge call-logs__status-badge--${modifier}`}>
//       {label}
//     </span>
//   )
// }

const PREFERRED_ASSISTANT_PHONE = '+12164249473'
// '+18578294168'
// '+12164249473'

function TriggerCallModal ({ onClose, onSuccess }) {
  const { data: assistantsRes } = useGetAssistantsQuery()
  const [triggerCall, { isLoading }] = useTriggerCallMutation()

  const assistants = assistantsRes?.data || []

  const [form, setForm] = useState({
    assistant: '',
    candidatePhone: '',
    candidateName: ''
  })

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.assistant) return toast.error('Select an assistant')
    if (!form.candidatePhone) return toast.error('Enter candidate phone (E.164 format)')

    const toastId = toast.loading('Triggering call…')
    try {
      await triggerCall({
        assistant: form.assistant,
        outboundPhone: PREFERRED_ASSISTANT_PHONE,
        variables: {
          CandidatePhone: form.candidatePhone,
          ...(form.candidateName && { candidateName: form.candidateName })
        }
      }).unwrap()
      toast.success('Call triggered successfully', { id: toastId })
      onSuccess()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to trigger call', { id: toastId })
    }
  }

  return (
    <div className="trigger-call" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="trigger-call__container">

        <div className="trigger-call__container__header">
          <span className="trigger-call__container__header__title">Trigger Call</span>
          <button
            type="button"
            className="trigger-call__container__header__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="trigger-call__container__body">
            <div className="trigger-call__container__body__grid">

              <div className="trigger-call__container__body__grid__field">
                <label htmlFor="tc-assistant">Assistant *</label>
                <select
                  id="tc-assistant"
                  name="assistant"
                  value={form.assistant}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select assistant…</option>
                  {assistants.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="trigger-call__container__body__grid__field">
                <label>Outbound phone number *</label>
                <input
                  type="text"
                  value={PREFERRED_ASSISTANT_PHONE}
                  readOnly
                  style={{ background: '#FAFBFB', cursor: 'default', color: '#181818' }}
                />
              </div>

              <div className="trigger-call__container__body__grid__field">
                <label htmlFor="tc-candidate-phone">Receiver phone (E.164) *</label>
                <input
                  id="tc-candidate-phone"
                  type="tel"
                  name="candidatePhone"
                  placeholder="+12025551234"
                  value={form.candidatePhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="trigger-call__container__body__grid__field">
                <label htmlFor="tc-candidate-name">Receiver name</label>
                <input
                  id="tc-candidate-name"
                  type="text"
                  name="candidateName"
                  placeholder="John Doe"
                  value={form.candidateName}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          <div className="trigger-call__container__footer">
            <Button type="button" variant="cancel" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Triggering…' : 'Trigger Call'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CallLogsPage () {
  const [listCallLogs, { isLoading }] = useListCallLogsMutation()
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [queryVersion, setQueryVersion] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [listDateRange, setListDateRange] = useState(DATE_RANGE.all)
  const [showModal, setShowModal] = useState(false)

  const tableSectionRef = useRef(null)
  const tableBodyScrollRef = useRef(null)
  const tableHeadInnerRef = useRef(null)
  const throttleRef = useRef(false)
  const appliedSearchRef = useRef('')
  const appliedDateRef = useRef(DATE_RANGE.all)

  const buildParams = useCallback((pageNum) => {
    const params = { page: pageNum, limit: 20 }
    const term = appliedSearchRef.current.trim()
    if (term) params.search = term
    const range = appliedDateRef.current
    if (range !== DATE_RANGE.all) {
      const [from, to] = getDateRangeFor(range)
      params.date = [from.toISOString(), to.toISOString()].join(',')
    }
    return params
  }, [])

  useLayoutEffect(() => {
    const mainEl = document.querySelector('main')
    mainEl?.classList.add('main--call-logs')
    return () => mainEl?.classList.remove('main--call-logs')
  }, [])

  useEffect(() => {
    let cancelled = false
      ; (async () => {
      const toastId = toast.loading(page === 1 ? 'Loading call logs…' : 'Loading more…')
      try {
        const res = await listCallLogs(buildParams(page)).unwrap()
        if (cancelled) return
        const fetched = res.data || []
        if (page === 1) {
          setRows(fetched)
          setTotalCount(res.count ?? 0)
        } else {
          setRows((prev) => {
            const seen = new Set(prev.map((r) => r.callId))
            return [...prev, ...fetched.filter((r) => !seen.has(r.callId))]
          })
        }
        setHasMore(!!res.hasMore)
      } catch (err) {
        if (!cancelled) toast.error(err?.data?.message || 'Failed to load call logs')
      } finally {
        toast.dismiss(toastId)
      }
    })()
    return () => { cancelled = true }
  }, [page, queryVersion, listCallLogs, buildParams])

  useEffect(() => {
    const scrollEl = findOverflowScrollParent(tableSectionRef.current)
    if (!scrollEl) return
    const onScroll = () => {
      if (!hasMore || isLoading || throttleRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      if (scrollTop + clientHeight >= scrollHeight - 120) {
        throttleRef.current = true
        setPage((p) => p + 1)
        setTimeout(() => { throttleRef.current = false }, 400)
      }
    }
    scrollEl.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollEl.removeEventListener('scroll', onScroll)
  }, [hasMore, isLoading])

  const bumpQuery = () => {
    setPage(1)
    setQueryVersion((v) => v + 1)
    const scrollEl = findOverflowScrollParent(tableSectionRef.current)
    if (scrollEl) scrollEl.scrollTop = 0
  }

  const handleSearch = () => {
    appliedSearchRef.current = searchTerm.trim()
    bumpQuery()
  }

  const handleDateRangeChange = (range) => {
    appliedDateRef.current = range
    setListDateRange(range)
    bumpQuery()
  }

  const handleTableBodyScroll = useCallback((e) => {
    const scrollLeft = e.currentTarget.scrollLeft
    if (tableHeadInnerRef.current) {
      tableHeadInnerRef.current.style.transform = `translateX(-${scrollLeft}px)`
    }
  }, [])

  const handleCallTriggered = () => {
    setShowModal(false)
    bumpQuery()
  }

  return (
    <div className="call-logs">

      {showModal && (
        <TriggerCallModal
          onClose={() => setShowModal(false)}
          onSuccess={handleCallTriggered}
        />
      )}

      {/* Header */}
      <div className="call-logs__header">
        <h1>Call logs</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="call-logs__header__range">
            {[
              { key: DATE_RANGE.all, label: 'All' },
              { key: DATE_RANGE.today, label: 'Today' },
              { key: DATE_RANGE.thisWeek, label: 'This week' },
              { key: DATE_RANGE.thisMonth, label: 'This month' }
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`call-logs__header__range-btn${listDateRange === key ? ' call-logs__header__range-btn--active' : ''}`}
                onClick={() => handleDateRangeChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="call-logs__trigger-btn"
            onClick={() => setShowModal(true)}
          >
            + Trigger Call
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="call-logs__toolbar">
        <div className="call-logs__toolbar__row">
          <div className="call-logs__toolbar__actions">
            <div className="call-logs__toolbar__search">
              <input
                type="text"
                placeholder="Search by call ID, phone, or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              />
              <button type="button" onClick={handleSearch}>Search</button>
            </div>
            {totalCount > 0 && (
              <p className="call-logs__toolbar__summary">
                {rows.length} of {totalCount} calls
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <section
        ref={tableSectionRef}
        className="static static--call-logs"
        style={{ paddingLeft: 0, paddingRight: 20 }}
      >
        <div className="static__container static__container--table">

          {/* Sticky header */}
          <div className="call-logs__table-head" aria-hidden>
            <table
              ref={tableHeadInnerRef}
              className="submissions-table submissions-table--call-logs-head"
            >
              <colgroup>
                {CALL_LOGS_COLUMNS.map((_, idx) => (
                  <col key={idx} className={`call-logs__col call-logs__col--${idx + 1}`} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {CALL_LOGS_COLUMNS.map((label, idx) => (
                    <th key={idx}>{label}</th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable body */}
          <div
            ref={tableBodyScrollRef}
            className="static__table-scroll"
            onScroll={handleTableBodyScroll}
          >
            <table className="submissions-table submissions-table--call-logs-body">
              <colgroup>
                {CALL_LOGS_COLUMNS.map((_, idx) => (
                  <col key={idx} className={`call-logs__col call-logs__col--${idx + 1}`} />
                ))}
              </colgroup>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.callId}>
                    <td>{row.callAt ? moment(row.callAt).format('lll') : '—'}</td>
                    <td>{row.candidateName || '—'}</td>
                    <td>{row.candidatePhone || '—'}</td>
                    <td>{row.assistantName || '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="call-logs__call-id"
                        title={row.callId || 'Copy call ID'}
                        onClick={() => copyText(row.callId, 'Call ID copied')}
                      >
                        <span className="call-logs__call-id__text">
                          {formatCallIdPreview(row.callId)}
                        </span>
                        <span className="call-logs__call-id__copy" aria-label="Copy">⧉</span>
                      </button>
                    </td>
                    {/* <td>
                      <CallStatusBadge status={row.status} endedReason={row.endedReason} />
                    </td> */}
                    <td>{formatDuration(row.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {!isLoading && rows.length === 0 && (
          <p className="call-logs__empty">No call logs found.</p>
        )}
      </section>

    </div>
  )
}
