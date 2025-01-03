import { useNavigate, useParams } from 'react-router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const myMeeting = async (element: HTMLDivElement) => {
    const appID = Number(process.env.REACT_APP_ZEGO_APP_ID);
    const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    if (roomId && appID && serverSecret && baseUrl) {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        'Joyel'
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Copy Link',
            url: `${baseUrl}/chat/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        showScreenSharingButton: true,
        onLeaveRoom: () => {
          navigate('/');
        },
      });
    }
  };

  return <div ref={myMeeting} />;
}

export default Room;
