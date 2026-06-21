import { useState, useEffect, useRef, useCallback } from 'react'
import animeCards from '../data/animeCards'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickInitial(shuffled) {
  const first = shuffled[0]
  let second = shuffled[1]
  let i = 2
  while (second.year === first.year && i < shuffled.length) {
    second = shuffled[i++]
  }
  return [first, second].sort((a, b) => a.year - b.year)
}

function sortByYear(arr) {
  return [...arr].sort((a, b) => a.year - b.year || a.id - b.id)
}

export default function useGameLogic(initialTime = 15) {
  const deckRef = useRef([])

  const buildInitialState = useCallback(() => {
    const shuffled = shuffle(animeCards)
    const initial = pickInitial(shuffled)
    const usedIds = new Set(initial.map((c) => c.id))
    deckRef.current = shuffled.filter((c) => !usedIds.has(c.id))
    return {
      timeline: initial,
      usedIds,
      insertIdx: null,
      feedback: null,
      score: 0,
      chrono: initialTime,
      timerActive: true,
      attempt: 0,
      finished: false,
    }
  }, [initialTime])

  const [state, setState] = useState(buildInitialState)

  // currentCard is derived directly from deckRef (not state) so it always reflects
  // the latest deck position without relying on React re-render timing
  const currentCard = deckRef.current[0] ?? null

  // ── timer countdown ────────────────────────────────────────────────────────
  const timerRef = useRef(null)

  useEffect(() => {
    if (!state.timerActive || state.finished) return
    timerRef.current = setInterval(() => {
      // only decrement — no side-effects inside setState callback
      setState((prev) => ({ ...prev, chrono: prev.chrono - 1 }))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [state.timerActive, state.finished, state.attempt])

  // ── handle chrono reaching 0 (separate effect, no deckRef mutation inside setState) ──
  useEffect(() => {
    if (state.chrono > 0 || !state.timerActive || state.finished) return
    clearInterval(timerRef.current)

    if (state.attempt + 1 >= 3) {
      // exhaust card: mutate deck BEFORE setState
      const card = deckRef.current[0]
      if (!card) return
      deckRef.current = deckRef.current.slice(1)
      const newTimeline = sortByYear([...state.timeline, { ...card, failed: true }])
      const newUsed = new Set([...state.usedIds, card.id])
      const finished = deckRef.current.length === 0
      setState((prev) => ({
        ...prev,
        timeline: newTimeline,
        usedIds: newUsed,
        insertIdx: null,
        feedback: 'wrong',
        chrono: initialTime,
        timerActive: !finished,
        attempt: 0,
        finished,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        attempt: prev.attempt + 1,
        insertIdx: null,
        feedback: 'wrong',
        chrono: initialTime,
        timerActive: true,
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chrono])

  // ── slot click ─────────────────────────────────────────────────────────────
  function handleSlotClick(idx) {
    setState((prev) => ({ ...prev, insertIdx: idx }))
  }

  // ── check placement ────────────────────────────────────────────────────────
  // Reads state directly (safe: only called from synchronous user click events).
  // All deckRef mutations happen BEFORE setState so StrictMode double-invocation
  // of the setState callback cannot corrupt the deck.
  function handleCheck() {
    if (state.insertIdx === null) return
    clearInterval(timerRef.current)

    const card = deckRef.current[0]
    if (!card) return

    const { timeline, insertIdx, attempt } = state
    const left = timeline[insertIdx - 1]
    const right = timeline[insertIdx]
    const ok =
      (!left || left.year <= card.year) &&
      (!right || card.year <= right.year)

    if (ok) {
      const pts = attempt === 0 ? 10 : 5
      // mutate deck before setState
      deckRef.current = deckRef.current.slice(1)
      const newTimeline = sortByYear([
        ...timeline.slice(0, insertIdx),
        card,
        ...timeline.slice(insertIdx),
      ])
      const newUsed = new Set([...state.usedIds, card.id])
      const finished = deckRef.current.length === 0
      setState((prev) => ({
        ...prev,
        timeline: newTimeline,
        usedIds: newUsed,
        insertIdx: null,
        feedback: 'correct',
        score: prev.score + pts,
        chrono: initialTime,
        timerActive: !finished,
        attempt: 0,
        finished,
      }))
    } else if (attempt + 1 >= 3) {
      // mutate deck before setState
      deckRef.current = deckRef.current.slice(1)
      const newTimeline = sortByYear([...timeline, { ...card, failed: true }])
      const newUsed = new Set([...state.usedIds, card.id])
      const finished = deckRef.current.length === 0
      setState((prev) => ({
        ...prev,
        timeline: newTimeline,
        usedIds: newUsed,
        insertIdx: null,
        feedback: 'wrong',
        chrono: initialTime,
        timerActive: !finished,
        attempt: 0,
        finished,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        attempt: prev.attempt + 1,
        insertIdx: null,
        feedback: 'wrong',
        chrono: initialTime,
        timerActive: true,
      }))
    }
  }

  // ── reset ──────────────────────────────────────────────────────────────────
  function handleReset() {
    clearInterval(timerRef.current)
    setState(buildInitialState())
  }

  const totalCards = animeCards.length - 2
  const currentIdx = animeCards.length - 2 - deckRef.current.length + 1

  return {
    timeline: state.timeline,
    currentCard,
    insertIdx: state.insertIdx,
    feedback: state.feedback,
    score: state.score,
    chrono: state.chrono,
    attempt: state.attempt,
    finished: state.finished,
    totalCards,
    currentIdx,
    handleSlotClick,
    handleCheck,
    handleReset,
    initialTime,
  }
}
