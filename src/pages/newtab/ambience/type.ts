type RainVariant = 'dense' | 'porch' | 'dripping' | 'shack' | 'gutter'
type ThunderVariant = 'calm' | 'loud'
type FireVariant = 'calm' | 'crackling'
type RiverVariant = 'calm' | 'strong'
type WavesVariant = 'beach' | 'slow'
type NightVariant = 'meadow' | 'suburban'
type FrogVariant = 'cricket' | 'chorus' | 'natterjack' | 'wood'
type BirdVariant = 'blackbird' | 'nightingale' | 'crow'
type ForestVariant = 'evening' | 'eerie'
type WindVariant = 'steady' | 'howling'
type LeavesVariant = 'soft' | 'crunch'
type FootstepsVariant = 'gravel' | 'snow' | 'pavement'
type TrainVariant = 'slow' | 'fast'
type RestaurantVariant = 'english' | 'french' | 'german' | 'pub'
type NoiseVariant = 'white' | 'pink' | 'brown'
type ConstructionVariant = 'house' | 'city'

type Rain = {
  type: 'rain'
  variant: RainVariant
}

type Thunder = {
  type: 'thunder'
  variant: ThunderVariant
}

type Fire = {
  type: 'fire'
  variant: FireVariant
}

type River = {
  type: 'river'
  variant: RiverVariant
}

type Waves = {
  type: 'waves'
  variant: WavesVariant
}

type Night = {
  type: 'night'
  variant: NightVariant
}

type Frog = {
  type: 'frog'
  variant: FrogVariant
}

type Bird = {
  type: 'bird'
  variant: BirdVariant
}

type Forest = {
  type: 'forest'
  variant: ForestVariant
}

type Wind = {
  type: 'wind'
  variant: WindVariant
}

type Leaves = {
  type: 'leaves'
  variant: LeavesVariant
}

type Footsteps = {
  type: 'footsteps'
  variant: FootstepsVariant
}

type Train = {
  type: 'train'
  variant: TrainVariant
}

type Restaurant = {
  type: 'restaurant'
  variant: RestaurantVariant
}

type Noise = {
  type: 'noise'
  variant: NoiseVariant
}

type Construction = {
  type: 'construction'
  variant: ConstructionVariant
}

type Ambience =
  | Rain
  | Thunder
  | Fire
  | River
  | Waves
  | Night
  | Frog
  | Bird
  | Forest
  | Wind
  | Leaves
  | Footsteps
  | Train
  | Restaurant
  | Noise
  | Construction

type ListRain = {
  type: 'rain'
  variant: RainVariant[]
}

type ListThunder = {
  type: 'thunder'
  variant: ThunderVariant[]
}

type ListFire = {
  type: 'fire'
  variant: FireVariant[]
}

type ListRiver = {
  type: 'river'
  variant: RiverVariant[]
}

type ListWaves = {
  type: 'waves'
  variant: WavesVariant[]
}

type ListNight = {
  type: 'night'
  variant: NightVariant[]
}

type ListFrog = {
  type: 'frog'
  variant: FrogVariant[]
}

type ListBird = {
  type: 'bird'
  variant: BirdVariant[]
}

type ListForest = {
  type: 'forest'
  variant: ForestVariant[]
}

type ListWind = {
  type: 'wind'
  variant: WindVariant[]
}

type ListLeaves = {
  type: 'leaves'
  variant: LeavesVariant[]
}

type ListFootsteps = {
  type: 'footsteps'
  variant: FootstepsVariant[]
}

type ListTrain = {
  type: 'train'
  variant: TrainVariant[]
}

type ListRestaurant = {
  type: 'restaurant'
  variant: RestaurantVariant[]
}

type ListNoise = {
  type: 'noise'
  variant: NoiseVariant[]
}

type ListConstruction = {
  type: 'construction'
  variant: ConstructionVariant[]
}

type ListAmbience =
  | ListRain
  | ListNoise
  | ListThunder
  | ListFire
  | ListRiver
  | ListWaves
  | ListNight
  | ListFrog
  | ListBird
  | ListForest
  | ListWind
  | ListLeaves
  | ListFootsteps
  | ListTrain
  | ListRestaurant
  | ListNoise
  | ListConstruction

type AmbienceType = Ambience['type']
type AmbienceVariantType = Ambience['type']

type AmbienceState = Ambience & {
  volume: number
}

type AmbienceActive = Record<AmbienceType, AmbienceState>

interface State {
  active: Record<AmbienceType, AmbienceState>
}

type Actions = {
  reset: () => void
  toggle: (state: AmbienceState) => void
  changeVariant: (type: AmbienceType, variant: AmbienceVariantType) => void
  changeVolume: (type: AmbienceType, volume: number) => void
}

type StateAction = State & Actions

export type {
  Ambience,
  ListAmbience,
  AmbienceType,
  AmbienceVariantType,
  State,
  Actions,
  StateAction,
  AmbienceActive,
  AmbienceState,
}
