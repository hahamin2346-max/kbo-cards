import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './cards.css'
import './collection.css'
import { CARD_SCHEMAS, NO_MATCH_MESSAGE, rosterTeams, findRosterTeam, filterPlayers, getCardPlayers, getCollectionStats } from './data'

const Icon = ({ children }) => <span className="icon" aria-hidden="true">{children}</span>
const formatNumber = (value) => Number.isInteger(value) ? value : value.toFixed(1)

function TeamSelect({ team, onChange }) {
  const [open, setOpen] = useState(false)
  return <div className="team-select"><button className="select-button" onClick={() => setOpen(!open)} aria-expanded={open}><span><small>구단 선택</small><strong style={{ color: team.color }}>{team.name}</strong></span><Icon>⌄</Icon></button>
    {open && <div className="select-menu">{rosterTeams.map((item) => <button key={item.id} onClick={() => { onChange(item.id); setOpen(false) }} className={item.id === team.id ? 'selected' : ''}>{item.name}</button>)}</div>}
  </div>
}

function CollectionParameters({ owned }) {
  const stats = getCollectionStats(owned, 'all')
  const total = stats['2026'].total + stats['2026+'].total
  const collected = stats['2026'].collected + stats['2026+'].collected
  return <section className="collection-parameters panel"><div className="panel-heading"><div><h2>수집 파라미터</h2><span>카드 페이지 기준</span></div></div><div className="total-cards"><strong>{collected}장 보유</strong><small>총 카드수 {total}장</small></div><div className="season-parameters">{Object.entries(stats).map(([season, value]) => <div className={`season-parameter season-${season === '2026' ? '2026' : 'plus'}`} key={season}><h3>{season}</h3><span>{season === '2026' ? '시즌 카드' : '확장 카드'}</span><dl><div><dt>보유 카드수</dt><dd>{value.collected}장</dd></div><div><dt>구매한 팩 수</dt><dd>{formatNumber(value.packs)}팩</dd></div><div><dt>구매한 박스 수</dt><dd>{formatNumber(value.boxes)}박스</dd></div><div><dt>수집률</dt><dd>{value.total ? `${Math.round(value.collected / value.total * 100)}%` : '0%'}</dd></div></dl></div>)}</div></section>
}

function CardsPage({ owned, setOwned, onBack }) {
  const [season, setSeason] = useState('2026')
  const [cardTeamId, setCardTeamId] = useState('all')
  const [floatingPosition, setFloatingPosition] = useState(null)
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const team = findRosterTeam(cardTeamId)
  const players = getCardPlayers(season, cardTeamId)
  const schema = CARD_SCHEMAS[season]
  const stats = getCollectionStats(owned, cardTeamId)[season]
  const toggleCard = (playerId, cardKey) => { const key = `${season}-${playerId}-${cardKey}`; setOwned((current) => ({ ...current, [key]: !current[key] })) }
  const startDragging = (event) => { if (event.button !== 0) return; const rect = event.currentTarget.getBoundingClientRect(); dragOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true) }
  const dragFloating = (event) => { if (!dragging) return; const width = event.currentTarget.offsetWidth; const height = event.currentTarget.offsetHeight; setFloatingPosition({ x: Math.max(0, Math.min(event.clientX - dragOffset.current.x, globalThis.innerWidth - width)), y: Math.max(0, Math.min(event.clientY - dragOffset.current.y, globalThis.innerHeight - height)) }) }
  const stopDragging = (event) => { if (!dragging) return; event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false) }
  return <main className="cards-page"><header className="cards-header"><div><h1>KBO 카드</h1><p>좋아하는 선수와 구단의 카드를 모아보세요 · {team.name}</p></div><div className="cards-header-actions"><TeamSelect team={team} onChange={setCardTeamId} /><button className="back-button" onClick={onBack}>← 대시보드로</button></div></header>
    <div className="season-selector" role="tablist" aria-label="카드 시즌 선택">{Object.keys(CARD_SCHEMAS).map((item) => <button key={item} className={`season-tab ${item === '2026+' ? 'season-plus' : 'season-2026'} ${season === item ? 'active' : ''}`} onClick={() => setSeason(item)} role="tab" aria-selected={season === item}>{item}</button>)}</div>
    <section className="card-list-area"><div className="card-list-heading"><h2>{season} 카드 목록</h2><span>{team.name} · {stats.collected} / {stats.total}장 보유</span></div><div className="card-table"><div className="card-table-row card-table-header" style={{ gridTemplateColumns: `70px 1.5fr repeat(${schema.length}, 1fr)` }}><span>번호</span><span>선수이름</span>{schema.map(([, label]) => <span key={label}>{label}</span>)}</div>{players.map((player) => <div className="card-table-row" style={{ gridTemplateColumns: `70px 1.5fr repeat(${schema.length}, 1fr)` }} key={player.id}><span>{player.number}</span><strong>{player.name}</strong>{schema.map(([key, label]) => <span className="card-check" key={key}>{player.versions[key] && <label><input type="checkbox" checked={Boolean(owned[`${season}-${player.id}-${key}`])} onChange={() => toggleCard(player.id, key)} aria-label={`${player.name} ${label} 카드 보유`} /><span /></label>}</span>)}</div>)}</div></section>
    <aside className={`collection-floating panel ${dragging ? 'is-dragging' : ''}`} style={floatingPosition ? { left: floatingPosition.x, top: floatingPosition.y, right: 'auto', bottom: 'auto' } : undefined} onPointerDown={startDragging} onPointerMove={dragFloating} onPointerUp={stopDragging} onPointerCancel={stopDragging} aria-label="카드 수집률 박스. 드래그해서 이동할 수 있습니다."><div className="collection-summary-copy"><strong>{season} 카드 수집률</strong><span>{stats.collected} / {stats.total}장 보유</span><small>수집률 {stats.total ? Math.round(stats.collected / stats.total * 100) : 0}%</small></div><div className="collection-donut" style={{ '--collection-progress': `${stats.total ? stats.collected / stats.total * 100 : 0}%` }}><b>{stats.total ? Math.round(stats.collected / stats.total * 100) : 0}%</b></div></aside>
  </main>
}

function Dashboard({ teamId, onTeamChange, owned, onCards }) {
  const team = findRosterTeam(teamId)
  const [query, setQuery] = useState('')
  const players = filterPlayers(team.players, query)
  return <main className="dashboard-page"><header className="dashboard-header"><div><h1>KBO 대시보드</h1><p>2026 시즌 기준 · 응원하는 구단의 로스터와 선수 정보를 한눈에 확인하세요</p></div><div className="header-actions"><TeamSelect team={team} onChange={(nextId) => { onTeamChange(nextId); setQuery('') }} /></div></header>
    <div className="dashboard-content"><section className="roster-panel panel"><div className="panel-heading"><div><h2>선수 로스터</h2><span>{team.players.length}명</span></div><span className="team-dot" style={{ background: team.color }}>{team.mark}</span></div><label className="search"><Icon>⌕</Icon><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="선수 이름 검색" aria-label="선수 이름 검색" /></label><div className="roster-list">{players.length ? players.map((player) => <div key={player.id} className="player-row"><span className="player-number">{player.number}</span><span className="player-info"><strong>{player.name}</strong></span></div>) : <p className="no-match">{NO_MATCH_MESSAGE}</p>}</div><button className="cards-button" onClick={() => onCards()}>KBO 카드</button></section><CollectionParameters owned={owned} /></div>
  </main>
}

function App() {
  const [page, setPage] = useState('dashboard')
  const [teamId, setTeamId] = useState(rosterTeams[0].id)
  const [owned, setOwned] = useState(() => { try { return JSON.parse(globalThis.localStorage.getItem('kbo-owned-cards')) ?? {} } catch { return {} } })
  useEffect(() => { globalThis.localStorage.setItem('kbo-owned-cards', JSON.stringify(owned)) }, [owned])
  return page === 'cards' ? <CardsPage owned={owned} setOwned={setOwned} onBack={() => setPage('dashboard')} /> : <Dashboard teamId={teamId} onTeamChange={setTeamId} owned={owned} onCards={() => setPage('cards')} />
}

createRoot(document.getElementById('root')).render(<App />)
