import { IPeer } from '@/types/peer'
import {
  ADD_PEER_STREAM,
  REMOVE_PEER_STREAM,
  ADD_PEER_NAME,
  ADD_ALL_PEERS,
  REMOVE_PEER,
  UPDATE_PEER_STREAM,
} from './peer-actions'

export type PeerState = Record<
  string,
  { stream?: MediaStream; userName?: string; peerId: string }
>
type PeerAction =
  | {
      type: typeof ADD_PEER_STREAM
      payload: { peerId: string; stream: MediaStream }
    }
  | {
      type: typeof REMOVE_PEER_STREAM
      payload: { peerId: string }
    }
  | {
      type: typeof ADD_PEER_NAME
      payload: { peerId: string; userName: string }
    }
  | {
      type: typeof ADD_ALL_PEERS
      payload: {
        peers: Record<string, IPeer>
      }
    }
  | {
      type: typeof REMOVE_PEER
      payload: {
        peerId: string
      }
    }
  | {
      type: typeof UPDATE_PEER_STREAM
      payload: {
        peerId: string
        stream: MediaStream
      }
    }

export const peersReducer = (state: PeerState, action: PeerAction) => {
  let newState = { ...state }

  switch (action.type) {
    case ADD_PEER_STREAM:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      }
    case ADD_PEER_NAME:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          userName: action.payload.userName,
        },
      }
    case REMOVE_PEER_STREAM:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: undefined,
        },
      }
    case ADD_ALL_PEERS:
      return { ...state, ...action.payload.peers }

    case REMOVE_PEER:
      newState = { ...state }
      delete newState[action.payload.peerId]
      return newState
    case UPDATE_PEER_STREAM:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      }
    default:
      return { ...state }
  }
}
