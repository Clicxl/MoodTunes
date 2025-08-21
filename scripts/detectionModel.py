# detectionModule.py
import cv2
from fer import FER
from time import sleep

def emotion_detection_process(shared_data, logger, camera_index=0, use_mtcnn=False):
    detector = FER(mtcnn=use_mtcnn)
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        logger.critical("Error: Cannot open camera.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            logger.critical("Failed to grab frame.")
            break

        frame = cv2.flip(frame, 1)
        results = detector.detect_emotions(frame)
        if results:
            emotions = results[0]['emotions']
            top_emotion = max(emotions, key=emotions.get)
            current_emotion = top_emotion.capitalize()
            (x, y, w, h) = results[0]['box']
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(
                frame,
                f"{top_emotion}: {emotions[top_emotion]:.2f}",
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (36, 255, 12),
                2,
            )
        else:
            current_emotion = "No Face"

        shared_data['frame'] = frame
        shared_data['emotion'] = current_emotion

        sleep(0.03)

    cap.release()
