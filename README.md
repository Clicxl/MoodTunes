# MoodTunes: The Emotion-Powered Music Flask App

A Python Flask web application that detects user emotions and plays corresponding songs from YouTube. MoodTunes uses machine learning to understand your mood and streams the perfect music to match your feelings.

## Features
- Real-time emotion detection from user input or camera.
- Personalized song recommendations sourced from YouTube.
- User-friendly and responsive Flask web interface.
- Seamless integration with YouTube for music playback.

## Technologies Used
- Python 3.x
- Flask
- Emotion Detection Model (custom or pre-trained)
- uv for virtual environment and dependency management

## Installation

### Clone the Repository
```bash
git clone https://github.com/Clicxl/MoodTunes.git
cd MoodTunes
```

### Setup Virtual Environment and Install Dependencies using uv
You should have `uv` python package manager installed

```bash
uv init
uv sync
```
### Creating and Adding OPENAI API keys
- Run the following command to setup the entire project:
```bash
uv run scripts/setup.py
```

#### For Developers 
As the project uses tailwindcss you have to run the tailwindcss command with node/bun in a new terminal:
```bash
node @tailwindcss/cli -i ./static/src/input.css -o ./static/dist/output.css --watch 
```

### Run the Application

```bash 
uv run main.py
```

Then open your browser and go to `http://localhost:5000` to start using MoodTunes.

## Usage
- Provide input or use your camera to detect emotions.
- Enjoy song recommendations and playback directly within the app.

## Contributing
Contributions are highly welcome! Feel free to fork the repository, create feature branches, and submit pull requests. For questions or suggestions, please open an issue.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Enjoy your personalized music journey with MoodTunes!

