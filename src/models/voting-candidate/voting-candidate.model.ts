import mongoose, { Schema, type Model } from 'mongoose';
import leanId from 'mongoose-lean-id';

import { Collections } from '@/static/mongo';
import { IVotingCandidate } from '@/models/voting-candidate/voting-candidate.types';

const VotingCandidateSchema: Schema = new Schema<IVotingCandidate.Model>({
  artist: {
    type: String,
    required: true,
  },

  song: {
    type: String,
    required: true,
  },

  votesAmount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  collection: Collections.VotingCandidates,
});

const VotingCandidateModel: Model<IVotingCandidate.Model> =
  mongoose.model<IVotingCandidate.Model>('VotingCandidate', VotingCandidateSchema);

export { VotingCandidateModel };
