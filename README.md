<div align="center">
  <!-- REMOVE THIS IF YOU DON'T HAVE A LOGO -->
    <img src="https://multiplayer-clock.vercel.app/favicon.ico" alt="Logo" width="80" height="80">

<h3 align="center">Multiplayer Clock</h3>

  <p align="center">
    A customizable timer app for board games with up to 12 players.
    <br />
     <a href="https://multiplayer-clock.vercel.app">multiplayer-clock.vercel.app</a>
  </p>
</div>

<img width="1624" alt="image" src="https://github.com/user-attachments/assets/4c8549cd-b146-48ba-ace0-7a390929c534" />

## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
      </ul>
    </li>
    <li><a href="#architecture">Architecture</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

The Multiplayer Clock is a web application designed to serve as a versatile timer for various multiplayer games and activities. It supports up to 12 players and offers customizable time settings, including initial time and time increments. The application features a visually appealing player wheel that dynamically displays each player's remaining time, enhancing the overall gaming experience.

### Key Features

- **Multiple Player Support:** Accommodates 2 to 12 players, making it suitable for a wide range of games.

  <img width="1624" alt="image" src="https://github.com/user-attachments/assets/0f497d2f-6467-4f91-a965-eacba08fb5e3" />
  
  <img width="1624" alt="image" src="https://github.com/user-attachments/assets/94b48459-a620-4dfa-b959-9a988a59399e" />


- **Customizable Time Settings:** Allows users to set the initial time and time increment for each player.

  <img width="1624" alt="image" src="https://github.com/user-attachments/assets/97275aa0-64dc-4e31-af3c-6e0365a029d2" />

- **Intuitive Player Wheel:** Presents a clear visual representation of the game state, showing each player's time and turn.
- **Responsive Design:** Adapts to different screen sizes, ensuring a consistent experience across devices.

  ![image](https://github.com/user-attachments/assets/6b0f4481-8eb4-42bb-a761-04c1367bdd88)

## Architecture
The Multiplayer Clock is built using the following technologies:

- **Frontend:**
    - **Next.js:** A React framework for building performant web applications.
    - **React:** A JavaScript library for building user interfaces.
    - **Tailwind CSS:** A utility-first CSS framework for styling the application.
    - **TypeScript:** A superset of JavaScript that adds static typing.
- **State Management:**
    - **React Hooks:** `useState` and `useEffect` are used for managing component state and side effects, including the timer logic.
- **Utilities:**
    - **formatters.ts:** Contains utility functions for formatting time.
    - **wheelCalculator.ts:** Contains utility functions for calculating the layout of the player wheel.

## Getting Started

### Prerequisites

- Node.js (version 18 or later) and npm (or yarn/pnpm/bun) installed on your machine.

### Installation

Instructions for setting up the project locally:

1.  Clone the repository:

    ```sh
    git clone https://github.com/owengretzinger/multiplayer-clock.git
    ```
2.  Navigate to the project directory:

    ```sh
    cd multiplayer-clock
    ```
3.  Install the dependencies:

    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
4.  Run the development server:

    ```sh
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5.  Open your browser and go to `http://localhost:3000` to view the application.

## Acknowledgments

- This README was created using [gitreadme.dev](https://gitreadme.dev) — an AI tool that looks at your entire codebase to instantly generate high-quality README files.
