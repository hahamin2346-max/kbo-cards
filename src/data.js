import cardData from '../cardData.json'

const teamMeta = {
  한화: ['한화 이글스', '한', '#F15A24'], LG: ['LG 트윈스', 'L', '#1B3C8C'], 두산: ['두산 베어스', '두', '#13294B'], 삼성: ['삼성 라이온즈', '삼', '#074CA1'], 롯데: ['롯데 자이언츠', '롯', '#041E42'], KIA: ['KIA 타이거즈', 'K', '#EA0029'], SSG: ['SSG 랜더스', 'S', '#CE0E2D'], KT: ['KT 위즈', 'K', '#000000'], NC: ['NC 다이노스', 'N', '#315288'], 키움: ['키움 히어로즈', '키', '#570514'], 스페셜: ['스페셜', 'S', '#667085'],
}

export const CARD_SCHEMAS = {
  '2026': [['normal-H', '노말(홈)'], ['normal-A', '노말(어웨이)'], ['alphabet', '알파벳'], ['holo', '홀로'], ['winningTalisman', '승리부적']],
  '2026+': [['normal', '노말'], ['record', '레코드'], ['holo', '홀로'], ['winningTalisman', '승리부적']],
}

export const cardPlayersBySeason = Object.fromEntries(Object.entries(cardData).map(([season, players]) => [season, players.map((player) => ({
  ...player,
  id: `${player.team}-${player.number}-${player.name}`,
  number: String(player.number),
}))]))

const uniquePlayers = [...new Map(Object.values(cardPlayersBySeason).flat().map((player) => [`${player.name}-${player.number}`, player])).values()]
const toTeam = (teamCode, players) => { const [name, mark, color] = teamMeta[teamCode] ?? [teamCode, teamCode.slice(0, 1), '#667085']; return { id: teamCode, name, mark, color, players } }

export const teamsData = Object.keys(teamMeta).map((teamCode) => toTeam(teamCode, uniquePlayers.filter((player) => player.team === teamCode)))
export const rosterTeams = [{ id: 'all', name: '전체', mark: '전체', color: '#4F6BFF', players: uniquePlayers }, ...teamsData]
export const getCardPlayers = (season, teamId) => cardPlayersBySeason[season].filter((player) => !teamId || teamId === 'all' || player.team === teamId)
export const getCollectionStats = (owned, teamId) => Object.fromEntries(Object.keys(CARD_SCHEMAS).map((season) => {
  const players = getCardPlayers(season, teamId)
  const total = players.reduce((count, player) => count + CARD_SCHEMAS[season].filter(([key]) => player.versions[key]).length, 0)
  const collected = players.reduce((count, player) => count + CARD_SCHEMAS[season].filter(([key]) => player.versions[key] && owned[`${season}-${player.id}-${key}`]).length, 0)
  return [season, { collected, total, packs: collected / 3, boxes: collected / 3 / (season === '2026' ? 30 : 20) }]
}))

export const NO_MATCH_MESSAGE = '해당 선수를 찾지 못했습니다.'
export const findRosterTeam = (teamId) => rosterTeams.find((team) => team.id === teamId) ?? rosterTeams[0]
export const filterPlayers = (players, query) => { const normalized = query.trim().toLocaleLowerCase(); return normalized ? players.filter((player) => player.name.toLocaleLowerCase().includes(normalized)) : players }
