import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const myMeeting = async (element: HTMLDivElement) => {
    const appID = 691585062;
    const serverSecret = "15384d67f8449451e44ea9b4e2682878";

    if (roomId) {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        'TutorG'
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Copy Link',
            url: `http://localhost:3000/chat/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        showScreenSharingButton: true,
        onLeaveRoom: () => {
          const userRole = localStorage.getItem('role');
          const roleRoutes: Record<string, string> = {
            instructor: '/instructor/messages',
            user: '/user-profile',
            admin: '/admin',
          };
          navigate(roleRoutes[userRole || 'guest'] || '/');
        },
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
      <div className="bg-white rounded-lg shadow-lg text-center w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the TutorG Meeting Room</h2>
        <p className="text-gray-600 mb-6">Engage, Share, and Collaborate Seamlessly!</p>
        <div
          ref={myMeeting}
          className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 "
        ></div>
      </div>
    </div>
  );
}

export default Room;
