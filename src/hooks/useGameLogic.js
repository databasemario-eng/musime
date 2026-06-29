import { useState, useEffect, useRef, useCallback } from 'react'
import { buildCardSet } from '../data/packs'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sortByYear(arr) {
  return [...arr].sort((a, b) => a.year - b.year || a.id - b.id)
}

// packIds: array of pack ids to play with, e.g. ['base'] or ['base','onepiece']
export default function useGameLogic(mode = 'normal', packIds = ['base']) {
  const timeLimit = mode === 'yamete' ? 15 : 10
  const maxAttempts = mode === 'yamete' ? 1 : 2

  const deckRef = useRef([])

  const buildInitialState = useCallback(() => {
    const allCards = buildCardSet(packIds)
    const shuffled = shuffle(allCards)
    const first = shuffled[0]
    let second = shuffled[1]
    let i = 2
    while (second.year === first.year && i < shuffled.length) {
      second = shuffled[i++]
    }
    const initialTimeline = sortByYear([first, second])
    const usedIds = new Set([first.id, second.id])
    deckRef.current = shuffled.filter(c => !usedIds.has(c.id))
    return {
      timeline: initialTimeline,
      score: 0,
      attempts: 0,
      totalFails: 0,
      chrono: timeLimit,
      timerActive: false,
      insertIdx: null,
      feedback: null,
      gameOver: false,
      hintUsed: false,
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimit, packIds.join(',')])

  const [state, setState] = useState(buildInitialState)

  const currentCard = deckRef.current[0] ?? null

  const timerRef = useRef(null)

  useEffect(() => {
    if (!state.timerActive || state.gameOver) return
    timerRef.current = setInterval(() => {
      setState(prev => ({ ...prev, chrono: prev.chrono - 1 }))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [state.timerActive, state.gameOver])

  // Handle chrono reaching 0
  useEffect(() => {
    if (state.chrono > 0 || !state.timerActive || state.gameOver) return
    clearInterval(timerRef.current)

    if (mode === 'yamete') {
      setState(prev => ({ ...prev, feedback: 'timeout', timerActive: false, gameOver: true }))
      return
    }

    const newAttempts = state.attempts + 1
    if (newAttempts >= maxAttempts) {
      deckRef.current = deckRef.current.slice(1)
      const newTotalFails = state.totalFails + 1
      const isGameOver = newTotalFails >= 2
      setState(prev => ({
        ...prev,
        attempts: 0,
        totalFails: newTotalFails,
        feedback: 'timeout',
        insertIdx: null,
        chrono: timeLimit,
        timerActive: false,
        gameOver: isGameOver,
        hintUsed: false,
      }))
    } else {
      setState(prev => ({
        ...prev,
        attempts: newAttempts,
        feedback: 'timeout',
        insertIdx: null,
        chrono: timeLimit,
        timerActive: false,
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.chrono])

  function handleSlotClick(idx) {
    setState(prev => ({ ...prev, insertIdx: idx }))
  }

  function handleCheck() {
    if (state.insertIdx === null) return
    clearInterval(timerRef.current)

    const card = deckRef.current[0]
    if (!card) return

    const { timeline, insertIdx } = state
    const left = timeline[insertIdx - 1]
    const right = timeline[insertIdx]
    const ok =
      (!left || left.year <= card.year) &&
      (!right || card.year <= right.year)

    if (ok) {
      deckRef.current = deckRef.current.slice(1)
      const newTimeline = sortByYear([...timeline, card])
      setState(prev => ({
        ...prev,
        timeline: newTimeline,
        score: prev.score + 1,
        attempts: 0,
        hintUsed: false,
        insertIdx: null,
        feedback: 'correct',
        chrono: timeLimit,
        timerActive: false,
      }))
      return
    }

    if (mode === 'yamete') {
      setState(prev => ({ ...prev, feedback: 'wrong', timerActive: false, gameOver: true }))
      return
    }

    const newAttempts = state.attempts + 1
    if (newAttempts >= maxAttempts) {
      deckRef.current = deckRef.current.slice(1)
      const newTotalFails = state.totalFails + 1
      const isGameOver = newTotalFails >= 2
      setState(prev => ({
        ...prev,
        attempts: 0,
        totalFails: newTotalFails,
        feedback: 'wrong',
        insertIdx: null,
        chrono: timeLimit,
        timerActive: false,
        gameOver: isGameOver,
        hintUsed: false,
      }))
    } else {
      setState(prev => ({
        ...prev,
        attempts: newAttempts,
        feedback: 'wrong',
        insertIdx: null,
        chrono: timeLimit,
        timerActive: false,
      }))
    }
  }

  function handleHint() {
    setState(prev => ({
      ...prev,
      hintUsed: true,
      score: Math.max(0, prev.score - 1),
    }))
  }

  function handleStartAudio() {
    setState(prev => ({ ...prev, timerActive: true }))
  }

  function nextCard() {
    setState(prev => ({
      ...prev,
      insertIdx: null,
      chrono: timeLimit,
      timerActive: false,
      feedback: null,
    }))
  }

  function handleReset() {
    clearInterval(timerRef.current)
    setState(buildInitialState())
  }

  return {
    timeline: state.timeline,
    currentCard,
    score: state.score,
    attempts: state.attempts,
    totalFails: state.totalFails,
    chrono: state.chrono,
    timerActive: state.timerActive,
    insertIdx: state.insertIdx,
    feedback: state.feedback,
    gameOver: state.gameOver,
    hintUsed: state.hintUsed,
    timeLimit,
    totalCards: deckRef.current.length + state.timeline.length,
    handleSlotClick,
    handleCheck,
    handleHint,
    handleStartAudio,
    nextCard,
    handleReset,
  }
}
