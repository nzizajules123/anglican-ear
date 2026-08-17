import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Peer-to-peer voice/video calling for the choir room.
 * Signalling (offer / answer / ICE candidates) is exchanged through Firestore;
 * the audio and video streams themselves travel directly between the two browsers.
 *
 * Note: with only public STUN servers, calls connect on most home and mobile
 * networks. Restrictive corporate networks would additionally need a TURN relay.
 */
const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }],
  iceCandidatePoolSize: 10,
}

export type CallHandle = {
  callId: string
  peer: RTCPeerConnection
  localStream: MediaStream
  hangUp: () => Promise<void>
}

export type CallKind = 'audio' | 'video'

async function getLocalStream(kind: CallKind) {
  return navigator.mediaDevices.getUserMedia({ audio: true, video: kind === 'video' })
}

export async function startCall(
  roomId: string,
  kind: CallKind,
  callerName: string,
  onRemoteStream: (stream: MediaStream) => void
): Promise<CallHandle> {
  if (!db) throw new Error('Firebase is not configured.')
  const localStream = await getLocalStream(kind)
  const peer = new RTCPeerConnection(rtcConfig)
  const remoteStream = new MediaStream()
  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream))
  peer.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track))
    onRemoteStream(remoteStream)
  }

  const callRef = doc(collection(db, 'calls'))
  const offerCandidates = collection(callRef, 'offerCandidates')
  const answerCandidates = collection(callRef, 'answerCandidates')

  peer.onicecandidate = (event) => {
    if (event.candidate) void addDoc(offerCandidates, event.candidate.toJSON())
  }

  const offer = await peer.createOffer()
  await peer.setLocalDescription(offer)
  await setDoc(callRef, {
    roomId,
    kind,
    callerName,
    status: 'ringing',
    offer: { type: offer.type, sdp: offer.sdp },
    createdAt: Date.now(),
  })

  const stopCallWatch = onSnapshot(callRef, (snapshot) => {
    const data = snapshot.data()
    if (data?.answer && !peer.currentRemoteDescription) {
      void peer.setRemoteDescription(new RTCSessionDescription(data.answer))
    }
  })

  const stopCandidateWatch = onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') void peer.addIceCandidate(new RTCIceCandidate(change.doc.data()))
    })
  })

  return {
    callId: callRef.id,
    peer,
    localStream,
    hangUp: async () => {
      stopCallWatch()
      stopCandidateWatch()
      localStream.getTracks().forEach((track) => track.stop())
      peer.close()
      await updateDoc(callRef, { status: 'ended' }).catch(() => {})
      await deleteDoc(callRef).catch(() => {})
    },
  }
}

export async function answerCall(
  callId: string,
  onRemoteStream: (stream: MediaStream) => void
): Promise<CallHandle> {
  if (!db) throw new Error('Firebase is not configured.')
  const callRef = doc(db, 'calls', callId)
  const snapshot = await getDoc(callRef)
  const data = snapshot.data()
  if (!data?.offer) throw new Error('This call is no longer available.')

  const localStream = await getLocalStream(data.kind === 'video' ? 'video' : 'audio')
  const peer = new RTCPeerConnection(rtcConfig)
  const remoteStream = new MediaStream()
  localStream.getTracks().forEach((track) => peer.addTrack(track, localStream))
  peer.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track))
    onRemoteStream(remoteStream)
  }

  const offerCandidates = collection(callRef, 'offerCandidates')
  const answerCandidates = collection(callRef, 'answerCandidates')
  peer.onicecandidate = (event) => {
    if (event.candidate) void addDoc(answerCandidates, event.candidate.toJSON())
  }

  await peer.setRemoteDescription(new RTCSessionDescription(data.offer))
  const answer = await peer.createAnswer()
  await peer.setLocalDescription(answer)
  await updateDoc(callRef, { status: 'connected', answer: { type: answer.type, sdp: answer.sdp } })

  const stopCandidateWatch = onSnapshot(offerCandidates, (snap) => {
    snap.docChanges().forEach((change) => {
      if (change.type === 'added') void peer.addIceCandidate(new RTCIceCandidate(change.doc.data()))
    })
  })

  return {
    callId,
    peer,
    localStream,
    hangUp: async () => {
      stopCandidateWatch()
      localStream.getTracks().forEach((track) => track.stop())
      peer.close()
      await updateDoc(callRef, { status: 'ended' }).catch(() => {})
    },
  }
}

export function subscribeToRoomCalls(roomId: string, handler: (calls: Array<{ id: string; kind: CallKind; callerName: string; status: string }>) => void) {
  if (!db) {
    handler([])
    return () => {}
  }
  return onSnapshot(
    collection(db, 'calls'),
    (snapshot) => {
      handler(
        snapshot.docs
          .map((d) => ({ id: d.id, ...(d.data() as { roomId: string; kind: CallKind; callerName: string; status: string }) }))
          .filter((call) => call.roomId === roomId && call.status === 'ringing')
      )
    },
    (error) => {
      console.error('Failed to watch calls:', error)
      handler([])
    }
  )
}
