import React, { useRef, useEffect, useState } from 'react';

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        if (hasPermission && !stream) {
            const getUserMedia = async () => {
                try {
                    const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = userMediaStream;
                    setStream(userMediaStream);
                } catch (err) {
                    console.error('Error accessing the camera: ', err);
                }
            };

            getUserMedia();
        }

        const drawCanvas = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video && video.readyState === 4 && canvas) {
                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                }
            }

            requestAnimationFrame(drawCanvas);
        };

        if (hasPermission) {
            drawCanvas();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        };
    }, [hasPermission, stream]);

    const handleToggleCamera = () => {
        if (hasPermission) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            setHasPermission(false);
        } else {
            setHasPermission(true);
        }
    };

    return (
        <div className="camera-container">
            <button onClick={handleToggleCamera}>
                {hasPermission ? 'Close Camera' : 'Allow Camera Access'}
            </button>
            {hasPermission && (
                <>
                    <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline />
                    <canvas ref={canvasRef} width="320" height="240" />
                </>                                                                                                                                                                                                                        
            )}
        </div>
    );
};

export default Camera;
