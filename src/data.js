const teams = [
  ['한화 이글스', '한', '#F15A24', ['노시환', '문현빈', '채은성', '류현진', '김태연', '황영묵']],
  ['LG 트윈스', 'L', '#1B3C8C', ['오지환', '문성주', '홍창기', '김현수', '박동원', '임찬규']],
  ['두산 베어스', '두', '#13294B', ['양의지', '김재환', '허경민', '정수빈', '곽빈', '최원준']],
  ['삼성 라이온즈', '삼', '#074CA1', ['구자욱', '강민호', '원태인', '김영웅', '이재현', '디아즈']],
  ['롯데 자이언츠', '롯', '#041E42', ['전준우', '손호영', '윤동희', '박세웅', '나승엽', '유강남']],
  ['KIA 타이거즈', 'K', '#EA0029', ['김도영', '최형우', '나성범', '양현종', '박찬호', '한준수']],
  ['SSG 랜더스', 'S', '#CE0E2D', ['최정', '한유섬', '박성한', '최지훈', '김광현', '조형우']],
  ['KT 위즈', 'K', '#000000', ['박병호', '장성우', '황재균', '강백호', '고영표', '소형준']],
  ['NC 다이노스', 'N', '#315288', ['박민우', '손아섭', '박건우', '김주원', '구창모', '신민혁']],
  ['키움 히어로즈', '키', '#570514', ['송성문', '이주형', '김건희', '안우진', '최주환', '김재현']],
]
const positions = ['내야수', '외야수', '외야수', '투수', '내야수', '포수']

// 화면 실습용 데이터는 이 파일에서만 관리합니다.
export const teamsData = teams.map(([name, mark, color, roster], teamIndex) => ({
  id: name,
  name,
  mark,
  color,
  players: roster.map((playerName, index) => ({
    id: `${teamIndex}-${index}`,
    name: playerName,
    position: positions[index],
    status: index === 3 ? '선발 로테이션' : '1군 엔트리',
    number: String(1 + index * 3 + teamIndex),
    stats: index === 3
      ? [['ERA', `${2.8 + teamIndex / 10}`], ['승리', `${8 + teamIndex}`], ['탈삼진', `${74 + teamIndex * 4}`], ['이닝', `${96 + teamIndex * 2}.1`]]
      : [['타율', `.${268 + teamIndex * 7}`], ['홈런', `${8 + index + teamIndex}`], ['타점', `${31 + teamIndex * 3}`], ['출루율', `.${348 + teamIndex * 5}`]],
  })),
}))

export const VALID_CREDENTIALS = { id: 'user1234', password: 'pw1234' }
export const NO_MATCH_MESSAGE = '해당 선수를 찾지 못했습니다.'
export const findTeam = (teamId) => teamsData.find((team) => team.id === teamId) ?? teamsData[0]
export const filterPlayers = (players, query) => {
  const normalized = query.trim().toLocaleLowerCase()
  return normalized ? players.filter((player) => player.name.toLocaleLowerCase().includes(normalized)) : players
}
