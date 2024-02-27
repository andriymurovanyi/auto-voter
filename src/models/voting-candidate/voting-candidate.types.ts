export namespace IVotingCandidate {
  export interface BaseModel {
    artist: string;
    song: string;
    votesAmount: number;
  }

  export interface Model extends BaseModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
