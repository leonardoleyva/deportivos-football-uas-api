import { TournamentStage } from '../models/tournament'

export const tournamentStageBasedOnTeamsAmount: Record<
  number,
  TournamentStage
> = {
  2: 'final',
  4: 'semiFinal',
  8: 'quartersFinal',
  16: 'top16',
}
