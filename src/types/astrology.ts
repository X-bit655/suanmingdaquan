export interface AstrologyInput {
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthMinute: number
  city: string
}

export interface PlanetPosition {
  planet: string
  sign: string
  house: number
  degree: number
}

export interface AstrologyCalculatedData {
  sunSign: string
  moonSign: string
  risingSign: string
  planets: PlanetPosition[]
  houses: string[]
}
