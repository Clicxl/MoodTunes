from scripts.log import logger
from scripts.detectionModel import emotion_detection_process
from scripts.UI import UI
from scripts.player import Player
from scripts.sharedEmotionDetector import SharedEmotionDetector
from multiprocessing import Process, Manager

def main():
    manager = Manager()
    shared_data = manager.dict()
    shared_data['frame'] = None
    shared_data['emotion'] = "Neutral"

    # Start emotion detection in a separate process
    emotion_proc = Process(target=emotion_detection_process, args=(shared_data, logger))
    emotion_proc.start()

    detector = SharedEmotionDetector(shared_data)
    player = Player()
    ui = UI(detector, player)
    try:
        ui.run()
    finally:
        emotion_proc.terminate()
        emotion_proc.join()

if __name__ == "__main__":
    from multiprocessing import set_start_method
    set_start_method("spawn")
    main()