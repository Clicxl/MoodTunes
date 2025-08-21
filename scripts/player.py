import yt_dlp
import subprocess
import pygame
import threading

# Global variables to manage playback
ffmpeg_proc = None
playback_thread = None
is_playing = False

class Player:

    def __init__(self) -> None:
        pygame.mixer.init()

    def get_best_audio_url(self, youtube_url):
        ydl_opts = {'format': 'bestaudio'}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=False)
            return info['url']

    def stream_and_play(self, youtube_url):
        global ffmpeg_proc, is_playing
        try:
            audio_url = self.get_best_audio_url(youtube_url)
            ffmpeg_cmd = [
                "ffmpeg",
                "-i", audio_url,
                "-f", "wav",
                "-acodec", "pcm_s16le",
                "-ar", "44100",
                "-ac", "2",
                "-"
            ]
            ffmpeg_proc = subprocess.Popen(
                ffmpeg_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL
            )

            pygame.mixer.init(frequency=44100, channels=2)
            chunk_size = 4096
            is_playing = True

            while is_playing:
                data = ffmpeg_proc.stdout.read(chunk_size)
                if not data:
                    break
                sound = pygame.mixer.Sound(buffer=data)
                sound.play()
                while pygame.mixer.get_busy() and is_playing:
                    pygame.time.delay(10)

        except Exception as e:
            print(f"Error {e}")

    def start_playback(self, url="https://www.youtube.com/watch?v=ZbZSe6N_BXs"):    
        global playback_thread, is_playing
        if not url:
            return
        if is_playing:
            return
        is_playing = True
        # FIX: args must be a tuple
        playback_thread = threading.Thread(target=self.stream_and_play, args=(url,), daemon=True)
        playback_thread.start()

    def stop_playback(self):
        global is_playing, ffmpeg_proc
        is_playing = False
        pygame.mixer.music.stop()
        if ffmpeg_proc:
            ffmpeg_proc.kill()
            ffmpeg_proc = None

    def update(self, url: str):
        # Just start playback in a background thread
        self.start_playback(url)
