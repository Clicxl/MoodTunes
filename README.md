# Real-Time Emotion Detection with FER and ttkbootstrap | MoodVision

This project provides a real-time emotion detection system using the [FER](https://github.com/justinshenk/fer) library and a modern GUI built with [ttkbootstrap](https://ttkbootstrap.readthedocs.io/). The application captures webcam video, detects emotions on faces, and displays the video feed and detected emotion in a responsive, user-friendly window.

---

## Features

- Real-time webcam video capture
- Live emotion detection using FER (Facial Expression Recognition)
- Modern, responsive UI with ttkbootstrap
- Clean separation of detection logic and GUI

---

## Prerequisites

- [uv](https://astral.sh/uv) (Python package and environment manager)
- **Python 3.12** (TensorFlow and FER require Python ≤3.12)

---

## Installation

### 1. Install `uv`

**Linux/macOS:**

`curl -LsSf https://astral.sh/uv/install.sh | sh`

---

**Windows (PowerShell):**

`powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`

---

### 3. Create and Activate a Virtual Environment with Python 3.12

`uv init --python 3.12.11`

---

### 4. Install Required Packages
`uv add -r requirements.txt`


---

## Running the Application

Assuming your entry point is `main.py`:

`uv run main.py`

---

## Project Structure Example

MoodVision/
├── scripts/
│ └── detectModel.py
│ └── UI.py
├── main.py
├── README.md
└── .venv/

---

## Notes

- Make sure your webcam is connected and accessible.
- If you encounter errors regarding TensorFlow or FER compatibility, ensure you are using Python 3.12.
- For best performance, avoid running heavy applications in the background while using real-time detection.
- If you reorganize your files, update import paths accordingly.

---

## References

- [uv documentation](https://docs.astral.sh/uv/)
- [FER library](https://github.com/justinshenk/fer)
- [ttkbootstrap](https://ttkbootstrap.readthedocs.io/)

---

**Enjoy real-time emotion detection with a modern Python GUI!**
