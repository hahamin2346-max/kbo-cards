import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './cards.css'
import { VALID_CREDENTIALS, NO_MATCH_MESSAGE, teamsData, findTeam, filterPlayers } from './data'

const Icon = ({ children }) => <span className="icon" aria-hidden="true">{children}</span>

function Login({ onLogin }) {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (id === VALID_CREDENTIALS.id && password === VALID_CREDENTIALS.password) onLogin()
    else setError('아이디 또는 비밀번호를 확인해 주세요.')
  }
  return <main className="login-page"><div className="orb orb-top" /><div className="orb orb-bottom" />
    <section className="login-card" aria-labelledby="login-title">
      <div className="brand">SAST</div><h1 id="login-title">다시 만나서 반가워요</h1><p className="subtext">서비스를 이용하려면 로그인해 주세요.</p>
      <form onSubmit={submit}>
        <label>아이디<input value={id} onChange={(e) => { setId(e.target.value); setError('') }} placeholder="아이디를 입력해 주세요" autoComplete="username" /></label>
        <label>비밀번호<input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} placeholder="비밀번호를 입력해 주세요" autoComplete="current-password" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit">로그인</button>
      </form>
      <div className="account-links"><button type="button">회원가입</button><span>·</span><button type="button" className="muted-link">비밀번호 찾기</button></div>
      <p className="security-note">안전한 로그인을 위해 개인정보를 보호합니다.</p>
    </section>
  </main>
}

function TeamSelect({ team, onChange }) {
  const [open, setOpen] = useState(false)
  return <div className="team-select"><button className="select-button" onClick={() => setOpen(!open)} aria-expanded={open}><span><small>구단 선택</small><strong style={{ color: team.color }}>{team.name}</strong></span><Icon>⌄</Icon></button>
    {open && <div className="select-menu">{teamsData.map((item) => <button key={item.id} onClick={() => { onChange(item.id); setOpen(false) }} className={item.id === team.id ? 'selected' : ''}>{item.name}</button>)}</div>}
  </div>
}

const cardSets = {
  '2026': ['노말(홈)', '노말(어웨이)', '알파벳', '홀로', '승리부적'],
  '2026+': ['노말', '레코드', '홀로', '승리부적'],
}

function CardsPage({ team, onBack }) {
  const [season, setSeason] = useState('2026')
  const [owned, setOwned] = useState(() => ({}))
  const columns = cardSets[season]
  const toggleCard = (playerId, cardName) => setOwned((current) => ({ ...current, [`${playerId}-${cardName}`]: !current[`${playerId}-${cardName}`] }))
  return <main className="cards-page"><header className="cards-header"><div><div className="brand">SAST <span>BASEBALL</span></div><h1>KBO 카드</h1><p>좋아하는 선수와 구단의 카드를 모아보세요</p></div><button className="back-button" onClick={onBack}>← 대시보드로</button></header>
    <div className="season-selector" role="tablist" aria-label="카드 시즌 선택">{['2025', '2026', '2026+'].map((item) => <button key={item} className={season === item ? 'active' : ''} onClick={() => setSeason(item)} role="tab" aria-selected={season === item}>{item}</button>)}</div>
    {season === '2025' ? <section className="cards-empty"><h2>카드 리스트가 없습니다.</h2><p>다른 시즌을 선택해 주세요.</p></section> : <section className="card-list-area"><div className="card-list-heading"><h2>{season} 카드 목록</h2><span>선수별 카드 보유 현황 · {team.name}</span></div><div className="card-table"><div className="card-table-row card-table-header" style={{ gridTemplateColumns: `1fr 1.5fr repeat(${columns.length}, 1fr)` }}><span>등번호</span><span>선수이름</span>{columns.map((column) => <span key={column}>{column}</span>)}</div>{team.players.map((player) => <div className="card-table-row" style={{ gridTemplateColumns: `1fr 1.5fr repeat(${columns.length}, 1fr)` }} key={player.id}><span>{player.number}</span><strong>{player.name}</strong>{columns.map((column) => <label className="card-check" key={column}><input type="checkbox" checked={Boolean(owned[`${player.id}-${column}`])} onChange={() => toggleCard(player.id, column)} aria-label={`${player.name} ${column} 카드 보유`} /><span /></label>)}</div>)}</div></section>}
  </main>
}

function Dashboard({ onLogout, onCards }) {
  const [teamId, setTeamId] = useState(teamsData[0].id)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(teamsData[0].players[0].id)
  const team = findTeam(teamId)
  const players = filterPlayers(team.players, query)
  const selected = team.players.find((player) => player.id === selectedId) ?? team.players[0]
  const changeTeam = (nextId) => { setTeamId(nextId); setSelectedId(findTeam(nextId).players[0].id); setQuery('') }
  return <main className="dashboard-page"><header className="dashboard-header"><div><div className="brand">SAST <span>BASEBALL</span></div><h1>KBO 팬 대시보드</h1><p>2026 시즌 기준 · 응원하는 구단의 로스터와 선수 정보를 한눈에 확인하세요</p></div><div className="header-actions"><TeamSelect team={team} onChange={changeTeam} /><button className="logout" onClick={onLogout}>로그아웃</button></div></header>
    <div className="dashboard-content"><section className="roster-panel panel"><div className="panel-heading"><div><h2>선수 로스터</h2><span>{team.players.length}명</span></div><span className="team-dot" style={{ background: team.color }}>{team.mark}</span></div><label className="search"><Icon>⌕</Icon><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="선수 이름 검색" aria-label="선수 이름 검색" /></label><div className="roster-list">{players.length ? players.map((player) => <button key={player.id} className={`player-row ${selected.id === player.id ? 'active' : ''}`} onClick={() => setSelectedId(player.id)}><span className="avatar" style={{ background: selected.id === player.id ? team.color : '#e5eaf2' }}>{player.name.slice(0, 1)}</span><span className="player-info"><strong>{player.name}</strong><small>{player.position} · {player.number}번</small></span><Icon>›</Icon></button>) : <p className="no-match">{NO_MATCH_MESSAGE}</p>}</div><button className="cards-button" onClick={() => onCards(team)}>KBO 카드</button></section>
      <section className="profile-panel panel"><div className="profile-top"><span className="large-avatar" style={{ background: team.color }}>{selected.name.slice(0, 1)}</span><div><span className="eyebrow">{team.name} · {selected.number}번</span><h2>{selected.name}</h2><p>{selected.position} <i>●</i> {selected.status}</p></div></div><div className="stats-heading"><h3>시즌 주요 기록</h3><span>2026 Regular Season</span></div><div className="stats-grid">{selected.stats.map(([label, value]) => <div className="stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="profile-note">선수 상세 기록과 최근 경기 데이터는<br />다음 업데이트에서 제공될 예정입니다.</div></section></div>
  </main>
}

function App() { const [loggedIn, setLoggedIn] = useState(false); const [page, setPage] = useState('dashboard'); const [cardsTeam, setCardsTeam] = useState(teamsData[0]); if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />; return page === 'cards' ? <CardsPage team={cardsTeam} onBack={() => setPage('dashboard')} /> : <Dashboard onLogout={() => { setLoggedIn(false); setPage('dashboard') }} onCards={(team) => { setCardsTeam(team); setPage('cards') }} /> }
createRoot(document.getElementById('root')).render(<App />)
