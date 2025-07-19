import React, { useEffect, useRef } from 'react';

const JitsiMeeting = ({ roomName, displayName, onMeetingEnd }) => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    // Load the Jitsi Meet External API
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initJitsi = async () => {
      if (!window.JitsiMeetExternalAPI) {
        await loadJitsiScript();
      }
      const domain = 'meet.jit.si';
      const options = {
        roomName,
        parentNode: jitsiContainerRef.current,
        configOverwrite: {},
        interfaceConfigOverwrite: {
          // interface config options
        },
        userInfo: {
          displayName
        }
      };
      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener('videoConferenceLeft', onMeetingEnd);

      return () => api.dispose();
    };

    initJitsi();
  }, [roomName, displayName, onMeetingEnd]);

  return <div ref={jitsiContainerRef} style={{ width: '800px', height: '600px' }} />;
};

export default JitsiMeeting;
