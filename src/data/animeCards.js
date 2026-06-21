import ANIME_OPENINGS from './animeOpenings'

// Map the rich openings dataset to the game's card format.
// Keeps all original fields (youtubeId, alternativeIds, previewStart…)
// and adds the aliases the game uses: year, img, song, youtube.
const animeCards = ANIME_OPENINGS.map(opening => ({
  ...opening,
  year:     new Date(opening.japanAirDate).getFullYear(),
  img:      opening.image,
  youtube:  opening.youtubeUrl,
  song:     opening.titleRomaji,
  audioSrc:   `/audio/${opening.youtubeId}.mp3`,
  spotifySrc: null,
}))

export default animeCards
