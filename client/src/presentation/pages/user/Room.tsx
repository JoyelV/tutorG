import { useNavigate, useParams } from 'react-router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function Room() {
  const { roomId } = useParams<{ roomId: string }>(); 
  const navigate = useNavigate();

  const myMeeting = async (element: HTMLDivElement) => {
        const appID = 691585062;
        const serverSecret = "15384d67f8449451e44ea9b4e2682878";
        if(roomId){
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(),'Joyel');
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Copy Link',
              url: `http://localhost:5000/chat/${roomId}`
            }
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showScreenSharingButton: true,
          onLeaveRoom: () => {
            navigate('/');
          },
        });
      };
    }      
  return <div ref={myMeeting} />;
}
export default Room;
