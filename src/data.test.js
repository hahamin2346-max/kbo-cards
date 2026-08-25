import { describe, expect, it } from 'vitest'
import { VALID_CREDENTIALS, NO_MATCH_MESSAGE, teamsData, filterPlayers, findTeam } from './data'

describe('KBO mock domain', () => {
  it('accepts only the documented credentials', () => {
    expect(VALID_CREDENTIALS).toEqual({ id: 'user1234', password: 'pw1234' })
    expect(VALID_CREDENTIALS.password).not.toBe('password')
  })
  it('provides ten teams with six selectable players each', () => {
    expect(teamsData).toHaveLength(10)
    expect(teamsData.every((team) => team.players.length === 6)).toBe(true)
  })
  it('resolves a team and filters only its players', () => {
    const team = findTeam('한화 이글스')
    expect(team.players).toHaveLength(6)
    expect(filterPlayers(team.players, ' 노시환 ')).toHaveLength(1)
    expect(filterPlayers(team.players, '없는 선수')).toEqual([])
    expect(NO_MATCH_MESSAGE).toBe('해당 선수를 찾지 못했습니다.')
  })
})
