import { useNavigate, useParams } from 'react-router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import api from '../../../infrastructure/api/api';

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const myMeeting = async (element: HTMLDivElement) => {
    const appID = Number(process.env.REACT_APP_ZEGO_APP_ID);
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const userId = localStorage.getItem('userId') || 'Joyel';

    try {
      if (roomId && appID && baseUrl) {
        // Fetch token from backend
        const { data: { data: { token } } } = await api.get(`/user/video-call/token?userId=${userId}&roomId=${roomId}`);

        const zp = ZegoUIKitPrebuilt.create(token);
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Copy Link',
              url: `${baseUrl}/chat/${roomId}`
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
      }
    } catch (error) {
      console.error('Failed to join video call:', error);
    }
  };
  return <div ref={myMeeting} />;
}
export default Room;
