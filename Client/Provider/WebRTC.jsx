import { createContext, useMemo, useState } from "react";


export const WebRTCContext = createContext(null)


export const WebProvider = (props) => {

    const [remotestresam, setRemotestream] = useState(null)

    const Peer = useMemo(() => new RTCPeerConnection(
        { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }] }
    ), [])

    const CreateOffer = async () => {
        const offer = await Peer.createOffer()
        await Peer.setLocalDescription(offer)
        return offer
    }

    const CreateAnswer = async (offer) => {
        Peer.setRemoteDescription(offer)
        const Ans = await Peer.createAnswer()
        await Peer.setLocalDescription(Ans)
        return Ans
    }

    const AcceptAnswer = async (Ans) => {
        await Peer.setRemoteDescription(Ans)
    }

    const SendTracks = (stream) => {
        const tracks = stream.getTracks()
        for (const track of tracks) {
            Peer.addTrack(track, stream)
        }
    }

    const disconnect = () => {
        Peer.getSenders().forEach(sender => sender.track.stop());
        if (remotestresam) {
            remotestresam.getTracks().forEach(track => track.stop());
            setRemotestream(null);
        }
    };

    return (
        <WebRTCContext.Provider value={{
            Peer,
            CreateOffer,
            CreateAnswer,
            AcceptAnswer,
            SendTracks,
            remotestresam,
            disconnect,
            setRemotestream
        }}>
            { props.children}
        </WebRTCContext.Provider>
    );

}