import type { Vox, User, Vote, Comment, CommentVote, Follow } from '@prisma/client'

export type FeedPost = Vox & {
    votes: VoxVote[],
    author: User,
    comments: Comment[]
}

export type FeedComment = Comment & {
    votes: CommentVote[],
    author: User,
    replies: Comment[]
}

export type FeedVote = Vote & {
    vox: FeedPost | null,
    comment: FeedComment | null
}

export type ExtendedFollowee = Follow & {
    followee: User
}

export type ExtendedFollower = Follow & {
    follower: User
}

export type ProfileUser = User & {
    followers: Follow[],
    following: Follow[],
    voxes: FeedPost[],
    comments: FeedComment[],
    votes: FeedVote[]
}