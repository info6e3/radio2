import React, { Component } from "react";
import song from "./audio/Платина - Дора - Сан Ларан.mp3";

class CurrentAudio extends Component {
    // Create state
    state = {

        // Get audio file in a variable
        audio: new CurrentAudio(song),

        // Set initial state of song
        isPlaying: false,
    };
}

export default CurrentAudio;