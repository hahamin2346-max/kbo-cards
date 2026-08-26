import { describe, expect, it } from 'vitest'
import { NO_MATCH_MESSAGE, teamsData, rosterTeams, filterPlayers, findRosterTeam } from './data'

describe('KBO card roster data', () => {
  it('builds a unique roster from both seasons', () => {
    expect(teamsData.length).toBeGreaterThanOrEqual(10)
    expect(rosterTeams[0].id).toBe('all')
    const keys = rosterTeams[0].players.map((player) => `${player.name}-${player.number}`)
    expect(new Set(keys).size).toBe(keys.length)
    expect(rosterTeams[0].players.length).toBe(237)
  })

  it('filters by the selected team before applying search', () => {
    const team = findRosterTeam('한화')
    expect(team.players.every((player) => player.team === '한화')).toBe(true)
    expect(filterPlayers(team.players, ' 노시환 ')).toHaveLength(1)
    expect(filterPlayers(team.players, '박해민')).toEqual([])
    expect(NO_MATCH_MESSAGE).toBe('해당 선수를 찾지 못했습니다.')
  })
})
