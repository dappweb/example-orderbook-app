import { BSC_MARKET_MANAGER_API_BASE } from '@/config/bsc'

export type BscParticipant = {
  image: string | null
  name: string
}

export type BscGame = {
  id: string
  gameId: string
  slug: string
  title: string
  startsAt: string
  state: 'Prematch' | 'Live' | 'Finished' | 'Stopped' | 'Canceled'
  status: 'Created' | 'Resolved' | 'Canceled' | 'Paused'
  turnover: string
  sport: {
    sportId: string
    slug: string
    name: string
    sporthub?: {
      id: string
      slug: 'sports' | 'esports'
    }
  }
  country: {
    id: string
    slug: string
    name: string
  }
  league: {
    id: string
    slug: string
    name: string
    country: {
      id: string
      slug: string
      name: string
    }
  }
  participants: BscParticipant[]
}

export type BscNavigationSport = {
  id: number
  sportId: string
  slug: string
  name: string
  activeGamesCount: number
  activeLiveGamesCount: number
  activePrematchGamesCount: number
}

type RawBscGame = Omit<BscGame, 'league' | 'status'> & {
  league: Omit<BscGame['league'], 'country'>
}

function normalizeGame(game: RawBscGame): BscGame {
  return {
    ...game,
    participants: game.participants.map((participant) => ({
      ...participant,
      image: null,
    })),
    status:
      game.state === 'Canceled'
        ? 'Canceled'
        : game.state === 'Finished' || game.state === 'Stopped'
          ? 'Resolved'
          : 'Created',
    league: {
      ...game.league,
      country: game.country,
    },
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BSC_MARKET_MANAGER_API_BASE}${path}`, {
    cache: 'no-cache',
    ...init,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`BSC market-manager request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getBscNavigation() {
  const data = await request<{ sports: BscNavigationSport[] }>(
    '/market-manager/navigation?sportHub=sports'
  )
  return data.sports
}

export async function getBscGames(sportSlug?: string, query?: string) {
  const searchParams = new URLSearchParams({
    state: 'Prematch',
    sportHub: 'sports',
    perPage: '100',
    orderBy: 'startsAt',
    orderDirection: 'asc',
  })

  if (sportSlug) searchParams.set('sportSlug', sportSlug)

  const data = await request<{
    games: RawBscGame[]
  }>(`/market-manager/games?${searchParams}`)

  const games = data.games.map(normalizeGame)

  if (!query) return games

  const regex = new RegExp(query, 'i')
  return games.filter((game) => regex.test(game.title))
}

export async function getBscGame(gameId: string) {
  const data = await request<{ games: RawBscGame[] }>(
    '/market-manager/games-by-ids',
    {
      method: 'POST',
      body: JSON.stringify({ gameIds: [gameId] }),
    }
  )

  return data.games[0] ? normalizeGame(data.games[0]) : undefined
}
